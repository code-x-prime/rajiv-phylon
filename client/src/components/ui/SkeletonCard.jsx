export function SkeletonCard({ type = "product" }) {
  if (type === "product") {
    return (
      <div className="rounded-xl  border bg-white overflow-hidden animate-pulse">
        <div className="aspect-square bg-border" />
        <div className="p-5 border-t border space-y-2">
          <div className="h-3 bg-border rounded w-1/4" />
          <div className="h-4 bg-border rounded w-3/4" />
        </div>
      </div>
    );
  }
  if (type === "category") {
    return (
      <div className="rounded-xl  border bg-white overflow-hidden animate-pulse">
        <div className="aspect-[4/3] bg-border" />
        <div className="p-5 border-t border">
          <div className="h-5 bg-border rounded w-2/3" />
        </div>
      </div>
    );
  }
  if (type === "banner") {
    return (
      <div className="w-full aspect-[3/1] min-h-[200px] md:min-h-[280px] bg-border rounded-2xl animate-pulse" />
    );
  }
  return (
    <div className="rounded-xl  border bg-white overflow-hidden animate-pulse">
      <div className="aspect-square bg-border" />
      <div className="p-5 border-t border space-y-2">
        <div className="h-3 bg-border rounded w-1/4" />
        <div className="h-4 bg-border rounded w-3/4" />
      </div>
    </div>
  );
}
