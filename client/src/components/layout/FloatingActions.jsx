"use client";

import { useState, useEffect } from "react";
import { Phone, ArrowUp } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export function FloatingActions() {
    const [isVisible, setIsVisible] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);

    const phoneNumber = "+919999999999"; // Replace with actual number
    const whatsappLink = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, "")}`;

    useEffect(() => {
        const handleScroll = () => {
            const currentScroll = window.scrollY;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

            // Calculate progress percentage
            const progress = scrollHeight > 0 ? (currentScroll / scrollHeight) * 100 : 0;
            setScrollProgress(progress);

            // Show actions after scrolling 400px
            if (currentScroll > 400) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

    return (
        <AnimatePresence>
            {isVisible && (
                <>
                    {/* Bottom Right Actions (WhatsApp & Call) */}
                    <div className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 z-[100] flex flex-col gap-4">
                        <motion.a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: 20 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="bg-[#25D366] text-white p-3.5 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center justify-center relative overflow-hidden group"
                            aria-label="Contact on WhatsApp"
                        >
                            <span className="absolute inset-0 w-full h-full bg-white/20 scale-0 group-hover:scale-150 transition-transform duration-500 rounded-full" />
                            <FaWhatsapp className="w-6 h-6 relative z-10" />
                        </motion.a>

                        <motion.a
                            href={`tel:${phoneNumber}`}
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: 20 }}
                            transition={{ delay: 0.1 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="bg-[#F5B400] text-white p-3.5 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center justify-center relative overflow-hidden group"
                            aria-label="Call Us"
                        >
                            <span className="absolute inset-0 w-full h-full bg-white/20 scale-0 group-hover:scale-150 transition-transform duration-500 rounded-full" />
                            <Phone className="w-6 h-6 relative z-10" />
                        </motion.a>
                    </div>

                    {/* Bottom Left Action (Scroll to Top with Progress) */}
                    <motion.div
                        className="fixed bottom-6 left-6 lg:bottom-10 lg:left-10 z-[100]"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <button
                            onClick={scrollToTop}
                            className="relative w-14 h-14 flex items-center justify-center bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-full group overflow-hidden"
                            aria-label="Scroll to top"
                        >
                            {/* SVG Progress Circle */}
                            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                                {/* Background Ring */}
                                <circle
                                    cx="28"
                                    cy="28"
                                    r={radius}
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    fill="transparent"
                                    className="text-gray-100"
                                />
                                {/* Progress Ring */}
                                <circle
                                    cx="28"
                                    cy="28"
                                    r={radius}
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    fill="transparent"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={strokeDashoffset}
                                    strokeLinecap="round"
                                    className="text-[#F5B400] transition-all duration-300 ease-out"
                                />
                            </svg>
                            {/* Arrow Icon */}
                            <ArrowUp className="w-5 h-5 text-gray-700 group-hover:text-[#F5B400] group-hover:-translate-y-1 transition-all duration-300 relative z-10" />
                        </button>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
