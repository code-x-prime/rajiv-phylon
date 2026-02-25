import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ChevronRight, Package } from "lucide-react";
import { getSubcategoryBySlug, getProducts, getCategories, getSubCategoriesByCategory } from "@/lib/api";
import { CatalogProductCard } from "@/components/catalog";

export async function generateStaticParams() {
  try {
    const categories = await getCategories();
    const slugs = [];
    for (const cat of categories) {
      const subs = await getSubCategoriesByCategory(cat.id);
      subs.forEach((s) => slugs.push({ slug: s.slug }));
    }
    return slugs;
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const slug = params.slug;
  try {
    const result = await getSubcategoryBySlug(slug);
    if (result?.subcategory) {
      return {
        title: `${result.subcategory.name} | Rajiv Phylon`,
        description: result.subcategory.description || `Browse ${result.subcategory.name} products.`,
      };
    }
  } catch {}
  return { title: "Subcategory | Rajiv Phylon" };
}

export default async function SubCategoryPage({ params }) {
  const slug = params.slug;
  const result = await getSubcategoryBySlug(slug);
  if (!result) notFound();

  const { subcategory: subCategory, category } = result;
  const imageUrl = subCategory.imageUrl || subCategory.image || "/placeholder.png";

  let products = [];
  try {
    products = await getProducts();
  } catch {}

  const subProducts = products.filter(
    (p) => p.subCategories?.some((s) => s.id === subCategory.id)
  );

  return (
    <div className="bg-white min-h-screen overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative bg-[#0A0A0A] overflow-hidden py-20 md:py-28">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image src={imageUrl} alt="" fill className="object-cover opacity-[0.12] saturate-0" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/80 to-[#0A0A0A]/50" />
        </div>

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }}
          aria-hidden
        />

        {/* Yellow glow */}
        <div className="absolute -bottom-16 -right-16 w-72 h-72 rounded-full bg-[#F5B400]/10 blur-[80px] pointer-events-none" aria-hidden />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex flex-wrap items-center gap-1.5 text-[12px] font-body text-white/40 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white/70 transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" />
            <Link href="/products" className="hover:text-white/70 transition-colors">Products</Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" />
            <Link href={`/category/${category.slug}`} className="hover:text-white/70 transition-colors">
              {category.name}
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" />
            <span className="text-white/70">{subCategory.name}</span>
          </nav>

          {/* Category parent link */}
          <Link
            href={`/category/${category.slug}`}
            className="inline-flex items-center gap-2 mb-4 group"
          >
            <div className="h-px w-8 bg-[#F5B400]" />
            <span className="text-[11px] font-heading font-bold text-[#F5B400] uppercase tracking-[0.28em] group-hover:underline underline-offset-2">
              {category.name}
            </span>
          </Link>

          {/* Title */}
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight mb-4 max-w-3xl">
            {subCategory.name}
          </h1>

          {subCategory.description && (
            <p className="text-[15px] text-white/50 font-body leading-relaxed max-w-xl mb-8">
              {subCategory.description}
            </p>
          )}

          {/* Count */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-2">
            <Package className="h-3.5 w-3.5 text-[#F5B400]" />
            <span className="font-heading font-semibold text-white text-[13px]">
              {subProducts.length} product{subProducts.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </section>

      {/* ── PRODUCTS GRID ────────────────────────────────── */}
      <section className="max-w-7xl mx-auto py-14 md:py-16 px-4 sm:px-6 lg:px-8">
        {subProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-5">
              <Package className="h-7 w-7 text-gray-400" />
            </div>
            <h3 className="font-heading font-bold text-xl text-[#111111] mb-2">No products yet</h3>
            <p className="text-gray-500 font-body text-[15px] mb-6">
              No products in this subcategory. Check back later.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href={`/category/${category.slug}`}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white text-[#111111] font-heading font-semibold text-sm px-6 py-3 hover:border-[#F5B400]/50 transition-colors"
              >
                Back to {category.name}
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-xl bg-[#F5B400] text-white font-heading font-bold text-sm px-6 py-3 hover:bg-[#e0a300] transition-colors"
              >
                Browse all products
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-heading text-xl md:text-2xl font-bold text-[#111111]">
                Products
              </h2>
              <span className="text-[13px] text-gray-400 font-body">
                {subProducts.length} found
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
              {subProducts.map((p, i) => (
                <CatalogProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
