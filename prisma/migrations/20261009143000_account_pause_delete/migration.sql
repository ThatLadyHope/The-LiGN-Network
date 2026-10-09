-- AlterTable
ALTER TABLE "User" ADD COLUMN     "pendingDeletionAt" TIMESTAMP(3),
ADD COLUMN     "returnAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Block_blockerId_blockedId_key" ON "Block"("blockerId", "blockedId");

