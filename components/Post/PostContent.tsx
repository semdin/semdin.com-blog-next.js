"use client";

import { useEffect, useState } from "react";
import { MdPreview, MdCatalog } from "md-editor-rt";
import "md-editor-rt/lib/preview.css";

export default function PostContent({ content }: { content: string }) {
  const [scrollElement, setScrollElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Ensure `document` is only accessed on the client side
    setScrollElement(document.documentElement);
  }, []);

  const id = "preview_only";

  // Preprocess the content to ensure unique heading keys
  const processedContent = preprocessMarkdown(content);

  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <MdPreview id={id} modelValue={processedContent} language="en-US" />
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
