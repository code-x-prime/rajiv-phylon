-- Product: home flags
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "isFeatured" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "isNewArrival" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "isHighDemand" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "showOnHome" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN NOT NULL DEFAULT true;

-- Category: home flags
ALTER TABLE "categories" ADD COLUMN IF NOT EXISTS "showOnHome" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "categories" ADD COLUMN IF NOT EXISTS "homeOrder" INTEGER NOT NULL DEFAULT 0;

-- Gallery: section (e.g. INFRASTRUCTURE)
ALTER TABLE "galleries" ADD COLUMN IF NOT EXISTS "section" TEXT;

-- Company stats (trust bar)
CREATE TABLE IF NOT EXISTS "company_stats" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "company_stats_pkey" PRIMARY KEY ("id")
);

-- Industries we serve
CREATE TABLE IF NOT EXISTS "industries" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "image" TEXT,
    "shortDescription" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "industries_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "industries_slug_key" ON "industries"("slug");

-- Why choose us
CREATE TABLE IF NOT EXISTS "why_choose_us" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "why_choose_us_pkey" PRIMARY KEY ("id")
);

-- Export countries
CREATE TABLE IF NOT EXISTS "export_countries" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "countryCode" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "export_countries_pkey" PRIMARY KEY ("id")
);

-- Global enquiry CTA (single row or first wins)
CREATE TABLE IF NOT EXISTS "home_ctas" (
    "id" TEXT NOT NULL,
    "heading" TEXT NOT NULL,
    "subheading" TEXT,
    "buttonText" TEXT,
    "buttonLink" TEXT,
    CONSTRAINT "home_ctas_pkey" PRIMARY KEY ("id")
);

-- Client logos
CREATE TABLE IF NOT EXISTS "client_logos" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logoImage" TEXT NOT NULL,
    "link" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "client_logos_pkey" PRIMARY KEY ("id")
);
