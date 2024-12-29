import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { drizzle } from "drizzle-orm/node-postgres";
import { DrizzleAdapter } from "@auth/drizzle-adapter";

// DB connection with Drizzle ORM
const db = drizzle(process.env.DATABASE_URL!);

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  adapter: DrizzleAdapter(db), // Adapter for Drizzle ORM
  secret: process.env.AUTH_SECRET, // Secret for token encryption and signing for sessions
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days // Maximum default is 30 days.
  },
  pages: {
    signIn: "/auth/sign-in",
    verifyRequest: "/auth/auth-success",
    error: "/auth/auth-error",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      allowDangerousEmailAccountLinking: true, // Allow linking multiple accounts with the same email
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST!,
        port: parseInt(process.env.EMAIL_SERVER_PORT!, 10),
        auth: {
          user: process.env.EMAIL_SERVER_USER!,
          pass: process.env.EMAIL_SERVER_PASSWORD!,
        },
      },
      from: process.env.EMAIL_FROM!,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Add user ID to the token
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id as string; // Add user ID to the session
      }
      return session;
    },
  },
});
