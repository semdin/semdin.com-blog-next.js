import { getPostsWithCategories } from "@/actions/actions";
import HomePage from "@/components/Home/HomePage";

export default async function Page() {
  const postsWithCategories = await getPostsWithCategories();
  const featuredPosts = postsWithCategories.filter(
    (post) => post.status === "FEATURED"
  );

  return (
    <HomePage featuredPosts={featuredPosts} allPosts={postsWithCategories} />
  );
}
