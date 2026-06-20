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

## Key Recent Learnings (2026-06-05 onwards)

### 2026-06-20T14:01:24-05:00 — Security fix: strip correctAnswer from GET questions + seed.ts production guard
**Security fix — assessment.service.ts `getQuestions()`:**
- Removed `correctAnswer` and `explanation` from the Prisma `select` clause in `getQuestions()`.
- `submitQuiz()` already returns `gradedAnswers` containing `correctAnswer` + `explanation` per question — that is the correct place for the client to receive answers.
- `QuizPage.tsx` currently reads `q.correctAnswer` from the GET response for local grading AND for the review panel. It does NOT capture the `submitQuiz()` response (the `await` result is discarded). **Ibn Sina must update `QuizPage.tsx`** to: (a) capture the `submitQuiz()` response, (b) map `correctAnswer`/`explanation` from the graded results, and (c) use those in `calculateScore()` and the review panel instead of the now-absent GET fields.
- Key files: `backend/src/services/assessment.service.ts`, `frontend/src/pages/courses/QuizPage.tsx`.

**Seed guard — backend/prisma/seed.ts:**
- Added a danger comment block above `main()` explaining the destructive nature.
- Added `NODE_ENV` check at the start of `main()`: throws if `'production'`, warns but proceeds for all other values.
- Logs a visible ⚠️ banner before the destructive deletes even in development so accidental runs are obvious.
- Key file: `backend/prisma/seed.ts`.

### 2026-06-06T17:42:46Z — al-Masār I'rab & Sarf Course BUILD COMPLETE
✅ **ALL FOUR SEED COMPONENTS DELIVERED**

**Deliverables:**
- **Schema Migration (1 file):** `20260606151820_add_arabic_term_metadata.sql` — Added `metadata Json?` to ArabicTerm for future per-word annotation
- **seed-masaar-course.ts:** 1 course + 8 units (weeks 1-8), idempotent upsert on `courseId_orderIndex`, Arabic labels in unit descriptions + content placeholders
- **seed-masaar-quizzes.ts:** 64 MCQ covering weeks 1-8, Sarf/I'rab topics, seeded via Question + QuestionsOnQuiz associations
- **seed-masaar-flashcards.ts:** 152 flashcards, bilingual terms + definitions, full SM-2 spaced repetition metadata
- **seed-masaar-terms.ts:** 320 Arabic terminology entries with categories, English glosses, metadata placeholders

**Quality Assurance:**
- All 4 seed files execute idempotently (upsert on natural keys)
- No merge conflicts with existing seed data
- Schema migration is fully backward-compatible
- Seed execution time: < 500ms per file

**Build Context:**
- Executed parallel to Ibn Sina HTML generation (weeks 1-8)
- Both agents completed without rework

---

### 2026-06-20T16:18:48-05:00 — Maktab Seed Files Refactored to Upsert Pattern

**All 10 maktab seed files converted from find-first-skip to idempotent upsert:**
- `course.create` → `course.upsert` keyed on `slug` (new `Course.slug @unique`)
- `unit.create` → `unit.upsert` keyed on `courseId_slug` composite unique
- `question.createMany` → `Promise.all([question.upsert(...)])` keyed on `externalId`
- `flashCard.createMany` → `Promise.all([flashCard.upsert(...)])` keyed on `unitId_orderIndex`
- `arabicTerm.createMany` → `deleteMany` per unit + `createMany` (no unique constraint on ArabicTerm)

**Slug assignments:**
- CB1–CB5, CB7, CB8: `maktab-coursebook-{N}`, units `maktab-{N}-{subject}`
- CB6 Boys: `maktab-coursebook-6-boys`, units `maktab-6b-{subject}`
- CB6 Girls: `maktab-coursebook-6-girls`, units `maktab-6g-{subject}`
- Further Studies NW: `maktab-further-studies-nw`, units `maktab-fs-{subject}`

**Question externalId pattern:** `{unit-slug}-q{N}` (1-indexed)

**Student data never touched:** `CourseEnrollment`, `UnitProgress`, `QuizResult`, `FlashCardProgress`

`tsc --noEmit` passes clean. All 10 files verified: 0 old `if (existing)` patterns, correct upsert counts across all files.

### 2026-06-20T17:20:27-05:00 — Question Randomization + Attempt Cooldown Enforcement

**Task 1 — Fisher-Yates shuffle in `getQuestions()` (assessment.service.ts):**
- Added `shuffle<T>()` utility (proper Fisher-Yates, unbiased) at module level.
- `getQuestions()` now shuffles the questions array after DB fetch.
- Also shuffles the `options` array within each question (guarded by `Array.isArray()`), so answer positions change across retries even for the same question.
- Prisma `select` fields unchanged.

**Task 2 — 15-minute cooldown after failed attempt:**
- Added `CooldownError` class to `error.middleware.ts` (extends `AppError`, statusCode=429, carries `retryAfterMinutes` + `retryAt` fields).
- Updated `errorHandler` to detect `CooldownError` and emit the flat response shape `{ error, retryAfterMinutes, retryAt }` expected by the frontend countdown UI.
- Added `getCooldownStatus(memberId, unitId)` static method to `AssessmentService` — returns `{ onCooldown, retryAfterMinutes, retryAt }`. Cooldown only fires after a FAILED attempt; passed attempts have no cooldown.
- `submitQuiz()` calls `getCooldownStatus()` before grading and throws `CooldownError` if active.
- Added `AssessmentController.getCooldownStatus` handler (uses `resolveAccessibleMemberId` pattern, wraps in `{ success: true, data: ... }`).
- Added `GET /units/:unitId/cooldown-status` route to `assessment.routes.ts`.
- `COOLDOWN_MINUTES = 15` constant — centralized, easy to tune.
- `tsc --noEmit` passes clean.

**Key paths:** `backend/src/services/assessment.service.ts`, `backend/src/controllers/assessment.controller.ts`, `backend/src/routes/assessment.routes.ts`, `backend/src/middleware/error.middleware.ts`.



For detailed work history prior to 2026-05-20, see `.squad/agents/khwarizmi/history-archive.md`

Key prior work:
- 2026-05-16: Seed data (50+ courses, 62+ units, 450+ questions, 530+ flashcards)
- 2026-05-17: Games backend (all 26 game types with type-specific engines)
- 2026-05-17: Parent dashboard + child auth APIs
- 2026-05-18: Game engine collapse (26→9 types, migration written)
- 2026-05-20: TTS/audiobook integration, video generation pipeline
- 2026-05-21: Coursebook images → Azure Blob Storage

## Session 2026-06-20T19:47:13Z
- Security fix for correctAnswer stripping in getQuestions API documented

## Session 2026-06-20T16:12:48-05:00 — Schema Migration: Content Slugs & Versioning

### What was done
- Added `slug String? @unique` and `contentVersion Int @default(1)` to Course model
- Added `slug String?` and `@@unique([courseId, slug])` to Unit model
- Added `externalId String? @unique` to Question model
- Created migration manually (non-interactive env): `backend/prisma/migrations/20260620211248_add_content_slugs_versioning/migration.sql`
- Wrote idempotent backfill script: `backend/prisma/backfill-slugs.ts`
- Regenerated Prisma client; `tsc --noEmit` passes clean

### Key decisions
- Used nullable (`String?`) for all three new fields — Postgres treats NULLs as distinct in unique indexes, so multiple NULL rows don't collide. This avoids the default-empty-string footgun on Unit's composite unique.
- Composite unique `@@unique([courseId, slug])` on Unit is safe with NULLs in Postgres.
- Backfill script uses kebab-case slug generation, de-duplication with numeric suffixes, question externalIds follow pattern `{unit-slug}-q{n}`, and processes in 500-row transaction chunks for safety.
- Did NOT run `migrate dev` (applied); migration is review-ready only.

### Key file paths
- `backend/prisma/schema.prisma` — Course, Unit, Question models updated
- `backend/prisma/migrations/20260620211248_add_content_slugs_versioning/migration.sql`
- `backend/prisma/backfill-slugs.ts`

