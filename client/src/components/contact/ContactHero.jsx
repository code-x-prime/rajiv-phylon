"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export function ContactHero() {
  return (
    <section className="relative bg-[#0A0A0A] overflow-hidden py-24 md:py-32">
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
        aria-hidden
      />
      {/* Glow orbs */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.18, 0.1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#F5B400] blur-[100px] pointer-events-none"
        aria-hidden
      />
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.06, 0.12, 0.06] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute -bottom-28 -left-16 w-80 h-80 rounded-full bg-[#F5B400] blur-[90px] pointer-events-none"
        aria-hidden
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 mb-6"
        >
          <div className="h-px w-8 bg-[#F5B400]" />
          <span className="text-[11px] font-heading font-bold text-[#F5B400] uppercase tracking-[0.28em]">
            B2B &amp; Export Enquiries
          </span>
          <div className="h-px w-8 bg-[#F5B400]" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
          className="font-heading text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white tracking-tight leading-[1.06] mb-5 max-w-2xl"
        >
          Let&apos;s <span className="text-[#F5B400]">Connect</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18 }}
          className="text-lg text-white/50 font-body leading-relaxed max-w-xl"
        >
          Get in touch for bulk quotes, product inquiries, or long-term OEM partnerships. Our team responds within 24 hours.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 flex flex-wrap gap-3"
        >
          {["Bulk Orders", "OEM Partnerships", "Export Enquiries", "Product Info"].map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 bg-white/8 border border-white/12 rounded-full px-4 py-1.5 text-[13px] font-heading font-medium text-white/60"
            >
              <MessageCircle className="h-3.5 w-3.5 text-[#F5B400]" />
              {tag}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
