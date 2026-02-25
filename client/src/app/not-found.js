import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center bg-[#ffffff]">
      <h1 className="text-2xl font-bold text-[#111827] mb-2">Page not found</h1>
      <p className="text-[#6b7280] mb-6">The page you are looking for does not exist.</p>
      <Link
        href="/"
        className="inline-block px-6 py-2.5 bg-[hsl(var(--accent))] text-[#111827] font-medium hover:opacity-90 transition-opacity"
      >
        Go home
      </Link>
    </div>
  );
}
