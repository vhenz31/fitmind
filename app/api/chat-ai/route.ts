import { NextResponse } from "next/server";
import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.error("OPENAI_API_KEY environment variable is not set.");
}

const openai = new OpenAI({
  apiKey: apiKey || "",
});

/**
 * Formats the AI response with proper markdown-style formatting
 * for better readability in the chat interface
 */
function formatResponse(text: string): string {
  let formatted = text.trim();

  //
  // 1. Normalize line breaks (prevent walls of text)
  //
  formatted = formatted.replace(/\r/g, "");
  formatted = formatted.replace(/\n{3,}/g, "\n\n");

  //
  // 2. Convert markdown "###" into readable headers
  //
  formatted = formatted.replace(/###\s*/g, "\n\n");

  //
  // 3. Proper spacing before numbers: "1." "2." "3."
  //
  formatted = formatted.replace(/(^|\n)(\d+)\.\s*/g, "\n\n$2. ");

  //
  // 4. Proper bullet list spacing
  //
  formatted = formatted.replace(/(^|\n)[\-•]\s*/g, "\n• ");

  //
  // 5. Bold headers get spacing around them
  //
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, "\n\n**$1**\n");

  //
  // 6. Cleanup: remove excessive spacing caused by formatting
  //
  formatted = formatted.replace(/\n{3,}/g, "\n\n");

  return formatted.trim();
}


export async function POST(req: Request) {
  // Check for API key configuration
  if (!apiKey) {
    return NextResponse.json(
      { 
        reply: "Server configuration error: Missing OpenAI API key.",
        error: "API_KEY_MISSING"
      },
      { status: 500 }
    );
  }

  try {
    // Parse and validate request body
    const body = await req.json();
    const { message } = body;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        {
          reply: "Invalid request: Please provide a valid message.",
          error: "INVALID_MESSAGE"
        },
        { status: 400 }
      );
    }

    // Prevent extremely long messages
    if (message.length > 1000) {
      return NextResponse.json(
        {
          reply: "Your message is too long. Please keep it under 1000 characters.",
          error: "MESSAGE_TOO_LONG"
        },
        { status: 400 }
      );
    }

    // Call OpenAI API
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

FORMATTING GUIDELINES:
- Use numbered lists when providing step-by-step instructions or multiple tips
- Use bullet points for simple lists
- Use bold (*text*) for important terms, section headers, or emphasis
- Break content into clear paragraphs for readability
- Keep your tone supportive, motivating, and professional

Provide helpful, accurate, and motivating fitness advice in a supportive tone.`,
        },
        { 
          role: "user", 
          content: message.trim() 
        },
      ],
      max_tokens: 500, // Increased for more detailed responses
      temperature: 0.7, // Balanced creativity and consistency
    });

    // Extract and format the response
    const rawReply = completion.choices[0].message?.content;
    
    if (!rawReply) {
      return NextResponse.json(
        { 
          reply: "I apologize, but I couldn't generate a response. Please try again.",
          error: "NO_RESPONSE"
        },
        { status: 500 }
      );
    }

    const formattedReply = formatResponse(rawReply);

    return NextResponse.json({ 
      reply: formattedReply,
      success: true 
    });

  } catch (error) {
    console.error("Chat AI error:", error);
    
    // Determine error type and message
    let errorMessage = "I encountered an error while processing your request. Please try again.";
    let errorType = "UNKNOWN_ERROR";
    
    if (error instanceof Error) {
      // OpenAI specific errors
      if (error.message.includes("API key")) {
        errorMessage = "Authentication error. Please contact support.";
        errorType = "AUTH_ERROR";
      } else if (error.message.includes("rate limit")) {
        errorMessage = "I'm receiving too many requests right now. Please wait a moment and try again.";
        errorType = "RATE_LIMIT";
      } else if (error.message.includes("timeout")) {
        errorMessage = "The request timed out. Please try again.";
        errorType = "TIMEOUT";
      }
      
      // Log detailed error in development
      if (process.env.NODE_ENV === "development") {
        console.error("Detailed error:", {
          message: error.message,
          stack: error.stack,
          type: errorType
        });
      }
    }

    return NextResponse.json(
      { 
        reply: errorMessage,
        error: errorType,
        success: false
      },
      { status: 500 }
    );
  }
}