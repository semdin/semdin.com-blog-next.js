import { getPostsByCategory } from "@/actions/actions";

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const posts = await getPostsByCategory(slug);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Category: {slug}</h1>
      {posts.length === 0 ? (
        <p className="text-gray-500 mt-4">No posts found for this category.</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {posts.map((post) => (
            <li key={post.id} className="border-b pb-2">
              <a
                href={`/posts/${post.slug}`}
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
