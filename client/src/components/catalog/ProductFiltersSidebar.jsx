"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X, RotateCcw, ChevronDown } from "lucide-react";

const SORT_OPTIONS = [
  { value: "newest",    label: "Newest first" },
  { value: "name-asc",  label: "Name A → Z" },
  { value: "name-desc", label: "Name Z → A" },
];

function Pill({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3.5 py-1.5 rounded-full text-[13px] font-heading font-semibold border transition-all duration-150 whitespace-nowrap ${
        active
          ? "bg-[#F5B400] border-[#F5B400] text-white shadow-sm"
          : "bg-white border-gray-200 text-gray-600 hover:border-[#F5B400] hover:text-[#F5B400]"
      }`}
    >
      {children}
    </button>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="text-[11px] font-heading font-bold text-gray-400 uppercase tracking-[0.18em] mb-3">
      {children}
    </p>
  );
}

export function ProductFiltersSidebar({ categoriesWithSubs = [], productCount }) {
  const router      = useRouter();
  const pathname    = usePathname();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sort            = searchParams?.get("sort")        || "newest";
  const categorySlug    = searchParams?.get("category")    || "";
  const subcategorySlug = searchParams?.get("subcategory") || "";
  const hasFilters      = !!(categorySlug || subcategorySlug || sort !== "newest");

  const filterCount =
    (categorySlug ? 1 : 0) + (subcategorySlug ? 1 : 0) + (sort !== "newest" ? 1 : 0);

  const updateParams = useCallback(
    (updates) => {
      const next = new URLSearchParams(searchParams?.toString() || "");
      next.delete("page"); // Reset to page 1 on filter change
      Object.entries(updates).forEach(([key, value]) => {
        if (value == null || value === "") next.delete(key);
        else next.set(key, value);
      });
      const qs = next.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const handleCategory    = (slug) => { updateParams({ category: slug || undefined, subcategory: undefined }); setMobileOpen(false); };
  const handleSubcategory = (slug) => { updateParams({ subcategory: slug || undefined }); setMobileOpen(false); };
  const handleSort        = (val)  => { updateParams({ sort: val === "newest" ? undefined : val }); setMobileOpen(false); };
  const handleReset       = () => { setMobileOpen(false); const next = new URLSearchParams(); router.push(pathname, { scroll: false }); };

  const selectedCategory = categoriesWithSubs.find((c) => c.slug === categorySlug);
  const subcategories    = selectedCategory?.subCategories || [];

  function FilterContent({ onClose }) {
    return (
      <div className="space-y-6">
        {/* Sort */}
        <div>
          <SectionLabel>Sort by</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {SORT_OPTIONS.map((opt) => (
              <Pill key={opt.value} active={sort === opt.value} onClick={() => { handleSort(opt.value); onClose?.(); }}>
                {opt.label}
              </Pill>
            ))}
          </div>
        </div>

        {/* Category */}
        <div>
          <SectionLabel>Category</SectionLabel>
          <div className="flex flex-wrap gap-2">
            <Pill active={!categorySlug} onClick={() => { handleCategory(""); onClose?.(); }}>All</Pill>
            {categoriesWithSubs.map((c) => (
              <Pill key={c.id} active={categorySlug === c.slug} onClick={() => { handleCategory(c.slug); onClose?.(); }}>
                {c.name}
              </Pill>
            ))}
          </div>
        </div>

        {/* Subcategory */}
        {subcategories.length > 0 && (
          <div>
            <SectionLabel>Sub-category</SectionLabel>
            <div className="flex flex-wrap gap-2">
              <Pill active={!subcategorySlug} onClick={() => { handleSubcategory(""); onClose?.(); }}>All</Pill>
              {subcategories.map((s) => (
                <Pill key={s.id} active={subcategorySlug === s.slug} onClick={() => { handleSubcategory(s.slug); onClose?.(); }}>
                  {s.name}
                </Pill>
              ))}
            </div>
          </div>
        )}

        {/* Footer: count + reset */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="text-[13px] text-gray-400 font-body tabular-nums">
            {productCount ?? 0} product{productCount !== 1 ? "s" : ""}
          </span>
          {hasFilters && (
            <button
              type="button"
              onClick={() => { handleReset(); onClose?.(); }}
              className="flex items-center gap-1.5 text-[13px] font-heading font-semibold text-gray-500 hover:text-[#F5B400] transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset all
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ── Desktop sticky sidebar ───────────────────────── */}
      <aside className="hidden lg:block w-[260px] xl:w-[280px] shrink-0 lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-heading font-bold text-[#111111] text-[14px] flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-[#F5B400]" />
              Filters
              {filterCount > 0 && (
                <span className="ml-0.5 h-5 min-w-[20px] px-1.5 rounded-full bg-[#F5B400] text-white text-[10px] font-bold flex items-center justify-center">
                  {filterCount}
                </span>
              )}
            </h3>
            {hasFilters && (
              <button
                type="button"
                onClick={handleReset}
                className="text-[12px] font-heading font-semibold text-[#F5B400] hover:underline underline-offset-2"
              >
                Clear all
              </button>
            )}
          </div>
          <FilterContent />
        </div>
      </aside>

      {/* ── Mobile trigger button ─────────────────────────── */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-[13px] font-heading font-semibold text-[#111111] shadow-sm hover:border-[#F5B400] hover:text-[#F5B400] transition-all duration-200"
        >
          <SlidersHorizontal className="h-4 w-4 text-[#F5B400]" />
          Filters
          {filterCount > 0 && (
            <span className="h-5 min-w-[20px] px-1.5 rounded-full bg-[#F5B400] text-white text-[10px] font-bold flex items-center justify-center">
              {filterCount}
            </span>
          )}
          <ChevronDown className="h-3.5 w-3.5 text-gray-400 ml-auto" />
        </button>

        {/* ── Mobile drawer with Framer Motion ─────────────── */}
        <AnimatePresence>
          {mobileOpen && (
            <div className="fixed inset-0 z-50">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setMobileOpen(false)}
              />

              {/* Drawer slides from left */}
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="absolute left-0 top-0 h-full w-full max-w-[320px] bg-white shadow-2xl flex flex-col"
              >
                {/* Drawer header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
                  <h3 className="font-heading font-bold text-[#111111] flex items-center gap-2 text-[15px]">
                    <SlidersHorizontal className="h-4 w-4 text-[#F5B400]" />
                    Filters
                    {filterCount > 0 && (
                      <span className="h-5 px-1.5 rounded-full bg-[#F5B400] text-white text-[10px] font-bold flex items-center justify-center">
                        {filterCount}
                      </span>
                    )}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-[#111111] transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Drawer content */}
                <div className="flex-1 overflow-y-auto p-5">
                  <FilterContent onClose={() => setMobileOpen(false)} />
                </div>

                {/* Drawer footer */}
                <div className="px-5 py-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    className="w-full rounded-xl bg-[#111111] text-white font-heading font-bold text-sm py-3 hover:bg-[#F5B400] transition-colors duration-200"
                  >
                    Show {productCount ?? 0} products
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
