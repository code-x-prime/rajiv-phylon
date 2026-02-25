"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";

/* ── Max categories shown on home ───────────────────────── */
const HOME_LIMIT = 8;
const PLACEHOLDER_IMAGE = "/placeholder.png";

/* ── Gradient fallbacks (lighter, more premium) ─────────── */
const GRAD = [
  { from: "#1a1a2e", to: "#16213e", accent: "#3b82f6" },
  { from: "#1a0533", to: "#2d0b5a", accent: "#8b5cf6" },
  { from: "#0f2027", to: "#2d4a22", accent: "#22c55e" },
  { from: "#1c1c1c", to: "#3a2012", accent: "#f97316" },
  { from: "#0a1628", to: "#1a2744", accent: "#06b6d4" },
  { from: "#1a0a28", to: "#2a1040", accent: "#ec4899" },
  { from: "#0d1b0d", to: "#1a3a1a", accent: "#84cc16" },
  { from: "#1a1200", to: "#3a2a00", accent: "#f5b400" },
];

/* ── Variants ────────────────────────────────────────────── */
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  show:   { opacity: 1, y: 0,  scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

/* ── Parallax card ───────────────────────────────────────── */
function ParallaxCard({ cat, index, size = "normal" }) {
  const ref      = useRef(null);
  const imageUrl = cat.imageUrl || cat.image || PLACEHOLDER_IMAGE;
  const subcats  = cat.subCategories ?? [];
  const grad     = GRAD[index % GRAD.length];
  const num      = String(index + 1).padStart(2, "0");

  const mouseX   = useMotionValue(0);
  const mouseY   = useMotionValue(0);
  const springX  = useSpring(mouseX, { stiffness: 80, damping: 20 });
  const springY  = useSpring(mouseY, { stiffness: 80, damping: 20 });
  const imgX     = useTransform(springX, [-0.5, 0.5], ["-6px", "6px"]);
  const imgY     = useTransform(springY, [-0.5, 0.5], ["-5px", "5px"]);
  const imgScale = useTransform(springX, [-0.5, 0.5], [1.05, 1.1]);

  const onMove  = (e) => {
    const el = ref.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    mouseX.set((e.clientX - left) / width  - 0.5);
    mouseY.set((e.clientY - top)  / height - 0.5);
  };
  const onLeave = () => { mouseX.set(0); mouseY.set(0); };

  const minH =
    size === "featured"
      ? "min-h-[380px] sm:min-h-[440px] lg:min-h-[520px]"
      : size === "normal"
      ? "min-h-[220px] sm:min-h-[260px]"
      : "min-h-[180px] sm:min-h-[200px]";

  const nameSize =
    size === "featured"
      ? "text-2xl sm:text-3xl lg:text-4xl"
      : "text-lg sm:text-xl";

  return (
    <motion.div variants={cardVariants} className="h-full">
      <Link
        ref={ref}
        href={`/category/${cat.slug}`}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl ${minH} block`}
        style={{ background: `linear-gradient(140deg, ${grad.from}, ${grad.to})` }}
      >
        {/* Image layer */}
        <motion.div
          className="absolute inset-[-8px] will-change-transform"
          style={{ x: imgX, y: imgY, scale: imgScale }}
          aria-hidden
        >
          <Image
            src={imageUrl}
            alt={cat.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </motion.div>

        {/* Dark overlay — lighter than before */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/5 z-[1]"
          aria-hidden
        />
        {/* Hover accent overlay */}
        <div
          className="absolute inset-0 z-[1] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: `linear-gradient(135deg, ${grad.accent}15, transparent)` }}
          aria-hidden
        />

        {/* Number + arrow (top) */}
        <div className="relative z-[3] flex items-start justify-between p-4 sm:p-5">
          <span className="font-heading text-[10px] font-bold text-white/40 tracking-[0.2em] uppercase select-none">
            {num}
          </span>
          <div className="w-9 h-9 rounded-full bg-[#F5B400] shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
            <ArrowUpRight className="h-4 w-4 text-white" />
          </div>
        </div>

        {/* Name + subcats (bottom) */}
        <div className="relative z-[3] p-4 sm:p-5 space-y-2">
          {/* Subcats pills */}
          {subcats.length > 0 && (
            <div className="flex flex-wrap gap-1.5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-350">
              {subcats.slice(0, size === "featured" ? 5 : 3).map((s) => (
                <span
                  key={s.id}
                  className="rounded-full bg-white/15 backdrop-blur-sm border border-white/20 px-2.5 py-0.5 text-[10px] font-heading font-semibold text-white/90 whitespace-nowrap"
                >
                  {s.name}
                </span>
              ))}
              {subcats.length > (size === "featured" ? 5 : 3) && (
                <span
                  className="rounded-full px-2.5 py-0.5 text-[10px] font-heading font-bold text-white"
                  style={{ background: grad.accent + "cc" }}
                >
                  +{subcats.length - (size === "featured" ? 5 : 3)}
                </span>
              )}
            </div>
          )}

          <h3 className={`font-heading font-bold text-white leading-tight group-hover:text-[#F5B400] transition-colors duration-300 ${nameSize}`}>
            {cat.name}
          </h3>

          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
            <div className="h-px w-5 bg-[#F5B400]" />
            <span className="text-[11px] font-heading font-bold text-[#F5B400] uppercase tracking-wider">Explore</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ── Main ────────────────────────────────────────────────── */
export function TopCategoriesSection({ categoriesWithSubs }) {
  const all  = Array.isArray(categoriesWithSubs) ? categoriesWithSubs : [];
  if (all.length === 0) return null;

  /* Hard cap: show only first HOME_LIMIT (8) on home page */
  const list     = all.slice(0, HOME_LIMIT);
  const overflow = all.length - HOME_LIMIT;   // how many are hidden
  const total    = all.length;

  const featured = list[0];
  const rest     = list.slice(1);   // up to 7

  return (
    <section className="py-16 md:py-20 lg:py-28 bg-[#0A0A0A] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 md:mb-14">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="text-[11px] font-heading font-bold text-[#F5B400] uppercase tracking-[0.25em] mb-3"
            >
              Browse by category
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="font-heading text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white tracking-tight leading-[1.05]"
            >
              Our Product<br />
              <span className="text-[#F5B400]">Categories</span>
            </motion.h2>
            <motion.div
              initial={{ scaleX: 0, originX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="mt-4 h-0.5 w-16 bg-[#F5B400] rounded-full"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.15 }}
          >
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 text-white font-heading font-semibold text-sm px-5 py-2.5 hover:border-[#F5B400] hover:text-[#F5B400] transition-all duration-300"
            >
              View all products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
        >
          {list.length === 1 && (
            <ParallaxCard cat={list[0]} index={0} size="featured" />
          )}

          {list.length === 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {list.map((c, i) => <ParallaxCard key={c.id} cat={c} index={i} size="featured" />)}
            </div>
          )}

          {list.length >= 3 && (
            <>
              {/* Row 1: featured left + up to 4 on right */}
              <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-4">
                <ParallaxCard cat={featured} index={0} size="featured" />

                {/* Right 2×2 grid (max 4 cards) */}
                <div className="grid grid-cols-2 gap-4">
                  {rest.slice(0, 4).map((c, i) => (
                    <ParallaxCard key={c.id} cat={c} index={i + 1} size="normal" />
                  ))}
                </div>
              </div>

              {/* Row 2: remaining (max 3 more = total 8) */}
              {rest.length > 4 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                  {rest.slice(4).map((c, i) => (
                    <ParallaxCard key={c.id} cat={c} index={i + 5} size="small" />
                  ))}
                </div>
              )}
            </>
          )}
        </motion.div>

        {/* Footer row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.3 }}
          className="mt-8 flex items-center justify-between border-t border-white/10 pt-7"
        >
          <p className="text-white/40 font-body text-sm">
            Showing{" "}
            <span className="text-white font-heading font-bold">{list.length}</span>
            {overflow > 0 && (
              <> of <span className="text-white font-heading font-bold">{total}</span></>
            )}{" "}
            {total === 1 ? "category" : "categories"}
          </p>
          <Link
            href="/products"
            className="flex items-center gap-1.5 text-[#F5B400] text-sm font-heading font-semibold hover:gap-3 transition-all duration-200"
          >
            {overflow > 0 ? `+${overflow} more categories` : "Browse all"}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}

/* ── Skeleton ─────────────────────────────────────────────── */
export function TopCategoriesSkeleton() {
  return (
    <section className="py-16 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-3 w-28 rounded bg-white/10 animate-pulse mb-4" />
        <div className="h-12 w-72 rounded-xl bg-white/10 animate-pulse mb-3" />
        <div className="h-12 w-56 rounded-xl bg-white/10 animate-pulse mb-10" />
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-4">
          <div className="rounded-2xl bg-white/5 animate-pulse min-h-[420px]" />
          <div className="grid grid-cols-2 gap-4">
            {[1,2,3,4].map((i) => (
              <div key={i} className="rounded-2xl bg-white/5 animate-pulse min-h-[200px]" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function TopCategoriesPillSkeleton() {
  return <div className="h-9 w-28 rounded-full bg-white/10 animate-pulse" />;
}
