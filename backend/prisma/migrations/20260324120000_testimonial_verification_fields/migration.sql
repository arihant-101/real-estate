-- Align Testimonial with schema (fields were in schema but missing from migrations)
ALTER TABLE "Testimonial" ADD COLUMN IF NOT EXISTS "emailForVerification" TEXT;
ALTER TABLE "Testimonial" ADD COLUMN IF NOT EXISTS "includeNameLocation" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Testimonial" ADD COLUMN IF NOT EXISTS "photoData" TEXT;
ALTER TABLE "Testimonial" ADD COLUMN IF NOT EXISTS "consent" BOOLEAN NOT NULL DEFAULT false;
