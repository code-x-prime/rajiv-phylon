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
 */
export function ProductCard({ product, showBadge = false, index = 0 }) {
  const imageUrl = product.images?.[0]?.url;
  const category = product.categories?.[0]?.name;
  const badge = showBadge && product.featureTag && TAG_BADGE[product.featureTag];

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex flex-col h-full rounded bg-white border border-gray-100 overflow-hidden hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)] hover:-translate-y-0.5 transition-all duration-300"
      style={{ animationDelay: `${index * 55}ms` }}
    >
      {/* ── Image ─────────────────────────────── */}
      <div
        className="relative overflow-hidden bg-gray-50 shrink-0"
        style={{ aspectRatio: "4/5" }}
      >
        <Image
          src={imageUrl || PLACEHOLDER_IMAGE}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
        />

        {/* Badge */}
        {badge && (
          <span className={`absolute top-3 left-3 z-10 text-[10px] font-heading font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${badge.cls}`}>
            {badge.label}
          </span>
        )}

        {/* Arrow pill — slides in on hover */}
        <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
          <div className="w-8 h-8 rounded-full bg-[#F5B400] flex items-center justify-center shadow-md">
            <ArrowUpRight className="h-4 w-4 text-white" />
          </div>
        </div>

        {/* Bottom yellow sweep bar */}
        <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-[#F5B400] group-hover:w-full transition-all duration-500 ease-out" aria-hidden />
      </div>

      {/* ── Content ───────────────────────────── */}
      <div className="flex flex-col flex-1 px-4 pt-3.5 pb-4 gap-1">
        {category && (
          <p className="text-[10px] font-heading font-bold text-[#F5B400] uppercase tracking-[0.18em]">
            {category}
          </p>
        )}
        <h3 className="font-heading font-semibold text-[#111111] text-[14px] leading-snug line-clamp-2 flex-1">
          {product.name}
        </h3>
        {/* Thin yellow underline accent on hover */}
        <div className="mt-2 flex items-center gap-1.5 text-[12px] font-heading font-bold text-gray-400 group-hover:text-[#F5B400] transition-colors duration-250">
          <div className="h-px w-4 bg-current" />
          View Product
        </div>
      </div>
    </Link>
  );
}
