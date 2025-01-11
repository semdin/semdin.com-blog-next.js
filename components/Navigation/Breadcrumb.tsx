"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function DynamicBreadcrumb() {
  const pathname = usePathname();
  const paths = pathname.split("/").filter((path) => path);

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center">
        <li>
          <Link href="/" className="text-gray-500 hover:text-gray-700">
            Home
          </Link>
        </li>
        {paths.map((path, index) => {
          const href = `/${paths.slice(0, index + 1).join("/")}`;
          const isLast = index === paths.length - 1;
          const title = path.charAt(0).toUpperCase() + path.slice(1);

          return (
            <li key={path} className="flex items-center">
              <ChevronRight className="h-4 text-gray-400 mx-1" />
              {isLast ? (
                <span className="text-gray-900 font-medium dark:text-white">
                  {title}
                </span>
              ) : (
                <Link href={href} className="text-gray-500 hover:text-gray-700">
                  {title}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
