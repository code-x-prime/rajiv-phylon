import {
  getBanners,
  getCategoriesHome,
  getProductsFeatured,
  getProductsNewArrivals,
  getProductsHighDemand,
  getGallery,
} from "./api";

/**
 * Fetch all home page data in one Promise.all (server-side only).
 * Pass the result as props to the home page. Do not fetch in client components.
 * Empty sections should be hidden (API returns empty array).
 */
// Fresh fetch for home so admin changes (New Arrival, Featured, etc.) show without cache delay
const homeFetchOpts = { next: { revalidate: 0 } };

export async function getHomePageData() {
  const [
    banners,
    homeCategories,
    featuredProducts,
    newArrivals,
    highDemandProducts,
    galleryInfrastructure,
  ] = await Promise.all([
    getBanners({ isActive: true }).catch(() => []),
    getCategoriesHome(homeFetchOpts).catch(() => []),
    getProductsFeatured(homeFetchOpts).catch(() => []),
    getProductsNewArrivals(homeFetchOpts).catch(() => []),
    getProductsHighDemand(homeFetchOpts).catch(() => []),
    getGallery({ section: "INFRASTRUCTURE" }).catch(() => []),
  ]);

  return {
    banners,
    homeCategories,
    featuredProducts,
    newArrivals,
    highDemandProducts,
    galleryInfrastructure,
  };
}
