"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";

export function HomeCta() {
  return (
    <section className="py-16 md:py-20 bg-white border-b border-gray-100 overflow-hidden">
      <div className="max-w-site mx-auto px-6 lg:px-10">

        <div className="relative rounded-3xl bg-[#111111] overflow-hidden px-8 py-16 md:px-16 md:py-24 text-center">

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
              className="inline-flex items-center gap-2 mb-6"
            >
              <div className="h-px w-8 bg-[#F5B400]" />
              <span className="type-overline text-[#F5B400]">
                Let&apos;s work together
              </span>
              <div className="h-px w-8 bg-[#F5B400]" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="font-display font-medium text-[clamp(2rem,4.5vw,4rem)] text-white tracking-[-0.03em] leading-[1.0] mb-6"
            >
              Ready to get<br />
              <span className="text-[#F5B400]">started?</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-white/45 font-body text-lg max-w-xl mx-auto mb-12"
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
                className="inline-flex items-center gap-2.5 rounded-xl bg-[#F5B400] text-white font-display font-medium text-[13px] uppercase tracking-[0.1em] px-8 py-4 hover:bg-[#e0a300] hover:shadow-[0_8px_32px_rgba(245,180,0,0.4)] hover:-translate-y-0.5 transition-all duration-300"
              >
                <MessageCircle className="h-4 w-4" />
                Global Enquiry
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center gap-2.5 rounded-xl border border-white/15 text-white font-display font-medium text-[13px] uppercase tracking-[0.1em] px-8 py-4 hover:border-white/40 hover:bg-white/[0.04] transition-all duration-300"
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
