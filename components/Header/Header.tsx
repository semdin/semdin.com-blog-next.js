"use client";

import { ModeToggle } from "@/components/Theme/dark-light-toggle";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export const Header = ({ categories }: { categories: any }) => {
  const router = useRouter();
  const { data: session } = useSession();

  const handleSignIn = () => {
    router.push("/login");
  };

  const handleSignUp = () => {
    router.push("/register");
  };

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
        {session ? (
          <Link href="/profile">
            <Button variant="outline">Profile</Button>
          </Link>
        ) : (
          <>
            <Button onClick={handleSignIn} variant="outline">
              Sign in
            </Button>
            <Button onClick={handleSignUp}>Sign Up</Button>
          </>
        )}
        <ModeToggle />
      </div>
    </div>
  );
};
