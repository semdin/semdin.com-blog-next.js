import { db } from "@/db/index"; // Adjust based on your Drizzle setup
import { categories } from "@/db/schema";

export async function getCategories() {
  return await db.select().from(categories);
}
