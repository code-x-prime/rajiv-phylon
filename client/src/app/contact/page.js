import { ContactForm } from "@/components/ContactForm";
import { ContactHero } from "@/components/contact/ContactHero";
import { Mail, Phone, MapPin, ExternalLink, MessageCircle, Clock } from "lucide-react";

const MAP_EMBED_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3493.9037402075064!2d77.13670957550958!3d28.871481075535154!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xa5a7db300cd4dd53%3A0x77c9e1bd3ef9ae6b!2sRAJIV%20PHYLON%20PRIVATE%20LIMITED!5e0!3m2!1sen!2sin!4v1771908168013!5m2!1sen!2sin";
const MAP_LINK = "https://maps.app.goo.gl/ZCHrQfTuJ1LuCrT1A";

const CONTACT_DETAILS = [
  {
    icon: Mail,
    label: "Email",
    value: "info@rajivphylon.com",
    href: "mailto:info@rajivphylon.com",
    desc: "We reply within 24 hours",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+91 98765 43210",
    href: "tel:+919876543210",
    desc: "Mon–Sat, 9am–6pm IST",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "Chat on WhatsApp",
    href: "https://wa.me/919876543210",
    desc: "Quick B2B enquiries",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "Rajiv Phylon Pvt. Ltd.",
    href: MAP_LINK,
    desc: "Manufacturing & Export Office, Delhi",
  },
];

const TRUST_POINTS = [
  "25+ years of manufacturing experience",
  "Export to 15+ countries worldwide",
  "Trusted by 40+ footwear brands",
  "ISO certified quality standards",
];

export const metadata = {
  title: "Contact | Rajiv Phylon",
  description: "Get in touch for quotes, bulk orders, and partnership inquiries. Export-grade B2B enquiry.",
};

export default function ContactPage() {
  return (
    <div className="bg-white overflow-x-hidden">
      {/* Hero */}
      <ContactHero />

      {/* Main content */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_520px] gap-12 lg:gap-16 items-start">

            {/* Left — Info */}
            <div>
              <p className="text-[11px] font-heading font-bold text-[#F5B400] uppercase tracking-[0.25em] mb-3">
                Get in touch
              </p>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#111111] tracking-tight mb-4 leading-tight">
                Let&apos;s build something<br />
                <span className="text-[#F5B400]">great together</span>
              </h2>
              <p className="text-[15px] text-gray-500 font-body leading-relaxed mb-10 max-w-md">
                Reach out for product information, bulk quotes, or partnership opportunities. We respond to all B2B and export enquiries promptly.
              </p>

              {/* Contact cards */}
              <div className="grid sm:grid-cols-2 gap-4 mb-10">
                {CONTACT_DETAILS.map(({ icon: Icon, label, value, href, desc }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="group flex items-start gap-4 p-5 rounded-2xl border border-gray-100 bg-[#FAFAFA] hover:border-[#F5B400]/40 hover:bg-white hover:shadow-md transition-all duration-300"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#F5B400]/10 border border-[#F5B400]/20 flex items-center justify-center shrink-0 group-hover:bg-[#F5B400] group-hover:border-[#F5B400] transition-all duration-300">
                      <Icon className="h-4.5 w-4.5 text-[#F5B400] group-hover:text-white transition-colors duration-300 h-[18px] w-[18px]" />
                    </div>
                    <div>
                      <p className="font-heading font-bold text-[13px] text-[#111111] mb-0.5">{label}</p>
                      <p className="font-body text-[14px] text-gray-700 font-medium mb-0.5">{value}</p>
                      <p className="font-body text-[12px] text-gray-400">{desc}</p>
                    </div>
                  </a>
                ))}
              </div>

              {/* Trust section */}
              <div className="rounded-2xl border border-gray-100 bg-[#111111] p-7 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#F5B400]/10 blur-3xl" aria-hidden />
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 mb-4">
                    <Clock className="h-4 w-4 text-[#F5B400]" />
                    <span className="font-heading font-bold text-[12px] text-[#F5B400] uppercase tracking-wider">Why Partner With Us</span>
                  </div>
                  <ul className="space-y-2.5">
                    {TRUST_POINTS.map((p) => (
                      <li key={p} className="flex items-center gap-3 text-[14px] text-white/70 font-body">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F5B400] shrink-0" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Right — Form */}
            <div className="lg:sticky lg:top-24 self-start">
              <div className="rounded-3xl border border-gray-100 bg-white shadow-xl p-8 sm:p-10">
                <ContactForm />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Map section */}
      <section className="py-16 bg-[#FAFAFA] border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-[11px] font-heading font-bold text-[#F5B400] uppercase tracking-[0.25em] mb-2">Location</p>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-[#111111] tracking-tight">
                Find Us
              </h2>
            </div>
            <a
              href={MAP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white text-[#111111] font-heading font-semibold text-sm px-5 py-2.5 hover:border-[#F5B400]/50 hover:shadow-sm transition-all duration-200"
            >
              <ExternalLink className="h-4 w-4 text-[#F5B400]" />
              Open in Google Maps
            </a>
          </div>

          <div className="rounded-3xl overflow-hidden border border-gray-200 shadow-lg">
            <iframe
              src={MAP_EMBED_SRC}
              width="100%"
              height="480"
              style={{ border: 0, display: "block" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Rajiv Phylon location on Google Maps"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
