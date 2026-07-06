export function Container({ children, className = "" }) {
  return (
    <div className={`max-w-site mx-auto px-6 lg:px-10 ${className}`}>
      {children}
    </div>
  );
}
