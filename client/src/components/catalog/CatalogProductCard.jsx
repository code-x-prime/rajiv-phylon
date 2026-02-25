"use client";

// Thin wrapper kept for backward compatibility.
// All rendering is delegated to the universal ProductCard.
import { ProductCard } from "@/components/ui/ProductCard";

export function CatalogProductCard({ product, index = 0 }) {
  return <ProductCard product={product} showBadge index={index} />;
}
