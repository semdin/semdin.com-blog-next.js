import { getPostBySlug } from "@/actions/actions";
import { CopyLink } from "@/components/Navigation/CopyLink";
import PostContent from "@/components/Post/PostContent";

type PostPageProps = Promise<{ slug: string }>;

export default async function Page(props: { params: PostPageProps }) {
  const params = await props.params;
  const slug = params.slug;
  const post = await getPostBySlug(slug).then((res) => res[0]);
  const url = `/post/${slug}`;

  return (
    <div className="container mx-auto py-8">
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
