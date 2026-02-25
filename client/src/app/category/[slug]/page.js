import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ChevronRight, Layers, Package } from "lucide-react";
import { getCategoryBySlug, getCategories, getSubCategoriesByCategory, getProducts } from "@/lib/api";
import { CatalogProductCard } from "@/components/catalog";
import { CategoryCard } from "@/components/ui";

export async function generateStaticParams() {
  try {
    const categories = await getCategories();
    return categories.map((c) => ({ slug: c.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const slug = params.slug;
  try {
    const category = await getCategoryBySlug(slug);
    if (category) {
      return {
        title: `${category.name} | Rajiv Phylon`,
        description: category.description || `Browse ${category.name} products and subcategories.`,
      };
    }
  } catch {}
  return { title: "Category | Rajiv Phylon" };
}

export default async function CategoryPage({ params }) {
  const slug = params.slug;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  let subCategories = [];
  let products = [];
  try {
    [subCategories, products] = await Promise.all([
      getSubCategoriesByCategory(category.id),
      getProducts(),
    ]);
  } catch {}

  const categoryProducts = products.filter(
    (p) => p.categories?.some((c) => c.id === category.id)
  );
  const showSubCategories = subCategories.length > 0;
  const showProducts = !showSubCategories && categoryProducts.length > 0;
  const imageUrl = category.imageUrl || category.image || "/placeholder.png";

  return (
    <div className="bg-white min-h-screen overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative bg-[#0A0A0A] overflow-hidden py-20 md:py-28">
        {/* Background image faint overlay */}
        <div className="absolute inset-0">
          <Image src={imageUrl} alt="" fill className="object-cover opacity-[0.12] saturate-0" priority sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/80 to-[#0A0A0A]/60" />
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
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-[#F5B400]/10 blur-[80px] pointer-events-none" aria-hidden />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-[12px] font-body text-white/40 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white/70 transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/products" className="hover:text-white/70 transition-colors">Products</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-white/70">{category.name}</span>
          </nav>

          {/* Label */}
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="h-px w-8 bg-[#F5B400]" />
            <span className="text-[11px] font-heading font-bold text-[#F5B400] uppercase tracking-[0.28em]">
              Category
            </span>
          </div>

          {/* Title */}
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight mb-4 max-w-3xl">
            {category.name}
          </h1>

          {category.description && (
            <p className="text-[15px] text-white/50 font-body leading-relaxed max-w-xl mb-8">
              {category.description}
            </p>
          )}

          {/* Count chips */}
          <div className="flex flex-wrap gap-3">
            {showSubCategories && (
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-2">
                <Layers className="h-3.5 w-3.5 text-[#F5B400]" />
                <span className="font-heading font-semibold text-white text-[13px]">
                  {subCategories.length} subcategor{subCategories.length !== 1 ? "ies" : "y"}
                </span>
              </div>
            )}
            {!showSubCategories && (
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-2">
                <Package className="h-3.5 w-3.5 text-[#F5B400]" />
                <span className="font-heading font-semibold text-white text-[13px]">
                  {categoryProducts.length} product{categoryProducts.length !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── CONTENT ──────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto py-14 md:py-16 px-4 sm:px-6 lg:px-8">

        {/* Subcategories grid */}
        {showSubCategories && (
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-heading text-xl md:text-2xl font-bold text-[#111111]">
                Subcategories
              </h2>
              <span className="text-[13px] text-gray-400 font-body">
                {subCategories.length} found
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
              {subCategories.map((sub) => (
                <CategoryCard
                  key={sub.id}
                  category={sub}
                  href={`/subcategory/${sub.slug}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Products grid */}
        {showProducts && (
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-heading text-xl md:text-2xl font-bold text-[#111111]">
                Products
              </h2>
              <span className="text-[13px] text-gray-400 font-body">
                {categoryProducts.length} found
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
              {categoryProducts.map((p, i) => (
                <CatalogProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </>
        )}

        {/* Empty */}
        {!showSubCategories && !showProducts && (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-5">
              <Package className="h-7 w-7 text-gray-400" />
            </div>
            <h3 className="font-heading font-bold text-xl text-[#111111] mb-2">Nothing here yet</h3>
            <p className="text-gray-500 font-body text-[15px] mb-6">
              No subcategories or products in this category.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-xl bg-[#F5B400] text-white font-heading font-bold text-sm px-6 py-3 hover:bg-[#e0a300] transition-colors"
            >
              Browse all products
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
