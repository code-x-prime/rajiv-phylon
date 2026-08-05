import { Suspense } from "react";
import dynamic from "next/dynamic";
import { BannerSkeleton, ProductSliderSkeleton } from "@/components/ui";
import { TopCategoriesSkeleton } from "@/components/TopCategoriesSection";
import {
  BannersFetcher,
  CategoriesFetcher,
  FeaturedProductsFetcher,
  NewArrivalsFetcher,
  HighDemandFetcher,
  GalleryFetcher,
} from "@/components/home/HomeFetchComponents";

/* Lazy-load heavy below-fold components (code-split + deferred) */
const CompanyStats = dynamic(() => import("@/components/home").then(m => m.CompanyStats), { ssr: true });
const CoreTechnology = dynamic(() => import("@/components/home").then(m => m.CoreTechnology), { ssr: true });
const ClientLogos = dynamic(() => import("@/components/home").then(m => m.ClientLogos), { ssr: true });
const VideoCarousel = dynamic(() => import("@/components/home").then(m => m.VideoCarousel), { ssr: false });
const AboutSection = dynamic(() => import("@/components/home").then(m => m.AboutSection), { ssr: true });
const MissionNarrative = dynamic(() => import("@/components/home").then(m => m.MissionNarrative), { ssr: true });
const WhyChooseUs = dynamic(() => import("@/components/home").then(m => m.WhyChooseUs), { ssr: true });
const GlobalPresenceSection = dynamic(() => import("@/components/home").then(m => m.GlobalPresenceSection), { ssr: true });
const MakeInIndiaSection = dynamic(() => import("@/components/home").then(m => m.MakeInIndiaSection), { ssr: true });
const ExportCountries = dynamic(() => import("@/components/home").then(m => m.ExportCountries), { ssr: true });
const HomeCta = dynamic(() => import("@/components/home").then(m => m.HomeCta), { ssr: true });

export const dynamic_route = "force-dynamic";

export default function HomePage() {
  return (
    <div className="bg-white">
      <Suspense fallback={<BannerSkeleton />}>
        <BannersFetcher />
      </Suspense>

      <CompanyStats />

      <VideoCarousel />

      <CoreTechnology />

      <ClientLogos />

      <Suspense fallback={<TopCategoriesSkeleton />}>
        <CategoriesFetcher />
      </Suspense>

      <Suspense fallback={<ProductSliderSkeleton />}>
        <FeaturedProductsFetcher />
      </Suspense>

      <Suspense fallback={<ProductSliderSkeleton />}>
        <NewArrivalsFetcher />
      </Suspense>

      <Suspense fallback={<ProductSliderSkeleton />}>
        <HighDemandFetcher />
      </Suspense>

      <AboutSection />

      <MissionNarrative />

      <WhyChooseUs />

      <Suspense fallback={<div className="py-16 bg-white" />}>
        <GalleryFetcher />
      </Suspense>

      <GlobalPresenceSection />

      <MakeInIndiaSection />

      <ExportCountries />

      <HomeCta />
    </div>
  );
}
