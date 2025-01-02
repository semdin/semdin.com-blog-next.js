import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Custom404() {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-screen ">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-lg mb-6">
        Sorry, the page you are looking for does not exist.
      </p>

      <Link href="/">
        <Button
          variant="default"
          className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700"
        >
          Go Back Home
        </Button>
      </Link>

      <div className="mt-10">
        <p className="text-sm text-gray-500">
          If you think this is a mistake, please contact support.
        </p>
      </div>
    </div>
  );
}
