export default function Loading() {
  return (
    <div className="bg-white min-h-screen overflow-x-hidden">
      {/* Hero skeleton */}
      <div className="bg-[#0A0A0A] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-6">
            {[32, 40, 28, 36, 48].map((w, i) => (
              <div key={i} className="flex items-center gap-1.5">
                {i > 0 && <div className="h-2.5 w-2.5 bg-white/10 rounded-full animate-pulse" />}
                <div className={`h-3 w-${w === 32 ? '8' : w === 40 ? '10' : w === 28 ? '7' : w === 36 ? '9' : '12'} bg-white/10 rounded-full animate-pulse`} />
              </div>
            ))}
          </div>
          <div className="h-3 w-24 bg-[#F5B400]/30 rounded-full mb-4 animate-pulse" />
          <div className="h-14 w-1/2 bg-white/10 rounded-xl mb-4 animate-pulse" />
          <div className="h-4 w-80 bg-white/10 rounded-full mb-8 animate-pulse" />
          <div className="h-9 w-32 bg-white/10 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Products grid skeleton */}
      <div className="max-w-7xl mx-auto py-14 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="h-7 w-32 bg-gray-200 rounded-xl animate-pulse" />
          <div className="h-4 w-16 bg-gray-100 rounded-full animate-pulse" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="rounded-2xl bg-white border border-gray-100 overflow-hidden shadow-sm animate-pulse">
              <div className="aspect-square bg-gray-100" />
              <div className="p-4 border-t border-gray-100 space-y-2.5">
                <div className="h-3 w-16 bg-gray-100 rounded" />
                <div className="h-4 w-full bg-gray-200 rounded" />
                <div className="h-4 w-4/5 bg-gray-200 rounded" />
                <div className="h-9 w-full bg-gray-100 rounded-xl mt-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
