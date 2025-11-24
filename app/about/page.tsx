"use client";

export default function AboutPage() {
  return (
    <>
      <main className="min-h-screen bg-gradient-to-b from-[#0b132b] to-[#1c2a56] text-white px-6 py-16">
        <section className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-blue-400">
            About <span className="text-blue-200">FitMind</span>
          </h1>
          <p className="text-gray-300 mt-6 leading-relaxed text-lg">
            FitMind transforms fitness by combining artificial intelligence with proven
            health science. Personalized fitness plans, smart meal guidance, and
            continuous AI-driven coaching — anytime, anywhere.
          </p>
        </section>

        {/* Feature Boxes */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mt-16">
          <div className="bg-[#111b33] border border-blue-900 p-8 rounded-xl shadow-lg">
            <h3 className="text-blue-300 font-semibold mb-3 text-xl">🤖 AI-Powered Intelligence</h3>
            <p className="text-gray-400 text-base">
              Tailored workout & meal plans based on your unique body and fitness profile.
            </p>
          </div>

          <div className="bg-[#111b33] border border-blue-900 p-8 rounded-xl shadow-lg">
            <h3 className="text-blue-300 font-semibold mb-3 text-xl">🎯 Goal-Oriented System</h3>
            <p className="text-gray-400 text-base">
              Whether you aim to lose fat, gain muscle, or improve performance — we guide you.
            </p>
          </div>

          <div className="bg-[#111b33] border border-blue-900 p-8 rounded-xl shadow-lg">
            <h3 className="text-blue-300 font-semibold mb-3 text-xl">⚡ Instant Personalized Results</h3>
            <p className="text-gray-400 text-base">
              Receive dynamic, clear, and actionable plans instantly.
            </p>
          </div>

          <div className="bg-[#111b33] border border-blue-900 p-8 rounded-xl shadow-lg">
            <h3 className="text-blue-300 font-semibold mb-3 text-xl">📚 Science-Based Guidance</h3>
            <p className="text-gray-400 text-base">
              We base recommendations on real research, fitness science, and nutrition data.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="max-w-5xl mx-auto bg-[#122045] p-10 rounded-xl shadow-lg mt-20 text-center">
          <h2 className="text-3xl font-bold text-blue-300 mb-4">Our Mission</h2>
          <p className="text-gray-300 leading-relaxed text-lg">
            We believe that everyone deserves professional-grade fitness support.
            FitMind brings expert-level training and nutrition guidance powered by AI —
            making a healthier lifestyle accessible to everyone.
          </p>
        </section>
      </main>
    </>
  );
}
