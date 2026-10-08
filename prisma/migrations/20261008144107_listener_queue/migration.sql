-- CreateTable
CREATE TABLE "ListenerQueueEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "need" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ListenerQueueEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ListenerQueueEntry_userId_key" ON "ListenerQueueEntry"("userId");
