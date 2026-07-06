"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import Image from "next/image";

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
    <section className="py-16 md:py-20 bg-[#F9FAFB] border-b border-gray-100">
      <div className="max-w-site mx-auto px-6 lg:px-10">

        {/* Header */}
        <div className="text-center mb-12 md:mb-14">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="type-overline text-[#F5B400] mb-4"
          >
            Our reach
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="font-display font-medium text-[clamp(1.75rem,3.5vw,3rem)] text-[#111111] tracking-[-0.02em]"
          >
            We Export To
          </motion.h2>
        </div>

        {/* Country cards */}
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
                <div className="flex items-center justify-center w-14 h-11 md:w-16 md:h-12 rounded-2xl bg-[#FFF7E0] text-2xl overflow-hidden">
                  <Image src={c.flag} alt={c.name} width={100} height={100} className="rounded-md h-full w-full object-cover" />
                </div>
                <div className="flex flex-col">
                  <span className="font-display font-medium text-[15px] md:text-[17px] text-[#111111] group-hover:text-[#F5B400] transition-colors duration-200">
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
          className="text-center mt-10 text-sm text-gray-400 font-body flex items-center justify-center gap-1.5"
        >
          <MapPin className="h-3.5 w-3.5 text-[#F5B400]" />
          Actively partnering with brands in Bangladesh and Sri Lanka
        </motion.p>

      </div>
    </section>
  );
}
