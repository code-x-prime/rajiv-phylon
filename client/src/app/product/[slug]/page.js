import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Tag, Package, Calendar, Layers, Star } from "lucide-react";
import { getProductBySlug, getRelatedProducts } from "@/lib/api";
import { ProductDetailGallery } from "@/components/product/ProductDetailGallery";
import { ProductSpecCards } from "@/components/product/ProductSpecCards";
import { StickyEnquiryBox } from "@/components/product/StickyEnquiryBox";
import { RelatedProductCard } from "@/components/product/RelatedProductCard";

/* ─── SEO metadata ──────────────────────────────────────── */
export async function generateMetadata({ params }) {
  const slug = params.slug;
  let product = null;
  try { product = await getProductBySlug(slug); } catch { /* noop */ }
  if (!product) return { title: "Product | Rajiv Phylon" };

  const title       = product.metaTitle      || product.name;
  const description = product.metaDescription || null;
  const ogImage     = product.ogImage         || product.images?.[0]?.url || null;
  const keywords    = product.metaKeywords    || null;

  return {
    title:       `${title} | Rajiv Phylon`,
    description: description || undefined,
    keywords:    keywords    || undefined,
    openGraph: {
      title,
      description: description || undefined,
      type:   "website",
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: product.name }] : undefined,
    },
    twitter: {
      card:        "summary_large_image",
      title,
      description: description || undefined,
      images:      ogImage ? [ogImage] : undefined,
    },
  };
}

/* ─── Helpers ────────────────────────────────────────────── */
function stripHtml(html) {
  if (!html || typeof html !== "string") return "";
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

const TAG_MAP = {
  NEW_ARRIVAL: { label: "New Arrival",  cls: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  TRENDING:    { label: "High Demand",  cls: "bg-blue-100   text-blue-700   border-blue-200"   },
  BEST_SELLER: { label: "Best Seller",  cls: "bg-amber-100  text-amber-700  border-amber-200"  },
};

function buildJsonLd(product) {
  return {
    "@context":  "https://schema.org",
    "@type":     "Product",
    name:        product.name,
    description: product.metaDescription || stripHtml(product.description || ""),
    image:       (product.images || []).map((i) => i.url),
    sku:         product.id,
    brand:       { "@type": "Brand", name: "Rajiv Phylon" },
    category:    product.categories?.[0]?.name || undefined,
    offers: {
      "@type":       "Offer",
      availability:  "https://schema.org/InStock",
      priceCurrency: "USD",
      url:           `https://rajivphylon.com/product/${product.slug}`,
    },
  };
}

/* ─── Page ───────────────────────────────────────────────── */
export default async function ProductPage({ params }) {
  const slug = params.slug;
  let product;
  try { product = await getProductBySlug(slug); } catch { notFound(); }
  if (!product) notFound();

  const images        = product.images        || [];
  const categories    = product.categories    || [];
  const subCategories = product.subCategories || [];
  const categoryIds   = categories.map((c) => c.id);
  const primaryCat    = categories[0]    || null;
  const primarySub    = subCategories[0] || null;
  const tagInfo       = product.featureTag ? TAG_MAP[product.featureTag] : null;

  let relatedProducts = [];
  try { relatedProducts = await getRelatedProducts(product.id, categoryIds, 8); } catch { /* noop */ }

  const shortDesc = product.metaDescription
    || (product.description ? stripHtml(product.description).slice(0, 320) : "");

  const jsonLd = buildJsonLd(product);

  /* Parse specifications object if present */
  const specs = product.specifications
    ? (typeof product.specifications === "string"
        ? (() => { try { return JSON.parse(product.specifications); } catch { return {}; } })()
        : product.specifications)
    : {};
  const specEntries = Object.entries(specs).filter(([, v]) => v != null && v !== "");

  /* Trade info */
  const tradeInfo = product.tradeInfo
    ? (typeof product.tradeInfo === "string"
        ? (() => { try { return JSON.parse(product.tradeInfo); } catch { return {}; } })()
        : product.tradeInfo)
    : {};
  const tradeEntries = Object.entries(tradeInfo).filter(([, v]) => v != null && v !== "");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="bg-white min-h-screen overflow-x-hidden">

        {/* ── BREADCRUMB HERO ──────────────────────────────── */}
        <div className="bg-[#FAFAFA] border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[12px] font-body text-gray-400">
              <Link href="/" className="hover:text-[#111111] transition-colors">Home</Link>
              <ChevronRight className="h-3.5 w-3.5 shrink-0" />
              <Link href="/products" className="hover:text-[#111111] transition-colors">Products</Link>
              {primaryCat && (
                <>
                  <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                  <Link href={`/category/${primaryCat.slug}`} className="hover:text-[#111111] transition-colors">{primaryCat.name}</Link>
                </>
              )}
              {primarySub && (
                <>
                  <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                  <Link href={`/subcategory/${primarySub.slug}`} className="hover:text-[#111111] transition-colors">{primarySub.name}</Link>
                </>
              )}
              <ChevronRight className="h-3.5 w-3.5 shrink-0" />
              <span className="text-[#111111] font-semibold truncate max-w-[240px]">{product.name}</span>
            </nav>
          </div>
        </div>

        {/* ── MAIN GRID ────────────────────────────────────── */}
        <section className="py-8 md:py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1fr_440px] xl:grid-cols-[1fr_480px] gap-8 lg:gap-12 xl:gap-16 items-start">

              {/* ── LEFT: Gallery ── */}
              <div>
                <ProductDetailGallery images={images} productName={product.name} />
              </div>

              {/* ── RIGHT: Product info + Enquiry ── */}
              <div className="space-y-5">

                {/* Tags / Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  {tagInfo && (
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-heading font-bold border uppercase tracking-wider ${tagInfo.cls}`}>
                      <Star className="h-3 w-3" />
                      {tagInfo.label}
                    </span>
                  )}
                  {categories.map((c) => (
                    <Link
                      key={c.id}
                      href={`/category/${c.slug}`}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-heading font-semibold bg-gray-100 text-gray-600 border border-gray-200 hover:bg-[#F5B400] hover:text-white hover:border-[#F5B400] transition-all duration-200"
                    >
                      <Tag className="h-3 w-3" />
                      {c.name}
                    </Link>
                  ))}
                  {subCategories.map((s) => (
                    <Link
                      key={s.id}
                      href={`/subcategory/${s.slug}`}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-heading font-semibold bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-200"
                    >
                      <Layers className="h-3 w-3" />
                      {s.name}
                    </Link>
                  ))}
                </div>

                {/* Title + short desc */}
                <div>
                  <h1 className="font-heading text-2xl sm:text-3xl xl:text-[2rem] font-bold text-[#111111] leading-tight tracking-tight mb-3">
                    {product.name}
                  </h1>
                  {shortDesc && (
                    <p className="text-gray-500 font-body text-[15px] leading-relaxed">
                      {shortDesc}
                    </p>
                  )}
                </div>

                {/* MOQ badge */}
                {product.moq && (
                  <div className="inline-flex items-center gap-2.5 rounded-xl border border-[#F5B400]/30 bg-[#F5B400]/5 px-4 py-2.5">
                    <Package className="h-4 w-4 text-[#F5B400] shrink-0" />
                    <div>
                      <p className="text-[11px] font-heading font-bold text-[#F5B400] uppercase tracking-wider">Minimum Order Quantity</p>
                      <p className="text-[15px] font-heading font-bold text-[#111111]">{product.moq}</p>
                    </div>
                  </div>
                )}

                {/* Spec cards */}
                <ProductSpecCards
                  category={primaryCat}
                  subcategory={primarySub}
                  allCategories={categories}
                  allSubcategories={subCategories}
                  createdAt={product.createdAt}
                  featureTag={product.featureTag}
                />

                {/* Extra specifications (if API returns them) */}
                {specEntries.length > 0 && (
                  <div className="rounded-xl border border-gray-100 bg-[#FAFAFA] overflow-hidden">
                    <div className="px-4 py-3 bg-white border-b border-gray-100">
                      <span className="text-[11px] font-heading font-bold text-gray-500 uppercase tracking-widest">Specifications</span>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {specEntries.map(([key, val]) => (
                        <div key={key} className="flex items-center justify-between gap-4 px-4 py-3">
                          <span className="text-[12px] font-heading font-semibold text-gray-400 uppercase tracking-wide shrink-0">
                            {key.replace(/_/g, " ")}
                          </span>
                          <span className="text-[14px] font-body text-[#111111] font-medium text-right">{String(val)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trade info */}
                {tradeEntries.length > 0 && (
                  <div className="rounded-xl border border-gray-100 bg-[#FAFAFA] overflow-hidden">
                    <div className="px-4 py-3 bg-white border-b border-gray-100">
                      <span className="text-[11px] font-heading font-bold text-gray-500 uppercase tracking-widest">Trade Info</span>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {tradeEntries.map(([key, val]) => (
                        <div key={key} className="flex items-center justify-between gap-4 px-4 py-3">
                          <span className="text-[12px] font-heading font-semibold text-gray-400 uppercase tracking-wide shrink-0">
                            {key.replace(/_/g, " ")}
                          </span>
                          <span className="text-[14px] font-body text-[#111111] font-medium text-right">{String(val)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Date added */}
                {product.createdAt && (
                  <p className="flex items-center gap-2 text-[12px] text-gray-400 font-body">
                    <Calendar className="h-3.5 w-3.5" />
                    Added on {new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(product.createdAt))}
                  </p>
                )}

                <div className="border-t border-gray-100" />

                {/* Enquiry Box */}
                <StickyEnquiryBox
                  productId={product.id}
                  productName={product.name}
                  productSlug={product.slug}
                />
              </div>

            </div>
          </div>
        </section>

        {/* ── FULL DESCRIPTION ─────────────────────────────── */}
        {product.description && (
          <section className="py-12 md:py-16 border-t border-gray-100 bg-[#FAFAFA]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-1 h-6 bg-[#F5B400] rounded-full" />
                  <h2 className="font-heading text-2xl md:text-3xl font-bold text-[#111111] tracking-tight">
                    Product Description
                  </h2>
                </div>
                <div
                  className="prose prose-gray prose-headings:font-heading prose-headings:text-[#111111] prose-a:text-[#F5B400] prose-a:no-underline hover:prose-a:underline max-w-none bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-10 text-[15px] leading-relaxed text-gray-700"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
            </div>
          </section>
        )}

        {/* ── RELATED PRODUCTS ─────────────────────────────── */}
        {relatedProducts.length > 0 && (
          <section className="py-12 md:py-16 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <p className="text-[11px] font-heading font-bold text-[#F5B400] uppercase tracking-[0.25em] mb-1">
                    More Products
                  </p>
                  <h2 className="font-heading text-2xl md:text-3xl font-bold text-[#111111] tracking-tight">
                    Related Products
                  </h2>
                </div>
                <Link
                  href={primaryCat ? `/category/${primaryCat.slug}` : "/products"}
                  className="text-[13px] font-heading font-semibold text-[#F5B400] hover:underline underline-offset-2 hidden sm:block"
                >
                  View all →
                </Link>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth scrollbar-hide -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-3 xl:grid-cols-4 lg:overflow-visible lg:gap-5">
                {relatedProducts.map((p, i) => (
                  <div key={p.id} className="shrink-0 w-[220px] sm:w-[250px] snap-start lg:w-auto">
                    <RelatedProductCard product={p} index={i} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

      </div>
    </>
  );
}
