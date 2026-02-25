import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Tag, Package, Layers, Star, CheckCircle } from "lucide-react";
import { getProductBySlug, getRelatedProducts } from "@/lib/api";
import { ProductDetailGallery } from "@/components/product/ProductDetailGallery";
import { StickyEnquiryBox } from "@/components/product/StickyEnquiryBox";
import { RelatedProductCard } from "@/components/product/RelatedProductCard";

/* ─── SEO ─────────────────────────────────────────────────── */
export async function generateMetadata({ params }) {
  const slug = params.slug;
  let product = null;
  try { product = await getProductBySlug(slug); } catch { /* noop */ }
  if (!product) return { title: "Product | Rajiv Phylon" };
  const title = product.metaTitle || product.name;
  const description = product.metaDescription || null;
  const ogImage = product.ogImage || product.images?.[0]?.url || null;
  const keywords = product.metaKeywords || null;
  return {
    title: `${title} | Rajiv Phylon`,
    description: description || undefined,
    keywords: keywords || undefined,
    openGraph: {
      title,
      description: description || undefined,
      type: "website",
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: product.name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: description || undefined,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

/* ─── Helpers ─────────────────────────────────────────────── */
const HTML_ENTITIES = { "&nbsp;": " ", "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'", "&apos;": "'", "&hellip;": "…", "&mdash;": "—", "&ndash;": "–" };
function decodeEntities(str) {
  return str.replace(/&[a-z0-9#]+;/gi, (m) => HTML_ENTITIES[m] ?? m);
}
function stripHtml(html) {
  if (!html || typeof html !== "string") return "";
  return decodeEntities(html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim());
}

const TAG_MAP = {
  NEW_ARRIVAL: { label: "New Arrival", cls: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  TRENDING: { label: "High Demand", cls: "bg-blue-100   text-blue-700   border-blue-200" },
  BEST_SELLER: { label: "Best Seller", cls: "bg-amber-100  text-amber-700  border-amber-200" },
};

function buildJsonLd(product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.metaDescription || stripHtml(product.description || ""),
    image: (product.images || []).map((i) => i.url),
    sku: product.id,
    brand: { "@type": "Brand", name: "Rajiv Phylon" },
    category: product.categories?.[0]?.name || undefined,
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "USD",
      url: `https://rajivphylon.com/product/${product.slug}`,
    },
  };
}

/* ─── Spec / Trade Table ─────────────────────────────────── */
function DataTable({ title, entries, accent = false }) {
  if (!entries || entries.length === 0) return null;
  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className={`px-5 py-3 border-b border-gray-200 ${accent ? "bg-[#111111]" : "bg-[#F8F8F8]"}`}>
        <h3 className={`text-[11px] font-heading font-bold uppercase tracking-[0.18em] ${accent ? "text-white" : "text-gray-400"}`}>
          {title}
        </h3>
      </div>
      <div className="divide-y divide-gray-100 bg-white">
        {entries.map(([key, val]) => (
          <div key={key} className="flex items-stretch min-h-[40px]">
            <div className="w-[42%] shrink-0 flex items-center gap-1.5 px-4 py-2.5 bg-[#FAFAFA] border-r border-gray-100">
              {accent && <CheckCircle className="h-3 w-3 text-[#F5B400] shrink-0" />}
              <span className="text-[12px] font-heading font-semibold text-gray-500 leading-snug">{key.replace(/_/g, " ")}</span>
            </div>
            <div className="flex items-center px-4 py-2.5 flex-1">
              <span className="text-[13px] font-body text-[#111111] font-medium leading-snug">{String(val)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Page ────────────────────────────────────────────────── */
export default async function ProductPage({ params }) {
  const slug = params.slug;
  let product;
  try { product = await getProductBySlug(slug); } catch { notFound(); }
  if (!product) notFound();

  const images = product.images || [];
  const categories = product.categories || [];
  const subCategories = product.subCategories || [];
  const categoryIds = categories.map((c) => c.id);
  const primaryCat = categories[0] || null;
  const primarySub = subCategories[0] || null;
  const tagInfo = product.featureTag ? TAG_MAP[product.featureTag] : null;

  let relatedProducts = [];
  try { relatedProducts = await getRelatedProducts(product.id, categoryIds, 8); } catch { /* noop */ }

  const shortDesc = product.metaDescription
    ? decodeEntities(product.metaDescription)
    : (product.description ? stripHtml(product.description).slice(0, 320) : "");

  const parseJson = (v) => {
    if (!v) return {};
    if (typeof v === "object") return v;
    try { return JSON.parse(v); } catch { return {}; }
  };
  const specEntries = Object.entries(parseJson(product.specifications)).filter(([, v]) => v != null && v !== "");
  const tradeEntries = Object.entries(parseJson(product.tradeInfo)).filter(([, v]) => v != null && v !== "");

  const jsonLd = buildJsonLd(product);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="bg-white min-h-screen">

        {/* ── BREADCRUMB ─────────────────────────────── */}
        <div className="bg-[#F8F8F8] border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 mt-24">
            <nav className="flex flex-wrap items-center gap-1 text-[12px] text-gray-400">
              <Link href="/" className="hover:text-[#111] transition-colors">Home</Link>
              <ChevronRight className="h-3 w-3 shrink-0" />
              <Link href="/products" className="hover:text-[#111] transition-colors">Products</Link>
              {primaryCat && (<>
                <ChevronRight className="h-3 w-3 shrink-0" />
                <Link href={`/category/${primaryCat.slug}`} className="hover:text-[#111] transition-colors">{primaryCat.name}</Link>
              </>)}
              {primarySub && (<>
                <ChevronRight className="h-3 w-3 shrink-0" />
                <Link href={`/subcategory/${primarySub.slug}`} className="hover:text-[#111] transition-colors">{primarySub.name}</Link>
              </>)}
              <ChevronRight className="h-3 w-3 shrink-0" />
              <span className="text-[#111] font-semibold truncate max-w-[200px] sm:max-w-none">{product.name}</span>
            </nav>
          </div>
        </div>

        {/* ── MAIN GRID ─────────────────────────────── */}
        {/*
          Desktop: LEFT=sticky gallery  |  RIGHT=scrollable (all info + enquiry at bottom)
          Mobile:  stacked — gallery → info → enquiry
        */}
        <section className="py-8 md:py-10 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 ">
            <div className="lg:grid lg:grid-cols-2 lg:gap-10  lg:items-start">

              {/* ── LEFT: Sticky Gallery ── */}
              <div className="lg:sticky lg:top-28 mb-6 lg:mb-0">
                <ProductDetailGallery images={images} productName={product.name} />
              </div>

              {/* ── RIGHT: All Info + Enquiry ── */}
              <div className="flex flex-col gap-5">

                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  {tagInfo && (
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-heading font-bold border uppercase tracking-wider ${tagInfo.cls}`}>
                      <Star className="h-3 w-3" />{tagInfo.label}
                    </span>
                  )}
                  {categories.map((c) => (
                    <Link key={c.id} href={`/category/${c.slug}`}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-heading font-semibold bg-gray-100 text-gray-600 border border-gray-200 hover:bg-[#F5B400] hover:text-white hover:border-[#F5B400] transition-all">
                      <Tag className="h-3 w-3" />{c.name}
                    </Link>
                  ))}
                  {subCategories.map((s) => (
                    <Link key={s.id} href={`/subcategory/${s.slug}`}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-heading font-semibold bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-500 hover:text-white transition-all">
                      <Layers className="h-3 w-3" />{s.name}
                    </Link>
                  ))}
                </div>

                {/* Title + Short Description */}
                <div>
                  <h1 className="font-heading text-2xl sm:text-[1.85rem] md:text-3xl lg:text-[2rem] font-bold text-[#111111] leading-tight tracking-tight">
                    {product.name}
                  </h1>
                  {shortDesc && (
                    <p className="mt-3 text-gray-500 text-[14px] sm:text-[15px] leading-relaxed">{shortDesc}</p>
                  )}
                </div>

                {/* MOQ */}
                {product.moq && (
                  <div className="flex items-center gap-3 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#F5B400] flex items-center justify-center shrink-0 shadow-sm">
                      <Package className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-heading font-bold text-amber-600 uppercase tracking-wider">Minimum Order Quantity</p>
                      <p className="text-[17px] font-heading font-bold text-[#111111] mt-0.5">{product.moq}</p>
                    </div>
                  </div>
                )}

                {/* Product Specifications (full table) */}
                {specEntries.length > 0 && (
                  <DataTable
                    title={`${product.name} — Product Specifications`}
                    entries={specEntries}
                    accent
                  />
                )}

                {/* Trade Information (full table) */}
                {tradeEntries.length > 0 && (
                  <DataTable
                    title="Trade Information"
                    entries={tradeEntries}
                    accent={false}
                  />
                )}

                {/* Divider before enquiry */}
                <div className="border-t-2 border-dashed border-[#F5B400]/30 pt-1" />

                {/* ── Enquiry Form (always last) ── */}
                <StickyEnquiryBox
                  productId={product.id}
                  productName={product.name}
                  productSlug={product.slug}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── FULL DESCRIPTION ─────────────────────── */}
        {product.description && (
          <section className="py-10 md:py-14 bg-[#F8F8F8] border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-5xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-5 bg-[#F5B400] rounded-full" />
                  <h2 className="font-heading text-xl md:text-2xl font-bold text-[#111111]">
                    About {product.name}
                  </h2>
                </div>
                <div
                  className="prose prose-gray prose-sm sm:prose-base prose-headings:font-heading prose-headings:text-[#111111] prose-a:text-[#F5B400] prose-a:no-underline hover:prose-a:underline prose-strong:text-[#111111] max-w-none bg-white rounded-xl border border-gray-200 p-5 md:p-8 text-[14px] sm:text-[15px] leading-relaxed text-gray-700"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
            </div>
          </section>
        )}

        {/* ── RELATED PRODUCTS ─────────────────────── */}
        {relatedProducts.length > 0 && (
          <section className="py-10 md:py-14 bg-white border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <p className="text-[11px] font-heading font-bold text-[#F5B400] uppercase tracking-[0.25em] mb-1">More Products</p>
                  <h2 className="font-heading text-xl md:text-2xl font-bold text-[#111111]">
                    {primaryCat ? `More in ${primaryCat.name}` : "Related Products"}
                  </h2>
                </div>
                <Link href={primaryCat ? `/category/${primaryCat.slug}` : "/products"}
                  className="text-[13px] font-heading font-semibold text-[#F5B400] hover:underline underline-offset-2 hidden sm:block shrink-0">
                  View all →
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
                {relatedProducts.slice(0, 8).map((p, i) => (
                  <RelatedProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            </div>
          </section>
        )}

      </div>
    </>
  );
}
