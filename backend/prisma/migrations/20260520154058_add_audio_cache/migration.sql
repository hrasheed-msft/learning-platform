-- CreateTable
CREATE TABLE "audio_cache" (
    "id" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "blockIndex" INTEGER,
    "url" TEXT NOT NULL,
    "duration" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audio_cache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "audio_cache_unitId_idx" ON "audio_cache"("unitId");

-- CreateIndex
CREATE UNIQUE INDEX "audio_cache_unitId_language_blockIndex_key" ON "audio_cache"("unitId", "language", "blockIndex");

-- AddForeignKey
ALTER TABLE "audio_cache" ADD CONSTRAINT "audio_cache_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "units"("id") ON DELETE CASCADE ON UPDATE CASCADE;
