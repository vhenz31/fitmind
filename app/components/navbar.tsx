"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4 bg-[#0b132b] text-white shadow-md">
      <h1 className="text-lg font-bold">FitMind</h1>
      <div className="flex space-x-6">
        <Link href="/">Home</Link>
        <Link href="/plan">Plan</Link>
        <Link href="/chat">Chat</Link>
        <Link href="/about">About</Link>
      </div>
    </nav>
  );
}
