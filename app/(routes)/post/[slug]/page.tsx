import { getPostBySlug } from "@/actions/actions";
import { CopyLink } from "@/components/Navigation/CopyLink";
import PostContent from "@/components/Post/PostContent";

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = await params; // Await params to handle its asynchronous nature
  const post = await getPostBySlug(slug).then((res) => res[0]);
  const url = `https://localhost:3000/post/${slug}`;

  return (
    <div className="container mx-auto py-8 h-screen">
      {!post ? (
        <p className="text-gray-500 mt-4">No post found.</p>
      ) : (
        <>
          <div className="flex items-center justify-start mb-6 gap-4">
            <h1 className="text-3xl font-bold">{post.title}</h1>
            <CopyLink url={url} />
          </div>

          <PostContent content={post.content} />
        </>
      )}
    </div>
  );
}
