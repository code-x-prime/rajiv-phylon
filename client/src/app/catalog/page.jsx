"use client";

import { useState, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ChevronRight, ArrowLeft } from "lucide-react";

const BookViewer = dynamic(() => import("@/components/BookViewer/BookViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center min-h-[500px] w-full">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-[#F5B400]/10 rounded-full blur-2xl animate-pulse" />
        <div className="relative w-16 h-16 border-4 border-t-[#F5B400] border-gray-800 rounded-full animate-spin" />
      </div>
      <h3 className="font-heading text-xl font-semibold text-white tracking-wide mb-2">
        Preparing Premium Catalogue
      </h3>
      <p className="text-white/40 text-sm font-body max-w-xs mb-6 text-center">
        Rendering high-resolution product pages.
      </p>
    </div>
  ),
});

const CATALOG_URL =
  "https://pub-58262d6d8d8f475fb5d97db5d155da43.r2.dev/2026%20CATALOGUE.pdf";

export default function CatalogPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(238);
  const viewerRef = useRef(null);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  return (
    <div className="bg-[#0A0A0A] min-h-screen text-white flex flex-col font-sans">
      {/* Hero section */}
      <section className="relative overflow-hidden border-b border-white/5 bg-gradient-to-b from-[#121212] to-[#0A0A0A] py-8 sm:py-16">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
          aria-hidden
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[#F5B400]/5 blur-[120px] pointer-events-none" aria-hidden />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1.5 text-xs text-white/40 mb-3 sm:mb-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white/70 transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white/70">Catalogue</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 sm:gap-6">
            <div>
              <div className="inline-flex items-center gap-2 mb-1.5 sm:mb-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#F5B400] animate-pulse" />
                <span className="text-[10px] font-heading font-bold text-[#F5B400] uppercase tracking-[0.25em]">
                  Interactive Showcase
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-heading font-bold text-white tracking-tight leading-tight">
                Product <span className="text-[#F5B400]">Catalogue</span> 2026
              </h1>
              <p className="text-xs sm:text-sm text-white/50 mt-2 max-w-xl">
                Explore our full line of premium compressed EVA phylon soles, TPU/TPR/Rubber hybrid outsoles, and custom polymer compounds in high-fidelity interactive mode.
              </p>
            </div>

            <a
              href={CATALOG_URL}
              download
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F5B400] text-black font-semibold text-xs uppercase tracking-wider px-5 py-3 hover:bg-[#e0a300] hover:shadow-[0_8px_32px_rgba(245,180,0,0.25)] transition-all duration-300 w-full sm:w-auto text-center"
            >
              Download PDF Version
            </a>
          </div>
        </div>
      </section>

      {/* Main interactive section */}
      <section
        ref={viewerRef}
        className="flex-1 flex flex-col justify-center items-center py-4 sm:py-8 px-2 sm:px-6 lg:px-8 bg-[#070707] transition-all max-w-full overflow-hidden"
      >
        <div className="w-full max-w-[1400px] flex flex-col gap-4 sm:gap-6 max-w-full">
          <BookViewer
            currentPage={currentPage}
            onPageChange={handlePageChange}
            pdfUrl={CATALOG_URL}
            onTotalPagesChange={setTotalPages}
          />
        </div>
      </section>

      {/* Footer navigation back */}
      <div className="py-6 sm:py-8 border-t border-white/5 flex justify-center bg-[#070707]">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-xs text-[#F5B400] hover:text-[#e0a300] font-semibold transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Browse Product Collections
        </Link>
      </div>
    </div>
  );
}