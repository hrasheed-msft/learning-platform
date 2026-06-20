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
- Pattern: never refactor the full seed system to add a guard — just a 10-line check at the top is sufficient and safe.
- Key file: `backend/prisma/seed.ts`.

### 2026-06-06T17:09:20-05:00 — al-Masār lesson summaries + linked static HTML delivery
- `seed-masaar-course.ts` now stores concise HTML summaries instead of placeholders, with Arabic passage focus, English translation, grammar bullets, and a canonical `/lessons/masaar-irab-sarf/week-N.html` CTA embedded directly in each unit `content`.
- The eight standalone HTML lessons now live under `frontend/public/lessons/masaar-irab-sarf/` as `week-1.html` through `week-8.html`, matching the production route shape expected by the frontend lesson CTA work.
- Production reseeding for course `a1b2c3d4-e5f6-4890-abcd-ef1234567001` completed successfully, and all 8 unit records now carry the expected lesson links.

### 2026-06-05T23:37:00.652-05:00 — al-Masār seed bootstrap + ArabicTerm metadata migration
- Added `ArabicTerm.metadata` as nullable `Json?` with migration `20260606151820_add_arabic_term_metadata`; this is fully backward-compatible and unlocks per-word I'rab/Sarf annotations without new tables.
- Established `seed-masaar-course.ts` as an idempotent shell seed using deterministic course id (`masaar-irab-sarf`) + `unit.upsert` on `courseId_orderIndex`, matching the existing seed chaining pattern.
- Current schema has no `Course.titleArabic`, `Unit.titleArabic`, or course-level difficulty field; Arabic titles are carried in unit descriptions/content placeholders until/if schema expands.

### 2026-05-24T21:00:31.834-05:00 — Prisma migrations must run before backend startup
- **Root cause:** The backend image generated Prisma client code during build, but Azure Container Apps never ran `prisma migrate deploy`, so production schema lagged the checked-in migration history and `audio_cache.cacheVersion` was missing at runtime.
- **Deployment fix:** `backend/Dockerfile` now installs the Prisma CLI in production dependencies and uses `backend/docker-entrypoint.sh` as the container entrypoint to run `npx --no-install prisma migrate deploy` before `node dist/index.js`.
- **Ops behavior:** Startup now fails fast on migration errors instead of serving with a mismatched Prisma client/database schema.
- **Key file paths:** `backend/Dockerfile`, `backend/docker-entrypoint.sh`, `backend/package.json`, `backend/package-lock.json`, `.github/workflows/ci-cd.yml`, `.squad/decisions/inbox/khwarizmi-prisma-migrate-on-startup.md`.

### 2026-05-24T09:58:03.672-05:00 — Emergency video generation rollback
- **Architecture decision:** Temporarily disable backend video generation endpoints at `backend/src/routes/video.routes.ts` with fast 503 responses so lesson and audio traffic cannot trigger Puppeteer/ffmpeg work while the site is stabilized.
- **Deployment pattern:** Production deploys from pushes to `main` via `.github/workflows/ci-cd.yml`; backend ships to Azure Container Apps (`ca-api-islamic-learning`) from `backend/Dockerfile`, frontend ships to Azure Static Web Apps.
- **User preference:** In outage mode, favor fast rollback and safe disablement over keeping non-essential AI/media features alive; audio/TTS must remain available.
- **Key file paths:** `backend/src/routes/video.routes.ts`, `backend/src/services/videoQueue.service.ts`, `backend/src/services/videoService.ts`, `.github/workflows/ci-cd.yml`, `azure.yaml`.

### 2026-05-24T15:25:56.506-05:00 — PAIR_MATCH game stats accuracy bug fix
- **Root cause:** `PairMatchGame.tsx` submitted `{ matched: string[] }` but `gradeAnswer()` in `game.service.ts` read `answer.matches` — always `undefined` → `isCorrect=false` every round → `accuracy=0%` stored in `GameScore`.
- **Fix pattern:** Frontend now sends canonical format `{ matches: [{ termId, definitionId }] }`. Both sides of a matched pair share the same `pairId`, so `termId === definitionId` correctly signals a valid match (not a cross-pair mismatch). Backend also accepts legacy `{ matched: string[] }` as a fallback for backward compatibility.
- **Identity was already correct:** `requireActiveMember` middleware resolves `child.memberId` (familyMemberId) as `req.activeMemberId` for all game endpoints; the identity bug from commit 297c7aa (course/quiz path) did NOT affect game stats.
- **Key file paths:** `frontend/src/pages/games/PairMatchGame.tsx`, `backend/src/services/game.service.ts` (`gradeAnswer` PAIR_MATCH branch, line ~1672).
- **Accuracy formula is correct:** `(roundsCorrect / answeredCount) * 100` in `submitRound`; the grading failure was the only cause of 0%.
- **Commit:** `e4e369e`

### 2026-05-24T10:13:27.614-05:00 — Child progress identity fix
- **Architecture decision:** Any learner-scoped progress or quiz endpoint that already requires an active learner must trust the authenticated child token or `x-active-member-id` over a submitted `memberId`; request bodies can be stale or contain the parent `userId`.
- **Progress pattern:** Quiz passes must update `unit_progress.completedAt`, recompute `course_enrollments.progress/status`, and refresh `family_members.lastActiveAt` so parent dashboards stay aligned with stored quiz results and completed lessons.
- **User preference:** When parent and child sessions both exist, preserve one backend path that resolves the active learner automatically instead of requiring the frontend to manually map identities for every progress call.
- **Key file paths:** `backend/src/controllers/course.controller.ts`, `backend/src/controllers/assessment.controller.ts`, `backend/src/services/course.service.ts`, `backend/src/services/assessment.service.ts`, `backend/src/routes/course.routes.ts`, `backend/src/routes/assessment.routes.ts`, `frontend/src/pages/courses/UnitViewer.tsx`, `frontend/src/pages/courses/QuizPage.tsx`, `frontend/src/services/courseService.ts`.

### 2026-05-24T16:05:42.973-05:00 — Audio cache versioning for TTS regen
- **Architecture decision:** `AudioCache` now carries a nullable `cacheVersion`; any row missing the current TTS version is treated as stale and deleted on lookup so regenerated audio always uses the latest Arabic-term narration format.
- **Cache invalidation pattern:** Keep on-demand generation cheap by deleting cache rows instead of bulk-regenerating files; `POST /api/v1/units/admin/audio-cache/invalidate` clears matching rows, and `buildAudioFilename()` bakes the cache version into new asset URLs to avoid reusing old paths.
- **User preference:** When TTS formatting logic changes, invalidate old audio automatically and let users regenerate only the units they actually open instead of paying for a full backfill.
- **Key file paths:** `backend/src/services/tts.service.ts`, `backend/src/controllers/audio.controller.ts`, `backend/src/routes/audio.routes.ts`, `backend/prisma/schema.prisma`, `backend/prisma/migrations/20260524160542_add_audio_cache_version/migration.sql`, `.squad/decisions/inbox/khwarizmi-audio-cache-versioning.md`.

### 2026-05-24T16:09:47.032-05:00 — Course text Arabic-term normalization + targeted audio invalidation
- **Content source pattern:** Learner-facing lesson bodies live in `units.content`; seed files populate the raw HTML, but a post-seed normalization pass is now needed because many lessons still store bare transliterations.
- **Normalization pattern:** `syncCourseTextFormatting()` rewrites matching transliterated terms to `Translation Arabic/(Transliteration)` using unit-linked `arabicTerms`, a shared glossary for concise translations, and idempotent replacement logic that skips already formatted text.
- **Cache regeneration pattern:** Seeding now runs the normalization pass and deletes `AudioCache` rows for only the units whose text changed; there is also a standalone `npm run db:normalize:arabic-terms` repair script plus parent/admin invalidation endpoints at both `/api/v1/admin/invalidate-audio-cache` and `/api/v1/units/admin/audio-cache/invalidate`.
- **Key file paths:** `backend/src/utils/arabic-term-formatting.ts`, `backend/src/services/course-content-formatting.service.ts`, `backend/prisma/normalize-course-content.ts`, `backend/prisma/seed.ts`, `backend/src/routes/audio-admin.routes.ts`, `backend/src/routes/audio.routes.ts`, `backend/src/services/tts.service.ts`.

### 2026-05-24T17:15:40.834-05:00 — Remote Arabic-term normalization endpoint
- **Ops pattern:** Parent-authenticated admins can now trigger the same `syncCourseTextFormatting()` repair logic over HTTP at `POST /api/v1/admin/normalize-arabic-terms`, so production fixes no longer require SSH access or ad-hoc npm scripts.
- **Idempotency detail:** The normalization helper now reports replacement counts while still skipping already formatted `Translation Arabic/(Transliteration)` content, so reruns return zero updated units/terms and leave audio cache untouched.
- **Response contract:** The admin endpoint returns `updatedUnits`, `normalizedTerms`, and `clearedAudioCacheEntries` after clearing only the affected units’ `AudioCache` rows.
- **Key file paths:** `backend/src/controllers/audio.controller.ts`, `backend/src/routes/audio-admin.routes.ts`, `backend/src/services/course-content-formatting.service.ts`, `backend/src/utils/arabic-term-formatting.ts`, `backend/prisma/normalize-course-content.ts`.

### 2026-06-05T23:37:00Z — al-Masār I'rab & Sarf Course Architecture Mapping
- **Decision:** Khaldun produced comprehensive architecture doc for 8-week course build
- **Schema change required:** `ArabicTerm.metadata: Json?` (one nullable column for word annotations)
- **Seed file strategy:** 4 concern-based files (`seed-masaar-course.ts`, `seed-masaar-quizzes.ts`, `seed-masaar-flashcards.ts`, `seed-masaar-terms.ts`)
- **Course structure:** 1 Course + 8 Units (one per week), each with HTML content
- **HTML integration:** 8 standalone lessons in `/lesson-irab-sarf/` (repo root, parallel to `maktab-coursebook-html/`)
- **Prisma mapping:** All 5 course parts fit existing models (Question, ArabicTerm, FlashCard, Unit) with no new models
- **Implementation order:** 1) Migration, 2) seed-masaar-course.ts, 3) parallel seeds (quizzes/flashcards/terms), 4) HTML generation
- **Status:** Awaiting hrasheed approval on metadata migration before implementation begins
- **Estimated scope:** ~22–33h (Khwarizmi schema + seeds), ~7–14h (Ibn Sina HTML weeks 2–8)
- **Key file:** `.squad/decisions/inbox/khaldun-irab-sarf-architecture.md` (merged to `.squad/decisions/decisions.md`)

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

**Architecture Notes:**
- Used existing `Course`/`Unit`/`Question`/`FlashCard` models (no schema expansion)
- Arabic bilingual content stored in unit `description` and content-body HTML
- Deterministic course id (`masaar-irab-sarf`) ensures reproducible seeding
- Metadata field available for future per-word I'rab/Sarf annotation data

**Build Context:**
- Executed parallel to Ibn Sina HTML generation (weeks 1-8)
- Both agents completed without rework
- Session log: `.squad/log/20260606T174246-masaar-course-complete.md`
- Orchestration log: `.squad/orchestration-log/20260606T174246-masaar-course-build.md`

---

## Archived History

For detailed work history prior to 2026-05-20, see `.squad/agents/khwarizmi/history-archive.md`

Key prior work:
- 2026-05-16: Seed data (50+ courses, 62+ units, 450+ questions, 530+ flashcards)
- 2026-05-17: Games backend (all 26 game types with type-specific engines)
- 2026-05-17: Parent dashboard + child auth APIs
- 2026-05-18: Game engine collapse (26→9 types, migration written)
- 2026-05-20: TTS/audiobook integration, video generation pipeline
- 2026-05-21: Coursebook images → Azure Blob Storage
