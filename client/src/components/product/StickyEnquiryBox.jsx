"use client";

import { useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, Phone, Loader2, SendHorizonal,
  ShieldCheck, Clock, Package, CheckCircle2, Zap,
} from "lucide-react";
import { submitProductEnquiry } from "@/lib/api";

/* WhatsApp brand SVG (official green) */
function WhatsAppIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

const PHONE           = process.env.NEXT_PUBLIC_PHONE    || "+91-9876543210";
const EMAIL           = process.env.NEXT_PUBLIC_EMAIL    || "info@rajivphylon.com";
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP || "919876543210";

const UNITS = [
  { value: "",           label: "Select unit" },
  { value: "pairs",      label: "Pairs"       },
  { value: "pieces",     label: "Pieces"      },
  { value: "kg",         label: "Kg"          },
  { value: "meters",     label: "Meters"      },
  { value: "containers", label: "Containers"  },
  { value: "boxes",      label: "Boxes"       },
];

/* Quick quantity presets (pairs) */
const QTY_PRESETS = ["100", "500", "1,000", "5,000", "Custom"];

const TRUST = [
  { icon: ShieldCheck, text: "100% Secure"  },
  { icon: Clock,       text: "24h Reply"    },
  { icon: Package,     text: "Bulk Ready"   },
  { icon: Zap,         text: "Fast Dispatch"},
];

const inputCls =
  "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-[14px] text-[#111111] font-body placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-[#F5B400]/30 focus:border-[#F5B400] outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

function Field({ label, required, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[11px] font-heading font-bold text-gray-400 uppercase tracking-[0.18em]">
        {label}{required && <span className="text-[#F5B400] ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

export function StickyEnquiryBox({ productId, productName }) {
  const defaultMsg = productName ? `Hi, I'm interested in: ${productName}` : "";

  const [form, setForm]         = useState({ name: "", email: "", phone: "", quantity: "", unit: "pairs", message: defaultMsg });
  const [submitting, setSub]    = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [qtyPreset, setQtyPreset] = useState("");

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const applyPreset = (preset) => {
    setQtyPreset(preset);
    if (preset === "Custom") {
      setForm((p) => ({ ...p, quantity: "" }));
    } else {
      setForm((p) => ({ ...p, quantity: preset.replace(",", "") }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim())  { toast.error("Please enter your name");         return; }
    if (!form.phone.trim()) { toast.error("Please enter your phone number"); return; }
    setSub(true);
    try {
      await submitProductEnquiry({
        name:        form.name.trim(),
        email:       form.email.trim()    || undefined,
        phone:       form.phone.trim(),
        message:     form.message.trim()  || defaultMsg,
        quantity:    form.quantity.trim() || undefined,
        unit:        form.unit            || undefined,
        productId:   productId            || undefined,
        productName: productName          || undefined,
        source:      "product-detail",
      });
      toast.success("Enquiry sent! We'll reply within 24 hours.");
      setSubmitted(true);
    } catch {
      toast.error("Something went wrong. Please try calling us directly.");
    } finally {
      setSub(false);
    }
  };

  const waText      = encodeURIComponent(productName ? `Hi, I'm interested in: ${productName}\n\nPlease share more details.` : "Hi, I have a product enquiry.");
  const mailSubject = encodeURIComponent(`Bulk Enquiry: ${productName || "Product"}`);
  const mailBody    = encodeURIComponent(form.message || defaultMsg);

  return (
    <div>
      <div className="rounded-2xl border border-gray-100 bg-white shadow-[0_8px_40px_rgba(0,0,0,0.08)] overflow-hidden">

        {/* Header */}
        <div className="bg-[#111111] px-6 py-5 relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-[#F5B400]/10 blur-2xl" aria-hidden />
          <h2 className="font-heading text-[17px] font-bold text-white tracking-tight relative z-10">
            Request Bulk Quote
          </h2>
          <p className="text-gray-400 text-[12px] font-body mt-0.5 relative z-10">
            Our team responds within 24 hours
          </p>
        </div>

        {/* Trust bar */}
        <div className="grid grid-cols-4 border-b border-gray-100 bg-[#FAFAFA] divide-x divide-gray-100">
          {TRUST.map(({ icon: Icon, text }) => (
            <div key={text} className="flex flex-col items-center gap-1 py-3 px-1">
              <Icon className="h-3.5 w-3.5 text-[#F5B400]" />
              <span className="text-[10px] font-heading font-bold text-gray-500 whitespace-nowrap text-center leading-none">{text}</span>
            </div>
          ))}
        </div>

        <div className="p-5">
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 text-center space-y-3"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#F5B400]/10 border border-[#F5B400]/20 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-7 w-7 text-[#F5B400]" />
                </div>
                <p className="font-heading font-bold text-[#111111] text-base">Enquiry Submitted!</p>
                <p className="text-[13px] text-gray-400 font-body">We&apos;ll contact you within 24 hours.</p>
                <button
                  type="button"
                  onClick={() => { setSubmitted(false); setForm((p) => ({ ...p, message: defaultMsg, quantity: "", unit: "pairs" })); setQtyPreset(""); }}
                  className="mt-2 text-[13px] font-heading font-semibold text-[#F5B400] hover:underline underline-offset-2"
                >
                  Send another enquiry
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                {/* ── Quick Quantity Presets ── */}
                <div>
                  <p className="text-[11px] font-heading font-bold text-gray-400 uppercase tracking-[0.18em] mb-2">
                    Quick Quantity (Pairs)
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {QTY_PRESETS.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => applyPreset(p)}
                        className={`px-3 py-1.5 rounded-full text-[12px] font-heading font-bold border transition-all duration-150 ${
                          qtyPreset === p
                            ? "bg-[#F5B400] border-[#F5B400] text-white shadow-sm"
                            : "bg-white border-gray-200 text-gray-600 hover:border-[#F5B400] hover:text-[#F5B400]"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity + Unit */}
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Quantity">
                    <input
                      name="quantity"
                      type="text"
                      value={form.quantity}
                      onChange={set("quantity")}
                      placeholder="e.g. 500"
                      className={inputCls}
                      disabled={submitting}
                    />
                  </Field>
                  <Field label="Unit">
                    <select
                      name="unit"
                      value={form.unit}
                      onChange={set("unit")}
                      className={inputCls}
                      disabled={submitting}
                    >
                      {UNITS.map((u) => (
                        <option key={u.value || "blank"} value={u.value}>{u.label}</option>
                      ))}
                    </select>
                  </Field>
                </div>

                {/* Name + Phone */}
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Name" required>
                    <input
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={set("name")}
                      placeholder="Your name"
                      className={inputCls}
                      disabled={submitting}
                      required
                      autoComplete="name"
                    />
                  </Field>
                  <Field label="Phone" required>
                    <input
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={set("phone")}
                      placeholder="+91 98765"
                      className={inputCls}
                      disabled={submitting}
                      required
                      autoComplete="tel"
                    />
                  </Field>
                </div>

                {/* Email */}
                <Field label="Business Email">
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={set("email")}
                    placeholder="email@company.com"
                    className={inputCls}
                    disabled={submitting}
                    autoComplete="email"
                  />
                </Field>

                {/* Message */}
                <Field label="Message" required>
                  <textarea
                    name="message"
                    rows={3}
                    value={form.message}
                    onChange={set("message")}
                    placeholder="Describe your requirements, specs, delivery…"
                    className={`${inputCls} resize-none`}
                    disabled={submitting}
                    required
                  />
                </Field>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#F5B400] text-white py-3.5 font-heading font-bold text-sm tracking-wide shadow-md hover:bg-[#e0a300] hover:shadow-[0_6px_20px_rgba(245,180,0,0.4)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {submitting
                    ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</>
                    : <><SendHorizonal className="h-4 w-4" /> Send Enquiry</>
                  }
                </button>

                {/* OR divider */}
                <div className="relative my-1">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-100" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-3 text-[11px] font-body text-gray-400">or contact directly</span>
                  </div>
                </div>

                {/* Quick contact buttons */}
                <div className="grid grid-cols-3 gap-2">
                  <a
                    href={`tel:${PHONE}`}
                    className="flex flex-col items-center gap-1.5 rounded-xl border border-gray-200 py-3 hover:border-[#F5B400] hover:bg-amber-50 transition-all duration-200 group"
                  >
                    <Phone className="h-4 w-4 text-[#F5B400]" />
                    <span className="text-[11px] font-heading font-semibold text-gray-500 group-hover:text-[#111111]">Call Now</span>
                  </a>
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1.5 rounded-xl border border-gray-200 py-3 hover:border-[#25D366] hover:bg-[#f0fdf4] transition-all duration-200 group"
                  >
                    <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
                    <span className="text-[11px] font-heading font-semibold text-gray-500 group-hover:text-[#15803d]">WhatsApp</span>
                  </a>
                  <a
                    href={`mailto:${EMAIL}?subject=${mailSubject}&body=${mailBody}`}
                    className="flex flex-col items-center gap-1.5 rounded-xl border border-gray-200 py-3 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
                  >
                    <Mail className="h-4 w-4 text-blue-500" />
                    <span className="text-[11px] font-heading font-semibold text-gray-500 group-hover:text-blue-700">Email</span>
                  </a>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
