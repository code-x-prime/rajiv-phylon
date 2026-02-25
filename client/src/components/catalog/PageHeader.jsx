import Link from "next/link";

export function PageHeader({ breadcrumbs, title, subtitle }) {
  return (
    <div>
      {breadcrumbs?.length > 0 && (
        <nav className="flex items-center gap-2 text-sm text-muted font-body mb-4" aria-label="Breadcrumb">
          {breadcrumbs.map((item, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <span className="text-gray-300">/</span>}
              {item.href ? (
                <Link href={item.href} className="hover:text-primary transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="text-foreground font-medium">{item.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
      <h1 className="font-heading text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
        {title}
      </h1>
      <div className="mt-3 w-20 h-1.5 rounded-full bg-primary" aria-hidden />
      {subtitle && (
        <p className="mt-4 text-lg text-muted max-w-3xl leading-relaxed font-body">
          {subtitle}
        </p>
      )}
    </div>
  );
}
