
"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "loading") return; // Do nothing while loading
    if (session) router.push("/plan"); // Redirect if logged in
  }, [session, status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl: "/plan",
      });

      if (res?.error) {
        setError("Invalid email or password");
      } else if (res?.url) {
        router.push(res.url);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading" || session) {
    // Optionally render nothing or a loading message while redirecting
    return null;
  }

  return (
    <main className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-[#0b1221] px-4 py-12">
      {/* Left side - Brand */}
      <div className="md:w-1/2 max-w-md mb-12 md:mb-0 md:mr-12 text-center md:text-left">
        <h1 className="text-4xl md:text-6xl font-bold text-blue-400 mb-6">FitMind</h1>
        <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
          Transform your fitness journey with AI-powered personalization and expert guidance.
        </p>
      </div>

      {/* Right side - Login form */}
      <div className="w-full max-w-md">
        <div className="bg-[#1e293b] p-8 rounded-xl shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-lg bg-[#0f172a] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-lg bg-[#0f172a] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors relative disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <span className="opacity-0">Log In</span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </>
              ) : (
                "Log In"
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-700 text-center">
            <Link
              href="/signup"
              className="inline-block bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
