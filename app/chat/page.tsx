"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<string[]>([]);

  const handleSend = () => {
    if (!message.trim()) return;
    setChat((prev) => [...prev, `You: ${message}`]);
    setMessage("");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0b132b] to-[#1c2a56] text-white px-8 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-400">
          AI Fitness Chat
        </h1>

        <div className="border border-gray-700 bg-[#111b33] rounded-2xl shadow-md flex flex-col h-[500px]">
          <div className="flex-1 overflow-y-auto p-6 space-y-2">
            {chat.length === 0 ? (
              <p className="text-center text-gray-400 italic">
                Start chatting with your AI fitness coach 💬
              </p>
            ) : (
              chat.map((msg, i) => (
                <p key={i} className="text-gray-200">
                  {msg}
                </p>
              ))
            )}
          </div>

          <div className="border-t border-gray-700 flex items-center px-4 py-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-transparent outline-none text-white px-2"
            />
            <button
              onClick={handleSend}
              className="text-blue-400 hover:text-blue-500"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
