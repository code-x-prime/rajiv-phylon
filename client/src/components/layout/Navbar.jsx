"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getCategories, getSubCategoriesByCategory } from "@/lib/api";
import { Menu, X, Search, Mail, ChevronDown, ArrowRight, Phone } from "lucide-react";
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
      className={`group relative px-3 py-2 text-[13px] font-heading font-extrabold uppercase tracking-widest transition-all duration-300 ${active ? "text-black" : "text-gray-500 hover:text-black"}`}
    >
      <span className="relative z-10">{children}</span>
      <span
        className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] bg-[#F5B400] rounded-full transition-all duration-300 ${active ? "w-4 opacity-100" : "w-0 opacity-0 group-hover:w-4 group-hover:opacity-100"}`}
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
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
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
    const onScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 8);

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down & past header
        setIsVisible(false);
      } else {
        // Scrolling up or at top
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastScrollY]);

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
      {/* Premium Top Bar */}
      <div className="bg-[#050505] text-white py-2 hidden lg:block border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-[11px] font-heading font-bold uppercase tracking-[0.15em]">
          <div className="flex items-center gap-6">
            <a href="tel:01304050921" className="flex items-center gap-2 hover:text-[#F5B400] transition-colors">
              <Phone className="h-3 w-3 text-[#F5B400]" />
              0130-4050921
            </a>
            <a href="mailto:info@rajivphylon.com" className="flex items-center gap-2 hover:text-[#F5B400] transition-colors">
              <Mail className="h-3 w-3 text-[#F5B400]" />
              info@rajivphylon.com
            </a>
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 opacity-80">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              Global Exports: Bangladesh & Sri Lanka
            </span>
            <div className="w-px h-3 bg-white/20" />
            <Link href="/contact" className="hover:text-[#F5B400] transition-colors">
              Corporate Support
            </Link>
          </div>
        </div>
      </div>

      <header
        className={`fixed inset-x-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          scrolled 
            ? "top-0 h-[72px] bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)]" 
            : "top-0 lg:top-9 h-[84px] bg-white/95 backdrop-blur-md border-b border-gray-100"
        } ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
      >
        {/* Dynamic Nav Accent Line */}
        <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#F5B400]/40 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full gap-4">

            {/* Logo Section */}
            <div className="flex items-center shrink-0">
              <Link href="/" className="group relative">
                <div className="absolute -inset-2 bg-[#F5B400]/5 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-300" />
                <Image
                  src="/logo.png"
                  alt="Rajiv Phylon"
                  width={150}
                  height={150}
                  className="w-auto h-10 md:h-12 object-contain relative transition-transform duration-300 group-hover:scale-[1.02]"
                  priority
                />
              </Link>
            </div>

            {/* Desktop Navigation Link Cluster */}
            <nav className="hidden lg:flex items-center justify-center gap-0.5">
              {navLinks.map((link) => (
                <NavLink key={link.href} href={link.href}>
                  {link.label}
                </NavLink>
              ))}

              {/* Enhanced Categories Mega Menu */}
              <div
                className="relative"
                onMouseEnter={openMega}
                onMouseLeave={closeMega}
              >
                <button
                  type="button"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[14px] font-heading font-bold text-gray-700 hover:text-black hover:bg-black/5 transition-all duration-300 group"
                >
                  Solutions
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${megaOpen ? "rotate-180 text-[#F5B400]" : "text-gray-400"}`} />
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
                          {/* Sidebar Accent */}
                          <div className="w-1.5 bg-[#F5B400]" />
                          
                          <div className="flex-1 p-8">
                            <div className="flex items-center justify-between mb-8">
                              <p className="text-[11px] font-heading font-black text-[#F5B400] uppercase tracking-[0.25em]">
                                Industry Solutions
                              </p>
                              <Link href="/products" className="text-[11px] font-heading font-bold text-gray-400 hover:text-black transition-colors">
                                View Catalog
                              </Link>
                            </div>

                            <div className="grid grid-cols-2 gap-x-12 gap-y-8">
                              {categories.map((cat) => (
                                <div key={cat.id} className="group/item">
                                  <Link
                                    href={`/category/${cat.slug}`}
                                    className="flex items-center justify-between font-heading font-extrabold text-[15px] text-[#111111] group-hover/item:text-[#F5B400] transition-colors duration-200"
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
                        
                        {/* Mega Menu Footer */}
                        <div className="bg-gray-50/80 px-8 py-5 flex items-center justify-between border-t border-gray-100">
                          <p className="text-[12px] text-gray-500 font-medium italic">Premium grade quality for industrial OEM partners.</p>
                          <Link
                            href="/contact"
                            className="bg-black text-white text-[11px] font-heading font-bold uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-[#F5B400] hover:text-black transition-all duration-300 shadow-lg shadow-black/10"
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

            {/* Action Group */}
            <div className="flex items-center gap-4 shrink-0">
              <div className="hidden xl:block">
                <HeaderSearch />
              </div>

              <Link
                href="/contact"
                className="hidden md:inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#F5B400] to-[#e0a300] text-black px-6 py-3 font-heading font-black text-[12px] uppercase tracking-wider shadow-[0_10px_20px_-10px_rgba(245,180,0,0.5)] hover:shadow-[0_15px_30px_-10px_rgba(245,180,0,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 border border-white/20"
              >
                <Mail className="h-4 w-4" aria-hidden />
                Start Enquiry
              </Link>

              {/* Secondary Trust Mark */}
              <div className="hidden lg:block h-10 w-px bg-gray-200/60" />
              <div className="hidden lg:block relative group">
                <div className="absolute -inset-2 bg-gray-50 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-300" />
                <Image
                  src="/sec-logo.png"
                  alt="Quality Mark"
                  width={150}
                  height={150}
                  className="h-14 w-auto object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 relative"
                />
              </div>

              {/* Mobile Interaction */}
              <div className="flex items-center gap-2 lg:hidden">
                <button
                  type="button"
                  className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-600 hover:bg-gray-100 transition-all"
                  onClick={() => setSearchOpen(true)}
                  aria-label="Search"
                >
                  <Search className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-black text-white shadow-lg shadow-black/10 transition-all active:scale-95"
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
                <Link href="/" onClick={closeMobile} className="flex items-center justify-between w-full">
                  <Image
                    src="/logo.png"
                    alt="Rajiv Phylon"
                    width={100}
                    height={100}
                    className="h-12 w-auto object-contain"
                  />
                  <span className="hidden sm:inline-block h-6 w-px bg-gray-200" aria-hidden />
                  <Image
                    src="/sec-logo.png"
                    alt="Rajiv Phylon"
                    width={100}
                    height={100}
                    className="h-12 w-auto object-contain"
                  />
                  <span className="hidden sm:inline-block h-6 w-px bg-gray-200" aria-hidden />
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
