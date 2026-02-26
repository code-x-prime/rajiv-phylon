"use client";

import { useMemo, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/ui/ProductCard";
import { ProductFiltersSidebar } from "./ProductFiltersSidebar";
import { CatalogEmptyState } from "./CatalogEmptyState";

const PER_PAGE = 12;

/* ── Pagination component ──────────────────────────── */
function Pagination({ page, totalPages, onPage }) {
  if (totalPages <= 1) return null;

  /* Build visible page numbers: first, last, and window around current */
  const pages = [];
  const delta = 1;
  const left = Math.max(2, page - delta);
  const right = Math.min(totalPages - 1, page + delta);

  pages.push(1);
  if (left > 2) pages.push("…");
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < totalPages - 1) pages.push("…");
  if (totalPages > 1) pages.push(totalPages);

  return (
    <div className="flex items-center justify-center gap-1.5 pt-10 mt-2 border-t border-gray-100">
      {/* Prev */}
      <button
        type="button"
        onClick={() => onPage(page - 1)}
        disabled={page === 1}
        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-[13px] font-heading font-semibold text-gray-600 hover:border-[#F5B400] hover:text-[#F5B400] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
        Prev
      </button>

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`ellipsis-${i}`} className="px-2 py-2 text-gray-400 text-[13px] select-none">…</span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPage(p)}
              className={`w-9 h-9 rounded-xl text-[13px] font-heading font-bold transition-all duration-200 ${p === page
                ? "bg-[#F5B400] text-white shadow-[0_2px_12px_rgba(245,180,0,0.4)]"
                : "bg-white border border-gray-200 text-gray-600 hover:border-[#F5B400] hover:text-[#F5B400]"
                }`}
              aria-label={`Page ${p}`}
              aria-current={p === page ? "page" : undefined}
            >
              {p}
            </button>
          )
        )}
      </div>

      {/* Next */}
      <button
        type="button"
        onClick={() => onPage(page + 1)}
        disabled={page === totalPages}
        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-[13px] font-heading font-semibold text-gray-600 hover:border-[#F5B400] hover:text-[#F5B400] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
        aria-label="Next page"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

/* ── Main component ────────────────────────────────── */
export function ProductsListingClient({ products = [], categoriesWithSubs = [] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const sort = searchParams?.get("sort") || "newest";
  const categorySlug = searchParams?.get("category") || "";
  const subcategorySlug = searchParams?.get("subcategory") || "";
  const searchQuery = (searchParams?.get("search") || "").trim().toLowerCase();
  const page = Math.max(1, parseInt(searchParams?.get("page") || "1", 10));

  /* Filter + sort */
  const filtered = useMemo(() => {
    let list = [...products];
    if (categorySlug) list = list.filter((p) => p.categories?.some((c) => c.slug === categorySlug));
    if (subcategorySlug) list = list.filter((p) => p.subCategories?.some((s) => s.slug === subcategorySlug));
    if (searchQuery) list = list.filter((p) =>
      p.name?.toLowerCase().includes(searchQuery) ||
      p.categories?.some((c) => c.name?.toLowerCase().includes(searchQuery)) ||
      p.subCategories?.some((s) => s.name?.toLowerCase().includes(searchQuery))
    );
    if (sort === "name-asc") list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    else if (sort === "name-desc") list.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
    else list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    return list;
  }, [products, categorySlug, subcategorySlug, sort, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const hasFilters = !!(categorySlug || subcategorySlug || sort !== "newest" || searchQuery);

  const goToPage = useCallback((p) => {
    const next = new URLSearchParams(searchParams?.toString() || "");
    if (p <= 1) next.delete("page");
    else next.set("page", String(p));
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: true });
  }, [pathname, router, searchParams]);

  /* When filters change, reset to page 1 */
  const activeCategory = categoriesWithSubs.find((c) => c.slug === categorySlug);

  return (
    <div className="flex flex-col gap-5">

      {/* Mobile: filter trigger + count */}
      <div className="flex items-center justify-between lg:hidden">
        <ProductFiltersSidebar
          categoriesWithSubs={categoriesWithSubs}
          productCount={filtered.length}
        />
        <span className="text-[13px] text-gray-400 font-body">
          {filtered.length} product{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="flex gap-8 xl:gap-10 items-start">

        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <ProductFiltersSidebar
            categoriesWithSubs={categoriesWithSubs}
            productCount={filtered.length}
          />
        </div>

        {/* Grid + pagination */}
        <div className="flex-1 min-w-0">

          {/* Result bar (desktop) */}
          <div className="hidden lg:flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
            <p className="text-[13px] font-body text-gray-500">
              Showing{" "}
              <span className="font-semibold text-[#111111]">
                {Math.min((safePage - 1) * PER_PAGE + 1, filtered.length)}–{Math.min(safePage * PER_PAGE, filtered.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-[#111111]">{filtered.length}</span>
              {activeCategory && (
                <> in <span className="font-semibold text-[#111111]">{activeCategory.name}</span></>
              )}
              {searchQuery && (
                <> matching &ldquo;<span className="font-semibold text-[#111111]">{searchQuery}</span>&rdquo;</>
              )}
            </p>
            {totalPages > 1 && (
              <p className="text-[13px] text-gray-400 font-body">
                Page {safePage} of {totalPages}
              </p>
            )}
          </div>

          {/* Empty state */}
          {filtered.length === 0 ? (
            <CatalogEmptyState
              title="No products found"
              description="Try adjusting or resetting the filters."
              showReset={hasFilters}
            />
          ) : (
            <>
              {/* Product grid — 2 col mobile (compact), 3 col tablet, 4 col desktop */}
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4 lg:gap-5">
                {paginated.map((p, i) => (
                  <ProductCard key={p.id} product={p} showBadge index={i} compactOnMobile />
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                page={safePage}
                totalPages={totalPages}
                onPage={goToPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
