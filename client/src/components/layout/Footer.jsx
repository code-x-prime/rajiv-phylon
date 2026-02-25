import Link from "next/link";
import { getCategories } from "@/lib/api";
import { Mail, Phone, MapPin } from "lucide-react";
import Image from "next/image";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

const contactInfo = [
  { icon: Phone, text: "+91 98765 43210", href: "tel:+919876543210" },
  { icon: Mail, text: "info@rajivphylon.com", href: "mailto:info@rajivphylon.com" },
  { icon: MapPin, text: "Delhi, India", href: null },
];

export async function Footer() {
  let categories = [];
  try { categories = await getCategories(); } catch { categories = []; }

  return (
    <footer className="mt-auto">
      {/* Smooth gradient fade from white to dark */}
      <div className="h-16 bg-gradient-to-b from-white to-[#0D0D0D]" aria-hidden />

      {/* Main footer */}
      <section className="bg-[#0D0D0D] text-gray-400">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-10">

            {/* Col 1 — Brand */}
            <div className="lg:col-span-1">
              <Link href="/" className="inline-block">
                <Image
                  src="/logo.png"
                  alt="Rajiv Phylon"
                  width={150}
                  height={150}
                  className="w-32 h-32 object-contain mb-5 bg-white rounded p-2"
                />
              </Link>
              <p className="text-[14px] leading-relaxed text-gray-400 font-body mb-6 max-w-[220px]">
                High-performance polymer footwear soles. Export-grade quality for B2B partners worldwide.
              </p>
              {/* Yellow accent bar */}
              <div className="w-8 h-[3px] rounded-full bg-[#F5B400]" aria-hidden />
            </div>

            {/* Col 2 — Quick Links */}
            <div>
              <h3 className="text-white font-heading font-semibold text-[13px] uppercase tracking-[0.18em] mb-6">
                Quick Links
              </h3>
              <ul className="space-y-3">
                {quickLinks.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-[14px] font-body text-gray-400 hover:text-[#F5B400] transition-colors duration-200 flex items-center gap-2 group"
                    >
                      <span className="block w-0 h-px bg-[#F5B400] group-hover:w-3 transition-all duration-200" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3 — Categories */}
            <div>
              <h3 className="text-white font-heading font-semibold text-[13px] uppercase tracking-[0.18em] mb-6">
                Categories
              </h3>
              <ul className="space-y-3">
                {categories.length > 0
                  ? categories.slice(0, 6).map((cat) => (
                    <li key={cat.id}>
                      <Link
                        href={`/category/${cat.slug}`}
                        className="text-[14px] font-body text-gray-400 hover:text-[#F5B400] transition-colors duration-200 flex items-center gap-2 group"
                      >
                        <span className="block w-0 h-px bg-[#F5B400] group-hover:w-3 transition-all duration-200" />
                        {cat.name}
                      </Link>
                    </li>
                  ))
                  : (
                    <li className="text-[14px] text-gray-600 font-body">No categories yet</li>
                  )
                }
              </ul>
            </div>

            {/* Col 4 — Contact */}
            <div>
              <h3 className="text-white font-heading font-semibold text-[13px] uppercase tracking-[0.18em] mb-6">
                Contact
              </h3>
              <ul className="space-y-4 mb-7">
                {contactInfo.map(({ icon: Icon, text, href }) => (
                  <li key={text}>
                    {href ? (
                      <a
                        href={href}
                        className="flex items-start gap-3 text-[14px] font-body text-gray-400 hover:text-[#F5B400] transition-colors duration-200 group"
                      >
                        <Icon className="h-4 w-4 text-[#F5B400] shrink-0 mt-0.5" />
                        {text}
                      </a>
                    ) : (
                      <span className="flex items-start gap-3 text-[14px] font-body text-gray-400">
                        <Icon className="h-4 w-4 text-[#F5B400] shrink-0 mt-0.5" />
                        {text}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl bg-[#F5B400] text-white px-5 py-2.5 font-heading font-semibold text-[13px] shadow-md hover:bg-[#e0a300] hover:shadow-[0_4px_20px_rgba(245,180,0,0.35)] hover:scale-[1.02] transition-all duration-300"
              >
                Send Enquiry
              </Link>
            </div>

          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800/60" />

        {/* Bottom bar */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[13px] text-gray-500 font-body">
            © {new Date().getFullYear()} Rajiv Phylon. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="text-[13px] text-gray-500 hover:text-[#F5B400] font-body transition-colors duration-200">
              Privacy Policy
            </Link>
            <span className="text-gray-700 text-xs">·</span>
            <Link href="/contact" className="text-[13px] text-gray-500 hover:text-[#F5B400] font-body transition-colors duration-200">
              Contact
            </Link>
          </div>
        </div>
      </section>
    </footer>
  );
}
