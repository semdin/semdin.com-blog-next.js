// types/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { AdapterUser } from "next-auth/adapters";

/**
 * If you need to store the user role in the session, augment the interfaces below.
 * You can add any additional user/session properties you need.
 */
declare module "next-auth" {
  // Extend `User` and/or `AdapterUser` if you need it during the sign-in flow
  interface User extends DefaultUser {
    role?: string;
  }

  interface AdapterUser {
    role?: string;
  }

  // Extend the `session` return type
  interface Session extends DefaultSession {
    user: {
      /** The user's id. */
      id: string;
      /** The user's role. */
      role?: string;
    } & DefaultSession["user"];
  }
}
