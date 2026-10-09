-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatarColor" TEXT,
ADD COLUMN     "avatarKind" TEXT NOT NULL DEFAULT 'none',
ADD COLUMN     "avatarUrl" TEXT;
