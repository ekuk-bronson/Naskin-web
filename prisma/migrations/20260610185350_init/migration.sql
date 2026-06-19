-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "Mole" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "loc" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "risk" TEXT NOT NULL,
    "days" INTEGER NOT NULL DEFAULT 0,
    "changed" BOOLEAN NOT NULL DEFAULT false,
    "size" TEXT NOT NULL,
    "since" TEXT NOT NULL,
    "imageUrl" TEXT,
    "abcdeJson" TEXT NOT NULL,
    "historyJson" TEXT NOT NULL,
    "summary" TEXT,
    "rec" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatarUrl" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Mole_userId_idx" ON "Mole"("userId");

-- AddForeignKey
ALTER TABLE "Mole" ADD CONSTRAINT "Mole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

