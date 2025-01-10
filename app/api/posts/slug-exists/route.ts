import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { posts } from "@/db/schema";

// 1. Slugify helper
function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawSlug = searchParams.get("slug") ?? "";

  // 2. Convert whatever user typed to the “final” slug
  const cleanedSlug = slugify(rawSlug);

  // If it becomes empty after cleaning (e.g., they typed only punctuation)
  if (!cleanedSlug) {
    return NextResponse.json({ exists: false });
  }

  // 3. Check if a post with this cleaned slug already exists
  const existing = await db
    .select()
    .from(posts)
    .where(eq(posts.slug, cleanedSlug))
    .limit(1);

  return NextResponse.json({ exists: existing.length > 0 });
}
