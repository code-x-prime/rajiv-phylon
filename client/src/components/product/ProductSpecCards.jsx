"use client";

import Link from "next/link";
import { Tag, Layers, Calendar } from "lucide-react";

const TAG_LABELS = {
  NEW_ARRIVAL: "New Arrival",
  TRENDING:    "Trending / High Demand",
  BEST_SELLER: "Best Seller",
};

function SpecRow({ label, value, href }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-gray-100 last:border-0">
      <span className="text-[12px] font-heading font-semibold text-gray-400 uppercase tracking-wider shrink-0 w-28">
        {label}
      </span>
      {href ? (
        <Link
          href={href}
          className="text-[14px] font-body text-[#F5B400] font-medium text-right hover:underline underline-offset-2 transition-colors"
        >
          {value}
        </Link>
      ) : (
        <span className="text-[14px] font-body text-[#111111] font-medium text-right">{value}</span>
      )}
    </div>
  );
}

function formatDate(iso) {
  if (!iso) return null;
  try {
    return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(iso));
  } catch {
    return null;
  }
}

export function ProductSpecCards({ category, subcategory, allCategories = [], allSubcategories = [], createdAt, featureTag }) {
  const rows = [];

  if (category?.name) {
    rows.push({ label: "Category", value: category.name, href: `/category/${category.slug}` });
  }

  if (allCategories.length > 1) {
    const extra = allCategories.slice(1).map((c) => c.name).join(", ");
    if (extra) rows.push({ label: "Also in", value: extra });
  }

  if (subcategory?.name) {
    rows.push({ label: "Sub-category", value: subcategory.name, href: `/subcategory/${subcategory.slug}` });
  }

  if (allSubcategories.length > 1) {
    const extra = allSubcategories.slice(1).map((s) => s.name).join(", ");
    if (extra) rows.push({ label: "Also in", value: extra });
  }

  if (featureTag && TAG_LABELS[featureTag]) {
    rows.push({ label: "Tag", value: TAG_LABELS[featureTag] });
  }

  const addedDate = formatDate(createdAt);
  if (addedDate) rows.push({ label: "Added on", value: addedDate });

  if (rows.length === 0) return null;

  return (
    <div className="rounded-xl border border-gray-100 bg-[#FAFAFA] divide-y divide-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-white border-b border-gray-100">
        <Layers className="h-3.5 w-3.5 text-[#F5B400]" />
        <span className="text-[11px] font-heading font-bold text-gray-500 uppercase tracking-widest">Product Details</span>
      </div>
      {/* Rows */}
      <div className="px-4">
        {rows.map((row, i) => (
          <SpecRow key={i} label={row.label} value={row.value} href={row.href} />
        ))}
      </div>
    </div>
  );
}
