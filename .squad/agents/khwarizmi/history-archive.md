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
