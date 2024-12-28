"use server";
import { ModeToggle } from "@/components/Theme/dark-light-toggle";
import { getCategories } from "@/actions/actions";
import Link from "next/link";

export const Header = async () => {
  const categories = await getCategories();

  return (
    <div className="flex justify-between space-x-8 w-full p-4 bg-white dark:bg-black sticky top-0 z-10 items-center">
      <div className="flex items-center space-x-8">
        <Link href="/">
          <h1>semdin.com</h1>
        </Link>
        <ul className="flex space-x-4">
          <Link href="/">
            <li>Home</li>
          </Link>
          <Link href="/about">
            <li>About</li>
          </Link>
          {categories.map(
            (
              category: { id: string; name: string; slug: string } // key is a property that should only be given to the outer container.
            ) => (
              <Link key={category.id} href={`/category/${category.slug}`}>
                <li>{category.name}</li> {/* Write your comments here */}
              </Link>
            )
          )}
        </ul>
      </div>
      <div>
        <ModeToggle />
      </div>
    </div>
  );
};
