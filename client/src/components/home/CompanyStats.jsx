"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

const STATS = [
  { label: "Years of Experience", value: "25+", num: 25 },
  { label: "Countries Served", value: "50+", num: 50 },
  { label: "Products", value: "500+", num: 500 },
  { label: "Happy Clients", value: "1000+", num: 1000 },
];

const DURATION_MS = 1800;

function useCountUp(end, start, isInView) {
  const [current, setCurrent] = useState(start);
  useEffect(() => {
    if (!isInView || end <= start) return;
    let startTime = null;
    let rafId = null;
    const step = (ts) => {
      if (startTime == null) startTime = ts;
      const elapsed = ts - startTime;
      const progress = Math.min(elapsed / DURATION_MS, 1);
      const ease = 1 - Math.pow(1 - progress, 4); // easeOutQuart
      setCurrent(Math.round(start + (end - start) * ease));
      if (progress < 1) rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);
    return () => rafId != null && cancelAnimationFrame(rafId);
  }, [end, start, isInView]);
  return current;
}

function StatBlock({ stat, isInView, index }) {
  const count = useCountUp(stat.num, 0, isInView);
  const suffix = stat.value.replace(/^\d+/, "");

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center text-center relative"
    >
      {/* Divider on right (not last) */}
      <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 h-12 w-px bg-gray-200" />

      <div className="font-heading text-5xl md:text-6xl  font-bold text-[#111111] leading-none mb-3 tabular-nums">
        {count}
        <span className="text-[#F5B400]">{suffix}</span>
      </div>
      <p className="text-sm md:text-base text-gray-500 font-body tracking-wide">{stat.label}</p>
    </motion.div>
  );
}

export function CompanyStats() {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsInView(true); },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} className="md:py-10 py-6   bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top label */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-3 justify-center mb-14 origin-left"
        >
          <div className="h-px w-12 bg-[#F5B400]" />
          <span className="text-[11px] font-heading font-bold text-[#F5B400] uppercase tracking-[0.25em]">
            Numbers that speak
          </span>
          <div className="h-px w-12 bg-[#F5B400]" />
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">
          {STATS.map((stat, i) => (
            <StatBlock key={i} stat={stat} isInView={isInView} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
