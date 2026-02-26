"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const PLACEHOLDER_IMAGE = "/placeholder.png";

const TAG_BADGE = {
  NEW_ARRIVAL: { label: "New", cls: "bg-emerald-500 text-white" },
  TRENDING: { label: "Trending", cls: "bg-[#111111] text-white" },
  BEST_SELLER: { label: "Best Seller", cls: "bg-[#F5B400] text-white" },
};

/**
 * Universal product card — home sliders, /products catalog, related products.
 * compactOnMobile: use in sliders so 2 cards fit in one row on small mobile.
 */
export function ProductCard({ product, showBadge = false, index = 0, compactOnMobile = false }) {
  const imageUrl = product.images?.[0]?.url;
  const category = product.categories?.[0]?.name;
  const badge = showBadge && product.featureTag && TAG_BADGE[product.featureTag];

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex flex-col rounded bg-white border border-gray-100 overflow-hidden hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)] hover:-translate-y-1 transition-all duration-300"
      style={{ animationDelay: `${index * 55}ms` }}
    >
      {/* ── Image ─────────────────────────────── */}
      <div
        className="relative overflow-hidden bg-[#F8F8F8] shrink-0"
        style={{ aspectRatio: "1/1" }}
      >
        <Image
          src={imageUrl || PLACEHOLDER_IMAGE}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
          className="object-contain p-1 sm:p-2 transition-transform duration-500 ease-out group-hover:scale-[1.05]"
        />

        {/* Badge */}
        {badge && (
          <span className={`absolute top-1.5 left-1.5 sm:top-3 sm:left-3 z-10 text-[8px] sm:text-[10px] font-heading font-bold uppercase tracking-wider px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full ${badge.cls}`}>
            {badge.label}
          </span>
        )}

        {/* Arrow pill — slides in on hover */}
        <div className="absolute top-1.5 right-1.5 sm:top-3 sm:right-3 z-10 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#F5B400] flex items-center justify-center shadow-md">
            <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
          </div>
        </div>

        {/* Bottom yellow sweep bar */}
        <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-[#F5B400] group-hover:w-full transition-all duration-500 ease-out" aria-hidden />
      </div>

      {/* ── Content ───────────────────────────── */}
      <div className={`flex flex-col flex-1 gap-0.5 sm:gap-1 ${compactOnMobile ? "px-2 pt-2 pb-2.5 sm:px-4 sm:pt-3.5 sm:pb-4" : "px-4 pt-3.5 pb-4"}`}>
        {category && (
          <p className="text-[9px] sm:text-[10px] font-heading font-bold text-[#F5B400] uppercase tracking-[0.18em]">
            {category}
          </p>
        )}
        <h3 className={`font-heading font-semibold text-[#111111] leading-snug line-clamp-2 flex-1 ${compactOnMobile ? "text-[11px] sm:text-[14px]" : "text-[14px]"}`}>
          {product.name}
        </h3>
        {/* Thin yellow underline accent on hover */}
        <div className={`mt-1 sm:mt-2 flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-[12px] font-heading font-bold text-gray-400 group-hover:text-[#F5B400] transition-colors duration-250`}>
          <div className="h-px w-3 sm:w-4 bg-current" />
          View Product
        </div>
      </div>
    </Link>
  );
}
