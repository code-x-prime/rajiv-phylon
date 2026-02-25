import { Plus_Jakarta_Sans, Manrope } from "next/font/google";
import dynamic from "next/dynamic";
import { Toaster } from "sonner";
import "./globals.css";

export const headingFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-heading",
});

export const bodyFont = Manrope({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-body",
});

const Navbar = dynamic(() => import("@/components/layout/Navbar").then((m) => m.Navbar), { ssr: true });
const Footer = dynamic(() => import("@/components/layout/Footer").then((m) => m.Footer), { ssr: true });

export const metadata = {
  title: "Rajiv Phylon | High-Performance Polymer Footwear Soles",
  description: "Export-grade polymer footwear sole manufacturer. Premium B2B industrial solutions for global OEM partners.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${headingFont.variable} ${bodyFont.variable}`}>
      <body className="font-body antialiased min-h-screen flex flex-col bg-white text-[var(--foreground)]">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
