"use client";

import { motion } from "framer-motion";
import { MapPin, TrendingUp, Award } from "lucide-react";

const STATS = [
  { icon: MapPin, value: "Strategic", label: "Regional Dominance", desc: "Proximate to South Asian footwear manufacturing hubs" },
  { icon: TrendingUp, value: "50,000+", label: "Daily Production Scale", desc: "Consistent volume for global assembly lines" },
  { icon: Award, value: "2.5", label: "Decades of Material Science", desc: "Deep expertise in polymer compounding" },
];

export function GlobalPresenceSection() {
  return (
    <section className="py-16 md:py-24 bg-white border-b border-gray-100 overflow-hidden">
      <div className="max-w-site mx-auto px-6 lg:px-10">

        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">

          {/* Left — text */}
          <div>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="type-overline text-[#F5B400] mb-4"
            >
              Our Export Reach
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="font-display font-medium text-[clamp(1.75rem,3.5vw,3rem)] text-foreground tracking-[-0.02em] leading-tight mb-3"
            >
              Global Logistics,<br />
              <span className="text-[#F5B400]">Industrial Precision.</span>
            </motion.h2>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="w-16 h-[2px] bg-[#F5B400] rounded-full origin-left mb-7"
            />
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-[15px] md:text-base text-gray-500 font-body leading-relaxed max-w-lg"
            >
              We operate at the intersection of high-volume manufacturing and frictionless global logistics. Strategically located near the National Capital Region&apos;s dry ports, we provide established shipping corridors to footwear hubs across South Asia and beyond. Our infrastructure is built to support the rapid lead times and stringent compliance standards of the world&apos;s most successful brands.
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
                      <span className="font-display font-medium text-2xl text-foreground">{stat.value}</span>
                      <span className="text-[13px] font-display font-medium text-gray-400">{stat.label}</span>
                    </div>
                    <p className="text-[13px] text-gray-400 font-body mt-0.5">{stat.desc}</p>
                  </div>
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
