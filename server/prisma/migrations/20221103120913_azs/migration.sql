-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "users" SET DEFAULT ARRAY['', '']::TEXT[];
