"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import Image from "next/image";

// Current export markets – keep this list honest & focused.
const COUNTRIES = [
  { name: "Bangladesh", flag: "/bangladesh.jpg" },
  { name: "Sri Lanka", flag: "/sri-lanka.jpg" },
];

const itemVariants = {
  hidden: { opacity: 0, scale: 0.85, y: 16 },
  show: {
    opacity: 1, scale: 1, y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  },
};

export function ExportCountries() {
  return (
    <section className="py-10  bg-[#F9FAFB] border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-10 md:mb-12">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[11px] font-heading font-bold text-[#F5B400] uppercase tracking-[0.25em] mb-3"
          >
            Our reach
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-[#111111] tracking-tight"
          >
            We Export To
          </motion.h2>
        </div>

        {/* Country cards — only 2, so make them large and prominent */}
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {COUNTRIES.map((c) => (
              <motion.div
                key={c.name}
                variants={itemVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-40px" }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="group flex items-center gap-3 md:gap-4 bg-white border border-gray-200 rounded-3xl px-5 py-4 md:px-7 md:py-5 shadow-sm hover:border-[#F5B400]/60 hover:shadow-lg transition-all duration-200 cursor-default"
              >
                <div className="flex items-center justify-center w-14 h-11 md:w-16 md:h-12 rounded-2xl bg-[#FFF7E0] text-2xl">
                  <Image src={c.flag} alt={c.name} width={100} height={100} className="rounded-md h-full w-full object-cover" />
                </div>
                <div className="flex flex-col">
                  <span className="font-heading font-semibold text-[15px] md:text-[17px] text-[#111111] group-hover:text-[#F5B400] transition-colors duration-200">
                    {c.name}
                  </span>
                  <span className="text-[11px] md:text-[12px] text-gray-500 font-body">
                    Current export market
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-8 text-sm text-gray-400 font-body flex items-center justify-center gap-1.5"
        >
          <MapPin className="h-3.5 w-3.5 text-[#F5B400]" />
          Actively partnering with brands in Bangladesh and Sri Lanka
        </motion.p>

      </div>
    </section>
  );
}
