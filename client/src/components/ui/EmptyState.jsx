export function EmptyState({ title, description, action }) {
  return (
    <div className="py-16 md:py-20 text-center  border rounded-xl bg-section-bg shadow-sm">
      <p className="font-heading text-foreground font-semibold text-lg">{title}</p>
      {description && (
        <p className="text-muted mt-2 max-w-md mx-auto font-body">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
