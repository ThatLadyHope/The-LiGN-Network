-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "spaceId" TEXT,
ALTER COLUMN "conversationId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "spaceId" TEXT;

-- CreateTable
CREATE TABLE "SpaceReconnectWish" (
    "id" TEXT NOT NULL,
    "spaceId" TEXT NOT NULL,
    "wanterId" TEXT NOT NULL,
    "wantedId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SpaceReconnectWish_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SpaceReconnectWish_spaceId_wanterId_wantedId_key" ON "SpaceReconnectWish"("spaceId", "wanterId", "wantedId");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "TemporarySpace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
