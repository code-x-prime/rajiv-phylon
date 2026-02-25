"use client";

/** Static section – no API. Industries We Serve. */
const INDUSTRIES = [
  "Automotive",
  "Construction",
  "Packaging",
  "Agriculture",
  "Textiles",
  "Electronics",
];

export function IndustriesWeServe() {
  return (
    <section className="py-16 md:py-24 border-b border-[#e5e7eb] bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-[#111827] tracking-tight mb-10 text-center">
          Industries We Serve
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          {INDUSTRIES.map((name, i) => (
            <span
              key={i}
              className="px-6 py-3 rounded-full bg-white border border-[#e5e7eb] text-[#111827] font-medium hover:border-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/5 transition-colors"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
