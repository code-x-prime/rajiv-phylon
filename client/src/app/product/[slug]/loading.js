export default function Loading() {
  return (
    <div className="bg-white min-h-screen overflow-x-hidden">

      {/* Breadcrumb */}
      <div className="bg-[#FAFAFA] border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2">
            {[40, 16, 60, 16, 80, 16, 140].map((w, i) => (
              <div key={i} className={`h-3 rounded-full bg-gray-200 animate-pulse`} style={{ width: w }} />
            ))}
          </div>
        </div>
      </div>

      {/* Main grid */}
      <section className="py-8 md:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_440px] xl:grid-cols-[1fr_480px] gap-8 lg:gap-12 xl:gap-16 items-start">

            {/* Gallery skeleton */}
            <div className="flex flex-col-reverse md:flex-row gap-3 lg:gap-4">
              <div className="flex md:flex-col gap-2 shrink-0">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-16 h-16 md:w-[78px] md:h-[78px] rounded-xl bg-gray-100 animate-pulse shrink-0" />
                ))}
              </div>
              <div className="flex-1 rounded-2xl bg-gray-100 animate-pulse" style={{ aspectRatio: "1/1" }} />
            </div>

            {/* Right panel skeleton */}
            <div className="space-y-5">
              {/* Badges */}
              <div className="flex gap-2">
                <div className="h-6 w-24 rounded-full bg-gray-100 animate-pulse" />
                <div className="h-6 w-20 rounded-full bg-gray-100 animate-pulse" />
              </div>
              {/* Title */}
              <div className="space-y-2">
                <div className="h-9 w-3/4 bg-gray-200 rounded-xl animate-pulse" />
                <div className="h-9 w-1/2 bg-gray-200 rounded-xl animate-pulse" />
                <div className="h-4 w-full bg-gray-100 rounded animate-pulse mt-3" />
                <div className="h-4 w-4/5 bg-gray-100 rounded animate-pulse" />
              </div>
              {/* MOQ */}
              <div className="h-14 rounded-xl bg-gray-100 animate-pulse" />
              {/* Spec cards */}
              <div className="rounded-xl border border-gray-100 overflow-hidden">
                <div className="h-10 bg-white border-b border-gray-100" />
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex justify-between px-4 py-3 border-b border-gray-50">
                    <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 w-28 bg-gray-100 rounded animate-pulse" />
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100" />
              {/* Enquiry box */}
              <div className="rounded-2xl border border-gray-100 overflow-hidden">
                <div className="h-16 bg-gray-800 animate-pulse" />
                <div className="h-12 bg-gray-50 animate-pulse" />
                <div className="p-5 space-y-4">
                  {/* Preset buttons */}
                  <div className="flex gap-2">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-7 w-14 rounded-full bg-gray-100 animate-pulse" />
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-10 rounded-xl bg-gray-100 animate-pulse" />
                    <div className="h-10 rounded-xl bg-gray-100 animate-pulse" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-10 rounded-xl bg-gray-100 animate-pulse" />
                    <div className="h-10 rounded-xl bg-gray-100 animate-pulse" />
                  </div>
                  <div className="h-10 rounded-xl bg-gray-100 animate-pulse" />
                  <div className="h-20 rounded-xl bg-gray-100 animate-pulse" />
                  <div className="h-12 rounded-xl bg-[#F5B400]/20 animate-pulse" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Description skeleton */}
      <div className="py-12 border-t border-gray-100 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="h-8 w-56 bg-gray-200 rounded-xl mb-8 animate-pulse" />
          <div className="bg-white rounded-2xl border border-gray-100 p-8 space-y-3">
            {[100, 95, 88, 92, 75, 85, 90].map((w, i) => (
              <div key={i} className="h-4 bg-gray-100 rounded animate-pulse" style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
