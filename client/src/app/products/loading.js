export default function Loading() {
  return (
    <div className="bg-white min-h-screen overflow-x-hidden">

      {/* Hero skeleton */}
      <div className="bg-[#0A0A0A] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-5">
            <div className="h-3 w-10 bg-white/10 rounded-full animate-pulse" />
            <div className="h-3 w-4 bg-white/10 rounded-full animate-pulse" />
            <div className="h-3 w-16 bg-white/10 rounded-full animate-pulse" />
          </div>
          <div className="h-3 w-24 bg-[#F5B400]/20 rounded-full mb-4 animate-pulse" />
          <div className="h-14 w-1/2 bg-white/10 rounded-xl mb-4 animate-pulse" />
          <div className="h-4 w-96 bg-white/10 rounded-full mb-8 animate-pulse" />
          <div className="h-9 w-44 bg-white/10 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Listing skeleton */}
      <div className="max-w-7xl mx-auto py-10 md:py-14 px-4 sm:px-6 lg:px-8">

        {/* Mobile filter bar */}
        <div className="flex items-center justify-between lg:hidden mb-5">
          <div className="h-10 w-28 rounded-xl bg-gray-200 animate-pulse" />
          <div className="h-4 w-20 rounded-full bg-gray-100 animate-pulse" />
        </div>

        <div className="flex gap-8 xl:gap-10 items-start">

          {/* Desktop sidebar */}
          <div className="hidden lg:block w-[260px] xl:w-[280px] shrink-0">
            <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5 space-y-6 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="h-5 w-20 rounded bg-gray-200" />
              </div>
              {/* Sort */}
              <div className="space-y-3">
                <div className="h-3 w-14 rounded-full bg-gray-200" />
                <div className="flex flex-wrap gap-2">
                  {[60, 80, 80].map((w, i) => (
                    <div key={i} className={`h-7 w-${w === 60 ? '16' : '20'} rounded-full bg-gray-100`} />
                  ))}
                </div>
              </div>
              {/* Category */}
              <div className="space-y-3">
                <div className="h-3 w-18 rounded-full bg-gray-200" />
                <div className="flex flex-wrap gap-2">
                  {[40, 60, 70, 50].map((_, i) => (
                    <div key={i} className="h-7 rounded-full bg-gray-100 w-16" />
                  ))}
                </div>
              </div>
              <div className="h-px bg-gray-100" />
              <div className="flex items-center justify-between">
                <div className="h-4 w-20 rounded-full bg-gray-100" />
              </div>
            </div>
          </div>

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            {/* Result bar */}
            <div className="hidden lg:flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
              <div className="h-4 w-48 bg-gray-200 rounded-full animate-pulse" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-gray-100 bg-white overflow-hidden animate-pulse shadow-sm">
                  {/* Image — aspect-[4/5] */}
                  <div className="bg-gray-100" style={{ aspectRatio: "4/5" }} />
                  {/* Content */}
                  <div className="px-4 pt-3.5 pb-4 space-y-2.5">
                    <div className="h-2.5 w-16 bg-gray-100 rounded-full" />
                    <div className="h-4 w-full bg-gray-200 rounded" />
                    <div className="h-4 w-4/5 bg-gray-200 rounded" />
                    <div className="h-9 w-full bg-gray-100 rounded-xl mt-1" />
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination skeleton */}
            <div className="flex items-center justify-center gap-2 pt-10 mt-2 border-t border-gray-100">
              <div className="h-9 w-20 rounded-xl bg-gray-200 animate-pulse" />
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-9 w-9 rounded-xl bg-gray-100 animate-pulse" />
              ))}
              <div className="h-9 w-20 rounded-xl bg-gray-200 animate-pulse" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
