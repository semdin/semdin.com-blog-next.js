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

const newPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  categoryId: z.string().min(1, "Category is required"),
  content: z.string().min(1, "Content is required"),
});

type NewPostFormValues = z.infer<typeof newPostSchema>;

async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", process.env.NEXT_PUBLIC_UPLOAD_PRESET!); // Use the preset from .env

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, // Dynamic cloud name
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || "Failed to upload image");
  }
  return data.secure_url; // Return the uploaded image URL
}

export default function NewPostEditor({
  categories,
  handleSave,
}: {
  categories: { id: string; name: string }[];
  handleSave: (data: NewPostFormValues) => Promise<void>;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const [content, setContent] = useState("");
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<NewPostFormValues>({
    resolver: zodResolver(newPostSchema),
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleImagePasteOrDrop = async (
    dataTransfer: DataTransfer,
    setContent: (value: string) => void
  ) => {
    const files: File[] = [];
    for (let i = 0; i < dataTransfer.items.length; i++) {
      const file = dataTransfer.items[i].getAsFile();
      if (file && file.type.startsWith("image/")) {
        files.push(file);
      }
    }

    if (files.length > 0) {
      try {
        const urls = await Promise.all(files.map(uploadToCloudinary));
        const markdownImages = urls.map((url) => `![](${url})`).join("\n");
        setContent((prevContent) => prevContent + "\n" + markdownImages);
      } catch (error) {
        toast({
          title: "Image upload failed",
          description: error instanceof Error ? error.message : "Unknown error",
          variant: "destructive",
        });
      }
    }
  };

  const handleToolbarImageUpload = async (
    files: Array<File>,
    callback: (urls: string[]) => void
  ) => {
    try {
      // Upload all selected files to Cloudinary
      const urls = await Promise.all(files.map(uploadToCloudinary));

      // Pass the uploaded URLs to the editor's callback as an array
      callback(urls);
    } catch (error) {
      // Debugging: Log any errors
      console.error("Image upload error:", error);

      toast({
        title: "Image upload failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: NewPostFormValues) => {
    try {
      await handleSave(data);
      toast({
        title: "Post saved successfully!",
        description: "Your post has been saved.",
      });
    } catch (error) {
      toast({
        title: "Error saving post",
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
          <CardTitle>Create a New Post</CardTitle>
          <CardDescription>
            Fill in the details for your new blog post
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
                  onDrop={(e) =>
                    handleImagePasteOrDrop(e.dataTransfer, setContent)
                  }
                  onUploadImg={(files, callback) =>
                    handleToolbarImageUpload(files, callback)
                  }
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
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Post is being created..." : "Save Post"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
