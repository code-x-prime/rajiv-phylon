"use client";

import { useRef } from "react";
import { ProductCard } from "@/components/ui";

export function ProductSlider({ title, products, showNewBadge = false, viewAllHref }) {
  const scrollRef = useRef(null);

  if (!products?.length) return null;

  return (
    <section className="py-16 md:py-24 border-b border-gray-100 bg-section-bg">
      <div className="max-w-site mx-auto px-6 lg:px-10">
        <div className="flex items-end justify-between mb-8 md:mb-10">
          <h2 className="font-display font-medium text-[clamp(1.25rem,2.5vw,1.75rem)] text-foreground tracking-[-0.02em]">
            {title}
          </h2>
          {viewAllHref && (
            <a href={viewAllHref} className="text-sm font-display font-medium text-[#F5B400] hover:underline underline-offset-2 hidden sm:block">
              View all →
            </a>
          )}
        </div>
        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-5 overflow-x-auto pb-3 snap-x snap-mandatory scroll-smooth scrollbar-hide -mx-6 px-6 lg:-mx-10 lg:px-10"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((p, i) => (
            <div
              key={p.id}
              className="flex-shrink-0 w-[calc(50vw-22px)] min-w-[140px] sm:w-[260px] snap-start"
            >
              <ProductCard product={p} showBadge index={i} compactOnMobile />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
