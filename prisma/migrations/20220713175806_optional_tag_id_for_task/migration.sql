-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_tagId_fkey";

-- AlterTable
ALTER TABLE "tasks" ALTER COLUMN "tagId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE SET NULL ON UPDATE CASCADE;
