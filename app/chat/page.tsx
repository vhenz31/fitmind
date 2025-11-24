"use client";
import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

const motivationalQuotes = [
  "Every rep counts. You've got this. 💪",
  "The only bad workout is the one that didn't happen. 🔥",
  "Your body can stand almost anything. It's your mind you have to convince. 🧠",
  "Push yourself because no one else is going to do it for you. 💯",
  "Success starts with self-discipline. Keep going! 🎯",
  "The pain you feel today will be the strength you feel tomorrow. ⚡",
  "Don't wish for it, work for it. Your future self will thank you. 🌟",
  "Progress, not perfection. Every step forward counts. 👣",
  "Believe in yourself and all that you are capable of achieving. ✨",
  "Sweat is just fat crying. Keep pushing! 💦"
];

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<Array<{ role: string; content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  // Rotate motivational quotes every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSend = async () => {
    if (!message.trim()) return;
    
    // Add user message to chat
    const userMessage = message;
    setChat((prev) => [...prev, { role: "user", content: userMessage }]);
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
        setChat((prev) => [...prev, { role: "coach", content: data.reply }]);
      } else {
        setChat((prev) => [...prev, { role: "coach", content: "Sorry, I couldn't generate a response." }]);
      }
    } catch (error) {
      console.error("Error:", error);
      setChat((prev) => [...prev, { role: "coach", content: "Sorry, I encountered an error. Please try again." }]);
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

  // Format message content with proper rendering of markdown-style text
  const formatMessage = (content: string) => {
    // Split content by double newlines to get paragraphs
    const paragraphs = content.split('\n\n').filter(p => p.trim());
    
    return paragraphs.map((paragraph, index) => {
      // Handle bold text (*text*)
      const parts = paragraph.split(/(\*\*[^*]+\*\*)/g);
      
      return (
        <div key={index} className="mb-2 last:mb-0 leading-relaxed">
          {parts.map((part, partIndex) => {
            // If it's bold text
            if (part.startsWith('*') && part.endsWith('*')) {
              return (
                <strong key={partIndex} className="font-semibold text-blue-300">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            // Regular text
            return <span key={partIndex}>{part}</span>;
          })}
        </div>
      );
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0b132b] to-[#1c2a56] text-white px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-400">
            AI <span className="text-blue-200">Fitness Coach</span>
          </h1>
          <p className="text-gray-300 mt-1 sm:mt-2 text-xs sm:text-sm lg:text-base">
            Get instant answers and motivation.
          </p>
        </div>

        {/* Motivational Quote Banner */}
        <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-700/50 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-5 mb-4 sm:mb-6 text-center shadow-lg">
          <p className="text-sm sm:text-base lg:text-lg font-medium text-blue-100 italic transition-all duration-500 ease-in-out">
            "{motivationalQuotes[currentQuote]}"
          </p>
          <div className="flex justify-center gap-1.5 sm:gap-2 mt-2 sm:mt-3">
            {motivationalQuotes.map((_, index) => (
              <div
                key={index}
                className={`h-1 sm:h-1.5 rounded-full transition-all duration-300 ${
                  index === currentQuote 
                    ? "w-4 sm:w-6 bg-blue-400" 
                    : "w-1 sm:w-1.5 bg-blue-800/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Chat Container */}
        <div className="bg-[#111b33] border border-blue-900 p-3 sm:p-4 lg:p-5 rounded-lg sm:rounded-xl shadow-2xl">
          <h2 className="font-semibold text-blue-300 mb-3 sm:mb-4 text-sm sm:text-base flex items-center gap-2">
            💬 <span>Chat with Your Coach</span>
          </h2>

          {/* Chat Messages */}
          <div className="h-[350px] sm:h-[400px] lg:h-[450px] overflow-y-auto border border-blue-800 p-2.5 sm:p-3 lg:p-4 rounded-lg bg-[#0f1a33] custom-scrollbar">
            {chat.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-center text-gray-400 italic py-2 text-xs sm:text-sm px-3 sm:px-4">
                  Start a conversation with your AI fitness coach!
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 sm:space-y-3">
                {chat.map((msg, i) => (
                  <div 
                    key={i} 
                    className={`${
                      msg.role === "user" 
                        ? "bg-blue-900/30 border-l-2 sm:border-l-4 border-blue-500 pl-2 sm:pl-3 py-1.5 sm:py-2 rounded-r" 
                        : "bg-gray-800/30 border-l-2 sm:border-l-4 border-green-500 pl-2 sm:pl-3 py-1.5 sm:py-2 rounded-r"
                    }`}
                  >
                    <div className="text-xs font-semibold mb-1 text-blue-300">
                      {msg.role === "user" ? "You" : "Coach"}
                    </div>
                    <div className="text-gray-200 text-xs sm:text-sm break-words whitespace-pre-wrap leading-relaxed">
                      {msg.role === "user" ? msg.content : formatMessage(msg.content)}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="text-blue-400 italic animate-pulse text-xs sm:text-sm pl-2 sm:pl-3">
                    Coach is typing...
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="flex flex-col sm:flex-row mt-3 sm:mt-4 gap-2 sm:gap-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-[#0d1630] border border-blue-800 text-white text-sm sm:text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition disabled:opacity-50"
              placeholder="Ask about workouts, meals, habits..."
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !message.trim()}
              className="bg-blue-600 hover:bg-blue-500 px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none text-sm sm:text-base font-medium"
            >
              <Send size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span>Send</span>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0d1630;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e40af;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #2563eb;
        }
      `}</style>
    </main>
  );
}