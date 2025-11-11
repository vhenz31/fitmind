"use client";

import Navbar from "./navbar";
import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNavbar = pathname === "/login" || pathname === "/signup";

  return (
    <SessionProvider>
      {!hideNavbar && <Navbar />}
      {children}
    </SessionProvider>
  );
}