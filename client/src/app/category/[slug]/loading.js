export default function Loading() {
  return (
    <div className="bg-white min-h-screen overflow-x-hidden">
      {/* Hero skeleton */}
      <div className="bg-[#0A0A0A] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-3 w-10 bg-white/10 rounded-full animate-pulse" />
            <div className="h-3 w-16 bg-white/10 rounded-full animate-pulse" />
            <div className="h-3 w-20 bg-white/10 rounded-full animate-pulse" />
          </div>
          <div className="h-3 w-20 bg-[#F5B400]/30 rounded-full mb-4 animate-pulse" />
          <div className="h-14 w-2/3 bg-white/10 rounded-xl mb-4 animate-pulse" />
          <div className="h-4 w-96 bg-white/10 rounded-full mb-8 animate-pulse" />
          <div className="h-9 w-36 bg-white/10 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="max-w-7xl mx-auto py-14 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="h-7 w-40 bg-gray-200 rounded-xl animate-pulse" />
          <div className="h-4 w-16 bg-gray-100 rounded-full animate-pulse" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="rounded-2xl bg-white border border-gray-100 overflow-hidden shadow-sm animate-pulse">
              <div className="aspect-[4/3] bg-gray-100" />
              <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <div className="h-4 w-24 bg-gray-200 rounded mb-1.5" />
                  <div className="h-3 w-16 bg-gray-100 rounded" />
                </div>
                <div className="w-8 h-8 bg-gray-100 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
