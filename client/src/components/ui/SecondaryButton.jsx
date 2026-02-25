"use client";

const base =
  "inline-flex items-center justify-center font-heading font-semibold uppercase tracking-[0.08em] rounded-xl border-2 border-charcoal text-charcoal bg-transparent transition-all duration-300 ease-out hover:bg-charcoal hover:text-white focus:outline-none focus:ring-2 focus:ring-charcoal focus:ring-offset-2 disabled:opacity-50";

const sizes = {
  default: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

export function SecondaryButton({
  children,
  className = "",
  size = "default",
  as: Comp = "button",
  ...props
}) {
  const combined = `${base} ${sizes[size]} ${className}`.trim();
  return (
    <Comp className={combined} {...props}>
      {children}
    </Comp>
  );
}
