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
