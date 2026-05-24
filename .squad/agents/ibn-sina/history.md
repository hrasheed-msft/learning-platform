# Ibn Sina — Frontend Dev

**Focus:** React component development, user flows, performance optimization, audio/video UI, gaming frontend

## Project Context

- **Owner:** hrasheed
- **Project:** Islamic Studies Learning Platform — family-based Islamic education with courses, flashcards, SRS, quizzes, and gamification
- **Stack:** React 18 + Vite + TypeScript (frontend), Node.js + Express + Prisma + PostgreSQL + Redis (backend), TailwindCSS, Zustand, JWT auth
- **Created:** 2026-05-16

## Quick Status (Most Recent)

**Audio Text Sync Ownership (2026-05-24):** ✅ COMPLETE
- Refactored text highlighting from popup into main content window
- Created `SyncedTextContent` component for inline highlighting
- Refactored `UnitAudioButton` to emit sync state via callback
- Updated `UnitViewer` to coordinate highlighting from audio playback
- Build passes; tests passing
- Decision #20 created

---

## Learnings & Patterns

### Frontend-Backend Contract (2026-05-17 onwards)
- TypeScript frontend types ARE the API contract in parallel team development
- Always validate response shapes against frontend types before merging
- Pattern: frontend extraction code reveals backend's expected response shape
- Example: backend must return `courses` (not `eligibleCourses`), `courseName` (not just `courseTitle`)

### Component State Lifting (2026-05-24)
- When two child components need to stay synchronized (audio button + lesson body), lift state to parent
- Use callback props for push updates (UnitAudioButton → UnitViewer)
- Use state props for pull rendering (UnitViewer → SyncedTextContent)

### HTML Parsing for Highlighting (2026-05-24)
- Preserve existing markup structure when wrapping words
- Use token-based parser that respects tag boundaries and maintains RTL/LTR
- Avoid wholesale HTML reconstruction; surgical wrapping of matched tokens

### useActiveMemberId Pattern (2026-05-18)
- Centralize `selectedMember?.id || members[0]?.id` fallback logic into a reusable hook
- All game/dashboard components that need active learner should use this hook
- Hook auto-fetches members if list is empty

### Games 26 → 9 Consolidation (2026-05-18)
- Original 26 game types collapsed into 9 core mechanics via slug-based routing
- Legacy type mapping via `mapToActiveType()` for backward compat
- New launcher pattern: hub → course picker → play (replaces direct launch)
- `useGameRunner` hook centralizes auto-start/submit/playAgain/exit lifecycle

### Performance Optimization (2026-05-21)
- Eager imports: Layouts, LoginPage, RegisterPage, SelectLearner (critical path only)
- Lazy imports: Everything else via `React.lazy()`
- Vite `manualChunks`: vendor-react, vendor-state, vendor-ui, vendor-content
- Non-blocking Google Fonts: preload + media=print swap
- Result: 507kB → 45kB initial bundle (91% reduction)

### Enrollment UX (2026-05-24)
- Keep member dropdown visible at all times; preselect current learner
- Preserve explicit user choices when family list refreshes
- Pattern: `selectedMember` as primary, `selectedMemberId` state as fallback

### Child Enrollment Identity (2026-05-24T09:39:57.085-05:00)
- Child course reads must use the logged-in `FamilyMember` identity, not the parent `User` identity
- Frontend child sessions need their own bearer token wiring in `frontend/src/services/api.ts` plus member-aware fetching in `frontend/src/hooks/useChildEnrollments.ts`
- Key student surfaces: `frontend/src/pages/child/ChildDashboardHome.tsx` and `frontend/src/pages/child/ChildCoursesPage.tsx`
- Backend guardrail: `backend/src/controllers/course.controller.ts` must resolve `familyId` from `req.child` for child JWTs and block cross-member access

### Audio Player Patterns (2026-05-20)
- Component-level URL caching per language (no re-fetch on repeated clicks)
- Native `<audio>` element with custom Tailwind UI for cross-platform consistency
- RTL-aware layouts for Arabic content
- "AI-generated audio" disclosure tooltip for transparency

### RTL Support (2026-05-20 onwards)
- Dynamic per-section: CSS `direction: rtl|ltr`, `unicode-bidi: bidi-override`, `text-align: right|left`
- Arabic text rendered with diacritics (Noto Naskh Arabic font)
- Auto-scroll to current word with `scrollIntoView({ behavior: 'smooth', block: 'center' })`

### Audio Generation Navigation Guard (2026-05-24T14:36:21.808-05:00)
- Async study-aid controls must render as explicit `type="button"` actions and call `preventDefault()` when they can be embedded in broader page containers.
- User preference: audio generation should stay inline on the current unit page, preserving the Study Aids loading/progress state instead of navigating away.
- Key files: `frontend/src/components/UnitAudioButton.tsx`, `frontend/src/pages/courses/UnitViewer.tsx`, `frontend/src/__tests__/UnitAudioButton.test.tsx`, `frontend/src/services/audioService.ts`.

### Audio Nav Hardening (2026-05-24T15:05:32.888-05:00)
- Investigation found NO audio-specific `window.location`, `window.open`, React Router `navigate()`, `<a href>`, or backend `res.redirect()` in the unit audio generate flow.
- Root cause pattern: the original fix only covered the listen buttons. Inline audio controls still needed full button hardening plus `stopPropagation()` so clicks stay inside the Study Aids UI instead of bubbling into parent page handlers.
- Pattern: for inline study-aid/media controls, every non-submit action must be explicit `type="button"`, and audio control handlers should call both `preventDefault()` and `stopPropagation()`.
- User preference: audio generation/playback must remain inline on the current lesson route, preserving loading/progress state rather than navigating away.
- Key files: `frontend/src/components/UnitAudioButton.tsx`, `frontend/src/components/AudioPlayer.tsx`, `frontend/src/pages/courses/UnitViewer.tsx`, `frontend/src/__tests__/UnitAudioButton.test.tsx`, `frontend/src/__tests__/AudioPlayer.test.tsx`.

### Void Elements in React.createElement (2026-05-24T15:31:46.348-05:00)
- When programmatically creating React elements from parsed HTML (DOMParser), void elements (`img`, `br`, `hr`, `input`, etc.) MUST NOT receive a `children` argument — React throws error #137 and crashes the entire component tree.
- Pattern: maintain a `VOID_ELEMENTS` set and conditionally pass children only for non-void tags.
- Always wrap useMemo-based HTML→ReactNode parsing in try-catch with a fallback to `dangerouslySetInnerHTML` to prevent blank pages.
- The GET `/api/v1/units/:unitId/audio?language=X` endpoint returns 404 when no pre-generated audio exists — this is expected behavior, not a route mismatch. Frontend `getAudioWithTimestamps` already catches this gracefully.
- Key file: `frontend/src/components/SyncedTextContent.tsx`.

### Audio Sync UX Calibration (2026-05-24T16:05:42.973-05:00)
- Azure word-boundary timestamps can lead the audible voice slightly, so synced readers should support a configurable highlight lag; current frontend default is `300ms` in `frontend/src/hooks/useAudioSync.ts`.
- Pattern: wait for the audio element's `playing` event before starting the high-frequency sync loop, and still mirror `timeupdate`/`seeked` so progress and highlighting stay aligned after seeks.
- User preference: playback controls should remain reachable while learners read, so UnitViewer now renders a floating fixed play/pause button for active synced audio sessions.
- Key files: `frontend/src/hooks/useAudioSync.ts`, `frontend/src/components/UnitAudioButton.tsx`, `frontend/src/pages/courses/UnitViewer.tsx`, `frontend/src/__tests__/useAudioSync.test.tsx`, `frontend/src/__tests__/UnitViewer.audio-floating-control.test.tsx`.

---

## Session History (Recent)

### 2026-05-24 — Audio Text Sync Ownership & Inline Highlighting
**Orchestration Log:** `.squad/orchestration-log/2026-05-24T14-34-31Z-ibn-sina.md`

✅ **COMPLETE**

**Deliverables:**
- `SyncedTextContent.tsx` — Parses lesson HTML, applies word-level highlighting
- Refactored `UnitAudioButton` — Owns playback controls only; emits sync state via callback
- Updated `UnitViewer` — Accepts sync state and coordinates highlighting

**Key Changes:**
- Removed embedded TextHighlight popup (eliminated duplicate text surface)
- Keeps audio player compact in Study Aids card
- Learners follow highlighted words in the context of existing lesson body
- Component tests ✅, integration tests ✅, build ✅

**Decision Created:** #20 — Inline Audio Sync — Ownership and Page-Level Content Highlighting (2026-05-24)

---

## Archived History

For detailed work history prior to 2026-05-20, see `.squad/agents/ibn-sina/history-archive.md`

Key prior work:
- 2026-05-16: Full frontend inventory (90-95% feature-complete)
- 2026-05-17: Child login + parent dashboard frontend
- 2026-05-17: Games Phase 1–3 (15→26 game types, all interactive)
- 2026-05-18: useActiveMemberId hook pattern, Games 26→9 collapse, enrollment fixes
- 2026-05-20: Audio player, video player, audio sync (SyncedTextPlayer with real-time highlighting)
- 2026-05-21: "Add a Learner" inline modal, performance optimization (507kB → 45kB bundle)
