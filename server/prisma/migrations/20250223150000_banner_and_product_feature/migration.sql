-- CreateEnum ProductFeature
CREATE TYPE "ProductFeature" AS ENUM ('NEW_ARRIVAL', 'TRENDING', 'BEST_SELLER');

-- AlterTable Product: add featureTag
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "featureTag" "ProductFeature";

-- CreateTable Banner
CREATE TABLE "banners" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "desktopImage" TEXT NOT NULL,
    "mobileImage" TEXT NOT NULL,
    "link" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "banners_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "banners_order_idx" ON "banners"("order");
CREATE INDEX "banners_isActive_idx" ON "banners"("isActive");
