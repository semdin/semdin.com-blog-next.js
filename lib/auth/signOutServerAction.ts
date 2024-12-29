"use server";

import { signOut } from "@/lib/auth/authConfig";

export const handleSignOut = async () => {
  try {
    // NextAuth will handle the redirect
    // because `redirect: true` (the default)
    // and we're specifying a custom path.
    await signOut({ redirectTo: "/", redirect: true });

    // No need to call next/navigation `redirect("/")`
    // because NextAuth's signOut will do it for us.
  } catch (error) {
    throw error;
  }
};
