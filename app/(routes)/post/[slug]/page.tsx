import { getPostBySlug } from "@/actions/actions";
import { CopyLink } from "@/components/Navigation/CopyLink";

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const post = await getPostBySlug(slug).then((res) => res[0]);
  const url = `https://localhost:3000/post/${slug}`;

  return (
    <div className="flex items-center justify-center flex-col">
      {!post ? (
        <p className="text-gray-500 mt-4">No post found.</p>
      ) : (
        <>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold">{post.title}</h1>
            <CopyLink url={url} />
          </div>

          <div
            className="mt-4"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </>
      )}
    </div>
  );
}
