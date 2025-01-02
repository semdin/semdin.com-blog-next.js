import { getCategories, savePost } from "@/actions/actions";
import NewPostEditor from "@/components/Post/NewPostEditor";

export default async function Page() {
  const categories = await getCategories();

  const handleSave = async (data: {
    title: string;
    content: string;
    categoryId: string;
  }) => {
    "use server";
    await savePost(data);
  };

  return (
    <div>
      <NewPostEditor categories={categories} handleSave={handleSave} />
    </div>
  );
}
