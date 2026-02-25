export default function Loading() {
  return (
    <div className="bg-white">
      <section className="border-b border bg-white">
        <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
          <div className="h-12 w-48 bg-border rounded animate-pulse" />
          <div className="mt-3 h-1.5 w-20 bg-border rounded-full animate-pulse" />
          <div className="mt-4 h-5 bg-border rounded w-full max-w-2xl animate-pulse" />
          <div className="mt-2 h-5 bg-border rounded w-full max-w-xl animate-pulse" />

          <div className="mt-12 columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="break-inside-avoid rounded-2xl overflow-hidden bg-border border aspect-[4/3] min-h-[200px] animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
