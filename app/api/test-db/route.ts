import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const prisma = new PrismaClient();
  try {
    const users = await prisma.user.findMany();
    return Response.json(users);
  } catch (err) {
    console.error(err);
    return new Response("Error fetching users", { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
