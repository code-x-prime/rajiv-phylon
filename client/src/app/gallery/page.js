import { getGallery } from "@/lib/api";
import { GalleryGrid } from "@/components/GalleryGrid";
import { GalleryHero } from "@/components/gallery/GalleryHero";
import { Images } from "lucide-react";

export const metadata = {
  title: "Gallery | Rajiv Phylon",
  description: "Our infrastructure, manufacturing, and product gallery. Export-grade manufacturing showcase.",
};

// Build time par API call na ho (VPS par API often unavailable during build).
export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  let items = [];
  try {
    items = await getGallery();
  } catch (e) {
    console.error(e);
  }

  return (
    <div className="bg-white overflow-x-hidden">
      {/* Hero */}
      <GalleryHero count={items.length} />

      {/* Grid */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-5">
                <Images className="h-7 w-7 text-gray-400" />
              </div>
              <h3 className="font-heading font-bold text-xl text-[#111111] mb-2">No gallery items yet</h3>
              <p className="text-gray-500 font-body text-[15px]">
                Gallery images will appear here once added.
              </p>
            </div>
          ) : (
            <GalleryGrid items={items} />
          )}
        </div>
      </section>
    </div>
  );
}
