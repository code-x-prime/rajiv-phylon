-- CreateEnum for InquiryStatus
CREATE TYPE "InquiryStatus" AS ENUM ('PENDING', 'CONTACTED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED');

-- AlterTable: add new columns to contact_inquiries
ALTER TABLE "contact_inquiries" ADD COLUMN IF NOT EXISTS "status" "InquiryStatus" NOT NULL DEFAULT 'PENDING';
ALTER TABLE "contact_inquiries" ADD COLUMN IF NOT EXISTS "adminNotes" TEXT;
ALTER TABLE "contact_inquiries" ADD COLUMN IF NOT EXISTS "followUpDate" TIMESTAMP(3);
ALTER TABLE "contact_inquiries" ADD COLUMN IF NOT EXISTS "lastUpdatedById" TEXT;
ALTER TABLE "contact_inquiries" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex (optional, for filter performance)
CREATE INDEX IF NOT EXISTS "contact_inquiries_status_idx" ON "contact_inquiries"("status");
CREATE INDEX IF NOT EXISTS "contact_inquiries_followUpDate_idx" ON "contact_inquiries"("followUpDate");
CREATE INDEX IF NOT EXISTS "contact_inquiries_createdAt_idx" ON "contact_inquiries"("createdAt");

-- AddForeignKey
ALTER TABLE "contact_inquiries" ADD CONSTRAINT "contact_inquiries_lastUpdatedById_fkey" 
  FOREIGN KEY ("lastUpdatedById") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;
