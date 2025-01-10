import { getCategories } from "@/actions/actions";

export default async function Page() {
  const categories = await getCategories();

  return (
    <div className="flex items-center justify-center h-screen flex-col">
      <h1 className="text-2xl font-bold">Categories ({categories.length})</h1>
      {categories.length === 0 ? (
        <p className="text-gray-500 mt-4">No posts found for this category.</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {categories.map((category) => (
            <li key={category.id} className="border-b pb-2">
              <a
                href={`/category/${category.slug}`}
                className="text-blue-500 hover:underline"
              >
                {category.name}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
