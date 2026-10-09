-- AlterTable
ALTER TABLE "Connection" ADD COLUMN     "endsAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "listenerMode" BOOLEAN NOT NULL DEFAULT false;

