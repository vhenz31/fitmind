import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are FitMind, an AI fitness coach that gives workout, nutrition, and motivation advice in a friendly and supportive tone.",
        },
        { role: "user", content: message },
      ],
      max_tokens: 200,
    });

    const reply = completion.choices[0].message?.content || "No response.";
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat AI error:", error);
    return NextResponse.json(
      { reply: "Error: Unable to connect to AI." },
      { status: 500 }
    );
  }
}
