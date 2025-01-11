"use client";

import { MdPreview } from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import { useTheme } from "next-themes";

interface MarkdownPreviewProps {
  content: string;
}

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  return (
    <MdPreview
      modelValue={content}
      language="en-US"
      theme={currentTheme === "dark" ? "dark" : "light"}
      className={`md-editor ${
        currentTheme === "dark" ? "md-editor-dark" : ""
      } md-editor-previewOnly`}
    />
  );
}
