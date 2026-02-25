"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

export function GalleryGrid({ items }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const openLightbox = (i) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const prev = useCallback(() => setLightboxIndex((i) => (i > 0 ? i - 1 : items.length - 1)), [items.length]);
  const next = useCallback(() => setLightboxIndex((i) => (i < items.length - 1 ? i + 1 : 0)), [items.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIndex, prev, next]);

  if (!items?.length) return null;

  return (
    <>
      {/* Masonry grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
        {items.map((item, i) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55, delay: (i % 8) * 0.06, ease: [0.22, 1, 0.36, 1] }}
            type="button"
            className="block w-full break-inside-avoid rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 hover:border-[#F5B400]/40 hover:shadow-xl transition-all duration-400 text-left group cursor-zoom-in"
            onClick={() => openLightbox(i)}
          >
            <div className="relative overflow-hidden bg-gray-100" style={{ aspectRatio: i % 5 === 0 ? "3/4" : i % 3 === 0 ? "16/9" : "4/3" }}>
              <Image
                src={item.imageUrl || item.image}
                alt={item.title || "Gallery"}
                fill
                className="object-cover group-hover:scale-[1.07] transition-transform duration-700 ease-out"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col justify-between p-4">
                <div className="flex justify-end">
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <ZoomIn className="h-4 w-4 text-white" />
                  </div>
                </div>
                {item.title && (
                  <div>
                    <div className="w-8 h-[2px] rounded-full bg-[#F5B400] mb-2" aria-hidden />
                    <p className="text-white font-heading font-semibold text-[14px] leading-snug line-clamp-2">
                      {item.title}
                    </p>
                  </div>
                )}
              </div>
              {/* Bottom yellow bar */}
              <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-[#F5B400] group-hover:w-full transition-all duration-500 ease-out" aria-hidden />
            </div>
          </motion.button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
            role="dialog"
            aria-modal="true"
          >
            {/* Top bar */}
            <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 py-4 z-10">
              <span className="text-white/50 font-heading text-sm">
                {lightboxIndex + 1} / {items.length}
              </span>
              <button
                type="button"
                className="p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                onClick={closeLightbox}
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Prev / Next */}
            <button
              type="button"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 text-white hover:bg-white/25 transition-colors"
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="Previous"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 text-white hover:bg-white/25 transition-colors"
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="Next"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Image — container needs explicit height so fill image displays large */}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="relative max-w-5xl w-full mx-4 sm:mx-8 md:mx-16 flex flex-col items-center px-2"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-[75vh] min-h-[320px] max-h-[85vh]">
                <Image
                  src={items[lightboxIndex]?.imageUrl || items[lightboxIndex]?.image}
                  alt={items[lightboxIndex]?.title || "Gallery"}
                  fill
                  className="object-contain rounded-xl shadow-2xl"
                  sizes="(max-width: 1024px) 100vw, 896px"
                />
              </div>
              {items[lightboxIndex]?.title && (
                <div className="mt-4 text-center">
                  <div className="w-8 h-[2px] bg-[#F5B400] rounded-full mx-auto mb-2" />
                  <p className="text-white font-heading font-semibold text-base">
                    {items[lightboxIndex].title}
                  </p>
                </div>
              )}
            </motion.div>

            {/* Dot indicators */}
            {items.length <= 20 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
                {items.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setLightboxIndex(i); }}
                    className={`rounded-full transition-all duration-200 ${i === lightboxIndex ? "w-5 h-1.5 bg-[#F5B400]" : "w-1.5 h-1.5 bg-white/30 hover:bg-white/60"}`}
                    aria-label={`Go to image ${i + 1}`}
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
