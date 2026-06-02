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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0">

            {/* Col 1 — Brand Identity */}
            <div className="flex flex-col items-start pb-8 md:pb-0 md:pr-10 lg:pr-16 md:border-r md:border-white/10">
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
              
              <a 
                href="https://www.rajivphylon.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-6 text-[15px] font-heading font-semibold text-[#F5B400] hover:text-white transition-colors duration-200"
              >
                www.rajivphylon.com
              </a>
              
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

            {/* Col 2 — Corporate HQ / Connect with Us */}
            <div className="flex flex-col pb-8 md:pb-0 md:px-10 lg:px-16 md:border-r md:border-white/10">
              <h3 className="text-white font-heading font-bold text-[14px] uppercase tracking-[0.2em] mb-8 border-l-2 border-[#F5B400] pl-3">
                Connect With Us
              </h3>
              <ul className="space-y-6 mb-8">
                <li className="flex items-start gap-4 text-[14px] font-body text-gray-400">
                  <div className="w-8 h-8 rounded-lg bg-gray-800/50 flex items-center justify-center shrink-0 mt-0.5 border border-white/5">
                    <MapPin className="h-4 w-4 text-[#F5B400]" />
                  </div>
                  <span className="flex flex-col">
                    <strong className="text-white font-semibold">Rajiv Phylon Pvt. Ltd.</strong>
                    <span className="mt-1 leading-relaxed">
                      Manufacturing & Export Office, Delhi, India
                    </span>
                  </span>
                </li>
                
                <li>
                  <a
                    href="tel:+919253369349"
                    className="flex items-start gap-4 text-[14px] font-body text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-800/50 flex items-center justify-center shrink-0 mt-0.5 border border-white/5">
                      <Phone className="h-4 w-4 text-gray-400 opacity-80" />
                    </div>
                    <span className="flex flex-col">
                      <span>+91-9253369349</span>
                      <span className="text-[10px] text-gray-500">Mon–Sat, 9am–6pm IST</span>
                    </span>
                  </a>
                </li>

                <li>
                  <a
                    href="tel:01304050921"
                    className="flex items-start gap-4 text-[14px] font-body text-white font-semibold hover:text-[#F5B400] transition-colors duration-200"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-800/50 flex items-center justify-center shrink-0 mt-0.5 border border-white/5">
                      <Phone className="h-4 w-4 text-[#F5B400]" />
                    </div>
                    <span className="flex flex-col">
                      <span>0130-4050921</span>
                      <span className="text-[9px] font-heading font-black text-[#F5B400] uppercase tracking-tighter mt-1">Direct Hotline</span>
                    </span>
                  </a>
                </li>

                <li>
                  <a
                    href="mailto:info@rajivphylon.com"
                    className="flex items-start gap-4 text-[14px] font-body text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-800/50 flex items-center justify-center shrink-0 mt-0.5 border border-white/5">
                      <Mail className="h-4 w-4 text-gray-400 opacity-80" />
                    </div>
                    <span>info@rajivphylon.com</span>
                  </a>
                </li>
              </ul>
              
              <Link
                href="/contact"
                className="w-full inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#F5B400] to-[#e0a300] text-black px-6 py-3.5 font-heading font-extrabold text-[13px] uppercase tracking-wider shadow-[0_10px_20px_-10px_rgba(245,180,0,0.5)] hover:shadow-[0_15px_30px_-10px_rgba(245,180,0,0.6)] hover:scale-[1.01] active:scale-[0.98] transition-all duration-300"
              >
                Start an Enquiry
              </Link>
            </div>

            {/* Col 3 — Solutions / Navigation in Chevron-List Style */}
            <div className="flex flex-col md:pl-10 lg:pl-16">
              <h3 className="text-white font-heading font-bold text-[14px] uppercase tracking-[0.2em] mb-8 border-l-2 border-[#F5B400] pl-3">
                Product Lines
              </h3>
              <div className="divide-y divide-white/5 border-t border-b border-white/5">
                {(categories.length > 0 ? categories.slice(0, 4) : [
                  { name: "Phylon Soles", slug: "phylon-soles" },
                  { name: "PU Soles", slug: "pu-soles" },
                  { name: "TPR Soles", slug: "tpr-soles" },
                  { name: "EVA Soles", slug: "eva-soles" }
                ]).map((cat) => (
                  <Link
                    key={cat.slug || cat.id}
                    href={`/category/${cat.slug}`}
                    className="py-4 flex items-center justify-between group text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    <div className="flex flex-col">
                      <span className="text-[15px] font-body font-medium text-gray-300 group-hover:text-[#F5B400] transition-colors duration-200">
                        {cat.name}
                      </span>
                      <span className="text-[11px] text-gray-500 font-heading tracking-wider mt-1 uppercase">
                        Premium Footwear Soles
                      </span>
                    </div>
                    <span className="text-gray-600 group-hover:text-[#F5B400] transition-all duration-300 transform group-hover:translate-x-1 text-sm font-bold">
                      &gt;
                    </span>
                  </Link>
                ))}
              </div>
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
