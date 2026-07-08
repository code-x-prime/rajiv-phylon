"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getCategories, getSubCategoriesByCategory } from "@/lib/api";
import { Menu, X, Search, Mail, ChevronDown, ArrowRight, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

function NavLink({ href, children, onClick, scrolled }) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`group relative px-4 py-2 text-[14px] font-display font-medium tracking-[0.04em] transition-all duration-300 ${scrolled
        ? "text-gray-600 hover:text-black"
        : "text-white/80 hover:text-white"
        }`}
    >
      <span className="relative z-10">{children}</span>
      <span
        className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-[#F5B400] rounded-full transition-all duration-300 ${active ? "w-5 opacity-100" : "w-0 opacity-0 group-hover:w-5 group-hover:opacity-100"
          }`}
      />
    </Link>
  );
}

export function Navbar() {
  const [categories, setCategories] = useState([]);
  const [subsByCategory, setSubsByCategory] = useState({});
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const megaTimeout = useRef(null);

  useEffect(() => {
    const mapped = [
      { id: "eva-soles", name: "EVA Soles", slug: "eva-soles" },
      { id: "phylon-soles", name: "Phylon Soles", slug: "phylon-soles" },
      { id: "semi-phylon-soles", name: "Semi Phylon Soles", slug: "semi-phylon-soles" }
    ];
    setCategories(mapped);
  }, []);

  useEffect(() => {
    if (!megaOpen || categories.length === 0) return;
    const subMap = {
      "eva-soles": [
        { id: "for-men", name: "For Men", slug: "for-men" },
        { id: "for-women", name: "For Women", slug: "for-women" },
        { id: "for-kids", name: "For Kids", slug: "for-kids" },
      ],
      "phylon-soles": [
        { id: "for-men", name: "For Men", slug: "for-men" },
        { id: "for-women", name: "For Women", slug: "for-women" },
        { id: "for-kids", name: "For Kids", slug: "for-kids" },
      ],
      "semi-phylon-soles": [
        { id: "for-men", name: "For Men", slug: "for-men" },
        { id: "for-women", name: "For Women", slug: "for-women" },
        { id: "for-kids", name: "For Kids", slug: "for-kids" },
      ]
    };
    setSubsByCategory(subMap);
  }, [megaOpen, categories]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen || searchOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen, searchOpen]);

  const navLinks = [
    { href: "/products", label: "Products" },
    { href: "/about", label: "About" },
    { href: "/gallery", label: "Gallery" },
    { href: "/contact", label: "Contact" },
  ];

  const openMega = () => {
    clearTimeout(megaTimeout.current);
    setMegaOpen(true);
  };
  const closeMega = () => {
    megaTimeout.current = setTimeout(() => setMegaOpen(false), 120);
  };
  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      {/* ═══════════════════════════════════════════════════════
          TOP BAR — always sticky, dark over hero, white on scroll
      ═══════════════════════════════════════════════════════ */}
      <div className={`fixed inset-x-0 z-[51] hidden lg:block top-0 transition-colors duration-300 ${scrolled ? "bg-white border-b border-gray-100" : "bg-[#0A0A0A]"
        }`}>
        <div className="max-w-site mx-auto px-6 lg:px-10 flex justify-between items-center py-2 text-[11px] font-body font-semibold uppercase tracking-[0.12em]">
          <div className={`flex items-center gap-6 transition-colors duration-300 ${scrolled ? "text-gray-500" : "text-white/70"}`}>
            <a href="tel:01304050921" className="flex items-center gap-2 hover:text-[#F5B400] transition-colors">
              <Phone className="h-3 w-3 text-[#F5B400]" />
              0130-4050921
            </a>
            <a href="mailto:info@rajivphylon.com" className="flex items-center gap-2 hover:text-[#F5B400] transition-colors">
              <Mail className="h-3 w-3 text-[#F5B400]" />
              info@rajivphylon.com
            </a>
          </div>
          <div className={`flex items-center gap-6 transition-colors duration-300 ${scrolled ? "text-gray-500" : "text-white/70"}`}>
            <div className={`w-px h-3 transition-colors duration-300 ${scrolled ? "bg-gray-200" : "bg-white/20"}`} />
            <Link href="/contact" className="hover:text-[#F5B400] transition-colors">
              Corporate Support
            </Link>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          HEADER — transparent over hero, white glass on scroll
      ═══════════════════════════════════════════════════════ */}
      <header
        className={`fixed inset-x-0 z-50 transition-all duration-300 ${scrolled
          ? "top-0 lg:top-[32px] h-[56px] bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
          : "top-0 lg:top-[32px] h-[56px] bg-transparent border-b border-white/[0.06]"
          }`}
      >
        {/* Gold accent line — only when scrolled */}
        {scrolled && (
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#F5B400]/25 to-transparent" />
        )}

        <div className="max-w-site mx-auto px-6 lg:px-10 h-full">
          <div className="flex items-center justify-between h-full gap-6">

            {/* Left: Primary Logo + divider + Secondary Logo */}
            <div className="flex items-center gap-4 shrink-0 font-body">
              <Link href="/" className="group relative">
                <div className="absolute -inset-2 bg-[#F5B400]/5 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-300" />
                {scrolled ? (
                  <Image
                    src="/logo.png"
                    alt="Rajiv Phylon"
                    width={150}
                    height={150}
                    className="w-auto h-7 lg:h-10 object-contain relative transition-transform duration-300 group-hover:scale-[1.02]"
                    priority
                  />
                ) : (
                  <Image
                    src="/logo-w-lg.png"
                    alt="Rajiv Phylon"
                    width={150}
                    height={150}
                    className="w-auto h-8 lg:h-11 object-contain relative transition-transform duration-300 group-hover:scale-[1.02]"
                    priority
                  />
                )}
              </Link>

              {/* Vertical Divider between logos — desktop only */}
              <div className={`hidden lg:block h-8 w-[1px] ${scrolled ? "bg-gray-300" : "bg-white/40"}`} />

              {/* Secondary Logo — desktop only */}
              <div className="hidden lg:block relative group">
                <div className="absolute -inset-2 bg-white/5 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-300" />
                {scrolled ? (
                  <Image
                    src="/sec-logo.png"
                    alt="Quality Mark"
                    width={150}
                    height={150}
                    className="h-9 w-auto object-contain transition-all duration-500 relative"
                  />
                ) : (
                  <Image
                    src="/sec-logo.png"
                    alt="Quality Mark"
                    width={150}
                    height={150}
                    className="h-9 w-auto object-contain brightness-0 invert opacity-90 transition-all duration-500 relative"
                  />
                )}
              </div>
            </div>

            {/* Center: Desktop Navigation */}
            <nav className="hidden lg:flex items-center justify-center gap-0.5">
              {navLinks.map((link) => (
                <NavLink key={link.href} href={link.href} scrolled={scrolled}>
                  {link.label}
                </NavLink>
              ))}

              {/* Solutions Mega Menu */}
              <div
                className="relative"
                onMouseEnter={openMega}
                onMouseLeave={closeMega}
              >
                <button
                  type="button"
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-[14px] font-display font-medium transition-all duration-300 group ${scrolled
                    ? "text-gray-600 hover:text-black hover:bg-black/5"
                    : "text-white/80 hover:text-white hover:bg-white/[0.06]"
                    }`}
                >
                  Solutions
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${megaOpen ? "rotate-180 text-[#F5B400]" : scrolled ? "text-gray-400" : "text-white/40"}`} />
                </button>

                <AnimatePresence>
                  {megaOpen && categories.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute right-0 top-full pt-4 z-50 w-[540px]"
                    >
                      <div className="bg-white/95 backdrop-blur-2xl border border-gray-200/50 shadow-[0_20px_50px_rgba(0,0,0,0.12)] rounded-2xl overflow-hidden">
                        <div className="flex">
                          <div className="w-1.5 bg-[#F5B400]" />
                          <div className="flex-1 p-8">
                            <div className="flex items-center justify-between mb-8">
                              <p className="type-overline text-[#F5B400]">Industry Solutions</p>
                              <Link href="/products" className="text-[11px] font-body font-semibold text-gray-400 hover:text-black transition-colors">View Catalog</Link>
                            </div>
                            <div className="grid grid-cols-2 gap-x-12 gap-y-8">
                              {categories.map((cat) => (
                                <div key={cat.id} className="group/item">
                                  <Link
                                    href={`/category/${cat.slug}`}
                                    className="flex items-center justify-between font-display font-medium text-[15px] text-[#111111] group-hover/item:text-[#F5B400] transition-colors duration-200"
                                    onClick={() => setMegaOpen(false)}
                                  >
                                    {cat.name}
                                    <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-300" />
                                  </Link>
                                  <div className="mt-3 space-y-1.5">
                                    {(subsByCategory[cat.id] || []).slice(0, 3).map((sub) => (
                                      <Link
                                        key={sub.id}
                                        href={`/subcategory/${sub.slug}`}
                                        className="text-[13px] text-gray-400 hover:text-black hover:translate-x-1 transition-all duration-200 block"
                                        onClick={() => setMegaOpen(false)}
                                      >
                                        {sub.name}
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="bg-gray-50/80 px-8 py-5 flex items-center justify-between border-t border-gray-100">
                          <p className="text-[12px] text-gray-500 font-medium italic">Premium grade quality for industrial OEM partners.</p>
                          <Link
                            href="/contact"
                            className="bg-black text-white text-[11px] font-display font-medium uppercase tracking-[0.15em] px-4 py-2 rounded-lg hover:bg-[#F5B400] hover:text-black transition-all duration-300 shadow-lg shadow-black/10"
                            onClick={() => setMegaOpen(false)}
                          >
                            Custom Quote
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            {/* Right: Action Group */}
            <div className="flex items-center gap-2 lg:gap-4 shrink-0">
              {/* Desktop Search Icon */}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className={`hidden lg:flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${scrolled
                  ? "text-gray-500 hover:text-black hover:bg-gray-100"
                  : "text-white/70 hover:text-white hover:bg-white/[0.08]"
                  }`}
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Desktop Enquiry Button */}
              <Link
                href="/contact"
                className={`hidden lg:inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 font-display font-medium text-[12px] uppercase tracking-[0.1em] transition-all duration-300 ${scrolled
                  ? "bg-gradient-to-r from-[#F5B400] to-[#e0a300] text-black shadow-[0_8px_16px_-8px_rgba(245,180,0,0.4)] hover:shadow-[0_12px_24px_-8px_rgba(245,180,0,0.5)] hover:scale-[1.02] active:scale-[0.98]"
                  : "bg-[#F5B400] text-black hover:bg-[#e0a300] hover:scale-[1.02] active:scale-[0.98]"
                  }`}
              >
                <Mail className="h-3.5 w-3.5" aria-hidden />
                Start Enquiry
              </Link>

              {/* Mobile Icons */}
              <div className="flex items-center gap-1 lg:hidden">
                <button
                  type="button"
                  className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${scrolled ? "text-gray-600 hover:bg-gray-100" : "text-white hover:bg-white/[0.1]"
                    }`}
                  onClick={() => setSearchOpen(true)}
                  aria-label="Search"
                >
                  <Search className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all active:scale-95 ${scrolled ? "text-gray-600 hover:bg-gray-100" : "text-white hover:bg-white/[0.1]"
                    }`}
                  onClick={() => setMobileOpen(true)}
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-[60] lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/40"
              onClick={closeMobile}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl flex flex-col"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <Link href="/" onClick={closeMobile} className="flex items-center gap-3 w-full">
                  <Image src="/sec-logo.png" alt="Quality Mark" width={100} height={100} className="h-9 w-auto object-contain" />
                  <span className="h-6 w-px bg-gray-200" aria-hidden />
                  <Image src="/logo.png" alt="Rajiv Phylon" width={100} height={100} className="h-9 w-auto object-contain" />
                </Link>
                <button type="button" className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors" onClick={closeMobile}>
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drawer nav */}
              <nav className="flex-1 overflow-y-auto px-5 py-5">
                <div className="space-y-1 mb-6">
                  {[{ href: "/", label: "Home" }, ...navLinks].map((link) => (
                    <Link key={link.href} href={link.href} onClick={closeMobile} className="flex items-center justify-between py-3.5 px-2 rounded-xl text-[16px] font-display font-medium text-gray-700 hover:text-[#111111] hover:bg-gray-50 transition-all duration-150">
                      {link.label}
                      <ArrowRight className="h-4 w-4 text-gray-300" />
                    </Link>
                  ))}
                </div>
                {categories.length > 0 && (
                  <div className="border-t border-gray-100 pt-5">
                    <p className="type-overline text-gray-400 mb-3 px-2">Categories</p>
                    <div className="space-y-3">
                      {categories.map((cat) => {
                        const subs = subsByCategory[cat.id] || [];
                        return (
                          <div key={cat.id} className="space-y-1">
                            <Link href={`/products?category=${cat.slug}`} onClick={closeMobile} className="flex items-center justify-between py-1.5 px-2 rounded-xl text-[14px] font-body text-gray-600 hover:text-[#111111] hover:bg-gray-50 transition-all">
                              <span className="font-semibold text-gray-900">{cat.name}</span>
                              <span className="w-1.5 h-1.5 rounded-full bg-[#F5B400]" />
                            </Link>
                            <div className="pl-5 flex flex-col gap-1.5">
                              {subs.map((s) => (
                                <Link
                                  key={s.id}
                                  href={`/products?category=${cat.slug}&subcategory=${s.slug}`}
                                  onClick={closeMobile}
                                  className="text-[13px] text-gray-400 hover:text-[#F5B400] transition-colors block py-0.5"
                                >
                                  {s.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </nav>

              {/* Drawer footer CTA */}
              <div className="px-5 py-5 border-t border-gray-100">
                <Link href="/contact" onClick={closeMobile} className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#F5B400] text-white px-6 py-3.5 font-display font-medium text-sm hover:bg-[#e0a300] transition-colors duration-200">
                  <Mail className="h-4 w-4" />
                  Send Enquiry
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Desktop search overlay — slides down below header */}
      <AnimatePresence>
        {searchOpen && (
          <div className="fixed inset-x-0 z-[55] hidden lg:block">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/30"
              onClick={() => setSearchOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative mx-auto max-w-site px-6 lg:px-10 top-[100px]"
            >
              <div className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center gap-3">
                    <Search className="h-5 w-5 text-gray-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="Search products, categories, solutions..."
                      className="flex-1 text-[15px] font-body text-[#111111] placeholder:text-gray-400 focus:outline-none bg-transparent"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setSearchOpen(false)}
                      className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="border-t border-gray-100 px-4 py-3 bg-gray-50/50">
                  <p className="text-[11px] font-body font-semibold uppercase tracking-[0.1em] text-gray-400 mb-2">Popular Searches</p>
                  <div className="flex flex-wrap gap-2">
                    {["Polymer Soles", "TPR Soles", "EVA Soles", "Safety Footwear", "Custom Solutions"].map((term) => (
                      <span key={term} className="text-[12px] font-body text-gray-600 bg-white border border-gray-200 rounded-lg px-3 py-1.5 hover:border-[#F5B400] hover:text-[#111111] cursor-pointer transition-colors">
                        {term}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile search overlay — slides down below header */}
      <AnimatePresence>
        {searchOpen && (
          <div className="fixed inset-x-0 z-[55] lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/30"
              onClick={() => setSearchOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative top-[60px] mx-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center gap-3">
                    <Search className="h-5 w-5 text-gray-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      className="flex-1 text-[15px] font-body text-[#111111] placeholder:text-gray-400 focus:outline-none bg-transparent"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setSearchOpen(false)}
                      className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="border-t border-gray-100 px-4 py-3 bg-gray-50/50">
                  <p className="text-[11px] font-body font-semibold uppercase tracking-[0.1em] text-gray-400 mb-2">Popular</p>
                  <div className="flex flex-wrap gap-2">
                    {["Polymer Soles", "TPR Soles", "EVA Soles"].map((term) => (
                      <span key={term} className="text-[12px] font-body text-gray-600 bg-white border border-gray-200 rounded-lg px-3 py-1.5 hover:border-[#F5B400] hover:text-[#111111] cursor-pointer transition-colors">
                        {term}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
