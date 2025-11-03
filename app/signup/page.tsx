"use client";

import { useState } from "react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Account created successfully!");
        setEmail("");
        setPassword("");
      } else {
        setMessage(`❌ ${data.error || "Signup failed"}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Something went wrong. Try again.");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0f172a",
        color: "#f8fafc",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "#1e293b",
          padding: "2rem",
          borderRadius: "1rem",
          boxShadow: "0 0 20px rgba(0,0,0,0.3)",
          width: "100%",
          maxWidth: "400px",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>Create Account</h1>

        <form onSubmit={handleSignup}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "8px",
              border: "1px solid #334155",
              backgroundColor: "#0f172a",
              color: "#f8fafc",
            }}
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
              borderRadius: "8px",
              border: "1px solid #334155",
              backgroundColor: "#0f172a",
              color: "#f8fafc",
            }}
          />
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Sign Up
          </button>
        </form>

        {message && (
          <p style={{ marginTop: "15px", color: "#38bdf8" }}>{message}</p>
        )}

        <p style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#94a3b8" }}>
          Already have an account?{" "}
          <a href="/login" style={{ color: "#3b82f6", textDecoration: "none" }}>
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
