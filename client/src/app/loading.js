import { BannerSkeleton, ProductSliderSkeleton } from "@/components/ui";
import { TopCategoriesSkeleton } from "@/components/TopCategoriesSection";

export default function Loading() {
  return (
    <div className="bg-white animate-pulse">
      <BannerSkeleton />
      {/* Company stats bar */}
      <div className="py-12 md:py-16 bg-[#111827]">
        <div className="max-w-7xl mx-auto px-4 flex justify-center gap-12">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 w-20 bg-white/10 rounded" />
          ))}
        </div>
      </div>
      <TopCategoriesSkeleton />
      <ProductSliderSkeleton />
      <ProductSliderSkeleton />
      <ProductSliderSkeleton />
      {/* Why Choose Us */}
      <div className="py-16 md:py-24 border-b border-[#e5e7eb]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-9 w-48 bg-[#e5e7eb] rounded mx-auto mb-10" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-[#e5e7eb] rounded-xl" />
            ))}
          </div>
        </div>
      </div>
      {/* Gallery */}
      <div className="py-16 border-b border-[#e5e7eb]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-9 w-40 bg-[#e5e7eb] rounded mb-8" />
          <div className="columns-2 md:columns-4 gap-6 space-y-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-[4/3] bg-[#e5e7eb] rounded-xl break-inside-avoid" />
            ))}
          </div>
        </div>
      </div>
      {/* CTA */}
      <div className="py-24 bg-[#111827]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="h-10 w-64 bg-white/10 rounded mx-auto mb-4" />
          <div className="h-6 w-96 bg-white/10 rounded mx-auto mb-8" />
          <div className="h-12 w-40 bg-white/10 rounded mx-auto" />
        </div>
      </div>
    </div>
  );
}
