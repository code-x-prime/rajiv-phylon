"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { usePdf } from "@/hooks/usePdf";
import Book from "@/components/BookViewer/Book";
import { Toolbar } from "@/components/BookViewer/Toolbar";
import { Loader } from "@/components/BookViewer/Loader";

const CATALOG_URL =
  "https://pub-58262d6d8d8f475fb5d97db5d155da43.r2.dev/2026%20CATALOGUE.pdf";

export default function CatalogPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomScale, setZoomScale] = useState(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const viewerRef = useRef(null);

  const { pdf, numPages, loading, error } = usePdf(CATALOG_URL);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentPage((prev) => Math.min(prev + 1, numPages));
  }, [numPages]);

  const toggleFullscreen = useCallback(() => {
    if (!viewerRef.current) return;

    if (!document.fullscreenElement) {
      viewerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.error("Fullscreen error:", err);
      });
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  return (
    <div className="bg-[#0A0A0A] min-h-screen text-white flex flex-col font-sans">
      {/* Hero section */}
      <section className="relative overflow-hidden border-b border-white/5 bg-gradient-to-b from-[#121212] to-[#0A0A0A] py-16">
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
          <nav className="flex items-center gap-1.5 text-xs text-white/40 mb-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white/70 transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white/70">Catalogue</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 mb-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#F5B400] animate-pulse" />
                <span className="text-[10px] font-heading font-bold text-[#F5B400] uppercase tracking-[0.25em]">
                  Interactive Showcase
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-heading font-bold text-white tracking-tight leading-tight">
                Product <span className="text-[#F5B400]">Catalogue</span> 2026
              </h1>
              <p className="text-sm text-white/50 mt-2 max-w-xl">
                Explore our full line of premium compressed EVA phylon soles, TPU/TPR/Rubber hybrid outsoles, and custom polymer compounds in high-fidelity 3D book-flip mode.
              </p>
            </div>
            
            <a
              href={CATALOG_URL}
              download
              className="inline-flex items-center gap-2 rounded-xl bg-[#F5B400] text-black font-semibold text-xs uppercase tracking-wider px-5 py-3 hover:bg-[#e0a300] hover:shadow-[0_8px_32px_rgba(245,180,0,0.25)] transition-all duration-300 self-start md:self-auto"
            >
              Download PDF Version
            </a>
          </div>
        </div>
      </section>

      {/* Main interactive section */}
      <section 
        ref={viewerRef}
        className={`flex-1 flex flex-col justify-center items-center py-8 px-4 sm:px-6 lg:px-8 bg-[#070707] transition-all ${
          isFullscreen ? "fixed inset-0 z-50 p-6 bg-black" : ""
        }`}
      >
        <div className="w-full max-w-[1400px] flex flex-col gap-6">
          {loading ? (
            <Loader progress={currentPage} total={numPages} />
          ) : error ? (
            <div className="p-8 text-center bg-red-950/20 border border-red-500/30 rounded-2xl">
              <p className="text-red-400 font-semibold mb-2">Failed to load the catalogue</p>
              <p className="text-xs text-white/60 mb-4">{error.message || "Unknown error"}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition text-xs font-semibold"
              >
                Retry Loading
              </button>
            </div>
          ) : (
            <>
              {/* Premium Book Canvas */}
              <div className="flex-1 flex items-center justify-center min-h-[500px] overflow-hidden rounded-3xl border border-white/5 bg-[#0E0E0E] shadow-2xl relative">
                {/* Visual accent background */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,180,0,0.02)_0%,transparent_70%)] pointer-events-none" />
                
                <Book
                  pdf={pdf}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                  zoomScale={zoomScale}
                />
              </div>

              {/* Glassmorphic Control Toolbar */}
              <Toolbar
                currentPage={currentPage}
                totalPages={numPages}
                zoomScale={zoomScale}
                setZoomScale={setZoomScale}
                isFullscreen={isFullscreen}
                toggleFullscreen={toggleFullscreen}
                pdfUrl={CATALOG_URL}
                onPrev={handlePrev}
                onNext={handleNext}
              />
            </>
          )}
        </div>
      </section>

      {/* Footer navigation back */}
      <div className="py-8 border-t border-white/5 flex justify-center bg-[#070707]">
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
