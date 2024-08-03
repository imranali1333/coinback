/*
  Warnings:

  - You are about to drop the column `updated` on the `UserTeleGram` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `UserTeleGram` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Invitation" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '1 DAY';

-- AlterTable
ALTER TABLE "UserTeleGram" DROP COLUMN "updated",
ADD COLUMN     "isBot" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "languageCode" VARCHAR(16),
ADD COLUMN     "lastLogin" TIMESTAMP(3),
ADD COLUMN     "status" VARCHAR(16),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
