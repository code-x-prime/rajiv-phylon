"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Award, Globe2, Settings, Cog, ShieldCheck } from "lucide-react";
import { AboutImageGrid } from "./AboutImageGrid";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

const PILLARS = [
  {
    icon: Settings,
    title: "The Ecosystem of Control",
    metric: "Vertical Integration",
    copy: "Unlike assembly-only shops, Rajiv Phylon owns the entire value chain. We compound our own polymers, tune our own densities, and manufacture every part. This verticality ensures that every sole leaving our floor is a direct reflection of our internal standards.",
  },
  {
    icon: Cog,
    title: "Micron-Level Tolerances",
    metric: "500+ Active Molds",
    copy: "Our engineering facility combines advanced multi-station rotary injection with automated Phylon compression. We maintain strict dimensional tolerances, ensuring that mass-production batches are indistinguishable from the first approved sample.",
  },
  {
    icon: ShieldCheck,
    title: "Global Compliance as a Baseline",
    metric: "REACH Certified",
    copy: "In the global export market, compliance is non-negotiable. Our materials are strictly formulated to be free of banned phthalates and toxic blowing agents, fulfilling the chemical safety requirements of the European (REACH) and North American (CA Prop 65) markets.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-white overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative bg-[#0A0A0A] min-h-[50vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
          aria-hidden
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.2, 0.12] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-[#F5B400] blur-[120px] pointer-events-none"
          aria-hidden
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.08, 0.15, 0.08] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute -bottom-40 -right-20 w-[400px] h-[400px] rounded-full bg-[#F5B400] blur-[100px] pointer-events-none"
          aria-hidden
        />

        <div className="relative z-10 max-w-site mx-auto px-6 lg:px-10 py-20">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-6 mt-16"
          >
            <div className="h-px w-8 bg-[#F5B400]" />
            <span className="type-overline text-[#F5B400]">
              About Rajiv Phylon
            </span>
            <div className="h-px w-8 bg-[#F5B400]" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
            className="font-display font-medium text-[clamp(2.5rem,5vw,4.5rem)] text-white tracking-[-0.03em] leading-[1.0] max-w-3xl"
          >
            Manufacturing{" "}
            <span className="text-[#F5B400]">Excellence</span>{" "}
            Since Day One
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.2 }}
            className="mt-6 text-lg text-white/50 font-body leading-relaxed max-w-2xl"
          >
            At Rajiv Phylon, we are committed to promoting development within the global footwear landscape. By integrating cutting-edge manufacturing technology with advanced polymer compounding, we provide our brand partners with differentiated solutions that redefine performance.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.32 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Link
              href="/contact"
              className="inline-flex items-center gap-2.5 rounded-xl bg-[#F5B400] text-white font-display font-medium text-[13px] uppercase tracking-[0.1em] px-8 py-4 hover:bg-[#e0a300] hover:shadow-[0_8px_32px_rgba(245,180,0,0.4)] hover:-translate-y-0.5 transition-all duration-300"
            >
              Partner With Us
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center gap-2.5 rounded-xl border border-white/20 text-white font-display font-medium text-[13px] uppercase tracking-[0.1em] px-8 py-4 hover:border-white/50 hover:bg-white/10 transition-all duration-300"
            >
              View Products
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── STORY + IMAGE GRID ───────────────────────────── */}
      <section className="py-16 md:py-24 bg-white border-b border-gray-100">
        <div className="max-w-site mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65 }}
            >
              <p className="type-overline text-[#F5B400] mb-4">Our Story</p>
              <h2 className="font-display font-medium text-[clamp(1.75rem,3.5vw,3rem)] text-foreground tracking-[-0.02em] leading-tight mb-3">
                Two Decades of Material Science.<br />
                <span className="text-[#F5B400]">Ten Million Steps Delivered.</span>
              </h2>
              <div className="h-[2px] w-16 bg-[#F5B400] rounded-full mb-7" />

              <p className="text-[15px] text-gray-500 font-body leading-relaxed mb-5">
                Founded in 2016, Rajiv Phylon began with a singular obsession: the molecular integrity of the footwear sole. Today, operating from our high-capacity industrial ecosystem in Sonipat, we have evolved into the institutional backbone of the footwear supply chain. With over 10 million soles produced and 500+ proprietary mold designs, we don&apos;t just supply components—we engineer the foundation of the world&apos;s most successful footwear brands.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            >
              <AboutImageGrid />
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── OUR INSTITUTIONAL FOOTPRINT ──────────────────── */}
      <section className="py-16 md:py-24 bg-[#FAFAFA] border-b border-gray-100">
        <div className="max-w-site mx-auto px-6 lg:px-10">
          <div className="text-center mb-14">
            <p className="type-overline text-[#F5B400] mb-4">
              Our Institutional Footprint
            </p>
            <h2 className="font-display font-medium text-[clamp(1.75rem,3.5vw,2.75rem)] text-foreground tracking-[-0.02em]">
              Three Pillars of Excellence
            </h2>
            <div className="mt-3 h-[2px] w-16 bg-[#F5B400] rounded-full mx-auto" />
          </div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {PILLARS.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="group bg-white rounded-2xl p-8 border border-gray-100 hover:border-[#F5B400]/30 hover:shadow-[0_20px_60px_-15px_rgba(245,180,0,0.1)] transition-all duration-500"
                >
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center group-hover:bg-[#F5B400] group-hover:border-[#F5B400] transition-all duration-500">
                      <Icon className="h-5 w-5 text-[#F5B400] group-hover:text-white transition-colors duration-500" />
                    </div>
                  </div>
                  <p className="type-overline text-[#F5B400] mb-2">{pillar.metric}</p>
                  <h3 className="font-display font-medium text-[18px] text-foreground mb-3 leading-snug">
                    {pillar.title}
                  </h3>
                  <p className="text-[14px] text-gray-500 font-body leading-relaxed">
                    {pillar.copy}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── MISSION & VISION ─────────────────────────────── */}
      <section className="py-16 md:py-24 bg-white border-b border-gray-100">
        <div className="max-w-site mx-auto px-6 lg:px-10">
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="group relative rounded-3xl bg-[#111111] p-12 lg:p-16 overflow-hidden min-h-[320px] flex flex-col justify-center"
            >
              <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-[#F5B400]/10 blur-3xl pointer-events-none" aria-hidden />
              <div className="relative z-10">
                <h3 className="font-display font-medium text-2xl lg:text-3xl text-[#F5B400] mb-4">Our Mission</h3>
                <p className="text-[16px] lg:text-[18px] text-white/80 font-body leading-relaxed">
                  To engineer the technical foundation of global footwear through industrial scale and material innovation—empowering brands to lead with confidence.
                </p>
              </div>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="group relative rounded-3xl border-2 border-[#F5B400]/30 bg-white p-12 lg:p-16 overflow-hidden hover:border-[#F5B400]/60 transition-colors duration-300 min-h-[320px] flex flex-col justify-center"
            >
              <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-[#F5B400]/5 blur-3xl pointer-events-none" aria-hidden />
              <div className="relative z-10">
                <h3 className="font-display font-medium text-2xl lg:text-3xl text-[#111111] mb-4">Our Vision</h3>
                <p className="text-[16px] lg:text-[18px] text-gray-500 font-body leading-relaxed">
                  To be the world&apos;s most resilient footwear component partner, where Indian manufacturing precision defines the global standard for performance and sustainability.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-[#FAFAFA]">
        <div className="max-w-site mx-auto px-6 lg:px-10">
          <div className="relative rounded-3xl bg-[#111111] overflow-hidden px-8 py-16 md:px-16 md:py-20 text-center">
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
            <div className="relative z-10">
              <motion.h2
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="font-display font-medium text-[clamp(1.75rem,4vw,3rem)] text-white tracking-[-0.03em] leading-tight mb-5"
              >
                Ready to build a<br />
                <span className="text-[#F5B400]">long-term partnership?</span>
              </motion.h2>
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
                  Get In Touch
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2.5 rounded-xl border border-white/15 text-white font-display font-medium text-[13px] uppercase tracking-[0.1em] px-8 py-4 hover:border-white/40 hover:bg-white/[0.04] transition-all duration-300"
                >
                  Browse Products
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
