"use server";

import { signIn } from "@/lib/auth/authConfig";

export const handleEmailSignIn = async (email: string) => {
  try {
    await signIn("mailgun", { email, callbackUrl: "/profile" });
  } catch (error) {
    throw error;
  }
};
