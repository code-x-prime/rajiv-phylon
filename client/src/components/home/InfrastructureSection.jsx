"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";

const POINTS = [
  {
    title: "Modern machinery",
    text: "State-of-the-art equipment and automated processes drive consistency and output. Our production lines are built for precision at scale.",
  },
  {
    title: "Organized workflow",
    text: "Structured processes from raw material to finished sole ensure efficiency and traceability. Every step is defined, measured, and controlled.",
  },
  {
    title: "Skilled workforce",
    text: "Trained teams with deep experience in polymer manufacturing. We invest in people to maintain the standards our partners depend on.",
  },
  {
    title: "Capacity for high-volume orders",
    text: "Scaled infrastructure to fulfil bulk and OEM commitments. We are equipped to support your growth and delivery timelines.",
  },
  {
    title: "Quality assurance labs",
    text: "Dedicated QA facilities and in-process checks ensure every batch meets specifications. International standards and documentation underpin our output.",
  },
];

/* Static images for Advanced Manufacturing Infrastructure section */
const INFRASTRUCTURE_IMAGES = [
  { imageUrl: "/high-capacity-manufacturing-infrastructure.png", title: "Infrastructure", alt: "High capacity manufacturing infrastructure" },
  { imageUrl: "/automated-footwear-production-workflow.png", title: "Workflow", alt: "Organized automated footwear production workflow" },
  { imageUrl: "/skilled-workforce-polymer-manufacturing.png", title: "Workforce", alt: "Skilled workforce in polymer manufacturing" },
];

/* 2×2 bento grid with a tall left item + 3 smaller items */
function ImageGrid({ images }) {
  const list = Array.isArray(images) && images.length > 0 ? images.slice(0, 4) : INFRASTRUCTURE_IMAGES;
  const filled = [
    list[0] || null,
    list[1] || null,
    list[2] || null,
    list[3] || null,
  ];

  function Item({ item, className = "", priority = false }) {
    const hasImage = item && (item.imageUrl || item.image);
    const src = item?.imageUrl || item?.image;
    const alt = item?.alt || item?.title || "Infrastructure";
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className={`group relative overflow-hidden rounded-2xl bg-[#F0F0F0] border border-gray-200 ${className}`}
      >
        {hasImage && src ? (
          <div className="relative w-full h-full">
            <Image
              src={src}
              alt={alt}
              fill
              className="object-cover group-hover:scale-[1.06] transition-transform duration-700 ease-out"
              sizes={className.includes("row-span-2") ? "(max-width: 1024px) 50vw, 45vw" : "(max-width: 1024px) 50vw, 22vw"}
              priority={priority}
            />
          </div>
        ) : (
          /* Premium placeholder */
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="w-8 h-8 rounded-lg border-2 border-gray-300 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-400">
                <rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
                <rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
                <rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
                <rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>
            <span className="text-[11px] font-heading font-semibold text-gray-400 uppercase tracking-wider">
              {item?.title || "Infrastructure"}
            </span>
          </div>
        )}
        {/* Subtle dark overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-400" aria-hidden />
        {/* Yellow corner accent */}
        <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-[#F5B400] group-hover:w-full transition-all duration-500 ease-out" aria-hidden />
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-3 lg:gap-4 h-[420px] md:h-[500px] lg:h-[540px]">
      {/* Top-left tall: spans 2 rows — first visible tall image gets priority */}
      <Item item={filled[0]} className="row-span-2" priority />
      {/* Top-right */}
      <Item item={filled[1]} />
      {/* Bottom-right top */}
      <Item item={filled[2]} />
    </div>
  );
}

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const listItemVariants = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export function InfrastructureSection({ galleryImages = [] }) {
  return (
    <section className="py-12 md:py-16  bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left — text content */}
          <div>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-[11px] font-heading font-bold text-[#F5B400] uppercase tracking-[0.25em] mb-3"
            >
              Our facility
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-[#111111] tracking-tight leading-tight mb-4"
            >
              Advanced<br />
              <span className="text-[#F5B400]">Manufacturing</span><br />
              Infrastructure
            </motion.h2>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-14 h-[3px] bg-[#F5B400] rounded-full origin-left mb-6"
            />
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-[15px] text-gray-500 font-body leading-relaxed mb-8"
            >
              Our facility is built for performance. From modern machinery and organized workflow to a skilled workforce and dedicated quality assurance labs, we combine capacity with control to deliver export-grade polymer soles at scale.
            </motion.p>

            {/* Checklist points */}
            <motion.ul
              variants={listVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-40px" }}
              className="space-y-4 mb-10"
            >
              {POINTS.map((point, i) => (
                <motion.li key={i} variants={listItemVariants} className="flex items-start gap-3.5 group">
                  <CheckCircle2 className="h-5 w-5 text-[#F5B400] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-heading font-bold text-[15px] text-[#111111] block mb-0.5">
                      {point.title}
                    </span>
                    <p className="text-[13px] text-gray-500 font-body leading-relaxed">
                      {point.text}
                    </p>
                  </div>
                </motion.li>
              ))}
            </motion.ul>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link
                href="/gallery"
                className="inline-flex items-center gap-2.5 rounded-xl bg-[#111111] text-white font-heading font-bold text-sm px-7 py-3.5 hover:bg-[#F5B400] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(245,180,0,0.35)] transition-all duration-300 group"
              >
                View Facility &amp; Gallery
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </motion.div>
          </div>

          {/* Right — image grid */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <ImageGrid images={galleryImages} />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
