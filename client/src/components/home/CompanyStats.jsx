"use client"
import { Award, Globe, Layers, Users, Zap, TrendingUp } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

const STATS = [
  { label: "Soles Engineered", value: "10M+", num: 10, icon: TrendingUp },
  { label: "Daily Pair Capacity", value: "50,000+", num: 50000, icon: Zap },
  { label: "Active Mold Designs", value: "500+", num: 500, icon: Layers },
  { label: "Years of Manufacturing Excellence", value: "25+", num: 25, icon: Award },
];

const DURATION_MS = 2000;

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
      const ease = 1 - Math.pow(1 - progress, 5);
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
  const suffix = stat.value.replace(/^[0-9,]+/g, "");
  const Icon = stat.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_60px_-15px_rgba(245,180,0,0.15)] transition-all duration-500 hover:-translate-y-2 relative overflow-hidden h-full flex flex-col items-center text-center">
        {/* Top Accent Bar */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#F5B400] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Icon Container */}
        <div className="mb-4 relative">
          <div className="absolute inset-0 bg-[#F5B400]/10 rounded-xl scale-0 group-hover:scale-125 transition-transform duration-500 blur-xl" />
          <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center relative z-10 border border-gray-100 group-hover:bg-[#F5B400] group-hover:text-white transition-colors duration-500">
            <Icon className="h-5 w-5 text-[#F5B400] group-hover:text-white transition-colors duration-500" />
          </div>
        </div>

        <div className="font-display font-medium text-[clamp(2rem,3.5vw,3rem)] text-[#111111] leading-none mb-2 tabular-nums tracking-[-0.03em]">
          {count.toLocaleString()}
          <span className="text-[#F5B400] group-hover:animate-pulse">{suffix}</span>
        </div>
        
        <p className="type-overline text-gray-400 text-center uppercase tracking-[0.12em] group-hover:text-gray-600 transition-colors duration-300">
          {stat.label}
        </p>

        {/* Decorative Watermark */}
        <div className="absolute -bottom-4 -right-4 opacity-[0.08] group-hover:opacity-[0.1] transition-opacity duration-500 pointer-events-none">
          <Icon className="w-24 h-24 rotate-12" />
        </div>
      </div>
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
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-16 md:py-24 relative overflow-hidden bg-[#FAFAFA]">
      {/* Industrial Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.4] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      
      <div className="max-w-site mx-auto px-6 lg:px-10 relative z-10">
        {/* Top Title Section */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white border border-gray-100 shadow-sm mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-[#F5B400] animate-pulse" />
            <span className="type-overline text-gray-500">
              Scale & Trust
            </span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display font-medium text-[clamp(1.75rem,3.5vw,2.75rem)] text-[#111111] tracking-[-0.02em] leading-tight"
          >
            Scale & <span className="text-[#F5B400]">Trust</span>
          </motion.h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {STATS.map((stat, i) => (
            <StatBlock key={i} stat={stat} isInView={isInView} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
