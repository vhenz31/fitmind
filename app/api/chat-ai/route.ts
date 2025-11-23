import { NextResponse } from "next/server";
import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.error("OPENAI_API_KEY environment variable is not set.");
}

const openai = new OpenAI({
  apiKey: apiKey || "",
});

export async function POST(req: Request) {
  if (!apiKey) {
    return NextResponse.json(
      { reply: "Server configuration error: Missing OpenAI API key." },
      { status: 500 }
    );
  }

  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        {
          reply: "Invalid request: Missing or invalid 'message' parameter.",
        },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are FitMind, an AI fitness coach specializing ONLY in fitness, exercise, nutrition, and wellness topics.

Your expertise includes:
- Workout routines and exercise techniques
- Nutrition and meal planning
- Weight loss and muscle building strategies
- Form and injury prevention
- Motivation and fitness mindset
- Recovery and rest strategies
- Sports performance
- General health and wellness related to fitness

IMPORTANT RESTRICTIONS:
- You MUST politely decline to answer questions that are not related to fitness, exercise, nutrition, or wellness
- If asked about non-fitness topics (politics, entertainment, general knowledge, etc.), respond with: "I'm FitMind, your fitness coach! I specialize only in fitness, exercise, nutrition, and wellness. I'd be happy to help you with any questions about workouts, meal planning, or your fitness goals. What would you like to know?"
- Always redirect off-topic conversations back to fitness
- Be friendly but firm about your specialization

Provide helpful, accurate, and motivating fitness advice in a supportive tone.`,
        },
        { role: "user", content: message },
      ],
      max_tokens: 200,
    });

    let reply = completion.choices[0].message?.content || "No response.";
    
    // Format the response with proper line breaks
    reply = reply
      .replace(/(\d+\.)\s/g, '\n$1 ') // Add line break before numbered lists
      .replace(/(\*\*[^*]+\*\*)/g, '\n$1') // Add line break before bold headers
      .replace(/(-\s)/g, '\n- ') // Add line break before bullet points
      .trim()
      .replace(/^\n+/, ''); // Remove leading line breaks
    
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat AI error:", error);
    let errorMessage = "Error: Unable to connect to AI.";
    let errorDetails = "";

    if (process.env.NODE_ENV === "development" && error instanceof Error) {
      errorDetails = error.message;
      errorMessage += ` Details: ${errorDetails}`;
    }

    return NextResponse.json({ reply: errorMessage, details: errorDetails }, { status: 500 });
  }
}