# Temporary Video Generation Rollback

**Author:** Khwarizmi
**Date:** 2026-05-24T09:58:03.672-05:00
**Status:** Implemented

## Context
The site was hanging and lessons were not loading reliably. Video generation is non-essential compared with lesson API and audio/TTS availability.

## Decision
Temporarily disable all backend video-generation endpoints in `backend/src/routes/video.routes.ts` and return a fast 503 response with `VIDEO_GENERATION_DISABLED` instead of importing the video service or queue.

## Rationale
- Prevent lesson requests from triggering or polling heavyweight Puppeteer/ffmpeg code paths
- Keep audio generation and normal lesson APIs untouched
- Provide a reversible rollback point while production stabilizes

## Impact
- `POST /api/v1/units/:unitId/video` is disabled
- `POST /api/v1/admin/generate-videos` is disabled
- `GET /api/v1/admin/video-status` is disabled
- Existing audio/TTS behavior remains available
- Deployment continues through push-to-`main` GitHub Actions and Azure Container Apps
