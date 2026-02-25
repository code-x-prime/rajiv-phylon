import { SkeletonCard } from "./SkeletonCard";

export function ProductSliderSkeleton() {
  return (
    <section className="py-16 md:py-24 border-b border bg-section-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-8 w-48 bg-border rounded animate-pulse mb-8 border-b border pb-3" />
        <div className="flex gap-6 overflow-hidden pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex-shrink-0 w-[280px] sm:w-[300px]">
              <SkeletonCard type="product" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
