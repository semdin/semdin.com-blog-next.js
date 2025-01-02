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

  return newPost;
}
