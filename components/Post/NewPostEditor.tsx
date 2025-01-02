"use client";

import { useState } from "react";
import { MdEditor } from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import { useTheme } from "next-themes";

export default function NewPostEditor({
  categories,
  handleSave,
}: {
  categories: any[];
  handleSave: (data: {
    title: string;
    content: string;
    categoryId: string;
  }) => Promise<void>;
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  const onSave = async () => {
    setLoading(true);
    try {
      await handleSave({ title, content, categoryId });
      alert("Post saved successfully!");
    } catch (error) {
      console.error(error);
      alert("Error saving post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 dark:bg-slate-900 bg-white">
      <h1 className="text-3xl font-bold mb-4">Create New Post</h1>
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2" htmlFor="title">
          Title
        </label>
        <input
          id="title"
          type="text"
          className="w-full border rounded px-4 py-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter post title"
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 font-bold mb-2"
          htmlFor="category"
        >
          Category
        </label>
        <select
          id="category"
          className="w-full border rounded px-4 py-2"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2" htmlFor="content">
          Content
        </label>
        <MdEditor
          modelValue={content}
          onChange={setContent}
          language="en-US" // Set language to English
          theme={theme === "dark" ? "dark" : "light"}
        />
      </div>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={onSave}
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Post"}
      </button>
    </div>
  );
}
