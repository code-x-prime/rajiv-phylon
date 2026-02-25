"use client";

// Thin wrapper — uses the universal ProductCard so all product cards look consistent.
import { ProductCard } from "@/components/ui/ProductCard";

export function RelatedProductCard({ product, index = 0 }) {
  return <ProductCard product={product} showBadge index={index} />;
}
