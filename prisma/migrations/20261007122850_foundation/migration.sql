-- CreateEnum
CREATE TYPE "AccountState" AS ENUM ('ACTIVE', 'PAUSED', 'DELETED');

-- CreateEnum
CREATE TYPE "DiscoveryState" AS ENUM ('DISCOVERABLE', 'NOT_DISCOVERABLE');

-- CreateEnum
CREATE TYPE "ConnectionState" AS ENUM ('STRANGER', 'CONVERSATION', 'MUTUAL_CONNECTION', 'ACTIVE', 'PAUSED', 'ARCHIVED', 'ENDED');

-- CreateEnum
CREATE TYPE "SafetyState" AS ENUM ('NORMAL', 'FLAGGED', 'RESTRICTED', 'SUSPENDED', 'REMOVED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "ageRange" TEXT,
    "country" TEXT,
    "bio" TEXT,
    "interests" TEXT[],
    "accountState" "AccountState" NOT NULL DEFAULT 'ACTIVE',
    "discoveryState" "DiscoveryState" NOT NULL DEFAULT 'DISCOVERABLE',
    "safetyState" "SafetyState" NOT NULL DEFAULT 'NORMAL',
    "verificationData" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Availability" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "types" TEXT[],
    "windows" TEXT,
    "tempState" TEXT,
    "tempStateUntil" TIMESTAMP(3),

    CONSTRAINT "Availability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Connection" (
    "id" TEXT NOT NULL,
    "userAId" TEXT NOT NULL,
    "userBId" TEXT NOT NULL,
    "state" "ConnectionState" NOT NULL DEFAULT 'STRANGER',
    "duration" TEXT,
    "pausedAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "enderId" TEXT,
    "reconnectRule" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Connection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConnectionRequest" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "note" TEXT,
    "state" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConnectionRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "connectionId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'one-on-one',
    "retention" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "moderation" TEXT NOT NULL DEFAULT 'clear',
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TemporarySpace" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "durationMin" INTEGER NOT NULL,
    "capacity" INTEGER NOT NULL DEFAULT 8,
    "state" TEXT NOT NULL DEFAULT 'open',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closesAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TemporarySpace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpaceParticipant" (
    "id" TEXT NOT NULL,
    "spaceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SpaceParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "reporterId" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "evidence" TEXT,
    "review" TEXT NOT NULL DEFAULT 'pending',
    "action" TEXT,
    "appeal" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Block" (
    "id" TEXT NOT NULL,
    "blockerId" TEXT NOT NULL,
    "blockedId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Block_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Schedule" (
    "id" TEXT NOT NULL,
    "data" TEXT,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JournalEntry" (
    "id" TEXT NOT NULL,
    "data" TEXT,

    CONSTRAINT "JournalEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SharedMemory" (
    "id" TEXT NOT NULL,
    "data" TEXT,

    CONSTRAINT "SharedMemory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrustedPerson" (
    "id" TEXT NOT NULL,
    "data" TEXT,

    CONSTRAINT "TrustedPerson_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Availability_userId_key" ON "Availability"("userId");

-- AddForeignKey
ALTER TABLE "Availability" ADD CONSTRAINT "Availability_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpaceParticipant" ADD CONSTRAINT "SpaceParticipant_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "TemporarySpace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
