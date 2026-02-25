"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Check, ArrowRight, Award, Globe2 } from "lucide-react";
import { AboutImageGrid } from "./AboutImageGrid";

const TRUST_HIGHLIGHTS = [
  "State-of-the-art manufacturing with modern machinery and automated processes",
  "Strict quality control and compliance with international standards",
  "Bulk production capability to meet global demand and lead times",
  "Long-term OEM partnerships built on reliability and consistent delivery",
];

const STATS = [
  { value: "25+", label: "Years of Experience" },
  { value: "40+", label: "Brand Partners" },
  { value: "15+", label: "Countries Exported" },
  { value: "10L+", label: "Pairs Monthly" },
];

const VALUES = [
  { svg: "/value/quality-first.svg", title: "Quality First", desc: "Every sole undergoes strict QC. International standards are our baseline, not our ceiling." },
  { svg: "/value/scale-precision.svg", title: "Scale & Precision", desc: "Modern automated lines built for bulk production without sacrificing dimensional accuracy." },
  { svg: "/value/global-reach.svg", title: "Global Reach", desc: "Export-grade products shipped to 15+ countries. We understand global compliance & documentation." },
  { svg: "/value/partnership-mindset.svg", title: "Partnership Mindset", desc: "We grow with our partners. Long-term OEM relationships are built on trust and delivery consistency." },
  { svg: "/value/fast-turnaround.svg", title: "Fast Turnaround", desc: "Lean workflows and in-house raw material processing keep lead times competitive." },
  { svg: "/value/continuous-innovation.svg", title: "Continuous Innovation", desc: "R&D investment in polymer blends ensures we always have a product edge for our clients." },
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};
const fadeLeft = {
  hidden: { opacity: 0, x: -28 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function AboutPage() {
  return (
    <div className="bg-white overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative bg-[#0A0A0A] min-h-[50vh] flex items-center overflow-hidden">
        {/* Background grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
          aria-hidden
        />
        {/* Yellow glow orbs */}
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

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-6 mt-16"
          >
            <div className="h-px w-8 bg-[#F5B400]" />
            <span className="text-[11px] font-heading font-bold text-[#F5B400] uppercase tracking-[0.28em]">
              About Rajiv Phylon
            </span>
            <div className="h-px w-8 bg-[#F5B400]" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
            className="font-heading text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white tracking-tight leading-[1.06] max-w-3xl"
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
            A global leader in high-performance polymer footwear soles. 25+ years of precision manufacturing, trusted by 40+ brands across 15+ countries.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.32 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Link
              href="/contact"
              className="inline-flex items-center gap-2.5 rounded-xl bg-[#F5B400] text-white font-heading font-bold text-sm px-8 py-4 hover:bg-[#e0a300] hover:shadow-[0_8px_32px_rgba(245,180,0,0.4)] hover:-translate-y-0.5 transition-all duration-300"
            >
              Partner With Us
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center gap-2.5 rounded-xl border-2 border-white/20 text-white font-heading font-bold text-sm px-8 py-4 hover:border-white/50 hover:bg-white/10 transition-all duration-300"
            >
              View Products
            </Link>
          </motion.div>

        </div>
      </section>

      {/* ── STORY + IMAGE GRID ───────────────────────────── */}
      <section className="py-10 md:py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">

            {/* Left text */}
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
            >
              <motion.p variants={fadeUp} className="text-[11px] font-heading font-bold text-[#F5B400] uppercase tracking-[0.25em] mb-3">
                Our Story
              </motion.p>
              <motion.h2 variants={fadeUp} className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-[#111111] tracking-tight leading-tight mb-5">
                A Global Leader in<br />
                <span className="text-[#F5B400]">Polymer Footwear</span><br />
                Soles
              </motion.h2>
              <motion.div variants={fadeUp} className="w-12 h-[3px] bg-[#F5B400] rounded-full mb-7" />

              <motion.p variants={fadeUp} className="text-[15px] text-gray-500 font-body leading-relaxed mb-5">
                Rajiv Phylon is a premium manufacturer of high-performance polymer shoe soles for the global footwear industry. We operate at scale with modern machinery, rigorous quality systems, and a commitment to international standards—serving OEM and B2B partners who demand reliability, consistency, and long-term supply security.
              </motion.p>
              <motion.p variants={fadeUp} className="text-[15px] text-gray-500 font-body leading-relaxed mb-10">
                Our facility is built for bulk production without compromising on quality. From raw material to finished sole, every step is controlled and traceable. We invest in technology and people to deliver export-grade products that meet the strictest specifications, making us the preferred partner for brands and manufacturers worldwide.
              </motion.p>

              <motion.ul variants={stagger} className="space-y-3.5">
                {TRUST_HIGHLIGHTS.map((item, i) => (
                  <motion.li key={i} variants={fadeLeft} className="flex items-start gap-3.5">
                    <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-[#F5B400] flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    </span>
                    <span className="text-[14px] md:text-[15px] text-[#333] font-body leading-relaxed">{item}</span>
                  </motion.li>
                ))}
              </motion.ul>

              <motion.div variants={fadeUp} className="mt-10">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2.5 rounded-xl bg-[#111111] text-white font-heading font-bold text-sm px-7 py-3.5 hover:bg-[#F5B400] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(245,180,0,0.35)] transition-all duration-300 group"
                >
                  Partner With Us
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Right image grid */}
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

      {/* ── OUR VALUES ───────────────────────────────────── */}
      <section className="py-10 md:py-12 bg-[#FAFAFA] border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="text-[11px] font-heading font-bold text-[#F5B400] uppercase tracking-[0.25em] mb-2"
            >
              What Drives Us
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-[#111111] tracking-tight"
            >
              Our Core Values
            </motion.h2>
          </div>

          {/* Values grid — same premium design as Why Choose Us */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200 rounded-3xl overflow-hidden shadow-sm"
          >
            {VALUES.map((v, i) => {
              const num = String(i + 1).padStart(2, "0");
              return (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  whileHover={{ backgroundColor: "#FAFAFA" }}
                  className="group bg-white p-8 sm:p-9 lg:p-10 xl:p-12 relative transition-colors duration-300 min-h-[220px] sm:min-h-[240px]"
                >
                  {/* Number — big and light */}
                  <span className="absolute top-6 right-6 font-heading text-5xl sm:text-6xl md:text-7xl font-light text-gray-100 group-hover:text-[#F5B400]/30 transition-colors duration-300 select-none tracking-tight">
                    {num}
                  </span>
                  {/* Left accent bar */}
                  <div className="absolute left-0 top-10 bottom-10 w-[3px] bg-[#F5B400] rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden />
                  {/* Icon — SVG from public/value */}
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[#F5B400]/10 border border-[#F5B400]/20 flex items-center justify-center mb-6 group-hover:bg-[#F5B400] group-hover:border-[#F5B400] transition-all duration-300 overflow-hidden">
                    <Image
                      src={v.svg}
                      alt=""
                      width={40}
                      height={40}
                      className="object-contain w-9 h-9 sm:w-10 sm:h-10 group-hover:brightness-0 group-hover:invert transition-all duration-300"
                    />
                  </div>
                  <h3 className="font-heading font-bold text-[18px] sm:text-[19px] text-[#111111] mb-3">{v.title}</h3>
                  <p className="text-[14px] sm:text-[15px] text-gray-500 font-body leading-relaxed">{v.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── MISSION & VISION ─────────────────────────────── */}
      <section className="py-10 md:py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="text-[11px] font-heading font-bold text-[#F5B400] uppercase tracking-[0.25em] mb-2"
            >
              Purpose & Direction
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-[#111111] tracking-tight"
            >
              Mission &amp; Vision
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="group relative rounded-3xl bg-[#111111] p-10 lg:p-12 overflow-hidden"
            >
              {/* Glow */}
              <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-[#F5B400]/10 blur-3xl pointer-events-none" aria-hidden />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-[#F5B400]/20 border border-[#F5B400]/30 flex items-center justify-center">
                    <Award className="h-4 w-4 text-[#F5B400]" />
                  </div>
                  <span className="font-heading font-bold text-[12px] text-[#F5B400] uppercase tracking-[0.2em]">Mission</span>
                </div>
                <div className="w-10 h-[3px] bg-[#F5B400] rounded-full mb-6" />
                <p className="text-[15px] text-white/70 font-body leading-relaxed">
                  To deliver high-performance polymer footwear soles at scale, with uncompromising quality control and international compliance—enabling our OEM and B2B partners to build trusted brands and supply chains worldwide.
                </p>
              </div>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="group relative rounded-3xl border-2 border-[#F5B400]/30 bg-white p-10 lg:p-12 overflow-hidden hover:border-[#F5B400]/60 transition-colors duration-300"
            >
              <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-[#F5B400]/5 blur-3xl pointer-events-none" aria-hidden />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-[#F5B400]/10 border border-[#F5B400]/20 flex items-center justify-center group-hover:bg-[#F5B400] group-hover:border-[#F5B400] transition-all duration-300">
                    <Globe2 className="h-4 w-4 text-[#F5B400] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <span className="font-heading font-bold text-[12px] text-[#F5B400] uppercase tracking-[0.2em]">Vision</span>
                </div>
                <div className="w-10 h-[3px] bg-[#F5B400] rounded-full mb-6" />
                <p className="text-[15px] text-gray-500 font-body leading-relaxed">
                  To lead the global footwear component market through innovation in polymer technology—with quality as our foundation and long-term partnerships as our commitment—driving growth that endures.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="py-10 md:py-12 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="relative rounded-3xl bg-[#111111] overflow-hidden px-8 py-16 md:px-16 md:py-20 text-center">
            {/* Orbs */}
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
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 mb-5"
              >
                <div className="h-px w-8 bg-[#F5B400]" />
                <span className="text-[11px] font-heading font-bold text-[#F5B400] uppercase tracking-[0.25em]">Let&apos;s work together</span>
                <div className="h-px w-8 bg-[#F5B400]" />
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight mb-5"
              >
                Ready to build a<br />
                <span className="text-[#F5B400]">long-term partnership?</span>
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
                  Get In Touch
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2.5 rounded-xl border-2 border-white/20 text-white font-heading font-bold text-sm px-8 py-4 hover:border-white/50 hover:bg-white/10 transition-all duration-300"
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
