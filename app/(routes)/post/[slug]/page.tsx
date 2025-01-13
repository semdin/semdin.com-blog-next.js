import { getPostBySlug } from "@/actions/actions";
import type { Metadata } from "next";
import { CopyLink } from "@/components/Navigation/CopyLink";
import PostContent from "@/components/Post/PostContent";
import { getUserRole } from "@/lib/auth/getUserRoleServerAction";
import Link from "next/link";
import { FaEdit } from "react-icons/fa";

type PostPageProps = { params: Promise<{ slug: string }> };

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug).then((res) => res[0]);

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested post could not be found.",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://localhost:3000";
  const postUrl = `${siteUrl}/post/${slug}`;
  const defaultImage = `${siteUrl}/default-og-image.jpg`;

  const excerpt = post.content.slice(0, 160).replace(/\s+/g, " ").trim();

  return {
    title: post.title,
    description: excerpt,
    openGraph: {
      title: post.title,
      description: excerpt,
      url: postUrl,
      images: [
        {
          url: defaultImage,
          width: 800,
          height: 600,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: excerpt,
      images: [defaultImage],
    },
  };
}

export default async function Page({ params }: PostPageProps) {
  const { slug } = await params;
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
