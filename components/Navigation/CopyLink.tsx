"use client";

import { Link as LinkIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type CopyLinkProps = {
  url: string;
};

export function CopyLink({ url }: CopyLinkProps) {
  const { toast } = useToast();
  const copyLink = () => {
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied!",
    });
  };
  return (
    <div>
      <LinkIcon
        className="cursor-pointer text-blue-600 hover:text-blue-200"
        onClick={copyLink}
      />
    </div>
  );
}
