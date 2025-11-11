
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Dumbbell, Home, Target, MessageCircle, Menu, X, Info } from "lucide-react";
import ProfileButton from "./ProfileButton";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const linkClass = (path: string) =>
    `flex items-center gap-2 transition-colors ${
      pathname === path ? "text-blue-400 font-semibold" : "text-gray-300 hover:text-blue-400 hover:font-semibold"
    }`;

  return (
    <nav className="w-full px-4 sm:px-8 md:px-12 py-4 bg-[#0b1221] border-b border-[#1d2945] flex justify-between items-center shadow">
      <Link href="/" className="flex items-center gap-3">
        <Dumbbell size={28} className="text-blue-400" />
        <span className="text-2xl font-bold text-white tracking-tight">FitMind</span>
      </Link>

      {/* Desktop links */}
      <div className="hidden md:flex items-center gap-10 text-base">
        <Link href="/" className={linkClass("/")}>
          <Home size={20} className="mb-0.5" />
          <span className="font-medium">Home</span>
        </Link>

        <Link href="/plan" className={linkClass("/plan")}>
          <Target size={20} className="mb-0.5" />
          <span className="font-medium">Plan</span>
        </Link>

        <Link href="/chat" className={linkClass("/chat")}>
          <MessageCircle size={20} className="mb-0.5" />
          <span className="font-medium">Chat</span>
        </Link>

        <Link href="/about" className={linkClass("/about")}>
          <Info size={20} className="mb-0.5" />
          <span className="font-medium">About</span>
        </Link>
      </div>

      {/* Actions (desktop) */}
      <div className="hidden md:flex items-center gap-4">
        {session ? (
          <ProfileButton />
        ) : (
          <Link
            href="/login"
            className="bg-blue-600 hover:bg-blue-500 transition text-white px-5 py-2.5 rounded-lg text-base font-semibold shadow-md"
          >
            Log In
          </Link>
        )}
      </div>

      {/* Mobile menu button */}
      <button
        className="md:hidden p-2 rounded-md text-gray-300 hover:text-white"
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle navigation"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Mobile menu */}
      {open && (
        <div className="absolute left-0 right-0 top-full bg-[#0b1221] border-t border-[#1d2945] shadow-md md:hidden">
          <div className="flex flex-col gap-2 px-4 py-4">
            <Link href="/" className={linkClass("/") + " py-2"} onClick={() => setOpen(false)}>
              <Home size={18} /> Home
            </Link>
            <Link href="/plan" className={linkClass("/plan") + " py-2"} onClick={() => setOpen(false)}>
              <Target size={18} /> Plan
            </Link>
            <Link href="/chat" className={linkClass("/chat") + " py-2"} onClick={() => setOpen(false)}>
              <MessageCircle size={18} /> Chat
            </Link>
            <Link href="/about" className={linkClass("/about") + " py-2"} onClick={() => setOpen(false)}>
              <Info size={18} /> About
            </Link>

            <div className="pt-2">
              {session ? (
                <div className="flex justify-center">
                  <ProfileButton />
                </div>
              ) : (
                <Link href="/login" className="block bg-blue-600 text-white px-4 py-2 rounded-md text-center" onClick={() => setOpen(false)}>
                  Log In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
