import { getPostBySlug, getPosts } from "@/actions/actions";
import { CopyLink } from "@/components/Navigation/CopyLink";
import PostContent from "@/components/Post/PostContent";

export default async function Page() {
  const posts = await getPosts();

  return (
    <div className="flex items-center justify-center h-screen flex-col">
      <h1 className="text-2xl font-bold">Posts ({posts.length})</h1>
      {posts.length === 0 ? (
        <p className="text-gray-500 mt-4">No posts found for this category.</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {posts.map((post) => (
            <li key={post.id} className="border-b pb-2">
              <a
                href={`/post/${post.slug}`}
                className="text-blue-500 hover:underline"
              >
                {post.title}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
