-- AlterTable
ALTER TABLE "User" ADD COLUMN     "currentNeeds" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "language" TEXT;
