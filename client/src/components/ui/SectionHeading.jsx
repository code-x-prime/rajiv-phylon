export function SectionHeading({ children, className = "" }) {
  return (
    <div className={`mb-8 md:mb-10 ${className}`}>
      <h2 className="font-display font-medium text-[clamp(1.75rem,3.5vw,2.75rem)] text-foreground tracking-[-0.02em] leading-tight">
        {children}
      </h2>
      <div className="mt-3 h-[2px] w-16 bg-[#F5B400] rounded-full" />
    </div>
  );
}
