"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

const COUNTRIES = [
  { name: "USA", flag: "🇺🇸" },
  { name: "United Kingdom", flag: "🇬🇧" },
  { name: "Germany", flag: "🇩🇪" },
  { name: "UAE", flag: "🇦🇪" },
  { name: "Singapore", flag: "🇸🇬" },
  { name: "Australia", flag: "🇦🇺" },
  { name: "Japan", flag: "🇯🇵" },
  { name: "South Africa", flag: "🇿🇦" },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.85, y: 16 },
  show: {
    opacity: 1, scale: 1, y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  },
};

export function ExportCountries() {
  return (
    <section className="py-10 md:py-16 bg-[#F9FAFB] border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-10 md:mb-12">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[11px] font-heading font-bold text-[#F5B400] uppercase tracking-[0.25em] mb-3"
          >
            Our reach
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-[#111111] tracking-tight"
          >
            We Export To
          </motion.h2>
        </div>

        {/* Country badges */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="flex flex-wrap justify-center gap-3 md:gap-4"
        >
          {COUNTRIES.map((c) => (
            <motion.div
              key={c.name}
              variants={itemVariants}
              whileHover={{ y: -3, scale: 1.04 }}
              className="group flex items-center gap-2.5 bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm hover:border-[#F5B400]/50 hover:shadow-md transition-all duration-200 cursor-default"
            >
              <span className="text-xl leading-none">{c.flag}</span>
              <span className="font-heading font-semibold text-[14px] text-[#111111] whitespace-nowrap group-hover:text-[#F5B400] transition-colors duration-200">
                {c.name}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-8 text-sm text-gray-400 font-body flex items-center justify-center gap-1.5"
        >
          <MapPin className="h-3.5 w-3.5 text-[#F5B400]" />
          And many more countries across 6 continents
        </motion.p>

      </div>
    </section>
  );
}
