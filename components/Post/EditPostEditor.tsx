"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MdEditor } from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import { useTheme } from "next-themes";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const editPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  categoryId: z.string().min(1, "Category is required"),
  content: z.string().min(1, "Content is required"),
  slug: z.string().min(1, "Slug is required"), // hidden or read-only
});

type EditPostFormValues = z.infer<typeof editPostSchema>;

export default function EditPostEditor({
  post,
  categories,
  handleUpdate,
}: {
  post: {
    title: string;
    slug: string;
    content: string;
    categoryId: string;
  };
  categories: { id: string; name: string }[];
  handleUpdate: (data: EditPostFormValues) => Promise<void>;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EditPostFormValues>({
    resolver: zodResolver(editPostSchema),
    defaultValues: {
      title: post.title,
      content: post.content,
      categoryId: post.categoryId,
      slug: post.slug, // we store the old slug so we can identify the correct post
    },
  });

  const [content, setContent] = useState(post.content);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onSubmit = async (data: EditPostFormValues) => {
    try {
      await handleUpdate(data);
      toast({
        title: "Post updated successfully!",
        description: "Your post has been updated.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error updating post",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Edit Post</CardTitle>
          <CardDescription>
            Update the details for your blog post
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="Enter post title"
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                onValueChange={(value: string) => setValue("categoryId", value)}
                defaultValue={post.categoryId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && (
                <p className="text-sm text-red-500">
                  {errors.categoryId.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              {isMounted ? (
                <MdEditor
                  modelValue={content}
                  onChange={(value) => {
                    setContent(value);
                    setValue("content", value);
                  }}
                  language="en-US"
                  theme={currentTheme === "dark" ? "dark" : "light"}
                />
              ) : (
                <div className="flex justify-center items-center h-40">
                  <Loader2 className="mr-2 h-8 w-8 animate-spin text-gray-500" />
                </div>
              )}
              {errors.content && (
                <p className="text-sm text-red-500">{errors.content.message}</p>
              )}
            </div>

            {/* We keep the old slug in a hidden field. 
                This is important so we know which post to update. */}
            <input type="hidden" {...register("slug")} />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Updating post..." : "Update Post"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
