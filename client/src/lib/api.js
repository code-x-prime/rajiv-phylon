const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

const defaultOptions = {
  next: { revalidate: 60 },
};

export async function fetchApi(path, options = {}) {
  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...defaultOptions,
      ...options,
      headers: { "Content-Type": "application/json", ...options.headers },
    });
  } catch (err) {
    // Build / VPS: API unreachable during static generation — return empty so build completes.
    if (typeof process !== "undefined" && process.env.NEXT_PHASE === "phase-production-build") {
      return { data: [] };
    }
    throw err;
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    // Build time par 404/5xx par throw mat karo — empty data do taaki build pass ho.
    if (typeof process !== "undefined" && process.env.NEXT_PHASE === "phase-production-build") {
      return { data: [] };
    }
    throw new Error(data?.message || res.statusText);
  }
  return data;
}

export async function getCategories() {
  const res = await fetchApi("/categories");
  return res.data || [];
}

export async function getCategoriesWithSubcategories() {
  const res = await fetchApi("/categories/with-subcategories");
  return res.data || [];
}

export async function getCategoryBySlug(slug) {
  const categories = await getCategories();
  const found = categories.find((c) => c.slug === slug || c.slug?.toLowerCase() === slug?.toLowerCase());
  if (found) return found;

  // Check subcategories
  for (const cat of categories) {
    const subs = await getSubCategoriesByCategory(cat.id);
    const subFound = subs.find((s) => s.slug === slug || s.slug?.toLowerCase() === slug?.toLowerCase());
    if (subFound) return { id: subFound.id, name: subFound.name, slug: subFound.slug, isSubcategory: true };
  }

  // Fallback for gender / special slugs (for-men, for-women, for-kids)
  if (slug === "for-men" || slug === "for-women" || slug === "for-kids") {
    const nameMap = { "for-men": "For Men", "for-women": "For Women", "for-kids": "For Kids" };
    return { id: slug, name: nameMap[slug], slug };
  }
  return null;
}

export async function getSubCategoriesByCategory(categoryId) {
  const res = await fetchApi(`/subcategories/category/${categoryId}`);
  return res.data || [];
}

export async function getSubcategoryBySlug(slug) {
  const categories = await getCategories();
  // 1. Check subcategories across categories
  for (const cat of categories) {
    const subs = await getSubCategoriesByCategory(cat.id);
    const found = subs.find((s) => s.slug === slug || s.slug?.toLowerCase() === slug?.toLowerCase());
    if (found) return { subcategory: found, category: cat };
  }

  // 2. Check if slug matches a top-level category (e.g. admin created "FOR MEN" category with slug "for-men")
  const catFound = categories.find((c) => c.slug === slug || c.slug?.toLowerCase() === slug?.toLowerCase());
  if (catFound) {
    return {
      subcategory: { id: catFound.id, name: catFound.name, slug: catFound.slug, isCategory: true },
      category: catFound,
    };
  }

  // 3. Fallback for gender / special slugs (for-men, for-women, for-kids) so user never gets 404
  if (slug === "for-men" || slug === "for-women" || slug === "for-kids") {
    const nameMap = { "for-men": "For Men", "for-women": "For Women", "for-kids": "For Kids" };
    const dummyCat = categories[0] || { id: "all", name: "Products", slug: "products" };
    return {
      subcategory: { id: slug, name: nameMap[slug], slug },
      category: dummyCat,
    };
  }
  return null;
}

export async function getProducts() {
  const res = await fetchApi("/products");
  return res.data || [];
}

export async function getProductsByFeature(tag) {
  const res = await fetchApi(`/products/feature/${tag}`);
  const data = res.data || [];
  if (process.env.NODE_ENV !== "production") {
    console.log("[Client getProductsByFeature]", { tag, count: data.length });
  }
  return data;
}

export async function getBanners(opts = {}) {
  const params = new URLSearchParams();
  if (opts.position != null) params.set("position", String(opts.position));
  if (opts.isActive !== undefined) params.set("isActive", String(opts.isActive));
  const qs = params.toString();
  const path = qs ? `/banners?${qs}` : "/banners";
  const res = await fetchApi(path);
  const data = res.data || [];
  return data.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export async function getCategoriesHome(opts = {}) {
  const res = await fetchApi("/categories/home", opts);
  return res.data || [];
}

export async function getProductsFeatured(opts = {}) {
  const res = await fetchApi("/products/featured", opts);
  return res.data || [];
}

export async function getProductsNewArrivals(opts = {}) {
  const res = await fetchApi("/products/new-arrivals", opts);
  return res.data || [];
}

export async function getProductsHighDemand(opts = {}) {
  const res = await fetchApi("/products/high-demand", opts);
  return res.data || [];
}

export async function getProductBySlug(slug) {
  const res = await fetchApi(`/products/${slug}`);
  return res.data;
}

export async function getRelatedProducts(currentProductId, categoryIds = [], limit = 8) {
  const products = await getProducts();
  return products
    .filter((p) => p.id !== currentProductId && (categoryIds.length === 0 || p.categories?.some((c) => categoryIds.includes(c.id))))
    .slice(0, limit);
}

export async function getGallery(opts = {}) {
  const params = new URLSearchParams();
  if (opts.section != null) params.set("section", String(opts.section));
  const qs = params.toString();
  const path = qs ? `/gallery?${qs}` : "/gallery";
  const res = await fetchApi(path);
  return res.data || [];
}

export async function submitContactInquiry(body) {
  const res = await fetchApi("/contact/inquiry", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return res;
}

/** Product detail page: submit enquiry with product context. Saves to same contact/inquiry API. */
export async function submitProductEnquiry(body) {
  return submitContactInquiry({ ...body, source: body.source || "product-detail" });
}

export async function getVideos() {
  const res = await fetchApi("/videos");
  return res.data || [];
}
