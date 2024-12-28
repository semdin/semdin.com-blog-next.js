import React from "react";
import { ModeToggle } from "@/components/Theme/dark-light-toggle";
import { getCategories } from "@/actions/actions"; // Path to your server action

export const Header = async () => {
  const categories = await getCategories();

  return (
    <div className="flex justify-between space-x-8 w-full p-4 bg-white dark:bg-black sticky top-0 z-10 items-center">
      <div className="flex items-center space-x-8">
        <h1>semdin.com</h1>
        <ul className="flex space-x-4">
          <li>Home</li>
          <li>About</li>
          {categories.map(
            (category: { id: string; name: string; slug: string }) => (
              <li key={category.id}>{category.name}</li>
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
