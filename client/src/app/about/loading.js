export default function Loading() {
  return (
    <div className="bg-white overflow-x-hidden">
      {/* Hero skeleton */}
      <div className="bg-[#0A0A0A] min-h-[62vh] flex items-end">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-28 w-full">
          <div className="h-3 w-24 bg-white/10 rounded-full mb-6 animate-pulse" />
          <div className="h-14 w-3/4 bg-white/10 rounded-xl mb-4 animate-pulse" />
          <div className="h-14 w-1/2 bg-white/10 rounded-xl mb-6 animate-pulse" />
          <div className="h-5 w-96 bg-white/10 rounded-full animate-pulse mb-10" />
          <div className="flex gap-4 mb-16">
            <div className="h-12 w-40 bg-[#F5B400]/20 rounded-xl animate-pulse" />
            <div className="h-12 w-36 bg-white/10 rounded-xl animate-pulse" />
          </div>
          <div className="border-t border-white/10 pt-10 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <div className="h-10 w-20 bg-white/10 rounded-lg mb-2 animate-pulse" />
                <div className="h-3 w-28 bg-white/10 rounded-full animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Story section skeleton */}
      <div className="py-28 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="h-3 w-20 bg-gray-200 rounded-full mb-3 animate-pulse" />
              <div className="h-12 w-5/6 bg-gray-200 rounded-xl mb-3 animate-pulse" />
              <div className="h-12 w-3/4 bg-gray-200 rounded-xl mb-7 animate-pulse" />
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-100 rounded-full mb-3 animate-pulse" style={{ width: `${90 - i * 8}%` }} />
              ))}
              <div className="mt-10 space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#F5B400]/20 shrink-0 mt-1 animate-pulse" />
                    <div className="h-4 bg-gray-100 rounded-full flex-1 animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4" style={{ gridTemplateRows: "240px 240px" }}>
              <div className="row-span-2 bg-gray-100 rounded-2xl animate-pulse" />
              <div className="bg-gray-100 rounded-2xl animate-pulse" />
              <div className="bg-gray-100 rounded-2xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Values grid skeleton */}
      <div className="py-28 bg-[#FAFAFA] border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="h-3 w-20 bg-gray-200 rounded-full mx-auto mb-3 animate-pulse" />
            <div className="h-10 w-64 bg-gray-200 rounded-xl mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200 rounded-3xl overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white p-9">
                <div className="w-12 h-12 bg-gray-100 rounded-xl mb-5 animate-pulse" />
                <div className="h-5 w-32 bg-gray-200 rounded-lg mb-3 animate-pulse" />
                <div className="h-4 bg-gray-100 rounded-full mb-2 animate-pulse" />
                <div className="h-4 bg-gray-100 rounded-full w-4/5 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
