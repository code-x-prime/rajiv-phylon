-- Add SEO fields to products
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "metaTitle" TEXT;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "metaDescription" TEXT;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "metaKeywords" TEXT;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "ogImage" TEXT;
