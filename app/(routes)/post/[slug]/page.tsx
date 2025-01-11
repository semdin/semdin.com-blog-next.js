import { getPostBySlug } from "@/actions/actions";
import { CopyLink } from "@/components/Navigation/CopyLink";
import PostContent from "@/components/Post/PostContent";
import { getUserRole } from "@/lib/auth/getUserRoleServerAction";
import Link from "next/link";
import { FaEdit } from "react-icons/fa";

type PostPageProps = Promise<{ slug: string }>;

export default async function Page(props: { params: PostPageProps }) {
  const params = await props.params;
  const slug = params.slug;
  const post = await getPostBySlug(slug).then((res) => res[0]);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://localhost:3000";
  const url = `${siteUrl}/post/${slug}`;

  const role = await getUserRole();
  const isAdmin = role?.role === "ADMIN";

  return (
    <div className="container mx-auto py-8">
      {!post ? (
        <p className="text-gray-500 mt-4">No post found.</p>
      ) : (
        <>
          <div className="flex items-center justify-start mb-6 gap-4">
            <h1 className="text-3xl font-bold">{post.title}</h1>
            <CopyLink url={url} />
            {isAdmin && (
              <Link href={`/post/${slug}/edit`} passHref>
                <button className="flex items-center text-blue-600 hover:text-blue-400">
                  <FaEdit className="mr-2" /> Edit
                </button>
              </Link>
            )}
          </div>

          <PostContent content={post.content} />
        </>
      )}
    </div>
  );
}
