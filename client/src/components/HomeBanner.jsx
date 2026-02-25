"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function HomeBanner({ banners }) {
  if (!banners?.length) return null;

  const banner = banners[0];
  const desktopSrc = banner.desktopImageUrl || banner.desktopImage;
  const mobileSrc = banner.mobileImageUrl || banner.mobileImage;
  const Wrapper = banner.link ? Link : "div";
  const wrapperProps = banner.link ? { href: banner.link } : {};

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full aspect-[3/1] min-h-[200px] md:min-h-[280px] relative bg-card border-b border-border overflow-hidden"
    >
      <Wrapper {...wrapperProps} className="block w-full h-full">
        <picture>
          <source media="(max-width: 768px)" srcSet={mobileSrc} />
          <img
            src={desktopSrc}
            alt={banner.title}
            className="w-full h-full object-cover"
            sizes="100vw"
            priority
          />
        </picture>
      </Wrapper>
    </motion.section>
  );
}
