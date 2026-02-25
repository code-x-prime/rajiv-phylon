"use client";

const base =
  "inline-flex items-center justify-center font-heading font-semibold uppercase tracking-[0.08em] rounded-xl bg-primary text-white shadow-md transition-all duration-300 ease-out hover:bg-primary-hover hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50";

const sizes = {
  default: "px-5 py-2.5 text-sm",
  lg: "px-8 py-4 text-base",
};

export function PrimaryButton({
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
