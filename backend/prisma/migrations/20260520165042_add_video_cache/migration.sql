-- CreateTable
CREATE TABLE "video_cache" (
    "id" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "duration" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'generating',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "video_cache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "video_cache_unitId_idx" ON "video_cache"("unitId");

-- CreateIndex
CREATE UNIQUE INDEX "video_cache_unitId_language_key" ON "video_cache"("unitId", "language");

-- AddForeignKey
ALTER TABLE "video_cache" ADD CONSTRAINT "video_cache_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "units"("id") ON DELETE CASCADE ON UPDATE CASCADE;
