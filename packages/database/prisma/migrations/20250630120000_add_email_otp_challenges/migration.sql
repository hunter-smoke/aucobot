-- CreateEnum
CREATE TYPE "EmailOtpPurpose" AS ENUM ('login', 'register');

-- CreateTable
CREATE TABLE "email_otp_challenges" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "purpose" "EmailOtpPurpose" NOT NULL,
    "code_hash" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_otp_challenges_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "email_otp_challenges_code_hash_key" ON "email_otp_challenges"("code_hash");

-- CreateIndex
CREATE INDEX "email_otp_challenges_email_purpose_idx" ON "email_otp_challenges"("email", "purpose");

-- CreateIndex
CREATE INDEX "email_otp_challenges_expires_at_idx" ON "email_otp_challenges"("expires_at");
