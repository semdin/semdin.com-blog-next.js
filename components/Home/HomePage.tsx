"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarkdownPreview } from "@/components/Markdown/MarkdownPreivew";

type Category = {
  id: string;
  name: string;
};

type Post = {
  content: string;
  title: string;
  id: string;
  status: string | null;
  slug: string;
  createdAt: Date | null;
  userId: string | null;
  updatedAt: Date | null;
  categories: Category[];
};

type HomePageProps = {
  featuredPosts: Post[];
  allPosts: Post[];
};

// A small helper to format the createdAt date
function formatDate(date: Date | null): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function HomePage({ featuredPosts, allPosts }: HomePageProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="container mx-auto py-8 space-y-12">
      {/* Intro Section */}
      <section className=" shadow-sm rounded-md mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center">
          {/* Intro Text */}
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
              Welcome to <strong>Semdin.com</strong>
            </h1>
            <p className="text-gray-700 leading-relaxed max-w-2xl">
              Hey there! I’m <strong className="font-semibold">Mehmet</strong> a{" "}
              <strong className="font-semibold">Computer Engineer</strong> who
              loves <strong className="font-semibold">learning</strong>,
              <strong className="font-semibold"> discovering</strong>, and
              exploring all things tech. This blog is my personal corner of the
              internet where I share what I&apos;ve been learning in my life.
              Join me on this exciting journey!
            </p>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Featured Posts</h2>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          orientation="horizontal"
        >
          <CarouselContent>
            {featuredPosts.map((post) => {
              const dateString = formatDate(post.createdAt);

              return (
                <CarouselItem
                  key={post.id}
                  className="sm:basis-full md:basis-1/2 lg:basis-1/3"
                >
                  {/* Wrap the entire card in a Link so the whole card is clickable */}
                  <Link href={`/post/${post.slug}`}>
                    <Card
                      className="
                        w-full 
                        mx-auto 
                        h-full
                        overflow-hidden 
                        cursor-pointer 
                        flex 
                        flex-col 
                        justify-between
                      "
                    >
                      {/* CardHeader can hold the title and the date badge on top-right */}
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-2xl leading-tight">
                            {post.title}
                          </CardTitle>
                          {dateString ? (
                            <Badge variant="secondary" className="mt-1 text-sm">
                              {dateString}
                            </Badge>
                          ) : null}
                        </div>
                      </CardHeader>

                      <CardContent className="flex-1 overflow-hidden">
                        <MarkdownPreview
                          content={post.content.slice(0, 200) + "..."}
                        />
                      </CardContent>

                      {/* Categories pinned at bottom via CardFooter */}
                      <CardFooter className="border-t mt-2 pt-2">
                        <div className="flex flex-wrap gap-2">
                          {post.categories.map((category) => (
                            <Badge key={category.id} variant="secondary">
                              {category.name}
                            </Badge>
                          ))}
                        </div>
                      </CardFooter>
                    </Card>
                  </Link>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="hidden lg:block" />
          <CarouselNext className="hidden lg:block" />
        </Carousel>
      </section>

      {/* All Posts */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">All Posts</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {allPosts.map((post) => {
            const dateString = formatDate(post.createdAt);

            return (
              <Link key={post.id} href={`/post/${post.slug}`}>
                <Card
                  className="
                    overflow-hidden 
                    cursor-pointer 
                    h-full
                    flex 
                    flex-col 
                    justify-between
                  "
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-2xl leading-tight">
                        {post.title}
                      </CardTitle>
                      {dateString ? (
                        <Badge variant="secondary" className="mt-1 text-sm">
                          {dateString}
                        </Badge>
                      ) : null}
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 overflow-hidden">
                    <MarkdownPreview
                      content={post.content.slice(0, 200) + "..."}
                    />
                  </CardContent>

                  <CardFooter className="border-t mt-2 pt-2">
                    <div className="flex flex-wrap gap-2">
                      {post.categories.map((category) => (
                        <Badge key={category.id} variant="secondary">
                          {category.name}
                        </Badge>
                      ))}
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
