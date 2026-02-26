"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
} from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight, Package, Globe, ShieldCheck } from "lucide-react";

/* ── Fallback image paths ────────────────────────────────── */
const FB_DESK   = "/desk-banner.jpeg";
const FB_MOBILE = "/mobile-banner.jpeg";

/* ── Slide transition variants ──────────────────────────── */
const slideVariants = {
  enter: (dir) => ({ opacity: 0, x: dir > 0 ? 80 : -80, scale: 1.04 }),
  center: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  exit:  (dir) => ({ opacity: 0, x: dir > 0 ? -80 : 80, scale: 0.96,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }),
};

const textVariants = {
  enter:  { opacity: 0, y: 28 },
  center: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] } },
  exit:   { opacity: 0, y: -16, transition: { duration: 0.3 } },
};

/* ── Trust badges (shown in fallback) ───────────────────── */
const BADGES = [
  { icon: Package,    text: "Export Grade Quality"     },
  { icon: Globe,      text: "50+ Countries Served"     },
  { icon: ShieldCheck,text: "ISO Certified Manufacturing" },
];

/* ═══════════════════════════════════════════════════════════
   API BANNER SLIDER
══════════════════════════════════════════════════════════════ */
function BannerSlider({ banners }) {
  const [index, setIndex]     = useState(0);
  const [dir, setDir]         = useState(1);
  const [paused, setPaused]   = useState(false);
  const [progress, setProgress] = useState(0);
  const INTERVAL = 5000;

  const go = useCallback((next) => {
    setDir(next > index ? 1 : -1);
    setIndex(next);
    setProgress(0);
  }, [index]);

  const prev = (e) => { e.stopPropagation(); go((index - 1 + banners.length) % banners.length); };
  const next = (e) => { e.stopPropagation(); go((index + 1) % banners.length); };

  /* Progress bar + auto-advance */
  useEffect(() => {
    if (banners.length <= 1 || paused) return;
    const step = 100 / (INTERVAL / 50);
    const t = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          go((index + 1) % banners.length);
          return 0;
        }
        return p + step;
      });
    }, 50);
    return () => clearInterval(t);
  }, [banners.length, index, paused, go]);

  const cur        = banners[index];
  const desktopSrc = cur?.desktopImageUrl || cur?.desktopImage;
  const mobileSrc  = cur?.mobileImageUrl  || cur?.mobileImage;
  const link       = cur?.link?.trim()    || "/products";

  return (
    <section
      className="relative w-full min-h-[70vh] md:min-h-[85vh] overflow-hidden bg-[#0A0A0A]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Image ── */}
      <AnimatePresence custom={dir} mode="popLayout">
        <motion.div
          key={index}
          custom={dir}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 will-change-transform select-none"
          onContextMenu={(e) => e.preventDefault()}
        >
          <picture>
            <source media="(max-width: 768px)" srcSet={mobileSrc || FB_MOBILE} />
            <Image
              src={desktopSrc || FB_DESK}
              alt={`Banner ${index + 1}`}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
              draggable={false}
              onDragStart={(e) => e.preventDefault()}
            />
          </picture>
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/20" />
        </motion.div>
      </AnimatePresence>

      {/* ── Clickable full link ── */}
      <Link href={link} className="absolute inset-0 z-10" aria-label="View offer" />

      {/* ── Progress bar ── */}
      {banners.length > 1 && (
        <div className="absolute bottom-0 inset-x-0 z-30 h-[3px] bg-white/10">
          <motion.div
            className="h-full bg-[#F5B400]"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* ── Dots ── */}
      {banners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5">
          {banners.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={(e) => { e.stopPropagation(); go(i); }}
              aria-label={`Slide ${i + 1}`}
              className="relative"
            >
              <span className={`block rounded-full transition-all duration-400 ${
                i === index
                  ? "w-7 h-2 bg-[#F5B400]"
                  : "w-2 h-2 bg-white/40 hover:bg-white/70"
              }`} />
            </button>
          ))}
        </div>
      )}

      {/* ── Arrow buttons ── */}
      {banners.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-30 group flex items-center justify-center w-11 h-11 rounded-full border border-white/20 bg-black/30 backdrop-blur-sm text-white hover:bg-[#F5B400] hover:border-[#F5B400] transition-all duration-200"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-30 group flex items-center justify-center w-11 h-11 rounded-full border border-white/20 bg-black/30 backdrop-blur-sm text-white hover:bg-[#F5B400] hover:border-[#F5B400] transition-all duration-200"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* ── Slide counter ── */}
      <div className="absolute top-5 right-5 z-30 hidden sm:flex items-center gap-1.5 rounded-full bg-black/30 backdrop-blur-sm border border-white/10 px-3 py-1.5">
        <span className="font-heading text-sm font-bold text-white">{String(index + 1).padStart(2, "0")}</span>
        <span className="text-white/30 text-xs">/</span>
        <span className="font-heading text-xs font-semibold text-white/50">{String(banners.length).padStart(2, "0")}</span>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   FALLBACK HERO — shown when no API banners
══════════════════════════════════════════════════════════════ */
function FallbackHero() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 40, damping: 18 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 18 });
  const bgX = useTransform(springX, [-0.5, 0.5], ["-10px", "10px"]);
  const bgY = useTransform(springY, [-0.5, 0.5], ["-10px", "10px"]);

  const handleMouseMove = (e) => {
    mouseX.set(e.clientX / window.innerWidth - 0.5);
    mouseY.set(e.clientY / window.innerHeight - 0.5);
  };

  return (
    <section
      className="relative w-full min-h-[92vh] flex items-center overflow-hidden bg-[#0A0A0A]"
      onMouseMove={handleMouseMove}
    >
      {/* Parallax bg image */}
      <motion.div
        className="absolute inset-[-12px] bg-cover bg-center will-change-transform"
        style={{ backgroundImage: `url(${FB_DESK})`, x: bgX, y: bgY }}
        aria-hidden
      />

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/88 via-black/65 to-black/30" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" aria-hidden />

      {/* Floating accent orbs */}
      <motion.div
        animate={{ y: [0, -18, 0], x: [0, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[15%] right-[18%] w-64 h-64 rounded-full bg-[#F5B400]/6 blur-3xl pointer-events-none"
        aria-hidden
      />
      <motion.div
        animate={{ y: [0, 14, 0], x: [0, -8, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[20%] right-[30%] w-96 h-96 rounded-full bg-[#F5B400]/4 blur-3xl pointer-events-none"
        aria-hidden
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-24 md:py-28">
        <div className="max-w-3xl">

          {/* Label */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 mb-6"
          >
            <div className="h-px w-10 bg-[#F5B400]" />
            <span className="text-[11px] font-heading font-bold text-[#F5B400] uppercase tracking-[0.25em]">
              Export Grade Manufacturer
            </span>
          </motion.div>

          {/* Heading */}
          <div className="overflow-hidden mb-2">
            <motion.h1
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold text-white tracking-tight leading-[1.0]"
            >
              High-Performance
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-6">
            <motion.h1
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold text-[#F5B400] tracking-tight leading-[1.0]"
            >
              Polymer Soles
            </motion.h1>
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg md:text-xl text-white/60 font-body leading-relaxed max-w-xl mb-10"
          >
            Trusted B2B & OEM partner for global footwear brands. Export-grade quality, bulk-ready production.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap items-center gap-4"
          >
            <Link
              href="/products"
              className="inline-flex items-center gap-2.5 rounded-xl bg-[#F5B400] text-white font-heading font-bold text-sm px-7 py-3.5 hover:bg-[#e0a300] hover:shadow-[0_8px_32px_rgba(245,180,0,0.35)] hover:-translate-y-0.5 transition-all duration-300"
            >
              Explore Products
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2.5 rounded-xl border-2 border-white/25 text-white font-heading font-bold text-sm px-7 py-3.5 hover:border-white/60 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
            >
              Request a Quote
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap items-center gap-5 mt-12 pt-10 border-t border-white/10"
          >
            {BADGES.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2.5">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#F5B400]/15 border border-[#F5B400]/25">
                  <Icon className="h-4 w-4 text-[#F5B400]" />
                </div>
                <span className="text-[13px] font-heading font-semibold text-white/70">{text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom progress line decoration */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-0 left-0 h-[3px] w-full bg-gradient-to-r from-[#F5B400] via-[#F5B400]/50 to-transparent origin-left"
      />
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   EXPORT — picks which hero to show
══════════════════════════════════════════════════════════════ */
export function BannerSection({ banners }) {
  const list = Array.isArray(banners) && banners.length > 0 ? banners : [];
  if (list.length === 0) return <FallbackHero />;
  return <BannerSlider banners={list} />;
}
