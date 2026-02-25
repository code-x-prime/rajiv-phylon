-- CreateTable: Product ↔ Category (many-to-many)
CREATE TABLE "product_categories" (
    "productId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "product_categories_pkey" PRIMARY KEY ("productId","categoryId")
);

-- CreateTable: Product ↔ SubCategory (many-to-many)
CREATE TABLE "product_sub_categories" (
    "productId" TEXT NOT NULL,
    "subCategoryId" TEXT NOT NULL,

    CONSTRAINT "product_sub_categories_pkey" PRIMARY KEY ("productId","subCategoryId")
);

-- AddForeignKey
ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "product_sub_categories" ADD CONSTRAINT "product_sub_categories_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "product_sub_categories" ADD CONSTRAINT "product_sub_categories_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "sub_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Migrate existing data (only if old columns exist)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'categoryId') THEN
        INSERT INTO "product_categories" ("productId", "categoryId")
        SELECT "id", "categoryId" FROM "products" WHERE "categoryId" IS NOT NULL
        ;
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'subCategoryId') THEN
        INSERT INTO "product_sub_categories" ("productId", "subCategoryId")
        SELECT "id", "subCategoryId" FROM "products" WHERE "subCategoryId" IS NOT NULL
        ;
    END IF;
END $$;

-- Drop old columns
ALTER TABLE "products" DROP COLUMN IF EXISTS "categoryId";
ALTER TABLE "products" DROP COLUMN IF EXISTS "subCategoryId";
