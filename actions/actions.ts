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

export async function savePost({
  title,
  content,
  categoryId,
}: {
  title: string;
  content: string;
  categoryId: string;
}) {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const userId = session.user?.id;
  const userRole = session.user?.role;

  if (!userId || userRole !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  if (!title || !content || !categoryId) {
    throw new Error("Missing required fields");
  }

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  const [newPost] = await db
    .insert(posts)
    .values({
      title,
      slug,
      content,
      userId: userId,
      categoryId: categoryId,
    })
    .returning();

  const link = `/post/${newPost.slug}`;

  return link;
}

// update existing post
export async function updatePost({
  title,
  content,
  categoryId,
  slug, // old slug from the URL
}: {
  title: string;
  content: string;
  categoryId: string;
  slug: string;
}) {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const userId = session.user?.id;
  const userRole = session.user?.role;

  if (!userId || userRole !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  // Re-generate slug from the new title
  const newSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  // Update the post
  const [updatedPost] = await db
    .update(posts)
    .set({
      title,
      content,
      categoryId,
      slug: newSlug,
    })
    .where(eq(posts.slug, slug)) // find by old slug
    .returning();

  return updatedPost;
}
