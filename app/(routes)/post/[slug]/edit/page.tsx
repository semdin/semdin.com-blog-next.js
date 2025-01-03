import { getPostBySlug, getCategories, updatePost } from "@/actions/actions";
import EditPostEditor from "@/components/Post/EditPostEditor";

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = await params;

  // 1. Fetch post data by slug
  const postData = await getPostBySlug(slug);
  // `getPostBySlug` returns an array (based on the code).
  // So we should get the first element if it’s not empty:
  const post = postData?.[0];

  // 2. Fetch categories
  const categories = await getCategories();

  // 3. Handle server-side update
  // This function will be passed down to the editor
  const handleUpdate = async (data: {
    title: string;
    content: string;
    categoryId: string;
    slug: string; // the old slug
  }) => {
    "use server"; // server action
    await updatePost(data);
  };

  // In case the post doesn’t exist
  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div>
      <EditPostEditor
        post={post}
        categories={categories}
        handleUpdate={handleUpdate}
      />
    </div>
  );
}
