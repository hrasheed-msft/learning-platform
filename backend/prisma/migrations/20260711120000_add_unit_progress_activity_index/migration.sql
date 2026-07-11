-- Phase 2: add composite index on unit_progress(enrollmentId, completedAt)
-- Supports batched activity/streak queries in getStageSummary without N+1.
CREATE INDEX "unit_progress_enrollmentId_completedAt_idx" ON "unit_progress"("enrollmentId", "completedAt");
