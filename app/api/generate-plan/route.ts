import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { age, weight, goal } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "No API key found. Check your .env.local file." },
        { status: 500 }
      );
    }

    const prompt = `Create a 5-day workout plan and 3-meal daily meal plan for someone aged ${age}, weighing ${weight}kg, whose goal is to ${goal}.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 800,
    });

    const plan = completion.choices[0].message?.content || "No plan generated.";
    return NextResponse.json({ plan });
  } catch (err: any) {
    console.error("Error generating plan:", err);
    return NextResponse.json(
      { error: "Server error, please check terminal logs." },
      { status: 500 }
    );
  }
}
