"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { PrimaryButton } from "@/components/ui";
import { AboutImageGrid } from "@/app/about/AboutImageGrid";

const TRUST_HIGHLIGHTS = [
  "State-of-the-art manufacturing with modern machinery and automated processes",
  "Strict quality control and compliance with international standards",
  "Bulk production capability to meet global demand and lead times",
  "Long-term OEM partnerships built on reliability and consistent delivery",
];

export function AboutSection() {
  return (
    <section className="py-12 md:py-16  border-b border bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="max-w-3xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-foreground tracking-tight"
            >
              A Global Leader in High-Performance Polymer Footwear Soles
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.05, ease: "easeOut" }}
              className="mt-6 text-muted text-base md:text-lg leading-relaxed font-body"
            >
              Rajiv Phylon is a premium manufacturer of high-performance polymer shoe soles for the global footwear industry. We operate at scale with modern machinery, rigorous quality systems, and a commitment to international standards—serving OEM and B2B partners who demand reliability, consistency, and long-term supply security.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
              className="mt-4 text-muted text-base md:text-lg leading-relaxed font-body"
            >
              Our facility is built for bulk production without compromising on quality. From raw material to finished sole, every step is controlled and traceable. We invest in technology and people to deliver export-grade products that meet the strictest specifications.
            </motion.p>

            <ul className="mt-8 md:mt-10 space-y-3 md:space-y-4">
              {TRUST_HIGHLIGHTS.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.1 + i * 0.05, ease: "easeOut" }}
                  className="flex items-start gap-3 font-body text-foreground"
                >
                  <span className="mt-1 shrink-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary-foreground" strokeWidth={2.5} />
                  </span>
                  <span className="text-sm md:text-[15px] leading-relaxed">{item}</span>
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.25, ease: "easeOut" }}
              className="mt-8 md:mt-10"
            >
              <PrimaryButton as={Link} href="/contact" size="lg">
                Partner With Us
              </PrimaryButton>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative mt-12 lg:mt-0"
          >
            <AboutImageGrid />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
