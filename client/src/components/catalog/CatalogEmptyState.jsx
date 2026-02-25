"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Package } from "lucide-react";

export function CatalogEmptyState({ title = "No products found", description, showReset = true }) {
  const router = useRouter();

  const handleReset = () => {
    router.push("/products");
  };

  return (
    <div className="py-20 md:py-28 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 text-muted mb-6">
        <Package className="w-8 h-8" strokeWidth={1.5} />
      </div>
      <h2 className="font-heading text-xl font-semibold text-foreground">{title}</h2>
      {description && (
        <p className="mt-2 text-muted font-body max-w-md mx-auto leading-relaxed">{description}</p>
      )}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        {showReset && (
          <button
            type="button"
            onClick={handleReset}
            className="rounded-xl bg-primary px-6 py-2.5 text-white font-heading font-semibold text-sm transition-all hover:bg-primary-hover shadow-md"
          >
            Reset filters
          </button>
        )}
        <Link
          href="/"
          className="rounded-xl border-2 border-gray-200 px-6 py-2.5 font-heading font-semibold text-sm text-foreground hover:bg-gray-50 transition-colors"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
