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
    <section className="py-16 md:py-24 border-b border-gray-100 bg-[#FAFAFA]">
      <div className="max-w-site mx-auto px-6 lg:px-10">
        <h2 className="font-display font-medium text-[clamp(1.75rem,3.5vw,2.75rem)] text-foreground tracking-[-0.02em] mb-10 text-center">
          Industries We Serve
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          {INDUSTRIES.map((name, i) => (
            <span
              key={i}
              className="px-6 py-3 rounded-full bg-white border border-gray-200 text-foreground font-display font-medium hover:border-[#F5B400] hover:bg-[#F5B400]/5 transition-colors"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
