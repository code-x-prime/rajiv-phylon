import { getProducts, getCategoriesWithSubcategories } from "@/lib/api";
import { ProductsListingClient } from "@/components/catalog";
import Link from "next/link";
import { ChevronRight, Package } from "lucide-react";

export const metadata = {
  title: "Products | Rajiv Phylon",
  description: "Browse our full range of B2B industrial products. Export-grade polymer footwear components.",
};

// Build time par API call na ho (VPS par API often unavailable during build).
export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  let products = [];
  let categoriesWithSubs = [];
  try {
    [products, categoriesWithSubs] = await Promise.all([
      getProducts(),
      getCategoriesWithSubcategories(),
    ]);
  } catch (e) {
    console.error(e);
  }

  return (
    <div className="bg-white min-h-screen overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative bg-[#0A0A0A] overflow-hidden py-16 md:py-24">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }}
          aria-hidden
        />
        {/* Glow */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#F5B400]/10 blur-[90px] pointer-events-none" aria-hidden />
        <div className="absolute -bottom-20 -left-10 w-64 h-64 rounded-full bg-[#F5B400]/8 blur-[80px] pointer-events-none" aria-hidden />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 mt-16">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-[12px] font-body text-white/40 mb-5" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white/70 transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-white/70">Products</span>
          </nav>

          <div className="inline-flex items-center gap-2 mb-4">
            <div className="h-px w-8 bg-[#F5B400]" />
            <span className="text-[11px] font-heading font-bold text-[#F5B400] uppercase tracking-[0.28em]">
              Full Catalog
            </span>
          </div>

          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight mb-4">
            Our <span className="text-[#F5B400]">Products</span>
          </h1>
          <p className="text-[15px] text-white/50 font-body leading-relaxed max-w-xl mb-8">
            Browse our full catalog of high-performance polymer footwear components. Export-grade quality for OEM and B2B partners worldwide.
          </p>

          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-2">
            <Package className="h-3.5 w-3.5 text-[#F5B400]" />
            <span className="font-heading font-semibold text-white text-[13px]">
              {products.length} product{products.length !== 1 ? "s" : ""} available
            </span>
          </div>
        </div>
      </section>

      {/* ── LISTING ──────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto py-10 md:py-14 px-4 ">
        <ProductsListingClient
          products={products}
          categoriesWithSubs={categoriesWithSubs || []}
        />
      </section>
    </div>
  );
}
