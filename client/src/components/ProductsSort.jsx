"use client";

import { useRouter, useSearchParams } from "next/navigation";

const OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "name-asc", label: "Name A–Z" },
  { value: "name-desc", label: "Name Z–A" },
];

export function ProductsSort({ currentSort }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (e) => {
    const next = new URLSearchParams(searchParams?.toString() || "");
    next.set("sort", e.target.value);
    router.push(`/products?${next.toString()}`);
  };

  return (
    <label className="flex items-center gap-2">
      <span className="text-sm font-medium text-[#111827]">Sort</span>
      <select
        value={currentSort}
        onChange={handleChange}
        className="border border-[#e5e7eb] bg-[#ffffff] px-3 py-2 text-[#111827] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))]"
      >
        {OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </label>
  );
}
