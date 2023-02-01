/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
ADD COLUMN     "avatarImage" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "isAvatarImageSet" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "username" TEXT;
