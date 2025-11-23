import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password || !name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        { error: "Email, password, and valid name are required" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findFirst({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
        name: name.trim(),
      } as any,
    });

    console.log("✅ User registered:", email);

    return NextResponse.json({ message: "User created successfully" });
  } catch (err: any) {
    console.error("Signup error:", err);
    // Return error message for debugging - remove or sanitize in production
    return NextResponse.json({ error: "Server error", message: err.message || String(err) }, { status: 500 });
  }
}
