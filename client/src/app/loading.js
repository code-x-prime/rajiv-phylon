import { BannerSkeleton } from "@/components/ui";

// Shown only during Next.js page navigation (route transition).
// Individual section skeletons are handled by Suspense boundaries inside page.js.
export default function Loading() {
  return (
    <div className="bg-white">
      <BannerSkeleton />
    </div>
  );
}
