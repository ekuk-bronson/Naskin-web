-- CreateTable
CREATE TABLE "Mole" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "loc" TEXT NOT NULL,
    "score" REAL NOT NULL,
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Mole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatarUrl" TEXT
);

-- CreateIndex
CREATE INDEX "Mole_userId_idx" ON "Mole"("userId");
