"use client";

import React, { useState, useEffect } from "react";
import { MdPreview } from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import { Button } from "@/components/ui/button";

interface PostPreviewProps {
  content: string;
}

export function PostPreview({ content }: PostPreviewProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="w-full max-w-3xl mt-4">
      <Button onClick={() => setShowPreview(!showPreview)} className="mb-4">
        {showPreview ? "Hide Preview" : "Show Preview"}
      </Button>

      {showPreview ? (
        <div className="border rounded-lg p-4 bg-white">
          <MdPreview modelValue={content} />
        </div>
      ) : (
        <div className="mt-4" dangerouslySetInnerHTML={{ __html: content }} />
      )}
    </div>
  );
}
