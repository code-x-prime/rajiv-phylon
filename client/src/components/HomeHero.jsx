"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

export function HomeHero({ banners }) {
  const hasBanner = banners?.length > 0;
  const banner = hasBanner ? banners[0] : null;
  const desktopSrc = banner?.desktopImageUrl || banner?.desktopImage;
  const mobileSrc = banner?.mobileImageUrl || banner?.mobileImage;

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-white to-[#f8fafc] py-20 md:py-28 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="order-2 lg:order-1"
          >
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-[#111827] tracking-tight leading-[1.1]">
              <span className="block">Premium Industrial</span>
              <span className="block text-[hsl(var(--accent))]">Solutions for Business</span>
            </h1>
            <p className="mt-6 text-[#6b7280] text-lg md:text-xl max-w-lg leading-relaxed">
              Quality B2B products and tailored solutions. Partner with us for reliability and scale.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <PrimaryButton as={Link} href="/contact" size="lg">
                Get in touch
              </PrimaryButton>
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-heading font-semibold rounded-xl border-2 border-[#111827] text-[#111827] hover:bg-[#111827] hover:text-white transition-colors"
              >
                View products
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            className="order-1 lg:order-2 relative aspect-[4/3] lg:aspect-square rounded-2xl overflow-hidden border border-[#e5e7eb] bg-[#f8fafc] shadow-xl"
          >
            {hasBanner && (desktopSrc || mobileSrc) ? (
              <picture>
                <source media="(max-width: 768px)" srcSet={mobileSrc} />
                <img
                  src={desktopSrc || mobileSrc}
                  alt="Industrial solutions"
                  className="w-full h-full object-cover"
                />
              </picture>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-[#6b7280] font-medium text-lg">
                <span>Industrial excellence</span>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
