import Image from "next/image";
import { Dumbbell, UtensilsCrossed, Bot } from "lucide-react"; // icons

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-20">
        <h2 className="text-4xl md:text-6xl font-extrabold mb-4 text-blue-400">AI-Powered Fitness Platform</h2>
        <h3 className="text-2xl md:text-3xl font-semibold mb-6">Transform Your Body With AI Guidance</h3>
        <p className="max-w-2xl text-gray-300 mb-8">
          FitMind combines cutting-edge AI technology with proven fitness science to create personalized
          workout and meal plans that evolve with you.
        </p>
        <div className="flex gap-4">
          <a
            href="#"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md font-semibold transition"
          >
            Start Now
          </a>
          <a
            href="#"
            className="border border-blue-500 hover:bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md font-semibold transition"
          >
            Learn More
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-800 py-16 px-6 grid md:grid-cols-3 gap-10 text-center">
        <div className="p-6 rounded-lg bg-gray-700 hover:bg-gray-600 transition flex flex-col items-center">
          <Dumbbell className="w-10 h-10 text-blue-400 mb-3" />
          <h4 className="text-2xl font-bold text-blue-400 mb-2">AI Workout Plans</h4>
          <p className="text-gray-300">
            Get personalized 5-day workout routines tailored to your fitness goals.
          </p>
        </div>

        <div className="p-6 rounded-lg bg-gray-700 hover:bg-gray-600 transition flex flex-col items-center">
          <UtensilsCrossed className="w-10 h-10 text-blue-400 mb-3" />
          <h4 className="text-2xl font-bold text-blue-400 mb-2">Smart Meal Plans</h4>
          <p className="text-gray-300">
            Receive customized daily meal plans that align with your objectives.
          </p>
        </div>

        <div className="p-6 rounded-lg bg-gray-700 hover:bg-gray-600 transition flex flex-col items-center">
          <Bot className="w-10 h-10 text-blue-400 mb-3" />
          <h4 className="text-2xl font-bold text-blue-400 mb-2">AI Fitness Coach</h4>
          <p className="text-gray-300">
            Chat with your personal AI coach for motivation and guidance.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-20 px-6 bg-blue-600">
        <h2 className="text-4xl font-extrabold mb-4">Ready to Start Your Journey?</h2>
        <p className="text-lg mb-6 text-gray-100">
          Join thousands of users who have transformed their fitness with AI-powered personalization.
        </p>
        <a
          href="#"
          className="bg-white text-blue-600 hover:bg-gray-200 px-8 py-3 rounded-lg font-semibold shadow-md transition"
        >
          Get Your Plan
        </a>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 bg-gray-800 text-gray-400 text-sm">
        © 2025 FitMind. All rights reserved.
      </footer>
    </main>
  );
}
