"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const LOGO_PATH = "/make-in-india-jootoor_orig.gif";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export function MakeInIndiaSection() {
  return (
    <section className="relative bg-[#0A0A0A] min-h-[60vh] flex items-center overflow-hidden">
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
        aria-hidden
      />

      {/* Yellow glow orbs */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.2, 0.12] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-[#F5B400] blur-[120px] pointer-events-none"
        aria-hidden
      />
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.08, 0.15, 0.08] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute -bottom-40 -right-20 w-[400px] h-[400px] rounded-full bg-[#F5B400] blur-[100px] pointer-events-none"
        aria-hidden
      />

      <div className="relative z-10 max-w-site mx-auto px-6 lg:px-10 py-20 md:py-28">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">

          {/* Left — text content */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 mb-6">
              <div className="h-px w-8 bg-[#F5B400]" />
              <span className="type-overline text-[#F5B400]">
                Proudly Indian
              </span>
              <div className="h-px w-8 bg-[#F5B400]" />
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="font-display font-medium text-[clamp(2.25rem,5vw,4.5rem)] text-white tracking-[-0.03em] leading-[1.0] mb-6"
            >
              <span className="text-[#F5B400]">Make in India</span>
            </motion.h2>

            <motion.div variants={fadeUp} className="w-12 h-[2px] bg-[#F5B400] rounded-full mb-8" />

            <motion.p
              variants={fadeUp}
              className="text-lg text-white/55 font-body leading-relaxed max-w-xl"
            >
              Manufacturing excellence from India, delivering high-performance polymer footwear soles to global brands.
            </motion.p>
          </motion.div>

          {/* Right — logo in white card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-[420px] sm:max-w-[480px] aspect-[2/1] rounded bg-white border border-white/10 shadow-2xl flex items-center justify-center p-8 overflow-hidden">
              <div className="absolute -bottom-8 -right-8 w-40 h-40 rounded-full bg-[#F5B400]/5 blur-2xl pointer-events-none" aria-hidden />
              <Image
                src={LOGO_PATH}
                alt="Make in India - Government of India initiative"
                width={480}
                height={240}
                className="object-contain w-full h-full relative z-10"
                unoptimized
                priority
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
