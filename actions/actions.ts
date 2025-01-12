import { db } from "@/db/index";
import { posts, categories, postCategories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth/authConfig";

export async function getCategories() {
  return await db.select().from(categories);
}

export async function getPostsByCategory(slug: string) {
  // 1. Find the category by slug
  const [category] = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1);

  if (!category) {
    // no category found
    return [];
  }

  // 2. Get all posts that belong to this category using the join table
  //    The result shape varies based on how you do .select().
  //    For a straightforward approach, just select all columns from posts.
  const rows = await db
    .select({
      post: posts,
    })
    .from(posts)
    .innerJoin(postCategories, eq(posts.id, postCategories.postId))
    .where(eq(postCategories.categoryId, category.id));

  // 3. Extract the post records
  //    If you used an alias-based select(), you might need to map them out.
  //    For example: rows.map((row) => row.post)
  return rows.map((row) => row.post);
}

export async function getPostBySlug(slug: string) {
  return await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
}

export async function getPostBySlugWithCategories(slug: string) {
  // First, get the post row
  const [postRow] = await db
    .select()
    .from(posts)
    .where(eq(posts.slug, slug))
    .limit(1);

  if (!postRow) return [];

  // Next, get all categoryIds for this post
  const catRows = await db
    .select({
      categoryId: postCategories.categoryId,
    })
    .from(postCategories)
    .where(eq(postCategories.postId, postRow.id));

  const categoryIds = catRows.map((row) => row.categoryId);

  // Combine them into one object
  const finalPost = {
    id: postRow.id,
    slug: postRow.slug,
    createdAt: postRow.createdAt,
    title: postRow.title,
    content: postRow.content,
    userId: postRow.userId,
    status: postRow.status,
    updatedAt: postRow.updatedAt,
    // ADD THIS:
    categoryIds,
  };

  return [finalPost];
}

// get all posts
export async function getPosts() {
  return await db.select().from(posts);
}

// get all posts with categories
export async function getPostsWithCategories() {
  const rows = await db
    .select({
      post: posts,
      category: categories,
    })
    .from(posts)
    .innerJoin(postCategories, eq(posts.id, postCategories.postId))
    .innerJoin(categories, eq(categories.id, postCategories.categoryId));

  // Group by post ID
  const postsMap = new Map<string, any>();
  rows.forEach((row) => {
    const postId = row.post.id;
    if (!postsMap.has(postId)) {
      postsMap.set(postId, {
        ...row.post,
        categories: [],
      });
    }
    const post = postsMap.get(postId);
    post.categories.push(row.category);
  });

  return Array.from(postsMap.values());
}

// get featured posts
export async function getFeaturedPosts() {
  return await db.select().from(posts).where(eq(posts.status, "FEATURED"));
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

// generate a unique slug for updating a post
export async function generateUniqueSlugForUpdate(
  baseSlug: string,
  originalSlug: string
): Promise<string> {
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
    if (existing.length === 0 || existing[0].slug === originalSlug) {
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
  categoryIds,
  slug,
}: {
  title: string;
  content: string;
  categoryIds: string[];
  slug?: string; // optional
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

  // 2. Required fields check
  if (!title || !content || !categoryIds) {
    throw new Error("Missing required fields");
  }

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

  // 4. Ensure slug is unique
  const finalSlug = await generateUniqueSlug(baseSlug);

  // 5. Insert post
  const [newPost] = await db
    .insert(posts)
    .values({
      title,
      slug: finalSlug,
      content,
      userId,
    })
    .returning();

  // 6. Insert rows in postCategories for each category
  if (categoryIds && categoryIds.length > 0) {
    const insertRecords = categoryIds.map((catId) => ({
      postId: newPost.id,
      categoryId: catId,
    }));
    await db.insert(postCategories).values(insertRecords);
  }

  // 6. Return the new slug or entire post
  return `/post/${newPost.slug}`;
}

// UPDATE
export async function updatePost({
  originalSlug, // old slug
  title,
  content,
  categoryIds,
}: {
  originalSlug: string;
  title: string;
  content: string;
  categoryIds: string[];
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

  if (!originalSlug || !title || !content || !categoryIds) {
    throw new Error("Missing required fields");
  }

  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  // 3. Ensure uniqueness
  const finalSlug = await generateUniqueSlugForUpdate(baseSlug, originalSlug);

  // 4. Update the post
  const [updatedPost] = await db
    .update(posts)
    .set({
      title,
      content,
      slug: finalSlug,
    })
    .where(eq(posts.slug, originalSlug))
    .returning();

  if (!updatedPost) {
    throw new Error("Post not found or update failed.");
  }

  // 5. Update join table
  //    5a) Remove old associations
  await db
    .delete(postCategories)
    .where(eq(postCategories.postId, updatedPost.id));

  //    5b) Insert new associations
  if (categoryIds && categoryIds.length > 0) {
    const newLinks = categoryIds.map((catId) => ({
      postId: updatedPost.id,
      categoryId: catId,
    }));
    await db.insert(postCategories).values(newLinks);
  }

  if (!updatedPost) {
    throw new Error("Post not found or update failed.");
  }

  // 5. Return new slug or updated record
  return `/post/${updatedPost.slug}`;
}
