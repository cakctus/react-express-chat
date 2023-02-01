-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "users" TEXT[] DEFAULT ARRAY[]::TEXT[];
