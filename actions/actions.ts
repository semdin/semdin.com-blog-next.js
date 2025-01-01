import { db } from "@/db/index";
import { posts, categories } from "@/db/schema";
import { eq } from "drizzle-orm";

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
