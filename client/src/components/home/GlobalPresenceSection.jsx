"use client";

import { motion } from "framer-motion";
import { Globe, TrendingUp, Award } from "lucide-react";

const STATS = [
  { icon: Globe, value: "50+", label: "Countries Served", desc: "Active export markets across 6 continents" },
  { icon: TrendingUp, value: "High Volume", label: "Production Capacity", desc: "Scaled for OEM & bulk order timelines" },
  { icon: Award, value: "25+", label: "Years of Experience", desc: "Decades of polymer manufacturing expertise" },
];

export function GlobalPresenceSection() {
  return (
    <section className="py-10 md:py-16  bg-white border-b border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left — text */}
          <div>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-[11px] font-heading font-bold text-[#F5B400] uppercase tracking-[0.25em] mb-3"
            >
              Our global reach
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-[#111111] tracking-tight leading-tight mb-5"
            >
              Global Presence,<br />
              <span className="text-[#F5B400]">Reliable</span> Partnership
            </motion.h2>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="w-16 h-[3px] bg-[#F5B400] rounded-full origin-left mb-6"
            />
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-[15px] md:text-base text-gray-500 font-body leading-relaxed max-w-lg"
            >
              We deliver export-ready production with international quality compliance, built for long-term OEM partnerships. Our supply chain is structured for reliable shipping timelines and consistent delivery to brands and manufacturers worldwide.
            </motion.p>
          </div>

          {/* Right — stat cards */}
          <div className="space-y-4">
            {STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ x: 4 }}
                  className="group flex items-center gap-5 p-5 rounded-2xl bg-[#F9FAFB] border border-gray-100 hover:border-[#F5B400]/40 hover:bg-white hover:shadow-md transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#F5B400]/10 border border-[#F5B400]/20 flex items-center justify-center shrink-0 group-hover:bg-[#F5B400] group-hover:border-[#F5B400] transition-all duration-300">
                    <Icon className="h-5 w-5 text-[#F5B400] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-heading text-2xl font-bold text-[#111111]">{stat.value}</span>
                      <span className="text-[13px] font-heading font-semibold text-gray-400">{stat.label}</span>
                    </div>
                    <p className="text-[13px] text-gray-400 font-body mt-0.5">{stat.desc}</p>
                  </div>
                  {/* Arrow */}
                  <div className="text-gray-300 group-hover:text-[#F5B400] transition-colors duration-300">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M5 10h10M10 5l5 5-5 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
