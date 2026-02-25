"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const ITEMS = [
  {
    svg: "/why-choose/precision-engineering.svg",
    title: "Precision Engineering",
    description:
      "Every sole is produced to exact specifications with consistent tolerances. Our engineering processes ensure repeatability and performance your brand can rely on.",
  },
  {
    svg: "/why-choose/advanced-infrastructure.svg",
    title: "Advanced Infrastructure",
    description:
      "Modern manufacturing facilities equipped with automated systems and dedicated production lines. Built to support high-volume, export-grade output.",
  },
  {
    svg: "/why-choose/strict-quality-control.svg",
    title: "Strict Quality Control",
    description:
      "Rigorous inspection at every stage—from raw material to finished product. We adhere to international standards and documented quality systems.",
  },
  {
    svg: "/why-choose/bulk-order-capability.svg",
    title: "Bulk Order Capability",
    description:
      "Scaled production capacity to fulfil large orders without compromising quality or lead times. We are structured for OEM and high-volume partnerships.",
  },
  {
    svg: "/why-choose/timely-global-delivery.svg",
    title: "Timely Global Delivery",
    description:
      "Reliable logistics and proven supply chain to ship to multiple regions. We meet committed timelines so your production and planning stay on track.",
  },
  {
    svg: "/why-choose/custom-development-support.svg",
    title: "Custom Development Support",
    description:
      "Dedicated technical support for custom sole development and sampling. We work with you to refine designs, materials, and specifications for your range.",
  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export function WhyChooseUs() {
  return (
    <section className="py-12 md:py-16  bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="max-w-2xl mb-14 md:mb-16">
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[11px] font-heading font-bold text-[#F5B400] uppercase tracking-[0.25em] mb-3"
          >
            Why work with us
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-[#111111] tracking-tight leading-tight"
          >
            Why Choose<br />
            <span className="relative">
              Rajiv Phylon
              <motion.span
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="absolute -bottom-1 left-0 h-[3px] w-full bg-[#F5B400] rounded-full origin-left block"
              />
            </span>
          </motion.h2>
        </div>

        {/* Grid — larger cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-100 border border-gray-100 rounded-2xl overflow-hidden shadow-sm"
        >
          {ITEMS.map((item, i) => {
            const num = String(i + 1).padStart(2, "0");
            return (
              <motion.div
                key={i}
                variants={cardVariants}
                whileHover={{ backgroundColor: "#FAFAFA" }}
                className="group bg-white p-8 sm:p-9 lg:p-10 xl:p-12 relative transition-colors duration-300 min-h-[220px] sm:min-h-[240px]"
              >
                {/* Number — even bigger */}
                <span className="absolute top-6 right-6 font-heading text-5xl sm:text-6xl md:text-7xl font-light text-gray-100 group-hover:text-[#F5B400]/30 transition-colors duration-300 select-none tracking-tight">
                  {num}
                </span>

                {/* Icon — SVG a bit bigger */}
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[#F5B400]/10 border border-[#F5B400]/20 flex items-center justify-center mb-6 group-hover:bg-[#F5B400] group-hover:border-[#F5B400] transition-all duration-300 overflow-hidden">
                  <Image
                    src={item.svg}
                    alt=""
                    width={40}
                    height={40}
                    className="object-contain w-9 h-9 sm:w-10 sm:h-10 text-[#F5B400] group-hover:brightness-0 group-hover:invert transition-all duration-300"
                  />
                </div>

                {/* Left yellow accent bar */}
                <div className="absolute left-0 top-10 bottom-10 w-[3px] bg-[#F5B400] rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden />

                <h3 className="font-heading font-bold text-[18px] sm:text-[19px] text-[#111111] mb-3 group-hover:text-[#111111]">
                  {item.title}
                </h3>
                <p className="text-[14px] sm:text-[15px] text-gray-500 font-body leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
