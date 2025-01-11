"use client";

import { useState } from "react";
import { ModeToggle } from "@/components/Theme/dark-light-toggle";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { TbCodePlus } from "react-icons/tb";

type Category = {
  id: string;
  name: string;
  slug: string;
};

type HeaderProps = {
  categories: Category[];
  isAuthenticated: boolean;
  isAdmin: boolean;
};

export default function Header({
  categories,
  isAuthenticated,
  isAdmin,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const NavItems = () => (
    <>
      <Link href="/">
        <li>Home</li>
      </Link>
      <Link href="/about">
        <li>About</li>
      </Link>
      {categories.map((category) => (
        <Link key={category.id} href={`/category/${category.slug}`}>
          <li>{category.name}</li>
        </Link>
      ))}
    </>
  );

  const AuthButton = () =>
    isAuthenticated ? (
      <Link href="/profile">
        <Button variant="outline">Profile</Button>
      </Link>
    ) : (
      <Link href="/login">
        <Button className="dark:text-white bg-[#3E7B27] hover:bg-[#85A947]">
          Sign In
        </Button>
      </Link>
    );

  const NewPostButton = () =>
    isAuthenticated &&
    isAdmin && (
      <Link href="/new-post">
        <Button variant="outline">
          <TbCodePlus />
        </Button>
      </Link>
    );

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-background/95 md:backdrop-blur md:supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="container flex justify-between w-full h-full items-center mx-auto">
        <div className="flex items-center">
          <Link href="/">
            <h1 className="font-extrabold text-xl text-[#3E7B27] hover:text-[#85A947]">
              semdin.com
            </h1>
          </Link>
        </div>

        <div className="hidden lg:flex items-center space-x-8">
          <nav>
            <ul className="flex space-x-4">
              <NavItems />
            </ul>
          </nav>
          <div className="flex items-center space-x-4">
            <AuthButton />
            <ModeToggle />
            <NewPostButton />
          </div>
        </div>

        <div className="lg:hidden flex items-center space-x-2">
          <ModeToggle />
          <NewPostButton />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <nav className="px-4 pt-2 pb-4">
            <ul className="space-y-2" onClick={() => setIsMenuOpen(false)}>
              <NavItems />
            </ul>
          </nav>
          <div className="px-4 pb-4">
            <AuthButton />
          </div>
        </div>
      )}
    </header>
  );
}
