import { getHomePageData } from "@/lib/home-data";
import { BannerSection } from "@/components/BannerSection";
import { ProductSlider } from "@/components/ProductSlider";
import { TopCategoriesSection } from "@/components/TopCategoriesSection";
import {
  CompanyStats,
  AboutSection,
  WhyChooseUs,
  InfrastructureSection,
  GlobalPresenceSection,
  ExportCountries,
  ClientLogos,
  HomeCta,
} from "@/components/home";
import { HomeGallerySection } from "@/components/home/HomeGallerySection";

export default async function HomePage() {
  const data = await getHomePageData();
  const {
    banners,
    homeCategories,
    featuredProducts,
    newArrivals,
    highDemandProducts,
    galleryInfrastructure,
  } = data;

  return (
    <div className="bg-white">
      {/* 1. Hero Banner – API se aaye to image only; nahi to fallback (desk/mobile banner) */}
      <BannerSection banners={banners || []} />

      {/* 2. Company Stats – static */}
      <CompanyStats />

      {/* 3. Top Categories with subcategories – dynamic, hide if empty */}
      {homeCategories?.length > 0 ? (
        <TopCategoriesSection categoriesWithSubs={homeCategories} />
      ) : null}

      {/* 4. Featured Products – dynamic, hide if empty */}
      {featuredProducts?.length > 0 ? (
        <ProductSlider title="Featured Products" products={featuredProducts} />
      ) : null}

      {/* 5. New Arrivals – dynamic, hide if empty */}
      {newArrivals?.length > 0 ? (
        <ProductSlider title="New Arrivals" products={newArrivals} showNewBadge />
      ) : null}

      {/* 6. High Demand Products – dynamic, hide if empty */}
      {highDemandProducts?.length > 0 ? (
        <ProductSlider title="High Demand Products" products={highDemandProducts} />
      ) : null}

      {/* 7. About – premium B2B corporate section */}
      <AboutSection />

      {/* 8. Why Choose Us – static */}
      <WhyChooseUs />

      {/* 9. Advanced Manufacturing Infrastructure – text left, image grid right */}
      <InfrastructureSection galleryImages={galleryInfrastructure || []} />

      {/* 10. Factory Gallery – bento grid desktop, horizontal scroll mobile */}
      <HomeGallerySection images={galleryInfrastructure || []} />

      {/* 11. Client Logos – static */}
      <ClientLogos />

      {/* 12. Global Presence – headline, paragraph, stats */}
      <GlobalPresenceSection />

      {/* 13. Export Countries – static */}
      <ExportCountries />

      {/* 14. Global Enquiry CTA – static */}
      <HomeCta />

    </div>
  );
}
