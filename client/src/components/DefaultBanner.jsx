"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function DefaultBanner() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-[#0A0A0A] text-white border-b border-white/10 py-16 md:py-24"
    >
      <div className="max-w-site mx-auto px-6 lg:px-10 text-center">
        <h1 className="font-display font-medium text-[clamp(2rem,4vw,3.5rem)] text-white tracking-[-0.02em]">
          Rajiv Phylon
        </h1>
        <p className="mt-3 text-lg text-white/50 max-w-2xl mx-auto font-body">
          Premium B2B industrial products and solutions.
        </p>
        <Link
          href="/products"
          className="inline-block mt-8 px-7 py-3.5 bg-[#F5B400] text-black font-display font-medium text-[13px] uppercase tracking-[0.1em] rounded-xl hover:bg-[#e0a300] transition-colors"
        >
          Browse categories
        </Link>
      </div>
    </motion.section>
  );
}
