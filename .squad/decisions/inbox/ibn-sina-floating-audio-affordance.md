# Decision: Floating Audio Affordance for Long Lesson Pages

**Date:** 2026-05-24T16:09:47.032-05:00
**Author:** Ibn Sina (Frontend Dev)

## Context

Unit audio playback now drives inline word highlighting inside the main lesson body. On long pages, learners can scroll far away from the Study Aids card, making pause/stop actions hard to reach.

## Decision

Use a compact floating transport for synced unit audio when:
- playback is active or resumable, and
- the main Study Aids audio controls are no longer visible in the viewport

The floating transport should include:
- play/pause
- stop (pause + seek to `0`)

## Why

This keeps audio controls reachable without duplicating the full player UI or cluttering the screen while the main controls are already visible.

## Implementation Notes

- Detect primary control visibility with `IntersectionObserver` on the UnitViewer Study Aids audio control wrapper.
- Keep audio ownership in `UnitAudioButton`; expose transport callbacks upward via `onSyncStateChange`.
- Apply a `400ms` highlight lag so the active word trails the spoken audio slightly instead of leading it.

## Files

- `frontend/src/hooks/useAudioSync.ts`
- `frontend/src/components/UnitAudioButton.tsx`
- `frontend/src/pages/courses/UnitViewer.tsx`
- `frontend/src/__tests__/UnitViewer.audio-floating-control.test.tsx`
