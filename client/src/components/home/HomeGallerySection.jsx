"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

/**
 * Factory / Infrastructure Gallery section.
 * Mobile: horizontal snap-scroll cards.
 * Desktop: bento-style grid (first image large, rest smaller).
 */
export function HomeGallerySection({ images = [] }) {
  if (!images || images.length === 0) return null;

  const list = images.slice(0, 8);

  return (
    <section className="py-16 md:py-20 lg:py-24 border-t border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-end justify-between mb-8 md:mb-10">
          <div>
            <p className="text-[11px] font-heading font-bold text-[#F5B400] uppercase tracking-widest mb-2">
              Our Facility
            </p>
            <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-[#111111] tracking-tight">
              Factory Gallery
            </h2>
          </div>
          <Link
            href="/gallery"
            className="hidden sm:flex items-center gap-1.5 text-sm font-heading font-semibold text-[#111111] border border-gray-200 rounded-xl px-4 py-2.5 hover:border-[#F5B400] hover:text-[#F5B400] transition-all duration-200 shrink-0"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* ── Desktop: bento grid ──────────────────────── */}
        <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-3 lg:gap-4 h-[520px] lg:h-[560px]">
          {/* Item 0 — large, spans 2 cols × 2 rows */}
          {list[0] && (
            <GalleryItem item={list[0]} className="col-span-2 row-span-2" />
          )}
          {/* Items 1–3 */}
          {list[1] && <GalleryItem item={list[1]} className="col-span-1 row-span-1" />}
          {list[2] && <GalleryItem item={list[2]} className="col-span-1 row-span-1" />}
          {/* Item 3 — wide, spans 2 cols */}
          {list[3] && <GalleryItem item={list[3]} className="col-span-2 row-span-1" />}
        </div>

        {/* ── Mobile: horizontal scroll ────────────────── */}
        <div className="md:hidden flex gap-3 overflow-x-auto pb-3 snap-x snap-mandatory scroll-smooth scrollbar-hide -mx-4 px-4">
          {list.map((item, i) => (
            <div
              key={item.id || i}
              className="shrink-0 w-[240px] snap-start rounded-2xl overflow-hidden border border-gray-100 shadow-sm"
            >
              <div className="relative aspect-[4/3] bg-gray-100">
                <Image
                  src={item.imageUrl || item.image}
                  alt={item.title || `Gallery ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="240px"
                />
                {item.title && (
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                    <p className="text-white text-xs font-heading font-semibold line-clamp-1">{item.title}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-6 sm:hidden">
          <Link
            href="/gallery"
            className="flex items-center justify-center gap-2 w-full rounded-xl border-2 border-[#F5B400] text-[#F5B400] py-3 font-heading font-bold text-sm hover:bg-[#F5B400] hover:text-white transition-all duration-200"
          >
            View full gallery
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function GalleryItem({ item, className = "" }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gray-100 border border-gray-100 shadow-sm group ${className}`}>
      <Image
        src={item.imageUrl || item.image}
        alt={item.title || "Factory gallery"}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end p-4">
        {item.title && (
          <p className="text-white font-heading font-semibold text-sm">{item.title}</p>
        )}
      </div>
    </div>
  );
}
