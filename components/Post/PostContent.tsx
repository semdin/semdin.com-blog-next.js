"use client";

import { useEffect, useState } from "react";
import { MdPreview, MdCatalog } from "md-editor-rt";
import "md-editor-rt/lib/preview.css";
import { useTheme } from "next-themes";
import { Loader2 } from "lucide-react";

export default function PostContent({ content }: { content: string }) {
  const [scrollElement, setScrollElement] = useState<HTMLElement | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;

  useEffect(() => {
    setScrollElement(document.documentElement);
    setIsMounted(true);
  }, []);

  const id = "preview_only";

  // Preprocess the content to ensure unique heading keys
  const processedContent = preprocessMarkdown(content);

  return (
    <div className="flex gap-4">
      <div className="flex-1">
        {isMounted ? (
          <MdPreview
            id={id}
            modelValue={processedContent}
            language="en-US"
            theme={currentTheme === "dark" ? "dark" : "light"}
            className={`md-editor ${
              currentTheme === "dark" ? "md-editor-dark" : ""
            } md-editor-previewOnly`}
          />
        ) : (
          <div className="flex justify-center items-center h-40 w-full">
            <Loader2 className="mr-2 h-8 w-8 animate-spin text-gray-500" />
          </div>
        )}
      </div>
      <div className="w-64">
        <div className="sticky top-20 max-h-screen overflow-y-auto">
          {scrollElement && (
            <MdCatalog
              editorId={id}
              scrollElement={scrollElement}
              scrollElementOffsetTop={80}
              offsetTop={100}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function preprocessMarkdown(content: string): string {
  const lines = content.split("\n");
  const headingCounts = new Map<string, number>();

  return lines
    .map((line) => {
      const match = line.match(/^(#{1,6})\s+(.*)/);
      if (match) {
        const [_, hashes, heading] = match;
        const normalizedHeading = heading.trim().toLowerCase();

        if (headingCounts.has(normalizedHeading)) {
          const count = headingCounts.get(normalizedHeading)! + 1;
          headingCounts.set(normalizedHeading, count);
          return `${hashes} ${heading} (${count})`; // Append a unique count
        } else {
          headingCounts.set(normalizedHeading, 1);
        }
      }
      return line;
    })
    .join("\n");
}
