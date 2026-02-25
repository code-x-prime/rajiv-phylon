"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";

export function HomeCta() {
  return (
    <section className="py-12 md:py-16  bg-white border-b border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="relative rounded-3xl bg-[#111111] overflow-hidden px-8 py-16 md:px-16 md:py-20 text-center">

          {/* Floating glow orbs */}
          <motion.div
            animate={{ x: [0, 20, 0], y: [0, -12, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-[#F5B400]/10 blur-3xl pointer-events-none"
            aria-hidden
          />
          <motion.div
            animate={{ x: [0, -16, 0], y: [0, 14, 0] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 3 }}
            className="absolute -bottom-24 -right-16 w-96 h-96 rounded-full bg-[#F5B400]/8 blur-3xl pointer-events-none"
            aria-hidden
          />

          {/* Content */}
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 mb-5"
            >
              <div className="h-px w-8 bg-[#F5B400]" />
              <span className="text-[11px] font-heading font-bold text-[#F5B400] uppercase tracking-[0.25em]">
                Let&apos;s work together
              </span>
              <div className="h-px w-8 bg-[#F5B400]" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight mb-5"
            >
              Ready to get<br />
              <span className="text-[#F5B400]">started?</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-white/50 font-body text-lg max-w-xl mx-auto mb-10"
            >
              Contact us for bulk quotes, product information, or long-term OEM partnership inquiries.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <Link
                href="/contact"
                className="inline-flex items-center gap-2.5 rounded-xl bg-[#F5B400] text-white font-heading font-bold text-sm px-8 py-4 hover:bg-[#e0a300] hover:shadow-[0_8px_32px_rgba(245,180,0,0.4)] hover:-translate-y-0.5 transition-all duration-300"
              >
                <MessageCircle className="h-4 w-4" />
                Global Enquiry
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center gap-2.5 rounded-xl border-2 border-white/20 text-white font-heading font-bold text-sm px-8 py-4 hover:border-white/50 hover:bg-white/10 transition-all duration-300"
              >
                Browse Products
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
