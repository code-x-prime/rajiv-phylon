"use client";

import { motion } from "framer-motion";

export function SectionWrapper({ children, alternate = false, className = "" }) {
  const bg = alternate ? "bg-section-bg" : "bg-white";
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`py-16 md:py-24 border-b border-gray-100 ${bg} ${className}`}
    >
      {children}
    </motion.section>
  );
}
