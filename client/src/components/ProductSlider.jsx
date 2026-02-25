"use client";

import { useRef } from "react";
import { ProductCard } from "@/components/ui";

export function ProductSlider({ title, products, showNewBadge = false, viewAllHref }) {
  const scrollRef = useRef(null);

  if (!products?.length) return null;

  return (
    <section className="py-16 md:py-20 lg:py-24 border-b border bg-section-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 md:mb-10">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground tracking-tight">
            {title}
          </h2>
          {viewAllHref && (
            <a href={viewAllHref} className="text-sm font-heading font-semibold text-[#F5B400] hover:underline underline-offset-2 hidden sm:block">
              View all →
            </a>
          )}
        </div>
        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-5 overflow-x-auto pb-3 snap-x snap-mandatory scroll-smooth scrollbar-hide -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((p, i) => (
            <div
              key={p.id}
              className="flex-shrink-0 w-[220px] sm:w-[260px] snap-start"
            >
              <ProductCard product={p} showBadge index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
