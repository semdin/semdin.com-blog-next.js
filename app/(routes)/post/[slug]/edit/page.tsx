import {
  getPostBySlugWithCategories,
  getCategories,
  updatePost,
} from "@/actions/actions";
import EditPostEditor from "@/components/Post/EditPostEditor";

type EditPageProps = Promise<{ slug: string }>;

export default async function Page(props: { params: EditPageProps }) {
  const params = await props.params;
  const slug = params.slug;

  // 1. Fetch post data by slug
  const postData = await getPostBySlugWithCategories(slug);
  // `getPostBySlug` returns an array (based on the code).
  // So we should get the first element if it’s not empty:
  const post = postData?.[0];

  // 2. Fetch categories
  const categories = await getCategories();

  // 3. Handle server-side update
  // This function will be passed down to the editor
  const handleUpdate = async (data: {
    originalSlug: string; // new field
    title: string;
    content: string;
    categoryIds: string[];
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
