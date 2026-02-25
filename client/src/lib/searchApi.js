const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

/**
 * Client-side search: fetches products and categories, filters by query.
 * Cancel previous request by passing AbortSignal and aborting before next call.
 */
export async function searchCatalog(query, signal) {
  if (!query || query.trim().length < 2) {
    return { products: [], categories: [], subcategories: [] };
  }
  const q = query.trim().toLowerCase();

  const [productsRes, categoriesRes] = await Promise.all([
    fetch(`${API_BASE}/products`, { signal, headers: { "Content-Type": "application/json" } }),
    fetch(`${API_BASE}/categories/with-subcategories`, { signal, headers: { "Content-Type": "application/json" } }),
  ]);

  if (!productsRes.ok || !categoriesRes.ok) {
    throw new Error("Search failed");
  }

  const [productsData, categoriesData] = await Promise.all([
    productsRes.json().catch(() => ({ data: [] })),
    categoriesRes.json().catch(() => ({ data: [] })),
  ]);

  const products = productsData.data || [];
  const categoriesWithSubs = categoriesData.data || [];

  const matchingProducts = products.filter(
    (p) =>
      (p.name && p.name.toLowerCase().includes(q)) ||
      p.categories?.some((c) => c.name?.toLowerCase().includes(q)) ||
      p.subCategories?.some((s) => s.name?.toLowerCase().includes(q))
  );

  const matchingCategories = [];
  const matchingSubcategories = [];
  categoriesWithSubs.forEach((cat) => {
    if (cat.name && cat.name.toLowerCase().includes(q)) {
      matchingCategories.push(cat);
    }
    (cat.subCategories || []).forEach((sub) => {
      if (sub.name && sub.name.toLowerCase().includes(q)) {
        matchingSubcategories.push({ ...sub, parentCategory: cat });
      }
    });
  });

  return {
    products: matchingProducts.slice(0, 8),
    categories: matchingCategories.slice(0, 5),
    subcategories: matchingSubcategories.slice(0, 5),
  };
}
