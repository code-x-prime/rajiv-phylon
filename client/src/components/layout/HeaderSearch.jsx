"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Loader2 } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { searchCatalog } from "@/lib/searchApi";

export function HeaderSearch({ variant = "bar", onClose }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({ products: [], categories: [], subcategories: [] });
  const debouncedQuery = useDebounce(query, 300);
  const controllerRef = useRef(null);
  const containerRef = useRef(null);
  const isDialog = variant === "dialog";

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.trim().length < 2) {
      setResults({ products: [], categories: [], subcategories: [] });
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    controllerRef.current = controller;
    setLoading(true);

    searchCatalog(debouncedQuery.trim(), controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setResults(data);
          setOpen(true);
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError" && !controller.signal.aborted) {
          setResults({ products: [], categories: [], subcategories: [] });
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [debouncedQuery]);

  useEffect(() => {
    if (isDialog) return;
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDialog]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setOpen(false);
      const q = query.trim();
      if (q) {
        router.push(`/products?search=${encodeURIComponent(q)}`);
        onClose?.();
      }
      setQuery("");
    }
  };

  const handleResultClick = () => {
    setOpen(false);
    setQuery("");
    onClose?.();
  };

  const hasResults =
    results.products.length > 0 || results.categories.length > 0 || results.subcategories.length > 0;

  return (
    <div
      ref={containerRef}
      className={`relative ${isDialog ? "w-full" : "flex-1 max-w-xl mx-4 hidden md:block"}`}
      role="combobox"
      aria-expanded={open}
      aria-haspopup="listbox"
    >
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => debouncedQuery && debouncedQuery.length >= 2 && setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search products, categories..."
          className="w-full rounded-full border border-gray-200 bg-gray-50/80 pl-11 pr-10 py-2.5 text-sm text-foreground placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F5B400]/40 focus:border-[#F5B400] transition-all duration-300"
          aria-label="Search products and categories"
          aria-autocomplete="list"
        />
        {loading && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden>
            <Loader2 className="h-4 w-4 animate-spin" />
          </span>
        )}
      </div>

      {open && (query.length >= 2 || hasResults) && (
        <div
          className={`mt-2 bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden z-10 max-h-96 overflow-y-auto animate-in fade-in duration-200 ${
            isDialog ? "relative" : "absolute left-0 right-0 top-full"
          }`}
          role="listbox"
        >
          {loading && !hasResults ? (
            <div className="p-6 text-center text-muted text-sm font-body">Searching...</div>
          ) : !hasResults && debouncedQuery.length >= 2 ? (
            <div className="p-6 text-center text-muted text-sm font-body">No results found.</div>
          ) : (
            <>
              {results.categories.length > 0 && (
                <div className="p-3 border-b border-gray-100">
                  <p className="px-3 py-1 text-xs font-heading font-semibold text-muted uppercase tracking-wider">
                    Categories
                  </p>
                  {results.categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.slug}`}
                      onClick={handleResultClick}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group"
                      role="option"
                    >
                      <span className="w-1 h-8 rounded-full bg-[#F5B400] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      <span className="font-body text-foreground">{cat.name}</span>
                    </Link>
                  ))}
                </div>
              )}
              {results.subcategories.length > 0 && (
                <div className="p-3 border-b border-gray-100">
                  <p className="px-3 py-1 text-xs font-heading font-semibold text-muted uppercase tracking-wider">
                    Subcategories
                  </p>
                  {results.subcategories.map((sub) => (
                    <Link
                      key={sub.id}
                      href={`/subcategory/${sub.slug}`}
                      onClick={handleResultClick}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group"
                      role="option"
                    >
                      <span className="w-1 h-8 rounded-full bg-[#F5B400] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      <span className="font-body text-foreground">{sub.name}</span>
                    </Link>
                  ))}
                </div>
              )}
              {results.products.length > 0 && (
                <div className="p-3">
                  <p className="px-3 py-1 text-xs font-heading font-semibold text-muted uppercase tracking-wider">
                    Products
                  </p>
                  {results.products.map((p) => (
                    <Link
                      key={p.id}
                      href={`/product/${p.slug}`}
                      onClick={handleResultClick}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group"
                      role="option"
                    >
                      <span className="w-1 h-8 rounded-full bg-[#F5B400] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      <span className="font-body text-foreground line-clamp-1">{p.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
