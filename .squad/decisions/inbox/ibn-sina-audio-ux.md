# Ibn Sina — Audio UX Calibration

**Date:** 2026-05-24T16:05:42.973-05:00
**Author:** Ibn Sina (Frontend Dev)
**Status:** Proposed for team decisions

## Context
Learners reported two audio UX issues in the unit reader:
1. Word highlighting was visibly ahead of the spoken narration.
2. Pause/resume controls were only available in the Study Aids card at the top of the page.

## Decision
- Treat TTS word-boundary offsets as slightly early for frontend highlighting and apply a configurable playback lag in the sync hook. Frontend default: `300ms`.
- Start the continuous sync loop from the audio element's `playing` event, while also syncing on `timeupdate` and `seeked`.
- Keep synced-audio transport reachable by rendering a floating fixed play/pause button from `UnitViewer` while an active synced session is in progress.

## Rationale
This preserves the existing page-level highlighting architecture from Decision #20 while making the perceived timing match the voice better and keeping playback control available during long reading sessions.

## Impacted Files
- `frontend/src/hooks/useAudioSync.ts`
- `frontend/src/components/UnitAudioButton.tsx`
- `frontend/src/pages/courses/UnitViewer.tsx`
- `frontend/src/__tests__/useAudioSync.test.tsx`
- `frontend/src/__tests__/UnitViewer.audio-floating-control.test.tsx`
