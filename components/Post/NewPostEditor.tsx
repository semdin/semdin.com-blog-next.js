"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MdEditor } from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import { useTheme } from "next-themes";
import { Loader2, Upload } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
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
import { useRouter } from "next/navigation";

// 1. Extend your schema with an optional "slug" field
const newPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  categoryId: z.string().min(1, "Category is required"),
  content: z.string().min(1, "Content is required"),
  slug: z
    .string()
    .max(100, "Slug is too long")
    .regex(/^[a-zA-Z0-9-_]*$/, "Only letters, numbers, dashes, underscores")
    .optional(),
});

type NewPostFormValues = z.infer<typeof newPostSchema>;

// If you have a real interface for category shape, you can use that
interface Category {
  id: string;
  name: string;
}

async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", process.env.NEXT_PUBLIC_UPLOAD_PRESET!);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || "Failed to upload image");
  }
  return data.secure_url;
}

export default function NewPostEditor({
  categories,
  handleSave,
}: {
  categories: Category[];
  // handleSave is provided from page.tsx, which calls the server action
  handleSave: (data: NewPostFormValues) => Promise<string | void>;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [content, setContent] = useState("");
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const { toast } = useToast();
  const router = useRouter();

  // 2. React Hook Form
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<NewPostFormValues>({
    resolver: zodResolver(newPostSchema),
  });

  // 3. Slug checking
  const watchSlug = watch("slug"); // watch the slug field
  const [slugIsTaken, setSlugIsTaken] = useState(false);
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);

  useEffect(() => {
    // If no slug, no need to check
    if (!watchSlug) {
      setSlugIsTaken(false);
      return;
    }

    let active = true;
    setIsCheckingSlug(true);

    fetch(`/api/posts/slug-exists?slug=${encodeURIComponent(watchSlug)}`)
      .then((res) => res.json())
      .then((data) => {
        if (active) {
          setSlugIsTaken(data.exists);
        }
      })
      .finally(() => {
        if (active) {
          setIsCheckingSlug(false);
        }
      });

    return () => {
      active = false;
    };
  }, [watchSlug]);

  // 4. On mount, set up drag listeners
  useEffect(() => {
    setIsMounted(true);

    function handleWindowDragOver(e: DragEvent) {
      e.preventDefault();
      if (e.dataTransfer?.types.includes("Files")) {
        setIsDraggingFile(true);
      }
    }

    function handleWindowDragLeave(e: DragEvent) {
      e.preventDefault();
      if (
        e.clientX <= 0 ||
        e.clientY <= 0 ||
        e.clientX >= window.innerWidth ||
        e.clientY >= window.innerHeight
      ) {
        setIsDraggingFile(false);
      }
    }

    function handleWindowDrop() {
      setIsDraggingFile(false);
    }

    window.addEventListener("dragover", handleWindowDragOver);
    window.addEventListener("dragleave", handleWindowDragLeave);
    window.addEventListener("drop", handleWindowDrop);

    return () => {
      window.removeEventListener("dragover", handleWindowDragOver);
      window.removeEventListener("dragleave", handleWindowDragLeave);
      window.removeEventListener("drop", handleWindowDrop);
    };
  }, []);

  // 5. Image uploads
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
      setIsUploading(true);
      setIsDraggingFile(false);
      try {
        const urls = await Promise.all(files.map(uploadToCloudinary));
        const markdownImages = urls.map((url) => `![](${url})`).join("\n");
        setContent(content + "\n" + markdownImages);

        toast({
          title: "Image upload successful",
          description: `Successfully uploaded ${files.length} image${
            files.length > 1 ? "s" : ""
          }`,
        });
      } catch (error) {
        toast({
          title: "Image upload failed",
          description: error instanceof Error ? error.message : "Unknown error",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    }
  };

  // 5B. Toolbar image upload
  const handleToolbarImageUpload = async (
    files: Array<File>,
    callback: (urls: string[]) => void
  ) => {
    setIsUploading(true);
    try {
      const urls = await Promise.all(files.map(uploadToCloudinary));
      callback(urls);
      toast({
        title: "Image upload successful",
        description: `Successfully uploaded ${files.length} image${
          files.length > 1 ? "s" : ""
        }`,
      });
    } catch (error) {
      console.error("Image upload error:", error);
      toast({
        title: "Image upload failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // 6. Form submit
  const onSubmit = async (formData: NewPostFormValues) => {
    // If slug is taken, prevent submission
    if (slugIsTaken) {
      toast({
        title: "Slug in use",
        description: "Please use a different slug before saving",
        variant: "destructive",
      });
      return;
    }

    try {
      // Call the server action passed as prop from page.tsx
      const link = await handleSave({
        ...formData,
      });

      // If your `handleSave` (server action) returns a link, you can redirect
      if (typeof link === "string") {
        toast({
          title: "Post saved successfully!",
          description: "Redirecting to your new post...",
        });
        router.push(link);
      } else {
        // If there's no returned link, just show success
        toast({
          title: "Post saved successfully!",
          description: "Your post has been saved.",
        });
      }
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

  // 7. Handle dropping images
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer) {
      handleImagePasteOrDrop(e.dataTransfer, setContent);
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
            {/* Title */}
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

            {/* Slug (optional) */}
            <div className="space-y-2">
              <Label htmlFor="slug">Slug (optional)</Label>
              <Input
                id="slug"
                {...register("slug")}
                placeholder="my-custom-post"
              />
              {errors.slug && (
                <p className="text-sm text-red-500">{errors.slug.message}</p>
              )}

              {isCheckingSlug && <p className="text-sm">Checking slug...</p>}
              {slugIsTaken && (
                <p className="text-sm text-red-500">
                  This slug is already in use. Please choose a different one.
                </p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                onValueChange={(value: string) => {
                  // update form value
                  return setValue("categoryId", value);
                }}
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

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              {isMounted ? (
                <div className="relative">
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/10 dark:bg-white/10 z-50 flex items-center justify-center backdrop-blur-sm rounded-lg">
                      <div className="flex flex-col items-center space-y-2">
                        <Loader2 className="h-8 w-8 animate-spin" />
                        <p className="text-sm">Uploading image...</p>
                      </div>
                    </div>
                  )}
                  <div
                    className={`relative ${
                      isDraggingFile ? "ring-2 ring-primary ring-offset-2" : ""
                    }`}
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    {isDraggingFile && (
                      <div className="absolute inset-0 bg-black/5 dark:bg-white/5 z-40 flex items-center justify-center backdrop-blur-sm rounded-lg pointer-events-none">
                        <div className="flex items-center space-x-2">
                          <Upload className="h-6 w-6" />
                          <p className="text-sm">Drop images here</p>
                        </div>
                      </div>
                    )}
                    <MdEditor
                      modelValue={content}
                      onChange={(value) => {
                        setContent(value);
                        setValue("content", value);
                      }}
                      onUploadImg={handleToolbarImageUpload}
                      language="en-US"
                      theme={currentTheme === "dark" ? "dark" : "light"}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex justify-center items-center h-40">
                  <Loader2 className="mr-2 h-8 w-8 animate-spin text-gray-500" />
                </div>
              )}
              {errors.content && (
                <p className="text-sm text-red-500">{errors.content.message}</p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || isUploading || slugIsTaken}
            >
              {isSubmitting ? "Post is being created..." : "Save Post"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
