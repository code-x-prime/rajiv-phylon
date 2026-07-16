"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Zap, Layers, Blend } from "lucide-react";

const SEGMENTS = [
  {
    icon: Zap,
    name: "PHYLON",
    subtitle: "Compressed EVA",
    tagline: "Ultralight. High-Rebound.",
    description: "The benchmark for athletic performance.",
    gradient: "from-[#0f2027] to-[#203a43]",
    image: "/core-tech/phylon.jpg",
    prompt: "Close-up of white compressed EVA phylon sole being manufactured in industrial mold, showing cellular texture and premium finish, factory lighting, product photography",
  },
  {
    icon: Layers,
    name: "EVA",
    subtitle: "Injection Molding",
    tagline: "Versatile cushioning",
    description: "Zero-defect consistency for high-volume ranges.",
    gradient: "from-[#1a1a2e] to-[#16213e]",
    image: "/core-tech/eva.jpg",
    prompt: "Injection molded EVA foam sole in production, showing smooth surface finish and precise edges, industrial manufacturing environment, close-up product shot",
  },
  {
    icon: Blend,
    name: "HYBRID CO-MOLDING",
    subtitle: "EVA + TPR",
    tagline: "Dual-density molecular bonding.",
    description: "Superior grip meets featherlight comfort.",
    gradient: "from-[#1c1c1c] to-[#3a2012]",
    image: "/core-tech/hybrid.jpg",
    prompt: "Hybrid dual-density sole combining EVA and TPR materials, showing two-tone color layers and professional finish, premium footwear component photography",
  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export function CoreTechnology() {
  return (
    <section className="py-10 md:py-16 bg-[#FAFAFA]">
      <div className="max-w-site mx-auto px-6 lg:px-10">

        {/* Header */}
        <div className="mb-12 md:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="type-overline text-[#F5B400] mb-4"
          >
            Core Technology
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="font-display font-medium text-[clamp(1.75rem,3.5vw,2.75rem)] text-foreground tracking-[-0.02em] leading-tight mb-2"
          >
            The Materials <span className="text-[#F5B400]">That Define Performance</span>
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0, originX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-1.5 h-[2px] w-16 bg-[#F5B400] rounded-full mb-6"
          />
        </div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {SEGMENTS.map((seg) => {
            const Icon = seg.icon;
            return (
              <motion.div
                key={seg.name}
                variants={cardVariants}
                className="group relative"
              >
                <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${seg.gradient} p-8 md:p-10 h-full transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)]`}>
                  {/* Image Background */}
                  <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500">
                    <Image
                      src={seg.image}
                      alt={seg.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>

                  {/* Accent bar */}
                  <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#F5B400] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-[#F5B400]/10 border border-[#F5B400]/20 flex items-center justify-center mb-6 group-hover:bg-[#F5B400] group-hover:border-[#F5B400] transition-all duration-500 relative z-10">
                    <Icon className="h-5 w-5 text-[#F5B400] group-hover:text-white transition-colors duration-500" />
                  </div>

                  {/* Name + subtitle */}
                  <h3 className="font-display font-medium text-xl md:text-2xl text-white tracking-[-0.02em] mb-1 relative z-10">
                    {seg.name}
                  </h3>
                  <p className="type-overline text-[#F5B400] mb-4 relative z-10">{seg.subtitle}</p>

                  {/* Tagline */}
                  <p className="font-display font-medium text-[15px] text-white/80 mb-2 leading-snug relative z-10">
                    {seg.tagline}
                  </p>

                  {/* Description */}
                  <p className="text-[14px] text-white/45 font-body leading-relaxed relative z-10">
                    {seg.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
