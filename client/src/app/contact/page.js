import { ContactForm } from "@/components/ContactForm";
import { ContactHero } from "@/components/contact/ContactHero";
import { Mail, Phone, MapPin, ExternalLink, MessageCircle } from "lucide-react";

const MAP_EMBED_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3493.9037402075064!2d77.13670957550958!3d28.871481075535154!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xa5a7db300cd4dd53%3A0x77c9e1bd3ef9ae6b!2sRAJIV%20PHYLON%20PRIVATE%20LIMITED!5e0!3m2!1sen!2sin!4v1771908168013!5m2!1sen!2sin";
const MAP_LINK = "https://maps.app.goo.gl/ZCHrQfTuJ1LuCrT1A";

const CONTACT_DETAILS = [
  {
    icon: Mail,
    label: "Email",
    value: "info@rajivphylon.com",
    href: "mailto:info@rajivphylon.com",
    desc: "Primary business email",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+91-9253369349",
    href: "tel:+919253369349",
    desc: "Mon-Sat, 9am-6pm IST",
  },
  {
    icon: Phone,
    label: "Landline",
    value: "0130-4050921",
    href: "tel:01304050921",
    desc: "Office direct line",
    isHighlight: true,
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "+91-9253369349",
    href: "https://wa.me/919253369349",
    desc: "Quick B2B enquiries",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "Rajiv Phylon Pvt. Ltd.",
    href: MAP_LINK,
    desc: "Manufacturing & Office, Delhi",
  },
];

const TRUST_POINTS = [
  "25+ years of manufacturing experience",
  "Trusted by 50+ footwear brands",
];

export const metadata = {
  title: "Contact | Rajiv Phylon",
  description: "Get in touch for quotes, bulk orders, and partnership inquiries.",
};

export default function ContactPage() {
  return (
    <div className="bg-white overflow-x-hidden">
      {/* Hero */}
      <ContactHero />

      {/* Main content */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-site mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-[1fr_520px] gap-12 lg:gap-16 items-start">

            {/* Left — Info */}
            <div>
              <h2 className="font-display font-medium text-[clamp(1.75rem,3.5vw,2.75rem)] text-foreground tracking-[-0.02em] leading-tight mb-4">
                Let&apos;s Build Something<br />
                <span className="text-[#F5B400]">Great Together</span>
              </h2>
              <div className="h-[2px] w-16 bg-[#F5B400] rounded-full mb-8" />

              {/* Contact cards */}
              <div className="grid sm:grid-cols-2 gap-4 mb-10">
                {CONTACT_DETAILS.map(({ icon: Icon, label, value, href, desc, isHighlight }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className={`group relative flex items-start gap-4 p-5 rounded-2xl border transition-all duration-300 ${
                      isHighlight
                        ? "border-[#F5B400] bg-[#F5B400]/5 shadow-md scale-[1.02]"
                        : "border-gray-100 bg-[#FAFAFA] hover:border-[#F5B400]/40 hover:bg-white hover:shadow-md"
                    }`}
                  >
                    {isHighlight && (
                      <div className="absolute -top-3 -right-3 bg-[#F5B400] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm uppercase tracking-wider z-20">
                        Main
                      </div>
                    )}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                      isHighlight
                        ? "bg-[#F5B400] border-[#F5B400]"
                        : "bg-[#F5B400]/10 border border-[#F5B400]/20 group-hover:bg-[#F5B400] group-hover:border-[#F5B400]"
                    }`}>
                      <Icon className={`h-[18px] w-[18px] transition-colors duration-300 ${
                        isHighlight ? "text-white" : "text-[#F5B400] group-hover:text-white"
                      }`} />
                    </div>
                    <div>
                      <p className="font-display font-medium text-[13px] text-foreground mb-0.5">{label}</p>
                      <p className="font-body text-[14px] text-gray-700 font-medium mb-0.5">{value}</p>
                      <p className="font-body text-[12px] text-gray-400">{desc}</p>
                    </div>
                  </a>
                ))}
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
      <section className="py-16 md:py-24 bg-[#FAFAFA] border-t border-gray-100">
        <div className="max-w-site mx-auto px-6 lg:px-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="type-overline text-[#F5B400] mb-2">Location</p>
              <h2 className="font-display font-medium text-[clamp(1.5rem,2.5vw,2rem)] text-foreground tracking-[-0.02em]">
                Find Us
              </h2>
            </div>
            <a
              href={MAP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white text-foreground font-display font-medium text-[13px] px-5 py-2.5 hover:border-[#F5B400]/50 hover:shadow-sm transition-all duration-200"
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
