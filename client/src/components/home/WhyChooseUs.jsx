"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const ITEMS = [
  {
    svg: "/why-choose/precision-engineering.svg",
    img: "/precision-engineering.png",
    title: "Precision Engineering",
    description:
      "Every sole is produced to exact specifications with consistent tolerances. Our engineering processes ensure repeatability and performance your brand can rely on.",
  },
  {
    svg: "/why-choose/advanced-infrastructure.svg",
    img: "/advanced-infrastructure.png",
    title: "Advanced Infrastructure",
    description:
      "Modern manufacturing facilities equipped with automated systems and dedicated production lines. Built to support high-volume, export-grade output.",
  },
  {
    svg: "/why-choose/strict-quality-control.svg",
    img: "/strict-quality-control.png",
    title: "Strict Quality Control",
    description:
      "Rigorous inspection at every stage—from raw material to finished product. We adhere to international standards and documented quality systems.",
  },
  {
    svg: "/why-choose/bulk-order-capability.svg",
    img: "/bulk-order-capability.png",
    title: "Bulk Order Capability",
    description:
      "Scaled production capacity to fulfil large orders without compromising quality or lead times. We are structured for OEM and high-volume partnerships.",
  },
  {
    svg: "/why-choose/timely-global-delivery.svg",
    img: "/timely-global-delivery.png",
    title: "Timely Global Delivery",
    description:
      "Reliable logistics and a proven supply chain for committed export timelines. We keep your production and planning on track with dependable dispatch support.",
  },
  {
    svg: "/why-choose/custom-development-support.svg",
    img: "/custom-development-support.png",
    title: "Custom Development Support",
    description:
      "Dedicated technical support for custom sole development and sampling. We work with you to refine designs, materials, and specifications for your range.",
  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

export function WhyChooseUs() {
  return (
    <section className="py-16 md:py-24 bg-[#F9F7F4] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16 md:mb-20">
          <div className="max-w-xl">
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-[11px] font-heading font-bold text-[#F5B400] uppercase tracking-[0.3em] mb-5 flex items-center gap-3"
            >
              <span className="h-px w-8 bg-[#F5B400]/60" aria-hidden />
              Why work with us
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="font-heading text-3xl md:text-5xl lg:text-[3.5rem] font-bold text-[#111111] leading-[1.1] tracking-tight"
            >
              Why Choose{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-[#F5B400]">Rajiv Phylon</span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute -bottom-1 left-0 h-[3px] w-full bg-[#F5B400]/40 rounded-full origin-left"
                  aria-hidden
                />
              </span>
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-sm text-sm text-gray-500 font-body leading-relaxed md:text-right"
          >
            Built for brands that demand precision, scale, and reliability — from
            first sample to bulk export.
          </motion.p>
        </div>

        {/* ── Cards Grid ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6"
        >
          {ITEMS.map((item, i) => {
            const num = String(i + 1).padStart(2, "0");
            return (
              <motion.div
                key={i}
                variants={cardVariants}
                className="group relative bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-500 flex flex-col"
              >
                {/* ── Image Area ── */}
                <div className="relative h-52 sm:h-56 overflow-hidden bg-white">
                  {/* Actual photo */}
                  <Image
                    src={item.img}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 p-3 rounded-lg"
                  />

                  {/* Dark gradient overlay — stronger on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-white/5 to-transparent group-hover:from-white/70 transition-all duration-500" />

                  {/* ── Card number (top-right corner on image) ── */}
                  <span className="absolute top-4 right-5 font-heading text-5xl font-light text-white/20 select-none tracking-tight leading-none">
                    {num}
                  </span>

                  {/* ── SVG Icon Badge (bottom-left corner on image) ── */}
                  <div className="absolute bottom-4 left-5">
                    <div className="relative w-14 h-14 rounded-xl bg-[#F5B400] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Image
                        src={item.svg}
                        alt=""
                        width={30}
                        height={30}
                        className="object-contain brightness-0 invert w-[26px] h-[26px] sm:w-[30px] sm:h-[30px]"
                      />
                    </div>
                  </div>

                  {/* Yellow accent bar that slides in from bottom on hover */}
                  <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#F5B400] translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out" />
                </div>

                {/* ── Text Area ── */}
                <div className="p-6 sm:p-7 flex flex-col flex-1">
                  <h3 className="font-heading font-bold text-[16px] sm:text-[18px] text-[#111111] mb-3 leading-snug group-hover:text-[#111]">
                    {item.title}
                  </h3>
                  <p className="text-[13px] sm:text-[14px] text-gray-500 font-body leading-relaxed flex-1">
                    {item.description}
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