-- DropIndex
DROP INDEX "completedHabits_dateCompleted_idx";

-- CreateIndex
CREATE INDEX "completedHabits_dateCompleted_habitId_idx" ON "completedHabits"("dateCompleted", "habitId");
