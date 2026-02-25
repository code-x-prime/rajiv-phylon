"use client";

import { useState } from "react";
import { toast } from "sonner";
import { submitContactInquiry } from "@/lib/api";
import { Send, CheckCircle2 } from "lucide-react";

const initialFormData = {
  name: "",
  companyName: "",
  email: "",
  phone: "",
  message: "",
};

const inputCls =
  "w-full rounded-xl border border-gray-200 bg-[#FAFAFA] px-4 py-3 text-[15px] text-[#111111] font-body transition-all duration-200 focus:ring-2 focus:ring-[#F5B400]/40 focus:border-[#F5B400] focus:bg-white focus:outline-none placeholder:text-gray-400";

const labelCls = "block text-[13px] font-heading font-semibold text-[#111111] mb-1.5";

export function ContactForm({ productName }) {
  const [formData, setFormData] = useState({
    ...initialFormData,
    ...(productName && { message: `Inquiry about: ${productName}` }),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitContactInquiry({
        name: formData.name.trim(),
        companyName: formData.companyName.trim() || undefined,
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        message: formData.message.trim() || undefined,
      });
      setSuccess(true);
      toast.success("Enquiry submitted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#F5B400]/10 border border-[#F5B400]/20 flex items-center justify-center mb-5">
          <CheckCircle2 className="h-8 w-8 text-[#F5B400]" />
        </div>
        <h3 className="font-heading font-bold text-xl text-[#111111] mb-2">Enquiry Sent!</h3>
        <p className="text-[15px] text-gray-500 font-body mb-6 max-w-xs">
          Thank you for reaching out. Our team will get back to you within 24 hours.
        </p>
        <button
          type="button"
          onClick={() => { setSuccess(false); setFormData({ ...initialFormData, ...(productName && { message: `Inquiry about: ${productName}` }) }); }}
          className="text-[13px] font-heading font-semibold text-[#F5B400] hover:underline"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Header */}
      <div className="mb-2">
        <h2 className="font-heading text-xl font-bold text-[#111111] tracking-tight mb-1">
          Send an Enquiry
        </h2>
        <p className="text-[13px] text-gray-400 font-body">
          Fill in the form and we&apos;ll get back to you promptly.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="contact-name" className={labelCls}>
            Name <span className="text-[#F5B400]">*</span>
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            className={inputCls}
            placeholder="Your name"
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="contact-company" className={labelCls}>
            Company
          </label>
          <input
            id="contact-company"
            name="companyName"
            type="text"
            value={formData.companyName}
            onChange={handleChange}
            className={inputCls}
            placeholder="Your company"
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="contact-email" className={labelCls}>
            Email <span className="text-[#F5B400]">*</span>
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className={inputCls}
            placeholder="email@company.com"
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="contact-phone" className={labelCls}>
            Phone <span className="text-[#F5B400]">*</span>
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            required
            value={formData.phone}
            onChange={handleChange}
            className={inputCls}
            placeholder="+91 98765 43210"
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-message" className={labelCls}>
          Message <span className="text-[#F5B400]">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          required
          value={formData.message}
          onChange={handleChange}
          className={`${inputCls} resize-none`}
          placeholder={productName ? `Inquiry about ${productName}` : "Your requirements, product details, quantity..."}
          disabled={isSubmitting}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#F5B400] text-white font-heading font-bold text-sm py-4 px-8 hover:bg-[#e0a300] hover:shadow-[0_8px_24px_rgba(245,180,0,0.35)] hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none transition-all duration-300"
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Sending...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Send Enquiry
          </>
        )}
      </button>

      <p className="text-center text-[12px] text-gray-400 font-body">
        We respect your privacy. No spam, ever.
      </p>
    </form>
  );
}
