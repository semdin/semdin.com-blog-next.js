import { db } from "@/db/index";
import { posts, categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth/authConfig";

export async function getCategories() {
  return await db.select().from(categories);
}

export async function getPostsByCategory(slug: string) {
  const category = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1);

  if (category.length === 0) {
    return [];
  }

  const postsForCategory = await db
    .select()
    .from(posts)
    .where(eq(posts.categoryId, category[0].id));

  return postsForCategory;
}

export async function getPostBySlug(slug: string) {
  return await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
}

// get all posts
export async function getPosts() {
  return await db.select().from(posts);
}

async function generateUniqueSlug(baseSlug: string): Promise<string> {
  let finalSlug = baseSlug;
  let counter = 2;

  while (true) {
    const existing = await db
      .select()
      .from(posts)
      .where(eq(posts.slug, finalSlug))
      .limit(1);

    // "existing" is an array.
    // if existing.length === 0, then no post found, we can use this slug.
    if (existing.length === 0) {
      return finalSlug;
    }

    // Otherwise, slug taken => append -2, -3, etc. and loop again
    finalSlug = `${baseSlug}-${counter}`;
    counter++;
  }
}

// CREATE
export async function savePost({
  title,
  content,
  categoryId,
  slug,
}: {
  title: string;
  content: string;
  categoryId: string;
  slug?: string; // optional
}) {
  // 1. Auth check
  const session = await auth(); // or however you get session in v5
  if (!session) {
    throw new Error("Unauthorized");
  }
  const userId = session.user.id;
  const userRole = session.user.role;
  console.log("userId", userId);
  console.log("userRole", userRole);
  if (!userId || userRole !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  // 2. Required fields check
  if (!title || !content || !categoryId) {
    throw new Error("Missing required fields");
  }

  console.log("Iam here");
  // 3. Clean up the slug
  let baseSlug = slug?.trim();
  if (!baseSlug) {
    // If user left slug blank, auto-generate from title
    baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  } else {
    // If user typed a slug, let's do a light cleaning
    baseSlug = baseSlug
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }
  console.log("I am here 2");

  // 4. Ensure slug is unique
  const finalSlug = await generateUniqueSlug(baseSlug);

  console.log("I am here 3");

  // 5. Insert
  const [newPost] = await db
    .insert(posts)
    .values({
      title,
      slug: finalSlug,
      content,
      userId,
      categoryId,
    })
    .returning();

  console.log("I am here 4");

  // 6. Return the new slug or entire post
  return `/post/${newPost.slug}`;
}

// UPDATE
export async function updatePost({
  originalSlug, // old slug
  title,
  content,
  categoryId,
  newSlug, // user-chosen or auto
}: {
  originalSlug: string;
  title: string;
  content: string;
  categoryId: string;
  newSlug?: string; // optional
}) {
  // 1. Auth check
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }
  const userId = session.user.id;
  const userRole = session.user.role;
  if (!userId || userRole !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  if (!originalSlug || !title || !content || !categoryId) {
    throw new Error("Missing required fields");
  }

  // 2. If the user provided a new slug, clean & check. Otherwise generate from title.
  let baseSlug = newSlug?.trim();
  if (!baseSlug) {
    baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  } else {
    baseSlug = baseSlug
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }

  // 3. Ensure uniqueness
  const finalSlug = await generateUniqueSlug(baseSlug);

  // 4. Update the post
  const [updatedPost] = await db
    .update(posts)
    .set({
      title,
      content,
      categoryId,
      slug: finalSlug,
    })
    .where(eq(posts.slug, originalSlug))
    .returning();

  if (!updatedPost) {
    throw new Error("Post not found or update failed.");
  }

  // 5. Return new slug or updated record
  return `/post/${updatedPost.slug}`;
}
