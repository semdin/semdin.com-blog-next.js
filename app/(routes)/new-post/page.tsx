// app/new-post/page.tsx (example)
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

  // IMPORTANT: We return the link from savePost, so we can redirect on the client
  const handleSave = async (data: {
    title: string;
    content: string;
    categoryIds: string[];
    slug?: string; // new slug field
  }) => {
    "use server";
    // We assume savePost returns the new post URL (e.g. `/post/my-title`)
    return await savePost(data);
  };

  return (
    <div>
      <NewPostEditor categories={categories} handleSave={handleSave} />
    </div>
  );
}
