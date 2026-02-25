export function SectionHeading({ children, className = "" }) {
  return (
    <h2
      className={`font-heading text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-10 md:mb-12 border-b border pb-3 ${className}`}
    >
      {children}
    </h2>
  );
}
