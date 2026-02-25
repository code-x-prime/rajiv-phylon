"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Check, ZoomIn, X, ChevronLeft, ChevronRight, Award } from "lucide-react";

const PLACEHOLDER_IMAGE = "/placeholder.png";

export function ProductDetailGallery({ images = [], productName }) {
  const [selected, setSelected]   = useState(0);
  const [copied, setCopied]       = useState(false);
  const [lightbox, setLightbox]   = useState(false);

  const list    = Array.isArray(images) ? images : [];
  const mainImg = list[selected];

  /* Share */
  const handleShare = useCallback(async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator?.share) {
      try { await navigator.share({ title: productName, url }); return; } catch { /* fallthrough */ }
    }
    if (navigator?.clipboard) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  }, [productName]);

  /* Lightbox keyboard nav */
  useEffect(() => {
    if (!lightbox) return;
    const handler = (e) => {
      if (e.key === "Escape")      setLightbox(false);
      if (e.key === "ArrowLeft")   setSelected((s) => Math.max(0, s - 1));
      if (e.key === "ArrowRight")  setSelected((s) => Math.min(list.length - 1, s + 1));
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, list.length]);

  /* No images — show placeholder */
  if (list.length === 0) {
    return (
      <div className="relative rounded-2xl overflow-hidden bg-gray-50 border border-gray-200" style={{ aspectRatio: "1/1" }}>
        <Image
          src={PLACEHOLDER_IMAGE}
          alt={productName || "Product"}
          fill
          sizes="(max-width: 768px) 100vw, 55vw"
          className="object-contain"
        />
      </div>
    );
  }

  return (
    <>
      {/* ── Gallery layout ───────────────────────── */}
      <div className="flex flex-col-reverse md:flex-row gap-3 lg:gap-4">

        {/* Vertical thumbnails (left on desktop, bottom on mobile) */}
        {list.length > 1 && (
          <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:overflow-x-hidden pb-1 md:pb-0 md:max-h-[540px] scrollbar-hide shrink-0">
            {list.map((img, i) => (
              <button
                key={img.id ?? i}
                type="button"
                onClick={() => setSelected(i)}
                aria-label={`View image ${i + 1}`}
                className={`relative shrink-0 w-16 h-16 md:w-[78px] md:h-[78px] rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                  selected === i
                    ? "border-[#F5B400] shadow-[0_0_0_3px_rgba(245,180,0,0.2)]"
                    : "border-gray-200 hover:border-gray-400 opacity-60 hover:opacity-100"
                }`}
              >
                <Image
                  src={img.url}
                  alt={`${productName} ${i + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Main image */}
        <div className="relative flex-1 rounded-2xl overflow-hidden bg-white border border-gray-200 group cursor-zoom-in shadow-sm"
          style={{ aspectRatio: "1/1" }}
          onClick={() => setLightbox(true)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={selected}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0"
            >
              <Image
                  src={mainImg.url}
                  alt={`${productName} — image ${selected + 1}`}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 55vw"
                  className="object-contain transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />
            </motion.div>
          </AnimatePresence>

          {/* Top-right controls */}
          <div className="absolute top-3 right-3 flex flex-col items-end gap-2 z-10">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleShare(); }}
              className="flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur-sm px-3 py-1.5 text-[12px] font-heading font-semibold text-gray-700 border border-gray-200 shadow-sm hover:border-[#F5B400] hover:text-[#F5B400] transition-all duration-200"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Share2 className="h-3.5 w-3.5" />}
              {copied ? "Copied!" : "Share"}
            </button>
          </div>

          {/* Bottom-left badges */}
          <div className="absolute bottom-3 left-3 z-10 flex flex-col gap-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F5B400] text-white text-[11px] font-heading font-bold px-3 py-1 shadow-md tracking-wide uppercase">
              <Award className="h-3 w-3" />
              Export Quality
            </span>
          </div>

          {/* Counter */}
          {list.length > 1 && (
            <div className="absolute bottom-3 right-3 z-10">
              <span className="rounded-full bg-black/50 text-white text-[11px] px-2.5 py-1 font-body backdrop-blur-sm tabular-nums">
                {selected + 1} / {list.length}
              </span>
            </div>
          )}

          {/* Zoom hint */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-black/25 backdrop-blur-sm rounded-full p-3">
              <ZoomIn className="h-5 w-5 text-white" />
            </div>
          </div>

          {/* Arrow nav on main image */}
          {list.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setSelected((s) => Math.max(0, s - 1)); }}
                disabled={selected === 0}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/90 shadow-md border border-gray-200 text-gray-700 hover:bg-white hover:border-[#F5B400] hover:text-[#F5B400] disabled:opacity-30 transition-all duration-200"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setSelected((s) => Math.min(list.length - 1, s + 1)); }}
                disabled={selected === list.length - 1}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/90 shadow-md border border-gray-200 text-gray-700 hover:bg-white hover:border-[#F5B400] hover:text-[#F5B400] disabled:opacity-30 transition-all duration-200"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── Lightbox ─────────────────────────────── */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/97 flex items-center justify-center"
            onClick={() => setLightbox(false)}
          >
            {/* Close */}
            <button
              type="button"
              className="absolute top-4 right-4 p-2.5 rounded-full bg-white/10 text-white hover:bg-white/25 transition-colors z-10"
              onClick={() => setLightbox(false)}
            >
              <X className="h-5 w-5" />
            </button>

            {/* Counter */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/50 font-body text-sm z-10">
              {selected + 1} / {list.length}
            </div>

            {list.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setSelected((s) => Math.max(0, s - 1)); }}
                  disabled={selected === 0}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 text-white hover:bg-white/25 disabled:opacity-30 transition-colors"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setSelected((s) => Math.min(list.length - 1, s + 1)); }}
                  disabled={selected === list.length - 1}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 text-white hover:bg-white/25 disabled:opacity-30 transition-colors"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            <motion.div
              key={selected}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="relative mx-4 sm:mx-14 w-full max-w-4xl"
              style={{ height: "75vh" }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={mainImg.url}
                alt={productName}
                fill
                className="object-contain rounded-xl"
                sizes="(max-width: 1024px) 95vw, 896px"
                priority
              />
            </motion.div>

            {/* Dot strip */}
            {list.length > 1 && list.length <= 12 && (
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {list.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setSelected(i); }}
                    className={`rounded-full transition-all duration-200 ${i === selected ? "w-5 h-1.5 bg-[#F5B400]" : "w-1.5 h-1.5 bg-white/30 hover:bg-white/60"}`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
