"use client";

import { useEffect, useState } from "react";
import { ModeToggle } from "@/components/Theme/dark-light-toggle";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { TbCodePlus } from "react-icons/tb";

export default function Header({
  categories,
  isAuthenticated,
}: {
  categories: any;
  isAuthenticated: boolean;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-background/95 md:backdrop-blur md:supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="flex justify-between w-full h-full px-4 items-center max-w-7xl mx-auto">
        <div className="flex items-center">
          <Link href="/">
            <h1 className="font-extrabold text-xl text-[#3E7B27] hover:text-[#85A947]">
              semdin.com
            </h1>
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <nav>
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
          </nav>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <Link href="/profile">
                <Button variant="outline">Profile</Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button className="dark:text-white bg-[#3E7B27] hover:bg-[#85A947]">
                  Sign In
                </Button>
              </Link>
            )}
            <ModeToggle />
            <Link href="/new-post">
              <Button variant="outline">
                <TbCodePlus />
              </Button>
            </Link>
          </div>
        </div>

        <div className="md:hidden flex items-center">
          <ModeToggle />
          <Link href="/new-post">
            <Button variant="outline">
              <TbCodePlus />
            </Button>
          </Link>
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
            <ul className="space-y-2">
              <Link href="/" onClick={() => setIsMenuOpen(false)}>
                <li>Home</li>
              </Link>
              <Link href="/about" onClick={() => setIsMenuOpen(false)}>
                <li>About</li>
              </Link>
              {categories.map(
                (category: { id: string; name: string; slug: string }) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.slug}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <li>{category.name}</li>
                  </Link>
                )
              )}
            </ul>
          </nav>
          <div className="px-4 pb-4">
            {isAuthenticated ? (
              <>
                <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Profiles
                  </Button>
                </Link>
              </>
            ) : (
              <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full dark:text-white bg-[#3E7B27] hover:bg-[#85A947]">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
