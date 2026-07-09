# Khwarizmi — History Archive

Archived entries from before 2026-05-20 for long-term reference.

## Archived Quick Status

**TTS Word Timestamps (2026-05-20):** ✅ COMPLETE
- Word-level timestamps via Azure Speech SDK `wordBoundary` event
- Cumulative offset calculation across SSML chunks
- `timestamps Json?` field on AudioCache model
- Admin batch endpoint: `POST /api/v1/units/admin/pre-generate-audio`
- Timestamps-only endpoint: `GET /api/v1/units/:unitId/audio/timestamps`
- Audio response now includes `{url, duration, timestamps, cached}`

**Games Backend (2026-05-17):** ✅ COMPLETE
- 8 enums, 14 models, 3 services (game, achievement, parental controls), 15 API endpoints
- Features: SRS writeback, streak system (1-day grace), time budget enforcement, game-type whitelist, difficulty caps

**Parent Dashboard + Child Auth (2026-05-17):** ✅ COMPLETE  
- 4 dashboard endpoints: children list, child stats, activity feed, family summary
- 3 notification endpoints with notification service integration
- Child Auth: username/password on FamilyMember, dual JWT (parent/child), 3 new endpoints

**Seed Data (2026-05-16):** ✅ COMPLETE
- 11 seed files wired (Maktab 1-8, Quduri, Further Studies)
- Totals: 50+ courses, 62+ units, 450+ questions, 530+ flashcards, 318+ Arabic terms

**Quduri Salah Seed (2026-07-14):** ✅ COMPLETE
- `seed-quduri-salah.ts` — 8 units, 42 questions, 35 flashcards, 55 Arabic terms
- Bilingual HTML format (same as Taharah); TEEN/ADULT target; Hanafi-distinctive rulings highlighted
- Wired into `seed.ts` after `seedQuduriTaharah()`
- Commit: `feat: add Mukhtasar al-Quduri Salah chapter course`

## Archived Learnings

**Coursebook Images → Blob Storage (2026-05-21):**
- `public/coursebook-images/` is in `.dockerignore` (188MB) — images don't exist in production Docker image
- Created `coursebook-images` container on `stislamiclearning` storage account with public blob access
- Uploaded all images via `az storage blob upload-batch`
- Backend route redirects to blob storage in production; falls back to local in dev
- Course controller rewrites `src="/coursebook-images/..."` directly to blob URL (no redirect hop)
- Pattern: large static assets → blob storage with public access; keep `.dockerignore` exclusion
- Env var `COURSEBOOK_IMAGES_BLOB_URL` can override the default blob URL if needed

**CI/CD Pipeline (2026-05-20):**
- Created `ci-cd.yml` (full deploy pipeline) and `test.yml` (PR-only fast feedback)
- Added `test:ci` scripts to both packages — `vitest run --reporter=verbose` for non-interactive CI
- Backend CI needs `npx prisma generate` before tests (Prisma client must be generated)
- Deploy jobs use `needs: [test-backend, test-frontend]` + `if: github.ref == 'refs/heads/main'` to gate deployments
- Branch protection with required status checks (`test-backend`, `test-frontend`) completes the automated gate
- Secrets needed: `AZURE_CREDENTIALS` (service principal), `SWA_DEPLOYMENT_TOKEN` (static web app token)

**Backend-Frontend Contract (2026-05-17):**
- Frontend TypeScript types ARE the API contract when teams work in parallel
- Response shapes must match exactly (example: id vs memberId caused undefined crashes)
- Established pattern: Always validate response shapes against frontend types before merging

**Game Type Engines (2026-05-17):**
- All 26 game types now have dedicated formatRoundsForGameType() and gradeAnswer() logic
- Game-type-specific metadata in rounds is the frontend contract — each gameMode has a defined shape
- Composite-round games (TERM_MATCH, HADITH_CHAIN, SEERAH_TIMELINE, WORD_SEARCH, MEMORY_MATCH, STORY_PUZZLE) collapse all items into a single round with combined metadata
- Per-round games (SPEED_QUIZ, FIQH_SCENARIO, TRIVIA_BATTLE, etc.) produce one round per content item with multiple-choice options auto-generated from sibling items
- FLASHCARD_FLIP and CALLIGRAPHY_TRACE use self-rating (1-5) model — "correct" means rating >= 3 for scoring purposes
- Course name now included in /games/available response to distinguish course-linked game instances
- generateOptions() helper creates distractors from sibling content items in the same session

**Critical Bug Fixes (2026-05-17):**
- selectContent difficulty filter: was filtering questions by exact difficulty but checkContentAvailability didn't — caused startGame to return 0 content even when questions existed at other difficulties. Fixed with fallback to any-difficulty query.
- GameType enum alignment: backend had 15 types, frontend had different 15 types. Extended to 26 total types covering full union. Schema migrated, engine updated, seed data expanded.
- Also lowered minQuestions for SPEED_QUIZ and MAZE_NAVIGATOR from 10→5 to improve availability.

**Recent Fixes:**
1. Seed Loading: Wired 12 missing seed files into main seed.ts
2. Dashboard API: Fixed 4 endpoints (children, stats, activity, family) to match frontend contracts
3. Child Auth: Implemented /auth/child-login and credential management
4. Course Catalog: Bumped limit from 12 → 50 (17 published courses now visible)
5. Game Engines: Implemented all 26 game types with type-specific round formatting + grading
6. Game Start Bug: Fixed selectContent difficulty fallback + aligned GameType enum across stack

## Archived Session Logs

### 2026-05-17 — Games Backend Implementation
- 1249 → 1555 lines (+306 lines)
- All 15 game type engines implemented with dedicated round formatting & grading
- No breaking changes to existing API contracts
- Frontend integration path clear

### 2026-05-18 — Game Engine Collapse (26 → 9 types)
- Migration written (not applied)
- 2047 → 1561 lines (24% reduction)
- Learnings: Postgres enum migration pattern, template dedup with sessions, service rewrite ratio
- Important: GameTemplate has NO defaultDifficulty column; difficulty lives in rules JSON

### 2026-05-18 — No Eligible Courses Fix + Decisions Merge
- Scribe merged 7 new team decisions into decisions.md
- Decisions archive metrics captured
- Complete game system redesign decision trail documented

### 2026-05-18 — Eligible Courses Fix + Simple Enroll Endpoint
- Fixed getEligibleCourses response shape: `eligibleCourses` → `courses`
- New countContentForGame() helper
- New POST /api/v1/courses/:courseId/enroll endpoint (idempotent)
- CourseService.enrollMemberIdempotent() method added

### 2026-05-20 — TTS Implementation & Key Learnings
- Azure Speech SDK: audio duration in 100-nanosecond ticks (divide by 10,000,000 for seconds)
- SSML `<lang>` tags switch voice mid-narration for bilingual content
- AudioCache blockIndex=-1 sentinel for full-unit audio
- Video generation: Puppeteer renders slides, TTS per-slide, ffmpeg stitches
- Dockerfile: switch `node:20-alpine` → `node:20-slim` (Debian) for Chromium support
- Fire-and-forget async pattern with database status tracking



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



### 2026-06-20T17:31:22-05:00 — Reading Completion Gate in submitQuiz()

**Task:** Block quiz attempts for enrolled students who haven't marked reading as complete.

**Changes — `backend/src/services/assessment.service.ts`:**
- Added `BadRequestError` to the import from `error.middleware`.
- Inserted a reading gate block in `submitQuiz()` **before** the cooldown check and before grading.
- Gate logic:
  - Looks up the unit's `courseId`.
  - If no enrollment exists for this member+course → gate is skipped (unenrolled exploration allowed).
  - If enrolled but no `UnitProgress` row → blocked (no row = not-read).
  - If enrolled and `readingCompleted` is `false` → blocked with `BadRequestError 400`.
  - If `readingCompleted` is `true` → allowed through.
- Uses `findUnique` with the composite key `memberId_courseId` (consistent with the rest of the service).

**Reading-complete endpoint (already exists — no new route needed):**
- `POST /api/v1/courses/progress`
- Body: `{ unitId: "<uuid>", readingCompleted: true }` (memberId resolved from auth context)
- Handler: `CourseController.updateProgress` → `CourseService.updateProgress` (upserts `UnitProgress`)
- Ibn Sina: call this endpoint when the student scrolls/clicks to mark reading done before showing the quiz button.

**tsc --noEmit:** passes clean.

### 2026-06-22T12:40:20-05:00 — Dev Azure Environment + CI/CD Multi-Environment Setup

**Task:** Wire up a dev Azure environment alongside prod, with `dev` branch CI/CD.

**Changes made:**

**`.github/workflows/ci-cd.yml` — refactored to use GitHub Environments:**
- `on.push.branches` and `on.pull_request.branches` expanded to `[main, dev]`
- Added `deploy-backend-dev` + `deploy-frontend-dev` jobs guarded by `github.ref == 'refs/heads/dev'`; both reference `environment: dev`
- Existing `deploy-backend` + `deploy-frontend` jobs now reference `environment: prod`
- Removed all hardcoded resource names (`cr34odstpjgaabg`, `ca-api-islamic-learning`, `rg-islamic-learning-centralus`) — replaced with environment-scoped secrets: `ACR_NAME`, `CONTAINER_APP_NAME`, `RESOURCE_GROUP`
- `AZURE_CREDENTIALS` and `SWA_DEPLOYMENT_TOKEN` remain the same names but are now scoped to the environment (not repo-level)
- Block comment at top of workflow documents every required secret and where to find it

**`docs/dev-environment-setup.md` — new file:**
- Full provisioning walkthrough: azd commands, SP creation, secret retrieval
- GitHub Environments setup (both `prod` migration and `dev` new setup)
- Dev DB seed instructions
- Cost-reduction tips (scale-to-zero, smaller PostgreSQL SKU)
- Tear-down instructions

**`azure.yaml` — no changes needed:** already parameterised by `environmentName`; azd handles multiple environments natively.

**Key decisions:**
- GitHub Environments used for secret scoping (not separate workflow files)
- Resource names moved from hardcoded strings to environment-scoped secrets — makes the workflow logic identical for dev and prod, eliminating future drift
- Prod migration is non-breaking: secret names unchanged, just the source moves from repo-level to environment-scoped
- Bicep templates are environment-agnostic by design — `resourceToken = uniqueString(subscriptionId, environmentName, location)` ensures no naming collisions
