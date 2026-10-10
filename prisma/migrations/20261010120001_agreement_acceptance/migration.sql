-- AlterTable
ALTER TABLE "User" ADD COLUMN     "agreementVersion" TEXT;

-- CreateTable
CREATE TABLE "AgreementAcceptance" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "textSnapshot" TEXT NOT NULL,
    "acceptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'accepted',

    CONSTRAINT "AgreementAcceptance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AgreementAcceptance_userId_idx" ON "AgreementAcceptance"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AgreementAcceptance_userId_version_key" ON "AgreementAcceptance"("userId", "version");

