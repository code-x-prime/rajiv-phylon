/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["var(--font-heading)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
          foreground: "var(--primary-foreground)",
        },
        charcoal: {
          DEFAULT: "var(--charcoal)",
          light: "var(--charcoal-light)",
        },
        "section-bg": "var(--section-bg)",
        border: "var(--border)",
        muted: "var(--muted)",
      },
      borderRadius: {
        xl: "var(--radius-xl)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      },
      transitionDuration: {
        premium: "300ms",
      },
      transitionTimingFunction: {
        premium: "ease",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
