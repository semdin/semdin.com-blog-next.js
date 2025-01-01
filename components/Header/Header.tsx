"use server";

import { ModeToggle } from "@/components/Theme/dark-light-toggle";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Header({
  categories,
  isAuthenticated,
}: {
  categories: any;
  isAuthenticated: boolean;
}) {
  return (
    <div className="flex justify-between space-x-8 w-full p-4 sticky top-0 z-10 items-center">
      <div className="flex items-center space-x-8">
        <Link href="/">
          <h1 className="font-extrabold text-xl text-[#3E7B27] hover:text-[#85A947]">
            semdin.com
          </h1>
        </Link>
        <ul className="flex space-x-4">
          <Link href="/">
            <li>Home</li>
          </Link>
          <Link href="/about">
            <li>About</li>
          </Link>
          {categories.map(
            (category: { id: string; name: string; slug: string }) => (
              <Link key={category.id} href={`/category/${category.slug}`}>
                <li>{category.name}</li>
              </Link>
            )
          )}
        </ul>
      </div>
      <div className="flex items-center space-x-4">
        {isAuthenticated ? (
          <Link href="/profile">
            <Button variant="outline">Profile</Button>
          </Link>
        ) : (
          <>
            <Link href="/login">
              <Button className="dark:text-white bg-[#3E7B27] hover:bg-[#85A947]">
                Sign In
              </Button>
            </Link>
          </>
        )}
        <ModeToggle />
      </div>
    </div>
  );
}
