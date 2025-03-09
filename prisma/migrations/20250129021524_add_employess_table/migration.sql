/*
  Warnings:

  - You are about to drop the `QRCodeNew` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "QRCodeNew";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Employees" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "age" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
