"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const CELLS = [
  { label: "Facility", src: "/footwear-polymer-manufacturing-facility.png", alt: "Advanced polymer sole manufacturing facility", span: "tall" },
  { label: "Production", src: "/automated-polymer-sole-production.png", alt: "Automated footwear sole production process", span: "normal" },
  { label: "Quality Lab", src: "/polymer-sole-quality-testing-lab.png", alt: "Footwear sole quality testing laboratory", span: "normal" },
];

const BADGE_LABELS = ["ISO Certified", "Export Grade", "25+ Years"];

function Cell({ label, src, alt, span, priority = false }) {
  const [errored, setErrored] = useState(false);
  const isTall = span === "tall";

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 ${isTall ? "row-span-2" : ""
        }`}
    >
      {!errored && src ? (
        <Image
          src={src}
          alt={alt || label}
          fill
          className="object-cover group-hover:scale-[1.07] transition-transform duration-700 ease-out"
          sizes={isTall ? "(max-width: 1024px) 50vw, 45vw" : "(max-width: 1024px) 50vw, 22vw"}
          priority={priority}
          onError={() => setErrored(true)}
        />
      ) : (
        /* Premium placeholder */
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-gray-100 to-gray-200">
          <div className="w-10 h-10 rounded-xl border-2 border-gray-300 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-gray-400">
              <rect x="1" y="1" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
              <rect x="10" y="1" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
              <rect x="1" y="10" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
              <rect x="10" y="10" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
          <span className="text-[11px] font-heading font-semibold text-gray-400 uppercase tracking-widest">
            {label}
          </span>
        </div>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" aria-hidden />

      {/* Label chip at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out">
        <span className="inline-block bg-white/90 backdrop-blur-sm text-[#111111] font-heading font-bold text-[11px] uppercase tracking-wider px-3 py-1.5 rounded-full">
          {label}
        </span>
      </div>

      {/* Bottom sweep accent */}
      <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-[#F5B400] group-hover:w-full transition-all duration-500 ease-out" aria-hidden />
    </motion.div>
  );
}

export function AboutImageGrid() {
  return (
    <div className="relative">
      {/* Main 2×2 bento grid — left column spans 2 rows */}
      <div className="grid grid-cols-2 gap-3 lg:gap-4" style={{ gridTemplateRows: "240px 240px" }}>
        <Cell label={CELLS[0].label} src={CELLS[0].src} alt={CELLS[0].alt} span="tall" priority />
        <Cell label={CELLS[1].label} src={CELLS[1].src} alt={CELLS[1].alt} span="normal" />
        <Cell label={CELLS[2].label} src={CELLS[2].src} alt={CELLS[2].alt} span="normal" />
      </div>

      {/* Floating badge strip */}
      <div className="flex flex-wrap gap-2 mt-4">
        {BADGE_LABELS.map((b) => (
          <span
            key={b}
            className="inline-flex items-center gap-1.5 bg-white border border-gray-200 text-[#111111] font-heading font-semibold text-[11px] uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#F5B400] inline-block" />
            {b}
          </span>
        ))}
      </div>
    </div>
  );
}
