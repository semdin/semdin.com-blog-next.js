"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MdEditor } from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import { useTheme } from "next-themes";
import { Loader2, Upload, Check, ChevronsUpDown } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandInput,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

// ----------------------
// 1. Zod Schema (multi-category)
// ----------------------
const editPostSchema = z.object({
  originalSlug: z.string().min(1, "Original slug is required"),
  title: z.string().min(1, "Title is required"),
  categoryIds: z.array(z.string()).min(1, "Select at least one category"),
  content: z.string().min(1, "Content is required"),
});

type EditPostFormValues = z.infer<typeof editPostSchema>;

interface Category {
  id: string;
  name: string;
}

// Same Cloudinary helper as before
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

export default function EditPostEditor({
  post,
  categories,
  handleUpdate,
}: {
  post: {
    title: string;
    slug: string; // the old slug from DB
    content: string;
    categoryIds: string[]; // now an array
  };
  categories: Category[];
  handleUpdate: (data: EditPostFormValues) => Promise<void>;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [content, setContent] = useState(post.content);
  const [isUploading, setIsUploading] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const { toast } = useToast();

  // ----------------------
  // 2. React Hook Form
  // ----------------------
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EditPostFormValues>({
    resolver: zodResolver(editPostSchema),
    defaultValues: {
      // The old slug is your "originalSlug"
      originalSlug: post.slug,
      title: post.title,
      content: post.content,
      // multiple category IDs
      categoryIds: post.categoryIds ?? [],
    },
  });

  // 3. Watch the current selected category IDs
  const selectedCategoryIds = watch("categoryIds");

  // 4. We'll manage the popover state locally
  const [openCategories, setOpenCategories] = useState(false);

  // 5. Toggle category logic
  const toggleCategory = (categoryId: string) => {
    const current = watch("categoryIds");
    if (current.includes(categoryId)) {
      // remove it
      setValue(
        "categoryIds",
        current.filter((id) => id !== categoryId)
      );
    } else {
      // add it
      setValue("categoryIds", [...current, categoryId]);
    }
  };

  // 6. Drag event listeners
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

  // 7. Image handling
  const handleImagePasteOrDrop = async (
    dataTransfer: DataTransfer,
    setContentValue: (cb: (prev: string) => string) => void
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

        setContentValue((prev) => prev + "\n" + markdownImages);

        toast({
          title: "Image upload successful",
          description: `Uploaded ${files.length} image${
            files.length > 1 ? "s" : ""
          }.`,
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

  // 7B. Toolbar image upload
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
        description: `Uploaded ${files.length} image${
          files.length > 1 ? "s" : ""
        }.`,
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
  };

  // 8. onSubmit
  const onSubmit = async (formData: EditPostFormValues) => {
    try {
      await handleUpdate(formData);
      toast({
        title: "Post updated",
        description: "Your post has been successfully updated.",
      });
    } catch (error) {
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

  // 9. Handle dropping images
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer) {
      handleImagePasteOrDrop(e.dataTransfer, (cb) => {
        // update local state & form state
        setContent((prev) => {
          const nextVal = typeof cb === "function" ? cb(prev) : prev;
          setValue("content", nextVal);
          return nextVal;
        });
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Edit Post</CardTitle>
          <CardDescription>Update your blog post details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Post title"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            {/* Original Slug (hidden) */}
            <input type="hidden" {...register("originalSlug")} />

            {/* Multi-Category Combobox */}
            <div className="space-y-2">
              <Label htmlFor="categories">Categories (multi-select)</Label>
              <Popover open={openCategories} onOpenChange={setOpenCategories}>
                <PopoverTrigger asChild>
                  <Button
                    id="categories"
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-between",
                      !selectedCategoryIds?.length && "text-muted-foreground"
                    )}
                  >
                    {selectedCategoryIds?.length
                      ? categories
                          .filter((cat) => selectedCategoryIds.includes(cat.id))
                          .map((cat) => cat.name)
                          .join(", ")
                      : "Select categories"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[50vw] left-0 right-0 p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search categories..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No categories found</CommandEmpty>
                      <CommandGroup>
                        {categories.map((category) => {
                          const isSelected = selectedCategoryIds.includes(
                            category.id
                          );
                          return (
                            <CommandItem
                              key={category.id}
                              onSelect={() => toggleCategory(category.id)}
                            >
                              {category.name}
                              <Check
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  isSelected ? "opacity-100" : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {errors.categoryIds && (
                <p className="text-sm text-red-500">
                  {errors.categoryIds.message as string}
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
              disabled={isSubmitting || isUploading}
            >
              {isSubmitting ? "Updating post..." : "Update Post"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
