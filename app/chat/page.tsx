"use client";
import { useState } from "react";
import { Send } from "lucide-react";

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;
    
    // Add user message to chat
    const userMessage = message;
    setChat((prev) => [...prev, `You: ${userMessage}`]);
    setMessage("");
    setIsLoading(true);
    
    try {
      // Call the API
      const response = await fetch("/api/chat-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });
      
      const data = await response.json();
      
      // Add coach reply to chat
      if (data.reply) {
        setChat((prev) => [...prev, `Coach: ${data.reply}`]);
      } else {
        setChat((prev) => [...prev, "Coach: Sorry, I couldn't generate a response."]);
      }
    } catch (error) {
      console.error("Error:", error);
      setChat((prev) => [...prev, "Coach: Sorry, I encountered an error. Please try again."]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isLoading) {
      handleSend();
    }
  };

  return (
    <>
      <main className="min-h-screen bg-gradient-to-b from-[#0b132b] to-[#1c2a56] text-white px-6 py-14">
        <h1 className="text-center text-4xl font-bold text-blue-400">
          AI <span className="text-blue-200">Fitness Coach</span>
        </h1>
        <p className="text-center text-gray-300 mt-2">
          Get instant answers and motivation.
        </p>

        <div className="max-w-4xl mx-auto bg-[#111b33] border border-blue-900 p-6 rounded-xl mt-10">
          <h2 className="font-semibold text-blue-300 mb-4">💬 Chat with Your Coach</h2>

          <div className="h-[350px] overflow-y-auto border border-blue-800 p-4 rounded-lg bg-[#0f1a33] text-sm">
            {chat.length === 0 ? (
              <p className="text-center text-gray-400 italic">
                "Every rep counts. You've got this. 💪"
              </p>
            ) : (
              chat.map((msg, i) => (
                <p key={i} className="text-gray-200 mb-2">
                  {msg}
                </p>
              ))
            )}
            {isLoading && (
              <p className="text-blue-400 italic animate-pulse">
                Coach is typing...
              </p>
            )}
          </div>

          {/* Input */}
          <div className="flex mt-4 gap-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="flex-1 px-4 py-2 rounded-lg bg-[#0d1630] border border-blue-800 text-white outline-none disabled:opacity-50"
              placeholder="Ask anything about workouts, meals, habits..."
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !message.trim()}
              className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg flex items-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} />
              Send
            </button>
          </div>
        </div>
      </main>
    </>
  );
}