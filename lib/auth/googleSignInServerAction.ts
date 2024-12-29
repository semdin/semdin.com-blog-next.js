"use server";

import { signIn } from "@/lib/auth/authConfig";

export const handleGoogleSignIn = async () => {
  try {
    await signIn("google", { redirectTo: "/profile" });
  } catch (error) {
    throw error;
  }
};
