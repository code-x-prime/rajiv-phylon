/**
 * Async server components — each fetches its own data independently.
 * Wrap each in <Suspense> in page.js so static sections render immediately
 * and only these dynamic sections show skeletons while loading.
 */
import { BannerSection } from "@/components/BannerSection";
import { ProductSlider } from "@/components/ProductSlider";
import { TopCategoriesSection } from "@/components/TopCategoriesSection";
import { InfrastructureSection } from "./InfrastructureSection";
import { HomeGallerySection } from "./HomeGallerySection";
import {
  getBanners,
  getCategoriesHome,
  getProductsFeatured,
  getProductsNewArrivals,
  getProductsHighDemand,
  getGallery,
} from "@/lib/api";

const noCache = { next: { revalidate: 0 } };

export async function BannersFetcher() {
  const banners = await getBanners({ isActive: true }).catch(() => []);
  return <BannerSection banners={banners} />;
}

export async function CategoriesFetcher() {
  const homeCategories = await getCategoriesHome(noCache).catch(() => []);
  if (!homeCategories?.length) return null;
  return <TopCategoriesSection categoriesWithSubs={homeCategories} />;
}

export async function FeaturedProductsFetcher() {
  const products = await getProductsFeatured(noCache).catch(() => []);
  if (!products?.length) return null;
  return <ProductSlider title="Featured Products" products={products} />;
}

export async function NewArrivalsFetcher() {
  const products = await getProductsNewArrivals(noCache).catch(() => []);
  if (!products?.length) return null;
  return <ProductSlider title="New Arrivals" products={products} showNewBadge />;
}

export async function HighDemandFetcher() {
  const products = await getProductsHighDemand(noCache).catch(() => []);
  if (!products?.length) return null;
  return <ProductSlider title="High Demand Products" products={products} />;
}

export async function GalleryFetcher() {
  const images = await getGallery({ section: "INFRASTRUCTURE" }).catch(() => []);
  return (
    <>
      <InfrastructureSection galleryImages={images} />
      <HomeGallerySection images={images} />
    </>
  );
}
