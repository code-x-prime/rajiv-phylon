"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function DefaultBanner() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-[#111827] text-white border-b border-[#374151] py-16 md:py-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
          Rajiv Phylon
        </h1>
        <p className="mt-2 text-lg text-gray-300 max-w-2xl mx-auto">
          Premium B2B industrial products and solutions.
        </p>
        <Link
          href="/#categories"
          className="inline-block mt-6 px-6 py-3 bg-[hsl(var(--accent))] text-[#111827] font-semibold hover:opacity-90 transition-opacity"
        >
          Browse categories
        </Link>
      </div>
    </motion.section>
  );
}
