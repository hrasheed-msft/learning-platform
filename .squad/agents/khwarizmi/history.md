# Khwarizmi — Backend Implementation Agent

**Focus:** Games engine, child auth, dashboard API, seed data generation

## Quick Status

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

## Key Learnings

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

## Architecture Decisions

- Parental controls: Whitelist model; empty = all allowed; non-empty = restricted
- Streak grace period: 1-day miss allowed per streak
- SRS writeback: Game answers feed into FlashCardProgress with ratings
- Activity tracking: recordActivity() helper ready for quiz/flashcard/course integration
- Daily challenge: Deterministic seed ensures all users get same challenge per day

---

## 2026-05-17 — Games Backend Implementation (Session 14:57:13Z)

**Status:** COMPLETED  
**Orchestration Log:** `.squad/orchestration-log/2026-05-17T14-57-13Z-khwarizmi.md`

### Deliverables

All 15 game type engines implemented in game.service.ts with full type-specific logic:

**Implemented game types (all with dedicated round formatting & grading):**
1. TERM_MATCH — Drag-and-drop pair matching
2. SPEED_QUIZ — Rapid-fire questions
3. FLASHCARD_FLIP — Self-rated card flips
4. WORD_SCRAMBLE — Letter tile assembly
5. FILL_IN_BLANK — Word bank completion
6. MEMORY_MATCH — Card pair matching
7. TRUE_FALSE — Binary statement validation
8. MULTIPLE_CHOICE — MCQ with distractors
9. SENTENCE_BUILD — Word tile sequencing
10. LISTENING_QUIZ — Audio + comprehension
11. CALLIGRAPHY_TRACE — Canvas drawing
12. SPELLING_BEE — Text input accuracy
13. STORY_PUZZLE — Segment reordering
14. ESCAPE_ROOM — Puzzle challenge
15. MAZE_RUNNER — Spatial navigation

### Key Implementation Details

- **File Growth:** 1249 → 1555 lines (+306 lines)
- **TypeScript:** ✅ Zero errors
- **Round Formatting:** Each game type has dedicated formatRoundsForGameType() logic
- **Grading Logic:** Type-aware gradeAnswer() with difficulty scaling
- **Timer Configs:** Per-game-type configuration (e.g., SPEED_QUIZ: 30s/round, CALLIGRAPHY_TRACE: 120s/round)
- **Course Names:** Added to /games/available response for game type disambiguation
- **Scoring:** Base + bonuses (speed, streaks, perfection multipliers)
- **SRS Integration:** Game answers feed into FlashCardProgress with SM-2 ratings

### Outcomes

- All 15 game engines production-ready
- No breaking changes to existing API contracts
- Frontend integration path clear: gameService.ts ready for GamePlay component consumption
- Parental controls enforcement verified
- Commit pending: `.squad/orchestration-log/2026-05-17T14-57-13Z-khwarizmi.md`

---

## 2026-05-17 — Games Full Implementation (Expansion 15→26 Types, Phase 1 Complete)

**Status:** COMPLETED  
**Session Log:** `.squad/log/2026-05-17T14-57-13Z-game-full-implementation.md`

### Deliverables

**GameType Enum Extended: 15→26**
- Original 15 fully supported with dedicated engine logic
- Added 11 new types: FIQH_SCENARIO, HADITH_CHAIN, WORD_SEARCH, KNOWLEDGE_EXPEDITION, TRIVIA_BATTLE, MOSQUE_BUILDER, PATTERN_CREATOR, SEERAH_TIMELINE, + 3 variants
- All 26 types now have: Prisma enum value, CONTENT_REQUIREMENTS, TIMER_CONFIGS, formatRoundsForGameType(), gradeAnswer() handler, seed GameTemplate records

**Critical Fixes**
1. **POST /api/v1/games/start Validation Relaxed**
   - Before: Required gameType + difficulty; no enum matched all backend types
   - After: gameId + memberId only required; difficulty defaults to MEDIUM; gameType derived from game record
   - Files: game.routes.ts, game.controller.ts, game.service.ts

2. **Content Selection Fallback**
   - Before: selectContent failed when exact-difficulty match returned 0 questions
   - After: Falls back to any-difficulty when exact match empty
   - Resolves "game start returns success=false" bug

3. **Parental Controls Integration**
   - gameType resolution happens before parental checks
   - Time limits and type restrictions now work with derived types

**Seed Data Generation**
- 26 GameTemplate records (one per enum value)
- 60+ course-linked games (auto-generated from existing course units)
- 9 standalone games (pre-seeded test instances)
- Total: 69 game records + 26 templates

### Files Modified (3)
- `backend/src/routes/game.routes.ts` — validation schema relaxed
- `backend/src/controllers/game.controller.ts` — removed guard, MEDIUM default
- `backend/src/services/game.service.ts` — gameType auto-derivation, fallback logic, 26 type engines

### Team Collaboration
- **Ibn Sina (Frontend):** Built all 26 game type UIs in parallel
- **Decision Coordination:** Both decisions merged into decisions.md
- **No Blockers:** Frontend/backend work completed independently
- **Integration Ready:** All 26 types now have full backend + frontend support

### Next Phase (Roadmap)
1. Leaderboards (global/family/class-based)
2. Multiplayer (Family Duel backend)
3. Achievements (milestone triggers)
4. Notifications (game completion, achievement unlocks)
5. Analytics (per-user performance dashboard)

---

## 2026-05-18 — Game Engine Collapse (26 → 9 types)

**Status:** ✅ COMPLETE (migration written, not applied)

Implemented the Khaldun game redesign — collapsed 26 GameType values into 9 canonical types. G8 (Verify/True-False) merged into G1 (Quick Recall) as 2-option MCQ variant per user directive. Decision artifact: `.squad/decisions/inbox/khwarizmi-game-engine-collapse.md`.

### Learnings

**Postgres enum migration pattern:** Can't drop enum values still referenced. Use `GameType_new` + ALTER each column with `USING (CASE ... END)::"GameType_new"` mapping, then drop old and rename. Array columns (`allowedGameTypes GameType[]`) need `DROP DEFAULT` before the swap. Sequence: drop array default → ALTER all referencing columns → DROP TYPE → RENAME → re-add default.

**Template dedup with sessions preserved:** When N old types collapse to 1 new type, multiple GameTemplate rows share the same type post-conversion. Use CTE `ROW_NUMBER() OVER (PARTITION BY type ORDER BY sortOrder, createdAt)` to pick canonical row, `UPDATE games SET templateId = canonical_id WHERE templateId IN (duplicates)`, then DELETE duplicates. GameSession FKs to Game (not GameTemplate) so sessions survive untouched.

**Service rewrite ratio:** 2047 → 1561 lines (24% reduction) by replacing 26 per-type formatters/graders with single switch statements over a `GAME_DEFS` config table. Each game type's behavior is now declarative: content requirements, per-difficulty timers, `defaultCompatibility`. New `getEligibleCourses(slug, memberId)` endpoint powers the launcher's reverse course selection.

**CourseEnrollment is keyed by memberId, NOT familyId:** When building course discovery for a member, query `where: { memberId }` directly. There is no `familyId` field — that lives on FamilyMember and is irrelevant to enrollments.

**GameTemplate has NO defaultDifficulty column:** Difficulty defaults live in the `rules` JSON blob under `rules.defaultDifficulty`. Don't add it as a separate field.

**Dev-server-locked Prisma client:** Multiple `ts-node-dev` processes hold `node_modules/.prisma/client/query_engine-windows.dll.node`, blocking `prisma generate`. Always check `Get-Process node` and stop by PID before running generate.

**GAME_DEFS courseCategory is an eligibility hard-wall (2026-05-18):** Setting `courseCategory` in `defaultCompatibility` filters out ALL courses that don't match that category. For CALLIGRAPHY_TRACE, `courseCategory: 'ARABIC'` meant users enrolled only in FIQH/SEERAH courses got 0 eligible courses. Remove `courseCategory` from any game def where the content type (ArabicTerm, FlashCard, etc.) can reasonably appear in courses of any subject. Let `minItems` be the gate.

**CourseFilters type vs API param mismatch (2026-05-18):** The frontend `CourseFilters` type uses `courseType` and `ageCategory` while the backend controller extracted `category` and `ageLevel`. Result: subject and age filters were silently ignored. Fix pattern: backend accepts aliases (`ageCategory` alongside `ageLevel`); frontend catalog uses the canonical `category` field from `CourseFilters`. Also: `setFilters()` in Zustand doesn't auto-re-fetch — always add a `useEffect` keyed on the filter values that calls `fetchCourses(filters)`.

**CourseCatalog filter values must be UPPERCASE to match DB:** The category dropdown was sending title-case strings ("Fiqh") but Prisma does exact-match on the stored value ("FIQH"). Always normalize to the enum value before sending to the API.

---

## 2026-05-18 — No Eligible Courses Fix + Decisions Merge (Scribe Session 19:48Z)

**Status:** ✅ COMPLETE  
**Commit:** 97d55ac

### Work Completed

Scribe merged all pending decisions from inbox into decisions.md, capturing 7 new team decisions:

1. **Azure Deployment Architecture** (Khaldun) — App Service approach, Key Vault secrets, VNet private endpoints, CI/CD via GitHub Actions
2. **useActiveMemberId Hook** (Ibn Sina) — Reusable hook eliminating `selectedMember?.id` fallback bugs in all game components
3. **Game System Redesign** (Khaldun) — 26 → 10 distinct mechanics proposal, collapsing redundant reskins, new Fiqh Scenario tree
4. **Family Account vs Learner Member** (Khaldun) — Identified root cause of game errors (no FamilyMember for parents), proposed "Who's Learning Today?" picker + schema changes
5. **User Directive — Game Consolidation** (hrasheed) — Merge True/False into Quick Recall (9 mechanics, not 10)
6. **Games frontend rebuilt to 9-mechanic taxonomy** (Ibn Sina) — Collapsed 26 components into 9, new useGameRunner hook, legacy back-compat via mapToActiveType()
7. **Game Engine Collapse** (Khwarizmi: you) — Implemented 26→9 GameType collapse, migration written (not deployed), new getEligibleCourses endpoint

### Decisions Archive Metrics

- **Before:** 16 decisions, 23,275 bytes, 7 inbox files
- **After:** 23 decisions, 50,000+ bytes (merged), 0 inbox files
- **No archival needed:** All existing decisions < 30 days old

### Key Outcomes

- Complete game system redesign decision trail now documented
- No history.md files exceeded 15KB summarization threshold
- All inbox files processed and deleted cleanly
- Ready for implementation sequencing (Phase A: backend enum/schema migration)

### Next Steps (Team Sequencing)

1. **Phase A (1 sprint):** Deploy game engine 26→9 migration on production
2. **Phase B (1 sprint):** Ibn Sina implements new 9-component frontend + GameLauncher + useGameRunner
3. **Phase C (1–2 sprints):** Author FiqhScenario content trees (needs fiqh SME)
4. **Parallel:** Implement "Who's Learning Today?" picker (Ibn Sina frontend + your backend middleware)

---

## 2026-05-18 — Eligible Courses Fix + Simple Enroll Endpoint

**Status:** ✅ COMPLETE  

### Work Completed

1. **getEligibleCourses response shape fixed** — renamed `eligibleCourses` → `courses` in the return object to match frontend extraction (`raw.courses`). Added `courseName` (alias of `courseTitle`), `contentCount`, and `suggestedDifficulty` (≤8→EASY, ≤15→MEDIUM, else HARD).

2. **New `countContentForGame()` helper** — counts questions/flashcards/arabicTerms for a game type on a given course (same content-type logic as `checkContentAvailability`).

3. **POST /api/v1/courses/:courseId/enroll** — simplified enrollment endpoint that reads `x-active-member-id` header (same pattern as games). Idempotent: returns existing enrollment if already enrolled (200, not 409).

4. **`CourseService.enrollMemberIdempotent()`** — new method paralleling `enrollMember` but without throwing on duplicate. Old endpoint preserved for backward compat.

### Enrollment Edge Case (self-member)

Verified: the `selfMemberId` from the learner picker IS a valid `FamilyMember.id` row. The enrollment query (`where: { memberId }`) works correctly because even parent-as-learner has a proper FamilyMember record. No code change needed.

## Learnings

**Frontend response extraction patterns (2026-05-18):** Frontend code `Array.isArray(raw) ? raw : raw?.courses ?? []` is the standard extraction. Backend must use `courses` as the key (not `eligibleCourses`). Always check the actual frontend extraction code before naming response fields.

**Idempotent enrollment pattern (2026-05-18):** When adding a "quick enroll" that any role can use (not just parents), make it idempotent (200 + existing record) rather than throwing ConflictError. This lets the frontend fire-and-forget without error handling for the already-enrolled case.

**Round metadata field naming must match frontend destructuring (2026-05-18):** Two bugs found in WORD_SEARCH and CLOZE. WORD_SEARCH: backend emitted `metadata.words` but frontend read `content.targetWords`. CLOZE: backend emitted multi-blank shape (`sentence` + `blanks[]`) but frontend expected single-blank fields (`questionText` with `{blank}` marker, `correctAnswer` string, `options` array). Rule: always read the frontend component's destructuring FIRST, then make the backend emit that exact shape. Also: when frontend submits `{ foundWords }`, grader must accept that key (not just `found`).

**Cross-origin static asset URLs (2026-05-20):** When frontend and backend are on different origins in production, relative paths in HTML content (e.g., `src="/coursebook-images/..."`) resolve against the frontend origin — not the backend that serves them. Fix: rewrite to absolute backend URLs at response time using `req.protocol + '://' + req.get('host')`. Also: Helmet's default `Cross-Origin-Resource-Policy: same-origin` blocks cross-origin `<img>` loads; must override to `cross-origin` on static asset routes.

**Azure ACR build from Windows (2026-05-20):** `az acr build` streams Unicode checkmark characters that crash the CLI's `colorama` layer on Windows cp1252 consoles. Workaround: use `--no-logs` flag to suppress streaming output; the command still waits for completion and returns the build result JSON. Also: ensure `.dockerignore` at the build context root; building from `backend/` directory with its existing `.dockerignore` is cleanest.

**TTS/Audiobook implementation (2026-05-20):** Azure Speech SDK (`microsoft-cognitiveservices-speech-sdk`) returns audio duration in 100-nanosecond ticks (`result.audioDuration`). Divide by 10,000,000 for seconds. SSML `<lang>` tags switch voice mid-narration for bilingual content. AudioCache uses blockIndex=-1 sentinel for "full unit" audio (Prisma unique constraint needs a concrete value, not null).

**Video generation pipeline (2026-05-20):** Narrated slide-deck approach works well: Puppeteer renders HTML slides to PNG (1920×1080), TTS generates per-slide audio, ffmpeg stitches each image+audio into segment then concatenates. Key: Dockerfile must switch from `node:20-alpine` to `node:20-slim` (Debian) because Chromium/Puppeteer needs glibc. Install `fonts-hosny-amiri` for proper Arabic rendering. Use `--no-sandbox` and `PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium` in Container Apps. Fire-and-forget async generation pattern with database status tracking (generating→ready→failed) avoids blocking the API request.
