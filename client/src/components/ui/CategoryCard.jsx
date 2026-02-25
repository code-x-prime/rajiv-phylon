"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const PLACEHOLDER_IMAGE = "/placeholder.png";

export function CategoryCard({ category, href, subcategoryCount }) {
  const url = href ?? `/category/${category.slug}`;
  const imageUrl = category.imageUrl || category.image || PLACEHOLDER_IMAGE;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
    >
      <Link
        href={url}
        className="group block rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:border-[#F5B400]/30 transition-all duration-300"
      >
        {/* Image */}
        <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
          <Image
            src={imageUrl}
            alt={category.name}
            fill
            className="object-cover group-hover:scale-[1.06] transition-transform duration-600 ease-out"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 280px"
          />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" aria-hidden />

          {/* Arrow icon top-right */}
          <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/0 border border-white/0 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:bg-white/90 group-hover:border-white transition-all duration-300">
            <ArrowUpRight className="h-4 w-4 text-[#111111]" />
          </div>

          {/* Bottom sweep */}
          <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-[#F5B400] group-hover:w-full transition-all duration-500 ease-out" aria-hidden />
        </div>

        {/* Content */}
        <div className="p-4 lg:p-5 border-t border-gray-100 flex items-center justify-between gap-3">
          <div>
            <h3 className="font-heading font-bold text-[15px] text-[#111111] group-hover:text-[#F5B400] transition-colors duration-200 leading-snug">
              {category.name}
            </h3>
            {subcategoryCount != null && (
              <p className="text-[12px] text-gray-400 font-body mt-0.5">
                {subcategoryCount} subcategor{subcategoryCount !== 1 ? "ies" : "y"}
              </p>
            )}
          </div>
          <div className="w-8 h-8 rounded-xl bg-[#F5B400]/10 border border-[#F5B400]/20 flex items-center justify-center shrink-0 group-hover:bg-[#F5B400] group-hover:border-[#F5B400] transition-all duration-300">
            <ArrowUpRight className="h-4 w-4 text-[#F5B400] group-hover:text-white transition-colors duration-300" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
