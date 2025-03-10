import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { drizzle } from "drizzle-orm/node-postgres";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Mailgun from "next-auth/providers/mailgun";
import {
  accounts,
  Role,
  sessions,
  users,
  verificationTokens,
} from "@/db/schema";
import { clearStaleTokens } from "./clearStaleTokenServerAction";

// DB connection with Drizzle ORM
const db = drizzle(process.env.DATABASE_URL!);

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  secret: process.env.AUTH_SECRET, // Secret for token encryption and signing for sessions
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days // Maximum default is 30 days.
  },
  pages: {
    signIn: "/login",
    verifyRequest: "/auth-success",
    error: "/auth-error",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      allowDangerousEmailAccountLinking: true, // Allow linking multiple accounts with the same email
    }),
    Mailgun,
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        await clearStaleTokens(); // Clear stale tokens
        token.id = user.id; // Add user ID to the token
        token.role = user.role; // Add user role to the token
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id as string; // Add user ID to the session
        session.user.role = token.role as Role; // Add user role to the session
      }
      return session;
    },
  },
});
