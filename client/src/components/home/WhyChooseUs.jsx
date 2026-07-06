"use client";

import { motion } from "framer-motion";
import { Settings, Cog, ShieldCheck, TrendingUp, Globe, Lightbulb } from "lucide-react";

const PILLARS = [
  {
    icon: Settings,
    number: "01",
    title: "Micron-Level Tolerance Engineering",
    copy: "We combine 2.5 decades of compounding heritage with advanced automated molding. Our engineering protocols ensure the absolute repeatability and performance required for high-spec global footwear ranges.",
  },
  {
    icon: Cog,
    number: "02",
    title: "Integrated Industrial Ecosystem",
    copy: "Our Sonipat facility is a vertically integrated powerhouse. Equipped with multi-station rotary injection and advanced Phylon compression molding, we control every variable from polymer compounding to the finished sole.",
  },
  {
    icon: ShieldCheck,
    number: "03",
    title: "Certified Quality Assurance",
    copy: "Quality is our core protocol, not a final check. Our in-house testing laboratory conducts rigorous DIN abrasion, SATRA flex, and REACH chemical compliance tests on every production batch.",
  },
  {
    icon: TrendingUp,
    number: "04",
    title: "Institutional Scalability",
    copy: "Built for global assembly lines. With a daily capacity of 50,000+ pairs, we provide the supply chain security necessary for million-pair monthly contracts without compromising on lead times.",
  },
  {
    icon: Globe,
    number: "05",
    title: "Frictionless Global Logistics",
    copy: "Strategically located to serve South Asian and global footwear hubs. We offer optimized land and sea-freight corridors, ensuring your production schedule remains uninterrupted.",
  },
  {
    icon: Lightbulb,
    number: "06",
    title: "Rapid Prototyping & ODM Solutions",
    copy: "Innovation at the speed of retail. Our in-house CNC tooling facility accelerates your speed-to-market, transforming 2D sketches into production-ready 3D prototypes within days.",
  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export function WhyChooseUs() {
  return (
    <section className="py-16 md:py-24 bg-[#F9F7F4] overflow-hidden">
      <div className="max-w-site mx-auto px-6 lg:px-10">

        {/* Header */}
        <div className="mb-10 md:mb-14">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="type-overline text-[#F5B400] mb-4"
          >
            Why Choose Rajiv Phylon
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="font-display font-medium text-[clamp(1.75rem,3.5vw,2.75rem)] text-foreground tracking-[-0.02em] leading-tight"
          >
            Engineered for <span className="text-[#F5B400]">Global Standards</span>
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0, originX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-3 h-[2px] w-16 bg-[#F5B400] rounded-full"
          />
        </div>

        {/* 6 Pillars */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.number}
                variants={cardVariants}
                className="group bg-white rounded-2xl p-7 border border-gray-100 hover:border-[#F5B400]/30 hover:shadow-[0_20px_60px_-15px_rgba(245,180,0,0.1)] transition-all duration-500"
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-11 h-11 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center group-hover:bg-[#F5B400] group-hover:border-[#F5B400] transition-all duration-500">
                    <Icon className="h-5 w-5 text-[#F5B400] group-hover:text-white transition-colors duration-500" />
                  </div>
                  <span className="font-display font-medium text-[13px] text-gray-300 tracking-[0.1em]">
                    {pillar.number}
                  </span>
                </div>
                <h3 className="font-display font-medium text-[17px] text-foreground mb-3 leading-snug">
                  {pillar.title}
                </h3>
                <p className="text-[14px] text-gray-500 font-body leading-relaxed">
                  {pillar.copy}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
