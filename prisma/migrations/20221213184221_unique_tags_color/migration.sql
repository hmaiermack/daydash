/*
  Warnings:

  - A unique constraint covering the columns `[colorHexValue]` on the table `tags` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "tags_colorHexValue_key" ON "tags"("colorHexValue");
