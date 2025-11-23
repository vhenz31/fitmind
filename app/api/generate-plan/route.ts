import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "../../lib/prisma";

interface RequestBody {
  age: number;
  weight: number;
  goal: string;
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

const CONCURRENT_REQUESTS_LIMIT = 3;
let currentRequestsCount = 0;

async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 3, retryDelay = 1000): Promise<Response> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const response = await fetch(url, options);
    if (response.status !== 429) {
      return response;
    }
    if (attempt < maxRetries) {
      const delay = retryDelay * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  return await fetch(url, options);
}

async function limitedConcurrentFetch(url: string, options: RequestInit) {
  while (currentRequestsCount >= CONCURRENT_REQUESTS_LIMIT) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  currentRequestsCount++;
  try {
    const response = await fetchWithRetry(url, options);
    return response;
  } finally {
    currentRequestsCount--;
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body: RequestBody = await req.json();
    const { age, weight, goal } = body;

    if (!age || !weight || !goal) {
      return NextResponse.json(
        { error: "Age, weight, and goal are required" },
        { status: 400 }
      );
    }

    const goalMap: Record<string, string> = {
      "build-muscle": "build muscle and gain strength",
      "lose-weight": "lose weight and burn fat",
      "improve-endurance": "improve cardiovascular endurance",
      "body-toning": "tone body and improve definition"
    };

    const goalText = goalMap[goal] || goal;

    const workoutPrompt = `Create a detailed 5-day weekly workout plan for a ${age}-year-old individual weighing ${weight}kg whose goal is to ${goalText}.

Format the response as a JSON object with this structure:
{
  "title": "brief title",
  "description": "2-3 sentence overview",
  "days": [
    {
      "day": "Day 1: Focus Area",
      "exercises": ["exercise with sets/reps", "exercise with sets/reps"]
    }
  ]
}

Include 5 days with 5-6 exercises each. Be specific with sets, reps, and rest periods.`;

    const mealPrompt = `Create a detailed daily meal plan for a ${age}-year-old individual weighing ${weight}kg whose goal is to ${goalText}.

Format the response as a JSON object with this structure:
{
  "title": "brief title",
  "description": "2-3 sentence overview",
  "meals": [
    {
      "time": "Breakfast/Lunch/Dinner/Snacks",
      "foods": ["specific food with measurements"],
      "calories": "calorie range",
      "protein": "protein amount"
    }
  ]
}

Include breakfast, lunch, dinner, and snacks. Be specific with portions and nutritional info.`;

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const fetchOptionsWorkout = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a professional fitness trainer and nutritionist. Always respond with valid JSON only, no markdown formatting."
          },
          { role: "user", content: workoutPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    };

    const fetchOptionsMeal = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a professional fitness trainer and nutritionist. Always respond with valid JSON only, no markdown formatting."
          },
          { role: "user", content: mealPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    };

    const [workoutResponse, mealResponse] = await Promise.all([
      limitedConcurrentFetch("https://api.openai.com/v1/chat/completions", fetchOptionsWorkout),
      limitedConcurrentFetch("https://api.openai.com/v1/chat/completions", fetchOptionsMeal)
    ]);

    if (!workoutResponse.ok || !mealResponse.ok) {
      const errorResponse = !workoutResponse.ok ? workoutResponse : mealResponse;
      const error = await errorResponse.json();
      return NextResponse.json(
        { error: "OpenAI API error", details: error },
        { status: errorResponse.status }
      );
    }

    const workoutData: OpenAIResponse = await workoutResponse.json();
    const mealData: OpenAIResponse = await mealResponse.json();

    let workoutPlan;
    let mealPlan;

    try {
      const workoutContent = workoutData.choices[0].message.content;
      const mealContent = mealData.choices[0].message.content;

      const cleanWorkout = workoutContent.replace(/```json\n?|\n?```/g, '').trim();
      const cleanMeal = mealContent.replace(/```json\n?|\n?```/g, '').trim();

      workoutPlan = JSON.parse(cleanWorkout);
      mealPlan = JSON.parse(cleanMeal);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return NextResponse.json(
        { error: "Failed to parse AI response", details: parseError instanceof Error ? parseError.message : String(parseError) },
        { status: 500 }
      );
    }

    // Save generated plan to database
    let savedPlan;
    try {
      savedPlan = await prisma.plan.create({
        data: {
          userId: user.id,
          title: workoutPlan.title || "Generated Plan",
          description: workoutPlan.description || "",
          workout: workoutPlan,
          mealPlan: mealPlan,
        }
      });
    } catch (dbError) {
      console.error("Database save error:", dbError);
      return NextResponse.json(
        { error: "Failed to save plan to database", details: dbError instanceof Error ? dbError.message : String(dbError) },
        { status: 500 }
      );
    }

    return NextResponse.json({
      workout: workoutPlan,
      mealPlan: mealPlan,
      savedPlanId: savedPlan.id
    });

  } catch (error) {
    console.error("Generate plan error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
