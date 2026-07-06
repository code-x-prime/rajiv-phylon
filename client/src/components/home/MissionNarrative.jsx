"use client";

import { motion } from "framer-motion";

export function MissionNarrative() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-site mx-auto px-6 lg:px-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="type-overline text-[#F5B400] mb-4"
          >
            Our Mission
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="font-display font-medium text-[clamp(1.5rem,3vw,2.25rem)] text-foreground tracking-[-0.02em] leading-tight mb-8"
          >
            Bridging Indian Manufacturing Excellence<br />
            <span className="text-[#F5B400]">with International Performance Standards</span>
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="h-[2px] w-16 bg-[#F5B400] rounded-full mx-auto mb-8"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-lg md:text-xl text-muted font-body leading-relaxed"
          >
            At Rajiv Phylon, we don&apos;t just manufacture shoe soles; we provide the structural integrity that global brands depend on. Our mission is to bridge the gap between Indian manufacturing excellence and international performance standards. By integrating advanced polymer compounding with automated precision molding, we work alongside footwear brands to transform ambitious ideas into market-ready products.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
