"use client";

import React, { useRef, useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
// Import the text/annotation layer CSS
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// Configure the PDF worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function ResponsivePDF() {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);

  // We'll calculate a width to make the PDF responsive.
  const [pdfWidth, setPdfWidth] = useState<number>(600);

  // We'll measure a containerRef's width to pass as "width" to <Page>.
  const containerRef = useRef<HTMLDivElement>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1); // Start at page 1 when loaded
  }

  // Dynamically measure container width
  useEffect(() => {
    function updateWidth() {
      if (containerRef.current) {
        setPdfWidth(containerRef.current.offsetWidth);
      }
    }
    updateWidth(); // measure once on mount
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  function goToPreviousPage() {
    setPageNumber((prev) => (prev > 1 ? prev - 1 : 1));
  }

  function goToNextPage() {
    setPageNumber((prev) => (prev < numPages ? prev + 1 : numPages));
  }

  return (
    <div className="relative min-h-screen">
      {/* Main content container */}
      <div className="container mx-auto pt-4 pb-24" ref={containerRef}>
        {/* Some top heading or text if you want */}
        <h1 className="text-2xl font-bold mb-4">My Resume</h1>

        {/* The PDF itself */}
        <Document
          file="/Mehmet_s_Resume.pdf"
          onLoadSuccess={onDocumentLoadSuccess}
          className="flex justify-center"
        >
          <Page pageNumber={pageNumber} width={pdfWidth} />
        </Document>
      </div>

      {/* Fixed pagination bar at the bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center gap-4 border-t bg-white py-3">
        <p className="text-sm text-gray-700">
          Page <span className="font-semibold">{pageNumber}</span> of{" "}
          <span className="font-semibold">{numPages}</span>
        </p>
        <div className="flex gap-2">
          <button
            className="rounded-md bg-gray-200 px-3 py-1 text-sm font-medium text-gray-700 transition hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={goToPreviousPage}
            disabled={pageNumber <= 1}
          >
            Previous
          </button>
          <button
            className="rounded-md bg-gray-200 px-3 py-1 text-sm font-medium text-gray-700 transition hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
