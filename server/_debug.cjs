const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();
(async () => {
  const cats = await p.category.findMany();
  console.log("=== CATEGORIES ===");
  cats.forEach(c => console.log(`  id=${c.id} name=${c.name} slug=${c.slug}`));

  const subs = await p.subCategory.findMany({ include: { category: true } });
  console.log("\n=== SUBCATEGORIES ===");
  subs.forEach(s => console.log(`  id=${s.id} name=${s.name} slug=${s.slug} categoryId=${s.categoryId} categoryName=${s.category?.name}`));

  const products = await p.product.findMany({ take: 3, include: { productCategories: { include: { category: true } }, productSubCategories: { include: { subCategory: true } } } });
  console.log("\n=== PRODUCTS (first 3) ===");
  products.forEach(pr => {
    console.log(`  name=${pr.name} slug=${pr.slug}`);
    console.log(`    categories: ${pr.productCategories.map(pc => `${pc.category?.name}(${pc.category?.slug})`).join(", ") || "NONE"}`);
    console.log(`    subCategories: ${pr.productSubCategories.map(ps => `${ps.subCategory?.name}(${ps.subCategory?.slug}, catId=${ps.subCategory?.categoryId})`).join(", ") || "NONE"}`);
  });
  await p.$disconnect();
})();
