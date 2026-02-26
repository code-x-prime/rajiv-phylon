import { Suspense } from "react";
import { BannerSkeleton, ProductSliderSkeleton } from "@/components/ui";
import { TopCategoriesSkeleton } from "@/components/TopCategoriesSection";
import {
  CompanyStats,
  AboutSection,
  WhyChooseUs,
  GlobalPresenceSection,
  ExportCountries,
  ClientLogos,
  HomeCta,
} from "@/components/home";
import {
  BannersFetcher,
  CategoriesFetcher,
  FeaturedProductsFetcher,
  NewArrivalsFetcher,
  HighDemandFetcher,
  GalleryFetcher,
} from "@/components/home/HomeFetchComponents";

// Not async — page renders immediately.
// Each dynamic section fetches its own data; only that section shows a skeleton.
// Static sections (CompanyStats, WhyChooseUs, etc.) render with zero delay.
export default function HomePage() {
  return (
    <div className="bg-white">
      {/* 1. Hero Banner – shows BannerSkeleton only while banners load */}
      <Suspense fallback={<BannerSkeleton />}>
        <BannersFetcher />
      </Suspense>

      {/* 2. Company Stats – static, renders immediately */}
      <CompanyStats />

      {/* 3. Top Categories – shows TopCategoriesSkeleton only while loading */}
      <Suspense fallback={<TopCategoriesSkeleton />}>
        <CategoriesFetcher />
      </Suspense>

      {/* 4. Featured Products – shows ProductSliderSkeleton only while loading */}
      <Suspense fallback={<ProductSliderSkeleton />}>
        <FeaturedProductsFetcher />
      </Suspense>

      {/* 5. New Arrivals – shows ProductSliderSkeleton only while loading */}
      <Suspense fallback={<ProductSliderSkeleton />}>
        <NewArrivalsFetcher />
      </Suspense>

      {/* 6. High Demand Products – shows ProductSliderSkeleton only while loading */}
      <Suspense fallback={<ProductSliderSkeleton />}>
        <HighDemandFetcher />
      </Suspense>

      {/* 7. About – static */}
      <AboutSection />

      {/* 8. Why Choose Us – static */}
      <WhyChooseUs />

      {/* 9 & 10. Infrastructure + Gallery – shares gallery API data */}
      <Suspense fallback={<div className="py-16 bg-white" />}>
        <GalleryFetcher />
      </Suspense>

      {/* 11. Client Logos – static */}
      <ClientLogos />

      {/* 12. Global Presence – static */}
      <GlobalPresenceSection />

      {/* 13. Export Countries – static */}
      <ExportCountries />

      {/* 14. Global Enquiry CTA – static */}
      <HomeCta />
    </div>
  );
}
