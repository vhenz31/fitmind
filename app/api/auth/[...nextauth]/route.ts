import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

const users = [
  {
    id: "1",
    email: "test@example.com",
    password: "$2b$10$a0aN3KTJCrA9jXagtCbIXuq9WAlF3pbYnIMO0DxBKQgzMsa7/momW", // password123
  },
];

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = users.find((u) => u.email === credentials?.email);
        if (!user) return null;

        const isMatch = bcrypt.compareSync(
          credentials!.password,
          user.password
        );

        if (isMatch) {
          return { id: user.id, email: user.email };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "mysecret",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
