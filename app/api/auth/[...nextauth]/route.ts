import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/app/lib/prisma";

// Extend NextAuth types to include custom fields
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name?: string | null;
  }
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials.password) {
            return null;
          }

          const user = await prisma.user.findFirst({
            where: { email: credentials.email },
          });

          if (!user) {
            return null;
          }

          const isPasswordValid = await compare(
            credentials.password,
            (user as any).password
          );

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: (user as any).name || null,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }

      if (trigger === "update") {
        const updatedUser = await prisma.user.findUnique({
          where: { id: token.id },
        });

        if (updatedUser) {
          token.email = updatedUser.email;
          token.name = (updatedUser as any).name;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
      }

      return session;
    },

    async signIn() {
      return true;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return baseUrl + url;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
    signOut: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },

  jwt: {
    maxAge: 30 * 24 * 60 * 60,
  },

  secret: process.env.NEXTAUTH_SECRET,

  debug: process.env.NODE_ENV === "development",

  events: {
    async signIn({ user }) {
      if (user?.email) {
        console.log("User signed in: " + user.email);
      }
    },
    async signOut({ token }) {
      if (token?.email) {
        console.log("User signed out: " + token.email);
      }
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
