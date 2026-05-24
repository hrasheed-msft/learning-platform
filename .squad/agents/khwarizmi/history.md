# Khwarizmi — Backend Implementation Agent

**Focus:** Games engine, child auth, dashboard API, seed data generation, TTS/audio services

## Quick Status

**TTS Audio Player & Sync (2026-05-20):** ✅ COMPLETE
- Azure AI Speech S0 integration for pre-generated audio
- Word-level timestamps via `wordBoundary` event
- SSML chunking with voice switching for bilingual content
- AudioCache model with duration and timestamp storage

**Games Backend (2026-05-17):** ✅ COMPLETE
- 8 enums, 14 models, 3 services, 15 API endpoints
- SRS writeback, streak system (1-day grace), time budget enforcement
- Game-type whitelist, difficulty caps, parental controls

**Parent Dashboard + Child Auth (2026-05-17):** ✅ COMPLETE
- 4 dashboard endpoints, 3 notification endpoints
- Child Auth: username/password, dual JWT (parent/child)

---

## Architecture Decisions

- Parental controls: Whitelist model; empty = all allowed; non-empty = restricted
- Streak grace period: 1-day miss allowed per streak
- SRS writeback: Game answers feed into FlashCardProgress with SM-2 ratings
- Activity tracking: recordActivity() helper ready for quiz/flashcard/course integration
- Daily challenge: Deterministic seed ensures all users get same challenge per day

---

## Key Learnings & Patterns

### Backend-Frontend Contract (2026-05-17 onwards)
- TypeScript types ARE the API contract in parallel development
- Response shapes must match exactly; test field names carefully
- Example: `eligibleCourses` vs `courses`, `courseTitle` vs `courseName`
- Pattern: Always check frontend extraction code first, then emit that exact shape

### Postgres Enum Migration (2026-05-18)
- Can't drop enum values still referenced
- Pattern: `GameType_new`, ALTER each column with `USING (CASE ... END)`, DROP old, RENAME
- Array columns need `DROP DEFAULT` before swap
- Sequence: drop array default → ALTER columns → DROP TYPE → RENAME → re-add default

### Content Selection Fallback (2026-05-17)
- selectContent was filtering by exact difficulty and returning 0 when no match
- Fixed with fallback to any-difficulty when exact match empty
- Resolves "game start returns success=false" silent failures

### Azure TTS Details (2026-05-20)
- Audio duration in 100-nanosecond ticks: divide by 10,000,000 for seconds
- SSML `<lang>` tags switch voice mid-narration for bilingual content
- AudioCache blockIndex=-1 sentinel for full-unit audio (not null)

### Video Generation Pipeline (2026-05-20)
- Narrated slide-deck: Puppeteer → PNG, TTS per-slide, ffmpeg stitch
- Dockerfile: `node:20-alpine` → `node:20-slim` (Debian) for Chromium
- Fire-and-forget async with database status tracking (generating→ready→failed)
- Use `--no-sandbox` + `PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium` in Container Apps

### Idempotent Operations (2026-05-18)
- New simple-enroll endpoint: POST /api/v1/courses/:courseId/enroll (idempotent)
- Returns 200 + existing record if already enrolled (not 409 ConflictError)
- Lets frontend fire-and-forget without error handling

### Azure SSML Break Placement + Targeted Regen (2026-05-24T09:31:36.752-05:00)
- Azure Speech rejects root-level `<break>` nodes under `<speak>`; keep heading pauses wrapped inside `<voice>` elements in `backend/src/services/tts.service.ts`
- Regression coverage for this lives in `backend/src/__tests__/audio.test.ts`
- Reliable ops pattern for one-off reruns: find the unit via Prisma, clear the specific `AudioCache` row, then call `getOrGenerateAudio()` directly
- Key path/data point for this request: `backend/prisma/seed-maktab-coursebook1.ts` defines Unit 1, and the live unit id is `988e4427-8d1c-447e-bc9d-17fa01c1118c`

---

## Session History (Recent)

### 2026-05-24 — TTS Arabic Term Normalization + Heading Breaks
**Orchestration Log:** `.squad/orchestration-log/2026-05-24T14-34-31Z-khwarizmi.md`

✅ **COMPLETE**

**Deliverables:**
- `preprocessTtsHtml()` — Normalize HTML before SSML generation
- `extractSynthesisBlocks()` — Preserve heading blocks for separate pause handling
- Updated `buildVoiceElements()` — Handle marked Arabic text (`[[ar]]...[[/ar]]`)
- Tests added to `src/__tests__/audio.test.ts`

**Key Improvements:**
1. Arabic terms now emit: "Translation صالح/(transliteration)" (normalized format)
2. Section headings have explicit pause markers (`[[break:800ms]]` before, `[[break:500ms]]` after)
3. Intelligent voice-element merging (inline Arabic <4 words stays with English voice)

**Build & Validation:**
- `npx tsc --noEmit` ✅
- `npm run test:ci` ✅
- `npm run build` ✅

**Decision Created:** #23 — TTS Arabic Term Normalization + Heading Breaks (2026-05-24)

---

## Learnings

### 2026-05-24T09:58:03.672-05:00 — Emergency video generation rollback
- **Architecture decision:** Temporarily disable backend video generation endpoints at `backend/src/routes/video.routes.ts` with fast 503 responses so lesson and audio traffic cannot trigger Puppeteer/ffmpeg work while the site is stabilized.
- **Deployment pattern:** Production deploys from pushes to `main` via `.github/workflows/ci-cd.yml`; backend ships to Azure Container Apps (`ca-api-islamic-learning`) from `backend/Dockerfile`, frontend ships to Azure Static Web Apps.
- **User preference:** In outage mode, favor fast rollback and safe disablement over keeping non-essential AI/media features alive; audio/TTS must remain available.
- **Key file paths:** `backend/src/routes/video.routes.ts`, `backend/src/services/videoQueue.service.ts`, `backend/src/services/videoService.ts`, `.github/workflows/ci-cd.yml`, `azure.yaml`.

### 2026-05-24T10:13:27.614-05:00 — Child progress identity fix
- **Architecture decision:** Any learner-scoped progress or quiz endpoint that already requires an active learner must trust the authenticated child token or `x-active-member-id` over a submitted `memberId`; request bodies can be stale or contain the parent `userId`.
- **Progress pattern:** Quiz passes must update `unit_progress.completedAt`, recompute `course_enrollments.progress/status`, and refresh `family_members.lastActiveAt` so parent dashboards stay aligned with stored quiz results and completed lessons.
- **User preference:** When parent and child sessions both exist, preserve one backend path that resolves the active learner automatically instead of requiring the frontend to manually map identities for every progress call.
- **Key file paths:** `backend/src/controllers/course.controller.ts`, `backend/src/controllers/assessment.controller.ts`, `backend/src/services/course.service.ts`, `backend/src/services/assessment.service.ts`, `backend/src/routes/course.routes.ts`, `backend/src/routes/assessment.routes.ts`, `frontend/src/pages/courses/UnitViewer.tsx`, `frontend/src/pages/courses/QuizPage.tsx`, `frontend/src/services/courseService.ts`.

## Archived History

For detailed work history prior to 2026-05-20, see `.squad/agents/khwarizmi/history-archive.md`

Key prior work:
- 2026-05-16: Seed data (50+ courses, 62+ units, 450+ questions, 530+ flashcards)
- 2026-05-17: Games backend (all 26 game types with type-specific engines)
- 2026-05-17: Parent dashboard + child auth APIs
- 2026-05-18: Game engine collapse (26→9 types, migration written)
- 2026-05-20: TTS/audiobook integration, video generation pipeline
- 2026-05-21: Coursebook images → Azure Blob Storage
