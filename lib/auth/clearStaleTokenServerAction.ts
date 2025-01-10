"use server";

import { db } from "@/db";
import { verificationTokens } from "@/db/schema";
import { lt } from "drizzle-orm";

export const clearStaleTokens = async () => {
  try {
    // DELETE FROM verification_token WHERE expires < NOW();
    await db
      .delete(verificationTokens)
      .where(lt(verificationTokens.expires, new Date()));
  } catch (error) {
    throw error;
  }
};
