"use client";

import { motion } from "framer-motion";

const BRANDS = [
  "Bata", "Relaxo", "JQR Sports", "Action", "VKC Pride", "HRX",
  "Welcome", "Today", "Lehar", "Cult Sport", "Calcetto", "Ajanta Shoes",
  "Aqualite", "Bersache", "Bacca Bucci", "FCUK", "Odyssia", "Yoo Brands",
  "Speed", "Sole Threads", "Fila", "Impakto", "Lakhani", "Nice",
  "Aygo", "Staed", "Striker", "Paragon", "Khadim's", "Campus",
  "Redtape", "Woodland", "Lee Cooper", "Neeman's", "Lancer", "Asian",
  "Liberty", "Red Chief", "Sreeleathers", "Walkaroo",
];

/* Duplicate for two seamless rows scrolling in opposite directions */
const ROW1 = [...BRANDS.slice(0, 20), ...BRANDS.slice(0, 20)];
const ROW2 = [...BRANDS.slice(20),    ...BRANDS.slice(20)];

function MarqueeRow({ items, reverse = false, duration = 35 }) {
  return (
    <div className="flex overflow-hidden">
      <motion.div
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
        className="flex shrink-0 gap-4"
      >
        {items.map((name, i) => (
          <div
            key={i}
            className="shrink-0 flex items-center justify-center h-12 px-6 rounded-full border border-gray-200 bg-white shadow-sm hover:border-[#F5B400]/60 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default select-none"
          >
            <span className="font-heading font-semibold text-[13px] text-gray-600 hover:text-[#111111] whitespace-nowrap transition-colors duration-200">
              {name}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function ClientLogos() {
  return (
    <section className="py-14 md:py-16 bg-[#FAFAFA] border-b border-gray-100 overflow-hidden">
      {/* Heading */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="text-[11px] font-heading font-bold text-[#F5B400] uppercase tracking-[0.25em] mb-2"
        >
          Trusted By
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="font-heading text-2xl md:text-3xl font-bold text-[#111111] tracking-tight"
        >
          Brands That Rely On Us
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-[14px] text-gray-500 font-body mt-2"
        >
          40+ leading footwear brands trust our polymer soles
        </motion.p>
      </div>

      {/* Row 1 — scrolls left */}
      <div className="relative mb-4">
        <div className="pointer-events-none absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-[#FAFAFA] to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-[#FAFAFA] to-transparent z-10" />
        <MarqueeRow items={ROW1} reverse={false} duration={40} />
      </div>

      {/* Row 2 — scrolls right */}
      <div className="relative">
        <div className="pointer-events-none absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-[#FAFAFA] to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-[#FAFAFA] to-transparent z-10" />
        <MarqueeRow items={ROW2} reverse={true} duration={35} />
      </div>

      {/* Count note */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-center mt-8 text-[12px] text-gray-400 font-body"
      >
        Partnering with footwear brands &amp; OEM manufacturers across India &amp; worldwide
      </motion.p>
    </section>
  );
}
