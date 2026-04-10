import Link from "next/link";
import { Shield, Lock, Eye, FileText, ChevronRight } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Rajiv Phylon",
  description: "Our commitment to protecting your privacy and personal data in accordance with B2B industry standards.",
};

export default function PrivacyPolicyPage() {
  const sections = [
    {
      icon: Shield,
      title: "Data Protection",
      content: "At Rajiv Phylon Pvt. Ltd., we prioritize the security of your business information. We implement robust technical and organizational measures to protect your data against unauthorized access, alteration, disclosure, or destruction."
    },
    {
      icon: Eye,
      title: "Information We Collect",
      content: "We collect information necessary for B2B transactions and inquiries, including company name, contact person, email address, phone numbers, and specific requirements for footwear soles. This data helps us provide tailored solutions for our global partners."
    },
    {
      icon: Lock,
      title: "Confidentiality",
      content: "All product designs, proprietary polymer formulations, and business negotiations remain strictly confidential. We do not share your private data with third parties except as required to fulfill export documentation or by legal mandate."
    },
    {
      icon: FileText,
      title: "Your Rights",
      content: "As our valued partner, you have the right to access, update, or request the deletion of your contact information from our records. For any such requests or privacy-related concerns, please contact us at info@rajivphylon.com."
    }
  ];

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      {/* Header */}
      <section className="bg-white border-b border-gray-100 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/" className="text-[12px] font-bold text-gray-400 hover:text-[#F5B400] uppercase tracking-widest transition-colors duration-200">Home</Link>
            <ChevronRight className="h-3 w-3 text-gray-300" />
            <span className="text-[12px] font-bold text-[#F5B400] uppercase tracking-widest">Privacy Policy</span>
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-[#111111] tracking-tight mb-6">
            Privacy <span className="text-[#F5B400]">Policy</span>
          </h1>
          <p className="text-[16px] text-gray-500 font-body leading-relaxed max-w-2xl">
            Last Updated: April 09, 2026. This policy outlines how Rajiv Phylon Pvt. Ltd. handles your data and ensures transparency in our business relationship.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid gap-12">
            {sections.map((section, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-8 md:p-10 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-[#F5B400]/10 flex items-center justify-center">
                    <section.icon className="h-6 w-6 text-[#F5B400]" />
                  </div>
                  <h2 className="font-heading text-2xl font-bold text-[#111111]">{section.title}</h2>
                </div>
                <p className="text-[16px] text-gray-600 font-body leading-relaxed">
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-[#111111] rounded-3xl p-10 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#F5B400]/5 blur-3xl rounded-full -mr-20 -mt-20" />
            <h3 className="relative z-10 font-heading text-2xl font-bold text-white mb-4">Have Questions?</h3>
            <p className="relative z-10 text-gray-400 font-body mb-8">Reach out to our compliance officer for any privacy concerns.</p>
            <a 
              href="mailto:info@rajivphylon.com" 
              className="relative z-10 inline-flex items-center justify-center rounded-xl bg-[#F5B400] text-white px-8 py-3.5 font-heading font-bold text-sm hover:bg-[#e0a300] transition-all duration-300"
            >
              Contact Support
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
