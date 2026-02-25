-- AlterTable banners: add optional position (e.g. HOME_DESKTOP)
ALTER TABLE "banners" ADD COLUMN IF NOT EXISTS "position" TEXT;
