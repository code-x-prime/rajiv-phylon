"use client";

import { useState, useRef } from "react";
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
} from "lucide-react";

const CATALOG_URL =
  "https://pub-58262d6d8d8f475fb5d97db5d155da43.r2.dev/2026%20CATALOGUE.pdf";
const CATALOG_NAME = "Rajiv Phylon - Product Catalogue 2026";

export default function CatalogPage() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(100);
  const containerRef = useRef(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleZoomIn = () => setZoom((z) => Math.min(z + 20, 200));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 20, 50));
  const handleResetZoom = () => setZoom(100);

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
        {/* Glow */}
        <div
          className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#F5B400]/10 blur-[90px] pointer-events-none"
          aria-hidden
        />
        <div
          className="absolute -bottom-20 -left-10 w-64 h-64 rounded-full bg-[#F5B400]/8 blur-[80px] pointer-events-none"
          aria-hidden
        />

        <div className="relative z-10 max-w-site mx-auto px-6 lg:px-10 pt-32 pb-10 lg:pt-40 lg:pb-14">
          {/* Breadcrumb */}
          <nav
            className="flex items-center gap-1.5 text-[12px] font-body text-white/40 mb-5"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-white/70 transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-white/70">Catalogue</span>
          </nav>

          <div className="inline-flex items-center gap-2 mb-4">
            <div className="h-px w-8 bg-[#F5B400]" />
            <span className="text-[11px] font-heading font-bold text-[#F5B400] uppercase tracking-[0.28em]">
              Product Catalogue
            </span>
          </div>

          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight mb-4">
            2026 <span className="text-[#F5B400]">Catalogue</span>
          </h1>
          <p className="text-[15px] text-white/50 font-body leading-relaxed max-w-xl mb-8">
            Browse our complete product range. Premium polymer footwear soles
            for global OEM and B2B partners.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={CATALOG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-[#F5B400] text-black font-display font-medium text-[13px] uppercase tracking-[0.1em] px-6 py-3 hover:bg-[#e0a300] hover:shadow-[0_8px_32px_rgba(245,180,0,0.35)] hover:-translate-y-0.5 transition-all duration-300"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </a>
            <a
              href={CATALOG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 text-white font-display font-medium text-[13px] uppercase tracking-[0.1em] px-6 py-3 hover:border-white/50 hover:bg-white/[0.06] transition-all duration-300 backdrop-blur-sm"
            >
              <ExternalLink className="h-4 w-4" />
              Open in New Tab
            </a>
          </div>
        </div>
      </section>

      {/* ── PDF VIEWER SECTION ──────────────────────────────── */}
      <section className="py-6 md:py-10 bg-gray-50">
        <div className="max-w-site mx-auto px-4 lg:px-10">
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-4 mb-4 bg-white rounded-xl border border-gray-200 px-4 py-3 shadow-sm">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-[#F5B400]" />
              <div>
                <p className="text-[14px] font-display font-medium text-[#111111]">
                  {CATALOG_NAME}
                </p>
                <p className="text-[11px] text-gray-400 font-body">
                  PDF Document
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Zoom Controls */}
              <div className="hidden sm:flex items-center gap-1 bg-gray-50 rounded-lg px-2 py-1 border border-gray-100">
                <button
                  onClick={handleZoomOut}
                  className="p-1.5 rounded-md hover:bg-white hover:shadow-sm transition-all text-gray-500 hover:text-[#111111]"
                  aria-label="Zoom out"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <span className="text-[12px] font-display font-medium text-gray-600 min-w-[40px] text-center tabular-nums">
                  {zoom}%
                </span>
                <button
                  onClick={handleZoomIn}
                  className="p-1.5 rounded-md hover:bg-white hover:shadow-sm transition-all text-gray-500 hover:text-[#111111]"
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

              <div className="h-6 w-px bg-gray-200 hidden sm:block" />

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-lg hover:bg-gray-100 transition-all text-gray-500 hover:text-[#111111]"
                aria-label="Toggle fullscreen"
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </button>

              {/* Download */}
              <a
                href={CATALOG_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-gray-100 transition-all text-gray-500 hover:text-[#111111]"
                aria-label="Download PDF"
              >
                <Download className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* PDF iframe */}
          <div
            ref={containerRef}
            className={`bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg ${
              isFullscreen
                ? "fixed inset-0 z-50 rounded-none border-0"
                : "relative"
            }`}
          >
            <div
              className="w-full overflow-auto bg-gray-100"
              style={{
                height: isFullscreen ? "100vh" : "calc(100vh - 280px)",
                minHeight: "500px",
              }}
            >
              <iframe
                src={`${CATALOG_URL}#toolbar=0&navpanes=0&scrollbar=1`}
                title={CATALOG_NAME}
                className="w-full border-0"
                style={{
                  height: `${zoom}%`,
                  minHeight: isFullscreen ? "100vh" : "500px",
                  transformOrigin: "top left",
                }}
              />
            </div>
          </div>

          {/* Bottom Info */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-gray-400 font-body">
            <p>
              View the complete product catalogue with specifications and pricing.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 text-[#F5B400] hover:underline underline-offset-2 font-medium"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Browse All Products
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 text-[#F5B400] hover:underline underline-offset-2 font-medium"
              >
                Request a Quote
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
