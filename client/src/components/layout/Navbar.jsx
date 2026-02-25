"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getCategories, getSubCategoriesByCategory } from "@/lib/api";
import { Menu, X, Search, Mail, ChevronDown, ArrowRight } from "lucide-react";
import { HeaderSearch } from "./HeaderSearch";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

function NavLink({ href, children, onClick }) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      onClick={onClick}
      className="group relative py-2 text-[14px] font-heading font-medium text-gray-600 hover:text-[#111111] transition-colors duration-200"
    >
      {children}
      <span
        className={`absolute bottom-0 left-0 h-[2px] w-full bg-[#F5B400] origin-left rounded-full transition-transform duration-300 ${active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
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
    getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (!megaOpen || categories.length === 0) return;
    Promise.all(categories.map((c) => getSubCategoriesByCategory(c.id)))
      .then((results) => {
        const map = {};
        categories.forEach((c, i) => { map[c.id] = results[i] || []; });
        setSubsByCategory(map);
      })
      .catch(() => setSubsByCategory({}));
  }, [megaOpen, categories]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
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
      <header
        className={`sticky top-0 z-50 h-[100px] bg-white/95 backdrop-blur-md border-b border-gray-100 transition-shadow duration-300 ${scrolled ? "shadow-[0_2px_20px_rgba(0,0,0,0.08)]" : ""
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full gap-4">

            {/* Logo */}
            <Link href="/" className="shrink-0 flex items-center gap-0 group">
              <Image
                src="/logo.png"
                alt="Rajiv Phylon"
                width={150}
                height={150}
                className="w-32 h-32 object-contain"
              />
            </Link>

            {/* Desktop search */}
            <HeaderSearch />

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <NavLink key={link.href} href={link.href}>
                  {link.label}
                </NavLink>
              ))}

              {/* Categories mega */}
              <div
                className="relative"
                onMouseEnter={openMega}
                onMouseLeave={closeMega}
              >
                <button
                  type="button"
                  className="flex items-center gap-1 py-2 text-[14px] font-heading font-medium text-gray-600 hover:text-[#111111] transition-colors duration-200 group"
                >
                  Categories
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${megaOpen ? "rotate-180" : ""}`} />
                  <span className={`absolute bottom-0 left-0 h-[2px] w-full bg-[#F5B400] origin-left rounded-full transition-transform duration-300 ${megaOpen ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
                </button>

                <AnimatePresence>
                  {megaOpen && categories.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute right-0 top-full pt-3 z-50"
                      onMouseEnter={openMega}
                      onMouseLeave={closeMega}
                    >
                      <div className="bg-white border border-gray-100 shadow-2xl rounded-2xl w-[min(520px,calc(100vw-2rem))] p-6">
                        <p className="text-[11px] font-heading font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">
                          Browse Categories
                        </p>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                          {categories.map((cat) => (
                            <div key={cat.id}>
                              <Link
                                href={`/category/${cat.slug}`}
                                className="group/cat flex items-center gap-1.5 font-heading font-semibold text-[14px] text-[#111111] hover:text-[#F5B400] mb-2 transition-colors duration-200"
                                onClick={() => setMegaOpen(false)}
                              >
                                {cat.name}
                                <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover/cat:opacity-100 group-hover/cat:translate-x-0 transition-all duration-200" />
                              </Link>
                              <ul className="space-y-1">
                                {(subsByCategory[cat.id] || []).slice(0, 4).map((sub) => (
                                  <li key={sub.id}>
                                    <Link
                                      href={`/subcategory/${sub.slug}`}
                                      className="text-[13px] text-gray-400 hover:text-[#111111] transition-colors duration-200 block py-0.5"
                                      onClick={() => setMegaOpen(false)}
                                    >
                                      {sub.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                        <div className="mt-5 pt-4 border-t border-gray-100">
                          <Link
                            href="/products"
                            className="inline-flex items-center gap-1.5 text-[13px] font-heading font-semibold text-[#F5B400] hover:underline"
                            onClick={() => setMegaOpen(false)}
                          >
                            View all products
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:block shrink-0">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#F5B400] text-white px-5 py-2.5 font-heading font-semibold text-[13px] shadow-sm hover:bg-[#e0a300] hover:shadow-[0_4px_16px_rgba(245,180,0,0.35)] hover:scale-[1.02] transition-all duration-300"
              >
                <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden />
                Enquiry
              </Link>
            </div>

            {/* Mobile icons */}
            <div className="flex items-center gap-1 lg:hidden">
              <button
                type="button"
                className="p-2.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="p-2.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-[60] lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/50"
              onClick={closeMobile}
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl flex flex-col"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <Link href="/" onClick={closeMobile} className="flex items-center">
                  <span className="font-heading text-[18px] font-bold text-[#111111]">Rajiv</span>
                  <span className="font-heading text-[18px] font-bold text-[#F5B400] ml-1">Phylon</span>
                </Link>
                <button
                  type="button"
                  className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                  onClick={closeMobile}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drawer nav */}
              <nav className="flex-1 overflow-y-auto px-5 py-5">
                <div className="space-y-1 mb-6">
                  {[{ href: "/", label: "Home" }, ...navLinks].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeMobile}
                      className="flex items-center justify-between py-3.5 px-2 rounded-xl text-[15px] font-heading font-medium text-gray-700 hover:text-[#111111] hover:bg-gray-50 transition-all duration-150"
                    >
                      {link.label}
                      <ArrowRight className="h-4 w-4 text-gray-300" />
                    </Link>
                  ))}
                </div>

                {categories.length > 0 && (
                  <div className="border-t border-gray-100 pt-5">
                    <p className="text-[11px] font-heading font-bold text-gray-400 uppercase tracking-[0.2em] mb-3 px-2">
                      Categories
                    </p>
                    <div className="space-y-0.5">
                      {categories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/category/${cat.slug}`}
                          onClick={closeMobile}
                          className="flex items-center justify-between py-2.5 px-2 rounded-xl text-[14px] font-body text-gray-600 hover:text-[#111111] hover:bg-gray-50 transition-all duration-150"
                        >
                          {cat.name}
                          <span className="w-1.5 h-1.5 rounded-full bg-[#F5B400]" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </nav>

              {/* Drawer footer CTA */}
              <div className="px-5 py-5 border-t border-gray-100">
                <Link
                  href="/contact"
                  onClick={closeMobile}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#F5B400] text-white px-6 py-3.5 font-heading font-bold text-sm hover:bg-[#e0a300] transition-colors duration-200"
                >
                  <Mail className="h-4 w-4" />
                  Send Enquiry
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <div className="fixed inset-0 z-[70] lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSearchOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-4 top-16 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
              style={{ maxHeight: "calc(100vh - 5rem)" }}
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <span className="font-heading font-semibold text-[#111111]">Search</span>
                <button
                  type="button"
                  className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
                  onClick={() => setSearchOpen(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-4 overflow-y-auto" style={{ maxHeight: "calc(100vh - 9rem)" }}>
                <HeaderSearch variant="dialog" onClose={() => setSearchOpen(false)} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
