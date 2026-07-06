"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, User, Users, Baby } from "lucide-react";

const PLACEHOLDER_IMAGE = "/placeholder.png";

const PRODUCT_LINES = [
  {
    name: "EVA Soles",
    slug: "eva-soles",
    description: "Lightweight, flexible & shock-absorbing",
    tabs: [
      { label: "For Men", slug: "men", icon: User },
      { label: "For Women", slug: "women", icon: Users },
      { label: "For Kids", slug: "kids", icon: Baby },
    ],
  },
  {
    name: "Phylon Sole",
    slug: "phylon-sole",
    description: "Premium cushioning & durability",
    tabs: [
      { label: "For Men", slug: "men", icon: User },
      { label: "For Women", slug: "women", icon: Users },
      { label: "For Kids", slug: "kids", icon: Baby },
    ],
  },
  {
    name: "Semi Phylon Sole",
    slug: "semi-phylon-sole",
    description: "Balance of comfort & performance",
    tabs: [
      { label: "For Men", slug: "men", icon: User },
      { label: "For Women", slug: "women", icon: Users },
      { label: "For Kids", slug: "kids", icon: Baby },
    ],
  },
];

const GRAD = [
  { from: "#1a1a2e", to: "#16213e", accent: "#3b82f6" },
  { from: "#1c1c1c", to: "#3a2012", accent: "#f97316" },
  { from: "#0a1628", to: "#1a2744", accent: "#06b6d4" },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

function ProductLineCard({ product, index, apiCategories }) {
  const [activeTab, setActiveTab] = useState(0);
  const grad = GRAD[index % GRAD.length];

  const matchedCat = apiCategories?.find(
    (c) => c.name?.toLowerCase().includes(product.slug.split("-")[0])
  );
  const imageUrl = matchedCat?.imageUrl || matchedCat?.image || PLACEHOLDER_IMAGE;

  return (
    <motion.div variants={cardVariants} className="h-full">
      <div
        className="group relative flex flex-col justify-between overflow-hidden rounded-2xl min-h-[340px] sm:min-h-[400px] lg:min-h-[460px]"
        style={{ background: `linear-gradient(140deg, ${grad.from}, ${grad.to})` }}
      >
        {/* Image layer */}
        <div className="absolute inset-0">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10 z-[1]" />

        {/* Number + arrow (top) */}
        <div className="relative z-[3] flex items-start justify-between p-5 sm:p-6">
          <span className="font-display font-medium text-[10px] text-white/40 tracking-[0.2em] uppercase select-none">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="w-10 h-10 rounded-full bg-[#F5B400] shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
            <ArrowUpRight className="h-4 w-4 text-white" />
          </div>
        </div>

        {/* Content (bottom) */}
        <div className="relative z-[3] p-5 sm:p-6 space-y-4">
          <p className="type-overline text-[#F5B400] text-[11px]">{product.description}</p>

          <h3 className="font-display font-medium text-2xl sm:text-3xl lg:text-4xl text-white leading-tight group-hover:text-[#F5B400] transition-colors duration-300">
            {product.name}
          </h3>

          {/* Sub-tabs */}
          <div className="flex flex-wrap gap-2 pt-1">
            {product.tabs.map((tab, tabIdx) => {
              const Icon = tab.icon;
              return (
                <Link
                  key={tab.slug}
                  href={`/category/${product.slug}?gender=${tab.slug}`}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-display font-medium transition-all duration-300 ${
                    activeTab === tabIdx
                      ? "bg-[#F5B400] text-black"
                      : "bg-white/10 text-white/80 hover:bg-white/20 hover:text-white border border-white/10"
                  }`}
                  onMouseEnter={() => setActiveTab(tabIdx)}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {tab.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300 pt-2">
            <div className="h-px w-5 bg-[#F5B400]" />
            <span className="type-overline text-[#F5B400] text-[10px]">Explore</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function TopCategoriesSection({ categoriesWithSubs }) {
  const apiCategories = Array.isArray(categoriesWithSubs) ? categoriesWithSubs : [];

  return (
    <section className="py-20 md:py-24 lg:py-32 bg-[#0A0A0A] overflow-hidden">
      <div className="max-w-site mx-auto px-6 lg:px-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 md:mb-16">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="type-overline text-[#F5B400] mb-4"
            >
              Browse by category
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="font-display font-medium text-[clamp(1.75rem,4vw,3.5rem)] text-white tracking-[-0.025em] leading-[1.0]"
            >
              Our Product<br />
              <span className="text-[#F5B400]">Lines</span>
            </motion.h2>
            <motion.div
              initial={{ scaleX: 0, originX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="mt-4 h-[2px] w-16 bg-[#F5B400] rounded-full"
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
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 text-white font-display font-medium text-[13px] uppercase tracking-[0.1em] px-5 py-2.5 hover:border-[#F5B400] hover:text-[#F5B400] transition-all duration-300"
            >
              View all products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>

        {/* 3-column grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
        >
          {PRODUCT_LINES.map((product, i) => (
            <ProductLineCard
              key={product.slug}
              product={product}
              index={i}
              apiCategories={apiCategories}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export function TopCategoriesSkeleton() {
  return (
    <section className="py-16 bg-[#0A0A0A]">
      <div className="max-w-site mx-auto px-6 lg:px-10">
        <div className="h-3 w-28 rounded bg-white/10 animate-pulse mb-4" />
        <div className="h-12 w-72 rounded-xl bg-white/10 animate-pulse mb-3" />
        <div className="h-12 w-56 rounded-xl bg-white/10 animate-pulse mb-10" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl bg-white/5 animate-pulse min-h-[400px]" />
          ))}
        </div>
      </div>
    </section>
  );
}

export function TopCategoriesPillSkeleton() {
  return <div className="h-9 w-28 rounded-full bg-white/10 animate-pulse" />;
}
