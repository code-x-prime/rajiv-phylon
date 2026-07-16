"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Download,
  Maximize2,
  Minimize2,
  ExternalLink,
  FileText,
  ArrowLeft,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Loader2,
  Eye,
  Printer,
} from "lucide-react";

const CATALOG_URL =
  "https://pub-58262d6d8d8f475fb5d97db5d155da43.r2.dev/2026%20CATALOGUE.pdf";
const CATALOG_NAME = "Rajiv Phylon - Product Catalogue 2026";

const ZOOM_LEVELS = [50, 75, 100, 125, 150, 200];

/* ═══════════════════════════════════════════════════════════
   LOADING SKELETON
═══════════════════════════════════════════════════════════ */
function CatalogSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Toolbar skeleton */}
      <div className="flex items-center justify-between gap-4 mb-4 bg-white rounded-xl border border-gray-200 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 bg-gray-200 rounded" />
          <div>
            <div className="h-4 w-48 bg-gray-200 rounded mb-1" />
            <div className="h-3 w-20 bg-gray-100 rounded" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 bg-gray-50 rounded-lg px-2 py-1 border border-gray-100">
            <div className="w-7 h-7 bg-gray-200 rounded" />
            <div className="w-10 h-4 bg-gray-200 rounded mx-1" />
            <div className="w-7 h-7 bg-gray-200 rounded" />
          </div>
          <div className="w-8 h-8 bg-gray-200 rounded-lg" />
          <div className="w-8 h-8 bg-gray-200 rounded-lg" />
        </div>
      </div>

      {/* PDF viewer skeleton */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg">
        <div className="w-full bg-gray-100" style={{ height: "calc(100vh - 280px)", minHeight: "500px" }}>
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <Loader2 className="h-10 w-10 text-[#F5B400] animate-spin" />
            <div className="text-center">
              <p className="text-[14px] font-display font-medium text-gray-600 mb-1">
                Loading Catalogue...
              </p>
              <p className="text-[12px] text-gray-400 font-body">
                Please wait while the PDF loads
              </p>
            </div>
            {/* Page skeleton previews */}
            <div className="flex gap-3 mt-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-20 h-28 bg-gray-200 rounded-lg border border-gray-200" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN CATALOG PAGE
═══════════════════════════════════════════════════════════ */
export default function CatalogPage() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomIndex, setZoomIndex] = useState(2); // 100%
  const [isLoading, setIsLoading] = useState(true);
  const [viewerKey, setViewerKey] = useState(0);

  const currentZoom = ZOOM_LEVELS[zoomIndex];

  // Google Docs Viewer for proper PDF rendering with zoom
  const viewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(CATALOG_URL)}&embedded=true&ui=true`;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleZoomIn = useCallback(() => {
    setZoomIndex((i) => Math.min(i + 1, ZOOM_LEVELS.length - 1));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomIndex((i) => Math.max(i - 1, 0));
  }, []);

  const handleResetZoom = useCallback(() => {
    setZoomIndex(2); // 100%
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const handleReload = useCallback(() => {
    setIsLoading(true);
    setViewerKey((k) => k + 1);
    setTimeout(() => setIsLoading(false), 2500);
  }, []);

  return (
    <div className="bg-white min-h-screen">
      {/* ── HERO SECTION ─────────────────────────────────────── */}
      <section className="relative bg-[#0A0A0A] overflow-hidden">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }}
          aria-hidden
        />
        {/* Glow orbs */}
        <div
          className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#F5B400]/10 blur-[90px] pointer-events-none"
          aria-hidden
        />
        <div
          className="absolute -bottom-20 -left-10 w-64 h-64 rounded-full bg-[#F5B400]/8 blur-[80px] pointer-events-none"
          aria-hidden
        />

        <div className="relative z-10 max-w-site mx-auto px-4 sm:px-6 lg:px-10 pt-28 pb-8 sm:pt-32 sm:pb-10 lg:pt-40 lg:pb-14">
          {/* Breadcrumb */}
          <nav
            className="flex items-center gap-1.5 text-[11px] sm:text-[12px] font-body text-white/40 mb-4 sm:mb-5"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-white/70 transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span className="text-white/70">Catalogue</span>
          </nav>

          <div className="inline-flex items-center gap-2 mb-3 sm:mb-4">
            <div className="h-px w-6 sm:w-8 bg-[#F5B400]" />
            <span className="text-[10px] sm:text-[11px] font-heading font-bold text-[#F5B400] uppercase tracking-[0.28em]">
              Product Catalogue
            </span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight mb-3 sm:mb-4">
            2026 <span className="text-[#F5B400]">Catalogue</span>
          </h1>
          <p className="text-[13px] sm:text-[15px] text-white/50 font-body leading-relaxed max-w-xl mb-6 sm:mb-8">
            Browse our complete product range. Premium polymer footwear soles
            for global OEM and B2B partners.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <a
              href={CATALOG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-[#F5B400] text-black font-display font-medium text-[11px] sm:text-[13px] uppercase tracking-[0.1em] px-4 sm:px-6 py-2.5 sm:py-3 hover:bg-[#e0a300] hover:shadow-[0_8px_32px_rgba(245,180,0,0.35)] hover:-translate-y-0.5 transition-all duration-300"
            >
              <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Download PDF
            </a>
            <a
              href={CATALOG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 text-white font-display font-medium text-[11px] sm:text-[13px] uppercase tracking-[0.1em] px-4 sm:px-6 py-2.5 sm:py-3 hover:border-white/50 hover:bg-white/[0.06] transition-all duration-300 backdrop-blur-sm"
            >
              <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Open in New Tab
            </a>
          </div>
        </div>
      </section>

      {/* ── PDF VIEWER SECTION ──────────────────────────────── */}
      <section className="py-4 sm:py-6 md:py-10 bg-gray-50">
        <div className="max-w-site mx-auto px-3 sm:px-4 lg:px-10">
          {isLoading ? (
            <CatalogSkeleton />
          ) : (
            <>
              {/* Toolbar */}
              <div className="flex items-center justify-between gap-2 sm:gap-4 mb-3 sm:mb-4 bg-white rounded-xl border border-gray-200 px-3 sm:px-4 py-2.5 sm:py-3 shadow-sm">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#F5B400]/10 flex items-center justify-center shrink-0">
                    <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-[#F5B400]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] sm:text-[14px] font-display font-medium text-[#111111] truncate">
                      {CATALOG_NAME}
                    </p>
                    <p className="text-[10px] sm:text-[11px] text-gray-400 font-body">
                      238 Pages
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                  {/* Zoom Controls */}
                  <div className="hidden sm:flex items-center gap-0.5 bg-gray-50 rounded-lg px-1.5 py-1 border border-gray-100">
                    <button
                      onClick={handleZoomOut}
                      disabled={zoomIndex === 0}
                      className="p-1.5 rounded-md hover:bg-white hover:shadow-sm transition-all text-gray-500 hover:text-[#111111] disabled:opacity-30 disabled:cursor-not-allowed"
                      aria-label="Zoom out"
                    >
                      <ZoomOut className="h-4 w-4" />
                    </button>
                    <span className="text-[11px] sm:text-[12px] font-display font-medium text-gray-600 min-w-[44px] text-center tabular-nums">
                      {currentZoom}%
                    </span>
                    <button
                      onClick={handleZoomIn}
                      disabled={zoomIndex === ZOOM_LEVELS.length - 1}
                      className="p-1.5 rounded-md hover:bg-white hover:shadow-sm transition-all text-gray-500 hover:text-[#111111] disabled:opacity-30 disabled:cursor-not-allowed"
                      aria-label="Zoom in"
                    >
                      <ZoomIn className="h-4 w-4" />
                    </button>
                    <button
                      onClick={handleResetZoom}
                      className="p-1.5 rounded-md hover:bg-white hover:shadow-sm transition-all text-gray-500 hover:text-[#111111]"
                      aria-label="Reset zoom"
                    >
                      <RotateCw className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Mobile Zoom */}
                  <div className="flex sm:hidden items-center gap-0.5 bg-gray-50 rounded-lg px-1 py-0.5 border border-gray-100">
                    <button
                      onClick={handleZoomOut}
                      disabled={zoomIndex === 0}
                      className="p-1.5 rounded hover:bg-white transition-all text-gray-500 disabled:opacity-30"
                      aria-label="Zoom out"
                    >
                      <ZoomOut className="h-4 w-4" />
                    </button>
                    <span className="text-[11px] font-medium text-gray-600 min-w-[36px] text-center tabular-nums">
                      {currentZoom}%
                    </span>
                    <button
                      onClick={handleZoomIn}
                      disabled={zoomIndex === ZOOM_LEVELS.length - 1}
                      className="p-1.5 rounded hover:bg-white transition-all text-gray-500 disabled:opacity-30"
                      aria-label="Zoom in"
                    >
                      <ZoomIn className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="h-5 sm:h-6 w-px bg-gray-200" />

                  {/* Reload */}
                  <button
                    onClick={handleReload}
                    className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition-all text-gray-500 hover:text-[#111111]"
                    aria-label="Reload PDF"
                    title="Reload"
                  >
                    <RotateCw className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </button>

                  {/* View in New Tab */}
                  <a
                    href={CATALOG_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition-all text-gray-500 hover:text-[#111111]"
                    aria-label="View in new tab"
                    title="View in new tab"
                  >
                    <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </a>

                  {/* Fullscreen */}
                  <button
                    onClick={toggleFullscreen}
                    className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition-all text-gray-500 hover:text-[#111111]"
                    aria-label="Toggle fullscreen"
                    title="Fullscreen"
                  >
                    {isFullscreen ? (
                      <Minimize2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    ) : (
                      <Maximize2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    )}
                  </button>

                  {/* Download */}
                  <a
                    href={CATALOG_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:inline-flex p-2 rounded-lg hover:bg-gray-100 transition-all text-gray-500 hover:text-[#111111]"
                    aria-label="Download PDF"
                    title="Download"
                  >
                    <Download className="h-4 w-4" />
                  </a>
                </div>
              </div>

              {/* PDF Viewer */}
              <div
                className={`bg-white rounded-xl sm:rounded-2xl border border-gray-200 overflow-hidden shadow-lg transition-all duration-300 ${
                  isFullscreen ? "fixed inset-0 z-50 rounded-none border-0" : ""
                }`}
              >
                <div
                  className="w-full overflow-auto bg-[#525659]"
                  style={{
                    height: isFullscreen ? "100vh" : "calc(100vh - 260px)",
                    minHeight: "400px",
                  }}
                >
                  <iframe
                    key={viewerKey}
                    src={viewerUrl}
                    title={CATALOG_NAME}
                    className="w-full h-full border-0"
                    style={{
                      transform: `scale(${currentZoom / 100})`,
                      transformOrigin: "top left",
                      width: `${10000 / currentZoom}%`,
                      height: `${10000 / currentZoom}%`,
                    }}
                    onLoad={() => setIsLoading(false)}
                  />
                </div>
              </div>

              {/* Bottom Info Bar */}
              <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3">
                <p className="text-[11px] sm:text-[12px] text-gray-400 font-body text-center sm:text-left">
                  Use zoom controls or pinch-to-zoom on mobile to adjust view
                </p>
                <div className="flex items-center gap-3 sm:gap-4">
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-1.5 text-[11px] sm:text-[12px] text-[#F5B400] hover:underline underline-offset-2 font-medium"
                  >
                    <ArrowLeft className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    Browse All Products
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1.5 text-[11px] sm:text-[12px] text-[#F5B400] hover:underline underline-offset-2 font-medium"
                  >
                    Request a Quote
                    <ExternalLink className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
