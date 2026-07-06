"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Wrench, Atom, ShieldCheck, Truck } from "lucide-react";
import { ProtectedImage } from "@/components/ui/ProtectedImage";

const POINTS = [
  {
    icon: Wrench,
    title: "In-House Tooling",
    text: "From 3D CAD to production molds in weeks, not months.",
  },
  {
    icon: Atom,
    title: "Advanced Compounding",
    text: "Custom material durometer and density tuning.",
  },
  {
    icon: ShieldCheck,
    title: "Chemical Compliance",
    text: "Fully REACH, and CA Prop 65 compliant.",
  },
  {
    icon: Truck,
    title: "Strategic Logistics",
    text: "Direct corridors to major ports across South Asia and Global hubs.",
  },
];

const INFRASTRUCTURE_IMAGES = [
  { imageUrl: "/high-capacity-manufacturing-infrastructure.png", title: "Infrastructure", alt: "High capacity manufacturing infrastructure" },
  { imageUrl: "/automated-footwear-production-workflow.png", title: "Workflow", alt: "Organized automated footwear production workflow" },
  { imageUrl: "/skilled-workforce-polymer-manufacturing.png", title: "Workforce", alt: "Skilled workforce in polymer manufacturing" },
];

function ImageGrid({ images }) {
  const list = Array.isArray(images) && images.length > 0 ? images.slice(0, 4) : INFRASTRUCTURE_IMAGES;

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
          <div className="relative w-full h-full select-none" onContextMenu={(e) => e.preventDefault()}>
            <ProtectedImage
              wrapperClassName="relative w-full h-full"
              src={src}
              alt={alt}
              fill
              className="object-cover group-hover:scale-[1.06] transition-transform duration-700 ease-out"
              sizes={className.includes("row-span-2") ? "(max-width: 1024px) 50vw, 45vw" : "(max-width: 1024px) 50vw, 22vw"}
              priority={priority}
            />
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="w-8 h-8 rounded-lg border-2 border-gray-300 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-400">
                <rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
                <rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
                <rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
                <rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>
            <span className="text-[11px] font-display font-medium text-gray-400 uppercase tracking-wider">
              {item?.title || "Infrastructure"}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-400" aria-hidden />
        <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#F5B400] group-hover:w-full transition-all duration-500 ease-out" aria-hidden />
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-3 lg:gap-4 h-[420px] md:h-[500px] lg:h-[540px]">
      <Item item={list[0]} className="row-span-2" priority />
      <Item item={list[1]} />
      <Item item={list[2]} />
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
    <section className="py-16 md:py-24 bg-white border-b border-gray-100">
      <div className="max-w-site mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">

          {/* Left — text content */}
          <div>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="type-overline text-[#F5B400] mb-4"
            >
              Ecosystems of Efficiency
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="font-display font-medium text-[clamp(1.75rem,3.5vw,3rem)] text-foreground tracking-[-0.02em] leading-tight mb-3"
            >
              Vertical Integration.<br />
              <span className="text-[#F5B400]">Seamless Export.</span>
            </motion.h2>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-14 h-[2px] bg-[#F5B400] rounded-full origin-left mb-7"
            />

            {/* Checklist points */}
            <motion.ul
              variants={listVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-40px" }}
              className="space-y-4 mb-10"
            >
              {POINTS.map((point, i) => {
                const Icon = point.icon;
                return (
                  <motion.li key={i} variants={listItemVariants} className="flex items-start gap-3.5 group">
                    <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#F5B400] group-hover:border-[#F5B400] transition-all duration-300">
                      <Icon className="h-4 w-4 text-[#F5B400] group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div>
                      <span className="font-display font-medium text-[15px] text-foreground block mb-0.5">
                        {point.title}
                      </span>
                      <p className="text-[13px] text-gray-500 font-body leading-relaxed">
                        {point.text}
                      </p>
                    </div>
                  </motion.li>
                );
              })}
            </motion.ul>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link
                href="/gallery"
                className="inline-flex items-center gap-2.5 rounded-xl bg-[#111111] text-white font-display font-medium text-[13px] uppercase tracking-[0.1em] px-7 py-3.5 hover:bg-[#F5B400] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(245,180,0,0.35)] transition-all duration-300 group"
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
