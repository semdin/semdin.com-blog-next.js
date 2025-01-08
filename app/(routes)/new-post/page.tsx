import { getCategories, savePost } from "@/actions/actions";
import NewPostEditor from "@/components/Post/NewPostEditor";
import { getUserRole } from "@/lib/auth/getUserRoleServerAction";
import { notFound } from "next/navigation";

export default async function Page() {
  const categories = await getCategories();
  const role = await getUserRole();
  const isAdmin = role?.role === "ADMIN";

  if (!isAdmin) {
    notFound();
  }

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
