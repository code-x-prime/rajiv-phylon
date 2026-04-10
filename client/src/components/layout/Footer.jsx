import Link from "next/link";
import { getCategories } from "@/lib/api";
import { Mail, Phone, MapPin } from "lucide-react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import Image from "next/image";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy-policy" },
];

const contactInfo = [
  { icon: Phone, text: "+91-9253369349", href: "tel:+919253369349" },
  { icon: Phone, text: "0130-4050921", href: "tel:01304050921", isMain: true },
  { icon: Mail, text: "info@rajivphylon.com", href: "mailto:info@rajivphylon.com" },
  { icon: MapPin, text: "Delhi, India", href: null },
];

const socialLinks = [
  { 
    icon: FaFacebookF, 
    href: "https://www.facebook.com/profile.php?id=61577846368987", 
    label: "Facebook",
    colorClass: "bg-[#1877F2]",
    glowClass: "shadow-[#1877F2]/40"
  },
  { 
    icon: FaInstagram, 
    href: "https://www.instagram.com/rajivphylon/?hl=en", 
    label: "Instagram",
    colorClass: "bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]",
    glowClass: "shadow-[#dc2743]/40"
  },
];

export async function Footer() {
  let categories = [];
  try { categories = await getCategories(); } catch { categories = []; }

  return (
    <footer className="mt-auto border-t border-gray-900">
      {/* Premium Transition Barrier */}
      <div className="h-1 bg-gradient-to-r from-transparent via-[#F5B400]/40 to-transparent" />

      {/* Main footer */}
      <section className="bg-[#0A0A0A] text-gray-400 relative overflow-hidden">
        {/* Deep Gradient Radial Overlay for Depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(245,180,0,0.03),transparent_70%)] pointer-events-none" />
        
        {/* Subtle World Map Background with improved blending */}
        <div 
          className="absolute inset-0 opacity-[0.06] pointer-events-none grayscale invert mix-blend-screen"
          style={{
            backgroundImage: "url('/world-map.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">

            {/* Col 1 — Brand Identity */}
            <div className="flex flex-col items-start">
              <Link href="/" className="inline-block transition-transform hover:scale-[1.02] duration-300">
                <div className="bg-white rounded-xl p-3 shadow-lg shadow-white/5 border border-white/10">
                  <Image
                    src="/logo.png"
                    alt="Rajiv Phylon"
                    width={160}
                    height={160}
                    className="w-auto h-12 object-contain"
                  />
                </div>
              </Link>
              <p className="mt-8 text-[15px] leading-relaxed text-gray-400 font-body max-w-[280px]">
                Global leaders in high-performance polymer footwear soles. Engineered for excellence, exported worldwide.
              </p>
              
              {/* Branded Social Icons (Always Colored) */}
              <div className="flex items-center gap-4 mt-8">
                {socialLinks.map(({ icon: Icon, href, label, colorClass, glowClass }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-11 h-11 rounded-xl ${colorClass} flex items-center justify-center text-white shadow-lg ${glowClass} hover:scale-110 hover:-translate-y-1 transition-all duration-300 border border-white/10`}
                    aria-label={label}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Col 2 — Navigation */}
            <div className="lg:pl-8">
              <h3 className="text-white font-heading font-bold text-[14px] uppercase tracking-[0.2em] mb-8 border-l-2 border-[#F5B400] pl-3">
                Quick Navigation
              </h3>
              <ul className="space-y-4">
                {quickLinks.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-[14px] font-body text-gray-400 hover:text-white transition-all duration-200 flex items-center group"
                    >
                      <span className="w-0 group-hover:w-4 h-[1px] bg-[#F5B400] transition-all duration-300 mr-0 group-hover:mr-3" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3 — Solutions */}
            <div>
              <h3 className="text-white font-heading font-bold text-[14px] uppercase tracking-[0.2em] mb-8 border-l-2 border-[#F5B400] pl-3">
                Product Lines
              </h3>
              <ul className="space-y-4">
                {categories.length > 0
                  ? categories.slice(0, 6).map((cat) => (
                    <li key={cat.id}>
                      <Link
                        href={`/category/${cat.slug}`}
                        className="text-[14px] font-body text-gray-400 hover:text-white transition-all duration-200 flex items-center group"
                      >
                        <span className="w-0 group-hover:w-4 h-[1px] bg-[#F5B400] transition-all duration-300 mr-0 group-hover:mr-3" />
                        {cat.name}
                      </Link>
                    </li>
                  ))
                  : (
                    <li className="text-[14px] text-gray-500 italic opacity-60">Inventory syncing...</li>
                  )
                }
              </ul>
            </div>

            {/* Col 4 — Corporate HQ */}
            <div className="bg-white/5 p-7 rounded-2xl border border-white/5 backdrop-blur-sm self-start">
              <h3 className="text-white font-heading font-bold text-[14px] uppercase tracking-[0.2em] mb-6">
                Corporate HQ
              </h3>
              <ul className="space-y-5 mb-8">
                {contactInfo.map(({ icon: Icon, text, href, isMain }) => (
                  <li key={text}>
                    {href ? (
                      <a
                        href={href}
                        className={`flex items-start gap-4 text-[14px] font-body transition-all duration-200 ${
                          isMain ? "text-white font-semibold" : "text-gray-400 hover:text-white"
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-gray-800/50 flex items-center justify-center shrink-0 mt-0.5">
                          <Icon className={`h-4 w-4 ${isMain ? "text-[#F5B400]" : "text-gray-400 opacity-80"}`} />
                        </div>
                        <span className="flex flex-col">
                          {text}
                          {isMain && <span className="text-[9px] font-heading font-black text-[#F5B400] uppercase tracking-tighter mt-1">Direct Hotline</span>}
                        </span>
                      </a>
                    ) : (
                      <span className="flex items-start gap-4 text-[14px] font-body text-gray-400">
                        <div className="w-8 h-8 rounded-lg bg-gray-800/50 flex items-center justify-center shrink-0 mt-0.5">
                          <Icon className="h-4 w-4 text-gray-400 opacity-80" />
                        </div>
                        {text}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className="w-full inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#F5B400] to-[#e0a300] text-black px-6 py-3.5 font-heading font-extrabold text-[13px] uppercase tracking-wider shadow-[0_10px_20px_-10px_rgba(245,180,0,0.5)] hover:shadow-[0_15px_30px_-10px_rgba(245,180,0,0.6)] hover:scale-[1.01] active:scale-[0.98] transition-all duration-300"
              >
                Start an Enquiry
              </Link>
            </div>

          </div>
        </div>

        {/* High-End Technical Divider */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        {/* Polished Bottom Bar */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="space-y-2">
            <p className="text-[13px] text-gray-500 font-body items-center flex gap-2">
               © {new Date().getFullYear()} <span className="text-gray-300 font-semibold">Rajiv Phylon</span> 
               <span className="hidden sm:inline text-gray-700">|</span> 
               All rights reserved worldwide.
            </p>
            <p className="text-[10px] text-gray-600 font-heading font-semibold uppercase tracking-[0.25em]">
              Precision Engineered Footwear Components
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4">
            <Link href="/privacy-policy" className="text-[12px] text-gray-500 hover:text-white font-medium transition-colors duration-200 uppercase tracking-widest">
              Legal Policy
            </Link>
            <Link href="/contact" className="text-[12px] text-gray-500 hover:text-white font-medium transition-colors duration-200 uppercase tracking-widest">
              Global Support
            </Link>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[11px] text-gray-400 font-bold uppercase tracking-tight">System Operational</span>
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
}
