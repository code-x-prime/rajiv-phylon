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
  BookOpen,
  Smartphone,
} from "lucide-react";

const CATALOG_URL =
  "https://pub-58262d6d8d8f475fb5d97db5d155da43.r2.dev/2026%20CATALOGUE.pdf";
const CATALOG_NAME = "Rajiv Phylon Product Catalogue 2026";

export default function CatalogPage() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1800);
    return () => clearTimeout(timer);
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

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative bg-[#0A0A0A] overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
          aria-hidden
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-[#F5B400]/8 blur-[120px] pointer-events-none" aria-hidden />

        <div className="relative z-10 max-w-site mx-auto px-4 sm:px-6 lg:px-10 pt-24 pb-6 sm:pt-28 sm:pb-8 lg:pt-36 lg:pb-12">
          <nav className="flex items-center gap-1.5 text-[11px] sm:text-[12px] font-body text-white/40 mb-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white/70 transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white/70">Catalogue</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 mb-3">
                <BookOpen className="h-4 w-4 text-[#F5B400]" />
                <span className="text-[10px] sm:text-[11px] font-heading font-bold text-[#F5B400] uppercase tracking-[0.25em]">
                  Product Catalogue
                </span>
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight mb-2">
                2026 <span className="text-[#F5B400]">Catalogue</span>
              </h1>
              <p className="text-[13px] sm:text-[14px] text-white/40 font-body">
                238 Pages &middot; Premium Polymer Footwear Soles
              </p>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <a
                href={CATALOG_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#F5B400] text-black font-display font-medium text-[11px] sm:text-[12px] uppercase tracking-[0.1em] px-4 sm:px-5 py-2.5 sm:py-3 hover:bg-[#e0a300] hover:shadow-[0_8px_32px_rgba(245,180,0,0.35)] hover:-translate-y-0.5 transition-all duration-300"
              >
                <Download className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Download</span> PDF
              </a>
              <a
                href={CATALOG_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 text-white font-display font-medium text-[11px] sm:text-[12px] uppercase tracking-[0.1em] px-4 sm:px-5 py-2.5 sm:py-3 hover:border-white/40 hover:bg-white/[0.06] transition-all duration-300"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Open</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── PDF VIEWER ───────────────────────────────────── */}
      <section className="py-4 sm:py-6 lg:py-8">
        <div className="max-w-site mx-auto px-3 sm:px-4 lg:px-10">

          {/* Toolbar */}
          <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4 bg-white rounded-xl border border-gray-200/80 px-3 py-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F5B400]/20 to-[#F5B400]/5 flex items-center justify-center shrink-0">
                <FileText className="h-4 w-4 text-[#F5B400]" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] sm:text-[13px] font-display font-medium text-[#111111] truncate">Catalogue 2026</p>
                <p className="text-[9px] sm:text-[10px] text-gray-400 font-body">PDF &middot; 238 pages</p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-lg hover:bg-gray-100 transition-all text-gray-500 hover:text-[#111111]"
                aria-label="Fullscreen"
                title="Fullscreen"
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>
              <a
                href={CATALOG_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-gray-100 transition-all text-gray-500 hover:text-[#111111]"
                aria-label="Download"
                title="Download PDF"
              >
                <Download className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* PDF Book Container */}
          <div
            className={`relative bg-white rounded-2xl sm:rounded-3xl border border-gray-200/60 overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.08)] transition-all duration-300 ${
              isFullscreen ? "fixed inset-0 z-50 rounded-none border-0" : ""
            }`}
          >
            {/* Book spine effect */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-gray-300 via-gray-200 to-gray-300 z-10 hidden sm:block" />

            {/* Loading */}
            {isLoading && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#F5B400]/20 rounded-full blur-xl animate-pulse" />
                  <Loader2 className="h-12 w-12 text-[#F5B400] animate-spin relative" />
                </div>
                <p className="text-[13px] font-display font-medium text-gray-700 mt-5 mb-1">Opening Catalogue...</p>
                <p className="text-[11px] text-gray-400 font-body">Loading 238 pages</p>
              </div>
            )}

            {/* PDF iframe - full width, clean */}
            <div
              className="w-full bg-[#525659]"
              style={{
                height: isFullscreen
                  ? "100vh"
                  : isMobile
                  ? "calc(100vh - 200px)"
                  : "calc(100vh - 240px)",
                minHeight: isMobile ? "400px" : "500px",
              }}
            >
              <iframe
                src={CATALOG_URL}
                title={CATALOG_NAME}
                className="w-full h-full border-0"
                onLoad={() => setIsLoading(false)}
              />
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-4 sm:mt-6 flex flex-col items-center gap-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-[12px] sm:text-[13px] text-[#F5B400] hover:text-[#e0a300] font-display font-medium transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Browse All Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
