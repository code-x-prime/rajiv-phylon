"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function HomeHero({ banners }) {
  const hasBanner = banners?.length > 0;
  const banner = hasBanner ? banners[0] : null;
  const desktopSrc = banner?.desktopImageUrl || banner?.desktopImage;
  const mobileSrc = banner?.mobileImageUrl || banner?.mobileImage;

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-white to-[#f8fafc] py-20 md:py-28 lg:py-32">
      <div className="max-w-site mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="order-2 lg:order-1"
          >
            <h1 className="font-display font-medium text-[clamp(2.5rem,5vw,4.5rem)] text-foreground tracking-[-0.03em] leading-[1.05]">
              <span className="block">Premium Industrial</span>
              <span className="block text-[#F5B400]">Solutions for Business</span>
            </h1>
            <p className="mt-6 text-muted text-lg md:text-xl max-w-lg leading-relaxed font-body">
              Quality B2B products and tailored solutions. Partner with us for reliability and scale.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F5B400] text-black font-display font-medium text-[13px] uppercase tracking-[0.1em] px-7 py-3.5 hover:bg-[#e0a300] hover:shadow-[0_8px_32px_rgba(245,180,0,0.35)] hover:-translate-y-0.5 transition-all duration-300"
              >
                Get in touch
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-xl border border-gray-200 text-foreground font-display font-medium text-[13px] uppercase tracking-[0.1em] px-7 py-3.5 hover:border-[#F5B400] hover:text-[#F5B400] transition-all duration-300"
              >
                View products
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            className="order-1 lg:order-2 relative aspect-[4/3] lg:aspect-square rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 shadow-xl"
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
              <div className="absolute inset-0 flex items-center justify-center text-muted font-display font-medium text-lg">
                <span>Industrial excellence</span>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
