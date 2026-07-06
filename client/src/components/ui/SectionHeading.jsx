export function SectionHeading({ children, className = "" }) {
  return (
    <h2
      className={`font-display font-medium text-[clamp(1.5rem,3vw,2.25rem)] text-foreground tracking-[-0.02em] leading-tight mb-10 md:mb-12 border-b border-gray-100 pb-4 ${className}`}
    >
      {children}
    </h2>
  );
}
