import { getPostBySlug } from "@/actions/actions";
import Link from "next/link";

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const post = await getPostBySlug(slug).then((res) => res[0]);

  return (
    <div className="flex items-center justify-center flex-col">
      {!post ? (
        <p className="text-gray-500 mt-4">No post found.</p>
      ) : (
        <ul className="mt-4 space-y-2">
          <li key={post.id} className="border-b pb-2">
            <Link
              href={`/post/${post.slug}`}
              className="text-blue-500 hover:underline"
            >
              {post.title}
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
}
