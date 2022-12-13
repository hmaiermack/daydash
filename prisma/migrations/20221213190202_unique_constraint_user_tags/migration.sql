/*
  Warnings:

  - A unique constraint covering the columns `[name,colorHexValue,userId]` on the table `tags` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "tags_colorHexValue_key";

-- DropIndex
DROP INDEX "tags_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_colorHexValue_userId_key" ON "tags"("name", "colorHexValue", "userId");
