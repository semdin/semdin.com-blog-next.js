import React from "react";
import Link from "next/link";
import { FaGithub, FaYoutube, FaXTwitter } from "react-icons/fa6";

export const Footer = () => {
  return (
    <footer>
      <div className="flex flex-col items-center justify-center py-8 text-center md:py-12 lg:py-16">
        <div className="flex items-center space-x-2">
          <img
            src="/placeholder.svg"
            width="40"
            height="40"
            alt="Logo"
            className="rounded-full overflow-hidden object-cover"
            style={{ aspectRatio: "40/40", objectFit: "cover" }}
          />
          <p className="font-semibold text-lg tracking-tighter sm:text-base md:text-lg">
            Semdin.com
          </p>
        </div>
        <nav className="flex items-center justify-center gap-4 mt-4 text-sm md:mt-6 md:gap-6">
          <Link
            href="#"
            className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            prefetch={false}
          >
            Home
          </Link>
          <Link
            href="#"
            className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            prefetch={false}
          >
            Features
          </Link>
          <Link
            href="#"
            className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            prefetch={false}
          >
            Pricing
          </Link>
          <Link
            href="#"
            className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            prefetch={false}
          >
            Contact
          </Link>
        </nav>
        <div className="flex items-center justify-center gap-4 mt-4 md:mt-8">
          <Link
            href="#"
            className="rounded-full border border-gray-200 bg-white w-8 h-8 flex items-center justify-center overflow-hidden shadow-sm hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:focus-visible:ring-gray-300"
            prefetch={false}
          >
            <span className="sr-only">Twitter</span>
            <FaXTwitter className="w-4 h-4 fill-current" />
          </Link>
          <Link
            href="#"
            className="rounded-full border border-gray-200 bg-white w-8 h-8 flex items-center justify-center overflow-hidden shadow-sm hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:focus-visible:ring-gray-300"
            prefetch={false}
          >
            <span className="sr-only">GitHub</span>
            <FaGithub className="w-4 h-4 fill-current" />
          </Link>
          <Link
            href="https://github.com/semdin"
            className="rounded-full border border-gray-200 bg-white w-8 h-8 flex items-center justify-center overflow-hidden shadow-sm hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:focus-visible:ring-gray-300"
            prefetch={false}
          >
            <span className="sr-only">YouTube</span>
            <FaYoutube className="w-4 h-4 fill-current" />
          </Link>
        </div>
      </div>
    </footer>
  );
};
