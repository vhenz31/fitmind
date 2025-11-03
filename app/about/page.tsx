"use client";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0b132b] to-[#1c2a56] text-white px-8 py-16">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-blue-400 mb-6">
          About FitMind
        </h1>

        <p className="text-gray-300 text-lg leading-relaxed mb-12">
          FitMind is your AI-powered fitness partner that helps you stay on
          track with smart workouts, nutrition planning, and personalized
          coaching — all designed to make your journey fun and effective.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-[#111b33] rounded-xl p-6 shadow-md border border-gray-700 hover:border-blue-500 transition">
            <div className="text-2xl mb-2">🧠</div>
            <h2 className="text-lg font-semibold text-blue-400 mb-2">
              Smart AI Plans
            </h2>
            <p className="text-gray-400 text-sm">
              Receive dynamic fitness and meal recommendations powered by AI.
            </p>
          </div>

          <div className="bg-[#111b33] rounded-xl p-6 shadow-md border border-gray-700 hover:border-blue-500 transition">
            <div className="text-2xl mb-2">💪</div>
            <h2 className="text-lg font-semibold text-blue-400 mb-2">
              Personalized Coaching
            </h2>
            <p className="text-gray-400 text-sm">
              Get tailored advice and motivation from your AI wellness coach.
            </p>
          </div>

          <div className="bg-[#111b33] rounded-xl p-6 shadow-md border border-gray-700 hover:border-blue-500 transition">
            <div className="text-2xl mb-2">🔒</div>
            <h2 className="text-lg font-semibold text-blue-400 mb-2">
              Safe & Private
            </h2>
            <p className="text-gray-400 text-sm">
              Your health data stays secure while you focus on reaching your
              goals.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
