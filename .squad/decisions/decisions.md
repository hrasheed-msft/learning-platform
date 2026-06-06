# Decisions Archive

**Last Updated:** 2026-06-05T23:37:00Z  
**Total Decisions:** 28  
**Source:** Merged from .squad/decisions/inbox/ on 2026-06-05

---

## Games API Contract Mismatches — Fixed

**Author:** Ibn Sina (Frontend Dev)  
**Date:** 2026-05-17  
**Status:** IMPLEMENTED

## Summary

The `/games` page rendered as a blank page due to three backend-frontend API response shape mismatches in the games feature. All three are now fixed in `gameService.ts` with transformation layers.

## Mismatches Found

| Endpoint | Backend Returns | Frontend Expected | Impact |
|----------|----------------|-------------------|--------|
| `GET /games/achievements` | `Achievement[]` (flat array) | `{ achievements: [], totalXpFromAchievements }` | **Crash** — set `achievements` to `undefined` |
| `GET /games/leaderboard/:type` | `{ leaderboard: FlatEntry[] }` | `{ leaderboard: { entries: Entry[] }, myRank }` | Silent data loss (leaderboard empty) |
| `GET /games/daily-challenge` (used for streak) | Streak with 2 fields | `StreakInfo` with 9 required fields | TS error, fragile `as` cast |

## Team Recommendation

For Khwarizmi: Consider wrapping the achievements endpoint response in `{ achievements: [...], totalXpFromAchievements: N }` to match the frontend contract. Alternatively, we can keep the current frontend transformation — both approaches work.

**Convention to adopt:** Frontend service methods should always validate/transform API responses rather than using `as T` type assertions. The `as` keyword hides runtime mismatches that only surface as blank-page crashes.

---

## Decision: Games Feature Frontend Architecture

**Author:** Ibn Sina (Frontend Dev)  
**Date:** 2026-05-18  
**Status:** IMPLEMENTED  
**Related:** `khaldun-games-detailed-design.md`

## Summary

Implemented the complete Games frontend feature consisting of 25 new files: game types, API service, Zustand store, 10 shared UI components, Games Hub page, 6 game type components, 3 supporting pages (scores, achievements, leaderboard), plus routing and navigation updates.

## Key Decisions

### 1. Explicit barrel re-exports for game types
The `types/game.ts` file exports a `StreakInfo` interface that conflicts with `types/progress.ts`. Rather than renaming, used explicit named re-exports in `types/index.ts` to avoid the ambiguity while keeping both types accessible via their module paths.

### 2. GamePlay router pattern
Created a single `GamePlay.tsx` component that maps URL slugs (e.g., `term-match`) to game components. This keeps routing clean and allows adding new game types by simply adding a mapping entry.

### 3. Shared game components
Extracted 10 reusable components (timer, score, progress bar, stars, game over screen, difficulty selector, hint button, streak indicator, time remaining bar, blocked screen) to ensure consistency across all game types and simplify future game development.

### 4. Parental controls integration
Every game page checks parental settings. `GameBlockedScreen` handles 4 block reasons (TIME_LIMIT, NOT_ALLOWED, OUTSIDE_HOURS, DIFFICULTY_EXCEEDED). `TimeRemainingBar` shows daily playtime usage. `DifficultySelector` respects `maxDifficulty` setting.

### 5. Dual-layout routing
Games are accessible from both parent (`/games/*`) and child (`/child/games/*`) layouts, matching the existing pattern for courses and flashcards. Child routes go through `ChildProtectedRoute`.

## API Contracts

All game API endpoints follow the existing `ApiResponse<T>` pattern. Key endpoints:
- `GET /games/available` — game discovery with filters
- `POST /games/:gameId/sessions` — start game session
- `POST /games/sessions/:sessionId/rounds` — submit round answer
- `POST /games/sessions/:sessionId/complete` — finish game
- `GET /games/daily-challenge` — today's daily challenge
- `GET /games/leaderboards`, `GET /games/scores/history`, `GET /games/achievements`, `GET /games/badges`, `GET /games/streaks`
- `GET/PUT /family/members/:memberId/game-settings` — parental game controls

---

## Decision: Architecture Inventory Key Findings

**Author:** Khaldun (Lead/Architect)  
**Date:** 2026-05-16  
**Status:** Informational — awareness for all agents

### Context

Completed a comprehensive architectural inventory of the full platform. The codebase is more mature than expected — all major features have real implementations (not stubs), the backend has 65+ API endpoints, and the frontend has 15+ fully-built pages.

### Key Findings Requiring Team Awareness

#### 1. Directus CMS is Scaffolded, Not Integrated
Docker config exists but the app doesn't use Directus at all. All content is managed through Prisma seed files. Any future CMS work starts from zero integration.

#### 2. Gamification is Schema-Only
The Achievement model exists and there's an endpoint to read achievements, but no logic anywhere awards them. Streaks/points fields exist on FamilyMember but nothing increments them beyond seed data.

#### 3. Dual SRS Systems
MemorizationItem (general SRS with AYAH/HADITH/DUA/TERM types) and FlashCardProgress (flashcard-specific SM-2) are separate systems with overlapping concerns. Both have SM-2 implementations. This needs consolidation or clear separation of purpose.

#### 4. Seed Files Are Fragmented
Main seed.ts creates 6 courses. Five additional seed files create 5 more courses independently. They're not connected — no orchestration, no single command to seed everything.

#### 5. Maktab Coursebooks Are Ready for Ingestion
10 well-structured HTML coursebooks (ages 6-adult) with semantic CSS classes (.subject, .topic, .arabic) are in maktab-coursebook-html/. These are the primary content source for upcoming course creation. The HTML structure is parseable.

### No Decision Required
This is an informational record. Specific decisions on consolidation, gamification activation, and Maktab ingestion strategy should be made when those workstreams begin.

---

## Decision: Frontend Gaps to Address

**Author:** Ibn Sina (Frontend Dev)  
**Date:** 2026-05-16

### Context
Full frontend inventory completed. The codebase is ~90-95% built out, but several gaps exist between what the README promises and what's implemented.

### Key Gaps Requiring Team Discussion

1. **No 404 page** — catch-all silently redirects to dashboard. Should we build a proper NotFound page?
2. **Missing utils/ and hooks/ directories** — Vite aliases exist for `@utils` and `@hooks` but the directories don't exist. Should we create them or remove the aliases?
3. **Family admin invite flow unimplemented** — `familyService` stubs exist (`getAdmins`, `inviteAdmin`, etc.) but no UI or backend. Is this on the roadmap?
4. **AI-powered quiz generation** — README advertises it but no frontend UI exists. Backend status unknown.
5. **Gamification page missing** — ChildDashboard shows locked badges, but there's no achievements/leaderboard page. Is this planned?
6. **Orphaned review/ReviewSession.tsx** — Not routed anywhere; `/reviews` uses `flashcards/ReviewSessionPage` instead. Should we consolidate or remove?
7. **Review streak uses localStorage** — Should this be persisted to backend instead?

### Recommendation
Items 1-2 are quick fixes I can handle immediately. Items 3-7 need product direction before frontend work begins.

---

## Decision Proposal: Fix Sarf Seed / Schema Mismatch

**Author:** Khwarizmi (Backend Dev)  
**Date:** 2026-05-16

### Context

`seed-sarf-course.ts` uses fields that don't exist in the current Prisma schema:
- `descriptionArabic`, `titleArabic` on Course/Unit
- `level`, `ageCategory` (as single string), `estimatedHours` on Course
- `category: 'LANGUAGE'` (not in the Course.category enum values)

Running `db:seed:sarf` will fail at runtime with Prisma validation errors.

### Options

1. **Update Prisma schema** to add these fields (descriptionArabic, titleArabic, level, estimatedHours) and add 'LANGUAGE' to category values. Requires a new migration.
2. **Fix the seed file** to only use existing schema fields. Loses Arabic text and metadata.
3. **Both** — add the useful fields to the schema AND fix seed consistency.

### Recommendation

Option 3. The Arabic text fields and level/estimatedHours are genuinely useful for all courses, not just Sarf. Add them to the schema with a migration, then audit all seed files for consistency.

### Status

Proposed — awaiting team discussion.

---

## Decision Proposal: Consolidate Dual SRS Systems

**Author:** Khwarizmi (Backend Dev)  
**Date:** 2026-05-16

### Context

The backend has two independent spaced repetition systems:

1. **MemorizationItem + ReviewLog** (`srs.service.ts`) — uses simplified SM-2 with fixed interval table [0,1,3,7,14,30,60,120,240]. Tracks AYAH/HADITH/DUA/TERM items per FamilyMember.
2. **FlashCard + FlashCardProgress** (`flashcard/` services) — uses full SM-2 algorithm with ease factor adjustment, status transitions (NEW→LEARNING→REVIEWING→MASTERED), and richer analytics.

Both serve the same purpose (spaced repetition review) for different content types. The FlashCard system is more mature and feature-rich.

### Proposal

Consolidate onto the FlashCard SRS system as the single spaced repetition engine. Migrate MemorizationItem content types (AYAH, HADITH, DUA, TERM) to work through the FlashCard model.

### Impact

- Reduces code duplication and maintenance surface
- Gives all content types access to the better SM-2 implementation
- Requires migration of existing MemorizationItem data
- Frontend SRS components would need to point at FlashCard endpoints

### Status

Proposed — awaiting team discussion.

---

## Decision: Critical Security & Quality Fixes Needed

**Author:** Biruni (QA)  
**Date:** 2026-05-16  
**Status:** Proposed

### Context

Full quality audit revealed 3 critical security issues and several high-severity gaps that should block any production deployment.

### Critical Items Requiring Immediate Action

1. **Rotate OpenAI API key** — real key exposed in `backend/.env`. Must rotate in OpenAI dashboard and scrub from git history.
2. **Remove auth console.log** — `frontend/src/services/authService.ts` lines 20-23 log email, API URL, and full login response (including tokens) to browser console.
3. **Implement logout token invalidation** — `backend/src/services/auth.service.ts` logout() is a no-op. Stolen refresh tokens remain valid for 30 days.

### High-Severity Items for This Sprint

4. Add `*.timestamp-*.mjs` to frontend/.gitignore and remove 44 stale files.
5. Make JWT secrets required (throw if env vars missing, not fallback to weak defaults).
6. Hash child PINs with bcrypt (currently plaintext).
7. Add React Error Boundary to App.tsx.
8. Add pagination to 5+ unbounded list endpoints.

### Recommendation

Items 1-3 should be addressed before any further feature work. Items 4-8 should be completed this sprint. Full report at `.squad/agents/biruni/quality-report-2026-05-16.md`.

---

## Decision: User Directive — Parental Controls for Games

**Author:** hrasheed (via Copilot)  
**Date:** 2026-05-17  
**Status:** Captured for team implementation

### Requirement

Games design doc must include parental controls. Parents should be able to:
1. Limit children's game time (daily time budget, cooldown periods)
2. Restrict which types of games children can play (blocklists by game type)
3. Enforce age-appropriate content restrictions

### Integration Point

This requirement is incorporated into the Games design doc (Section 12: Parental Controls). Implementation includes dashboard UI for time limits, database schema (GameTimeLimit, GameTypeRestriction models), and enforcement logic at game launch.

---

## Decision: Child Auth + Parent Dashboard — Backend Implementation

**Author:** Khwarizmi (Backend Dev)  
**Date:** 2026-05-17  
**Status:** IMPLEMENTED

### Summary

Implemented three backend features per design:
1. **Seed Loading Fix** — All 12+ seed files now wired into `seed.ts` (seed-sarf-simple.ts kept as standalone alternative)
2. **Child Auth (Phase 1)** — Username/password login for FamilyMembers with dual JWT middleware
3. **Parent Dashboard Backend** — Activity tracking and notification system

### Key Decisions

- **Child JWT Structure:** Uses `sub: memberId`, `role: "CHILD"`; single `authenticate` middleware handles both token types
- **Credential Storage:** On FamilyMember model (username globally unique + lowercased, password bcrypt-hashed)
- **Activity Recording:** Standalone `recordActivity()` helper callable by any service; currently wired to quiz completion
- **SRS Integration:** Quiz completion writes ActivityEvent; other services (flashcard, course) deferred

### Files Modified/Created

**Modified:** schema.prisma, seed.ts, auth.middleware.ts, index.ts, assessment.service.ts, 11 seed files  
**Created:** 9 new controllers/services/routes for child-auth, dashboard, notifications

### Blockers Resolved

All 12 seed files now execute without errors (Sarf schema mismatch fixed by Khwarizmi in prior decision).

---

## Decision: Child Auth + Parent Dashboard — Frontend Implementation

**Author:** Ibn Sina (Frontend Dev)  
**Date:** 2026-05-17  
**Status:** IMPLEMENTED

### Summary

Built complete frontend for child authentication, child-scoped layout, parent dashboard, and credential management. All new code compiles and builds successfully.

### Key Architectural Choices

1. **Separate Child Auth Store** — Uses `childAuthStore` with isolated persist key (`child-auth-storage`); parent and child sessions fully independent
2. **Standalone Child Login Page** — `/child-login` rendered outside AuthLayout; distinct child-friendly UI with larger inputs, welcoming copy, GraduationCap icon
3. **ChildLayout Restriction** — Navigation limited to: My Dashboard, My Courses, My Flashcards, Achievements; no Settings or family management access
4. **Dual Route Guards** — New `ChildProtectedRoute` (reads `childAuthStore`) vs existing `ProtectedRoute` (reads `authStore`)
5. **Credential Modal in FamilySettings** — "Set Login" button per member opens `SetCredentialsModal` with username/password fields; calls `POST /api/v1/family/members/:memberId/credentials`

### API Contracts for Backend

Frontend expects these endpoints:
- `POST /api/v1/auth/child-login` — `{ username, password }` → `{ token, refreshToken, member }`
- `POST /api/v1/family/members/:memberId/credentials` — `{ username, password }` → `{ username, message }`
- `GET /api/v1/dashboard/children` — returns `ChildSummary[]`
- `GET /api/v1/dashboard/children/:memberId/stats` — returns `ChildDetailStats`
- `GET /api/v1/dashboard/children/:memberId/activity` — returns `ActivityFeedResponse`
- `GET /api/v1/dashboard/family/summary` — returns `FamilySummary`
- `GET /api/v1/notifications` — returns `Notification[]`
- `PUT /api/v1/notifications/:id/read` — marks notification read

### Files Created/Modified

**New files (17):** types (childAuth, dashboard), services (childAuth, dashboard), stores (childAuth, dashboard, notification), pages (ChildLogin, ChildDashboard variants, ParentDashboard), layouts (ChildLayout), modal (SetCredentialsModal)  
**Modified (7):** App.tsx, type/service/store indices, LoginPage, FamilySettings

---

## Decision: Games Engine — Detailed Design Document (Implementation Blueprint)

**Author:** Khaldun (Lead Architect)  
**Date:** 2026-05-17  
**Status:** PROPOSAL — Implementation blueprint (supersedes high-level outline)

### Overview

Comprehensive implementation blueprint for the Games feature. Covers 13 game types across two categories, data model, game engine architecture, auto-generation pipeline, API design, frontend components, gamification layer, and parental controls. Sufficient specificity for backend (Khwarizmi) and frontend (Ibn Sina) to implement without guessing.

### Game Type Catalog

**Course-Integrated (7 types):**
1. Term Match — Drag-and-drop vocabulary matching (4-8 pairs, difficulty scaling, SRS integration)
2. Ayah Completion — Complete Quranic verses by selecting missing words in order
3. Speed Quiz — Rapid-fire Q&A from course questions (timed, streaks, multiplier scoring)
4. Flashcard Flip — Flip-and-match flashcard pairs with speed bonuses
5. Fill-in-the-Blank — Complete sentences with word bank (fiqh rules, vocabulary)
6. Hadith Hunt — Extract key words from hadith text (memorization aid)
7. True/False Rush — Rapid true/false statements (10-question rounds, perfect bonus)

**Standalone (6 types):**
8. Daily Challenge — Curated daily quiz across all enrolled courses (cross-course mega-game)
9. Family Duel — Competitive head-to-head on randomly selected question pools
10. Leaderboard Sprint — Weekly ranking sprint (global/family/class-based scoring)
11. Survival Mode — Endless flashcard recall with increasing difficulty and time pressure
12. Time Attack — Fixed question set, minimize time + maximize accuracy
13. Mystery Box — Randomly selected game type from all 12 above (surprise element)

### Data Model

**New Prisma Models:** Game, GameInstance, GameRound, GameScore, ParentalTimeLimit, GameTypeRestriction, ActivityEvent, Notification

**Content Integration:** Games auto-generated from existing FlashCard, Question, ArabicTerm records. Phase 1 requires zero manual content authoring.

### Game Engine Architecture

- **Engine Layer:** Stateful game instance management (rounds, scoring, state transitions)
- **Content Injection:** Unit-scoped content query → difficulty sampling → game config
- **SRS Writeback:** Game results feed into FlashCardProgress (correct = SM-2 rating 4, incorrect = rating 2)

### API Design (15 endpoints)

- Game metadata queries (list games, get game details)
- Game instance lifecycle (create, get state, send action, end)
- Scoring and leaderboard (get scores, weekly rankings)
- Parental control configuration (set time limits, restrict types)

### Frontend Component Architecture

- GameLauncher (game picker, difficulty selector)
- GameBoard (game type renderers, timer, score tracker)
- GameResult (summary, points breakdown, SRS writeback confirmation)
- ParentalControlsPanel (time limits, type restrictions, enforcement UI)

### Placement Strategy

- **Course Integration:** Games placed after unit quizzes (optional progression)
- **Standalone Hub:** Dedicated /games/all page listing all 13 types with recent scores
- **Habit Formation:** Daily Challenge widget on dashboard; notification reminders for completions

### Gamification Layer

- Points per game type (base + bonuses: speed, streaks, perfection)
- Achievements triggered by milestones (100 points total, 5-day streak, leaderboard top-3)
- Reward system: Unlock new difficulties after completing 5 games of a type

### Parental Controls (Section 12)

**Time Limits:** DailyTimeLimit per child per game type (e.g., 30 min Term Match/day)  
**Type Restrictions:** Blocklist of restricted game types per child  
**Enforcement:** Game launch checks limit + blockage; parent dashboard shows child usage vs limits  
**Age-Based Defaults:** Automatic restrictions by AgeCategory (e.g., EARLY_CHILD blocks games 8-13)  
**UI:** Parental Controls panel in parent dashboard for full CRUD

### Phase 1 vs Phase 2

**Phase 1 (MVP):** Games 1-7 (course-integrated), no leaderboards, no family duels, parental controls UI + enforcement  
**Phase 2:** Standalone games, global leaderboards, achievements, multiplayer features

### Implementation Order

1. Data model + migrations
2. Game engine + round logic
3. Content generator (unit → game config)
4. API endpoints + scoring
5. Frontend game components
6. Parental controls enforcement + dashboard UI
7. SRS writeback + notifications

### Full Document Reference

The complete 3335-line design document with detailed section specifications, scoring formulas, UI wireframes, test cases, and implementation pseudocode is stored at:  
`.squad/decisions/inbox/khaldun-games-detailed-design.md`

This summary captures the key architectural decisions. Engineering teams should reference the full document during implementation for scoring algorithms, UI patterns, and test strategies.

---

# Decision: Game Start Validation — Relax Required Fields

**Date:** 2026-05-17
**Author:** Khwarizmi (Backend Dev)
**Status:** Implemented

## Context
POST /api/v1/games/start was failing because validation required `gameType` (with no enum whitelist matching the 26 actual types) and `difficulty` (required, no default). The frontend only sends `{ gameId, memberId }`.

## Decision
1. **`gameId` and `memberId` are now the only required fields** for starting a game.
2. **`difficulty` defaults to `'MEDIUM'`** when not provided — the frontend doesn't need to pick difficulty upfront.
3. **`gameType` is optional** — when a `gameId` is provided, the service derives gameType from the game's template record. This eliminates the need to validate against all 26 enum values.
4. **Removed the hard-coded controller guard** (`if (!gameType || !difficulty)`) since the service now handles resolution.
5. **Parental controls check moved after gameType resolution** so it works with the derived type.

## Files Changed
- `backend/src/routes/game.routes.ts` — validation schema
- `backend/src/controllers/game.controller.ts` — removed redundant guard, default difficulty
- `backend/src/services/game.service.ts` — gameType optional, derived from gameId, error if neither provided

---

# GameType Enum Alignment — Schema + Engine + Frontend + Seed

**Author:** Khwarizmi  
**Date:** 2026-05-17  
**Status:** IMPLEMENTED

## Problem

Backend schema had 15 GameType enum values; frontend expected a different set of 15. Only 4 overlapped (TERM_MATCH, SPEED_QUIZ, FLASHCARD_FLIP, ESCAPE_ROOM). Additionally, MAZE_NAVIGATOR (backend) vs MAZE_RUNNER (frontend) was a naming conflict.

## Decision

Extended GameType to 26 values — the full union of both sets. Both MAZE_NAVIGATOR and MAZE_RUNNER kept as separate types (different theming, same mechanics). All 26 types now have:
- Prisma schema enum value
- CONTENT_REQUIREMENTS, TIMER_CONFIGS in game.service.ts
- formatRoundsForGameType() case with game-mode-specific metadata
- gradeAnswer() handling (specific or generic fallback)
- GameTemplate + Game seed records
- Frontend type + GAME_META entry

## Also Fixed

selectContent was filtering questions by exact difficulty match while checkContentAvailability was not — root cause of "game start returns success=false". Fixed with fallback to any-difficulty when exact match returns 0.

## Impact

- Ibn Sina: All 15 frontend game UIs now have working backend support
- Seed: 26 templates, 60+ course-linked games, 9 standalone games
- API: /games/available returns all 26 types with availability status

---

## Decision: Azure Deployment Architecture

**Date:** 2026-05-17  
**Author:** Khaldun (Lead Architect)  
**Status:** DOCUMENTED

### Summary

Comprehensive Azure deployment guide written at `docs/azure-deployment-guide.md` covering full production path for the Islamic Learning Platform.

### Key Architectural Decisions

1. **App Service over Container Apps** for now — no Dockerfile maintenance, native Node.js runtime, simpler operations. Container Apps is the future path when we split services.

2. **Key Vault for all secrets** — no raw secrets in App Service settings. Uses managed identity + `@Microsoft.KeyVault(...)` references.

3. **VNet + Private Endpoints for production** — PostgreSQL and Redis isolated from public internet. App Service integrates via VNet.

4. **CI/CD via GitHub Actions** — separate workflows for frontend (Static Web Apps) and backend (App Service ZIP deploy). Migrations run in CI before deployment.

5. **Cost tiers documented:** ~$43/mo dev, ~$487/mo production. Growth milestones mapped to infrastructure upgrades.

### Trade-offs

- **No Dockerfile yet:** Simpler ops now, but limits containerization options. Migration path documented for when scale demands it.
- **Static Web Apps Free tier:** Sufficient for now but Standard ($9/mo) needed for custom auth providers or >2 custom domains.
- **Seeds run manually:** Large seed corpus (20+ files) makes automated seeding slow. Recommend tracking which seeds have been applied.

### Impact

All team members should reference this guide for deployments. The existing `docs/AZURE_DEPLOYMENT.md` (older, less comprehensive) remains for quick reference but the new guide is canonical.

---

## Decision: useActiveMemberId Hook for Game Components

**Date:** 2026-05-17  
**Author:** Ibn Sina (Frontend Dev)  
**Status:** Implemented

### Context

All 26 game components relied on `selectedMember?.id` from `useFamilyStore()`, but `selectedMember` is only populated when `selectMember()` is explicitly called. No code path calls it before game start. Result: every "Start Game" button silently failed.

GamesHub already worked around this with `activeMemberId = selectedMember?.id || members[0]?.id` inline.

### Decision

Created a reusable hook `useActiveMemberId()` at `frontend/src/hooks/useActiveMemberId.ts` that:
1. Returns `selectedMember?.id || members[0]?.id` (fallback to first member)
2. Auto-fetches family members from authStore's `family.id` if not yet loaded

All 26 game components now use this hook instead of directly destructuring `selectedMember`.

### Impact

- **All game files in `frontend/src/pages/games/`** now import from `@/hooks/useActiveMemberId`
- Any future game component should use `useActiveMemberId()` — never raw `selectedMember`
- GamesHub itself still uses its own inline pattern (no change needed; it already worked)

### Also Fixed

- GamesHub `filteredGames.map` key changed from `game.id` to `${game.id}-${game.template.type}-${index}` to prevent React key warnings when template flattening produces duplicate IDs.

---

## Decision: Game System Redesign — From 26 Quiz Reskins to 10 Distinct Mechanics

**Author:** Khaldun (Lead Architect)  
**Date:** 2026-05-18  
**Status:** PROPOSAL — Pending review  
**Supersedes (in part):** Decision #7 (Games Engine Detailed Design, 2026-05-17)

### Summary

After auditing `game.service.ts`, confirmed that more than half the game types produce **byte-identical round payloads** with only cosmetic flavor text. We have built one game and shipped it 15 times.

### Current State Audit: 26 Game Types Categorized by Actual Mechanic

#### Group A — Pure MCQ Reskins (10 types, all identical)
- MULTIPLE_CHOICE, SPEED_QUIZ, TRIVIA_BATTLE, FIQH_SCENARIO (broken), ESCAPE_ROOM, MAZE_NAVIGATOR, MAZE_RUNNER, KNOWLEDGE_EXPEDITION, MOSQUE_BUILDER, PATTERN_CREATOR
- All generate: `{ questionText, options[], correctAnswer, explanation }`
- **Verdict:** Collapse to **one** game (MCQ) with skinnable presentation themes.

#### Group B — Flashcard Reskins (3 types, all identical)
- FLASHCARD_FLIP, MEMORY_MATCH, TERM_MATCH
- MEMORY_MATCH and TERM_MATCH are the same mechanic (pair-matching)
- **Verdict:** Collapse to one **Pair Match** game. Keep **Flashcard Sprint** separate (self-rated recall).

#### Group C — Fill-in-the-blank Variants (4 types)
- FILL_IN_BLANK, AYAH_COMPLETION (same mechanic), WORD_SCRAMBLE, SPELLING_BEE
- **Verdict:** Merge FILL_IN_BLANK + AYAH_COMPLETION into one **Cloze** game. Keep WORD_SCRAMBLE and SPELLING_BEE distinct.

#### Group D — Sequencing Games (4 types)
- HADITH_CHAIN, SEERAH_TIMELINE, SENTENCE_BUILD, STORY_PUZZLE
- Same mechanic (drag items into correct order), different content.
- **Verdict:** Keep as **one Ordering game** with content-type variants.

#### Group E — Special Mechanics (5 types, genuinely distinct)
- WORD_SEARCH (keep), TRUE_FALSE (keep but reframe), LISTENING_QUIZ (merge into MCQ), CALLIGRAPHY_TRACE (keep), DAILY_CHALLENGE (delivery wrapper, not a game type)

### Proposed 10-Mechanic Taxonomy

**Core Engine (4):**
1. **Quick Recall** (replaces 10 MCQ reskins) — 4-option MCQ with themes
2. **Pair Match** (replaces MEMORY_MATCH + TERM_MATCH) — reveal/match pairs in grid
3. **Flashcard Sprint** (keep) — self-rated recall, feeds SRS
4. **Cloze (Fill the Gap)** (replaces FILL_IN_BLANK + AYAH_COMPLETION) — type missing text

**Specialized (6):**
5. **Word Search** — find words in letter grid
6. **Sequence It** (replaces HADITH_CHAIN + SEERAH_TIMELINE + SENTENCE_BUILD + STORY_PUZZLE) — drag items into order
7. **Word Scramble** — unscramble jumbled letters
8. **Verify** (reframed TRUE_FALSE) — binary statement judgment with context labels (Halal/Haram/True/False/etc)
9. **Calligraphy Trace** — trace Arabic letterforms on canvas
10. **Fiqh Scenario Tree** ⚡ NEW — **branching decision tree** (replaces broken FIQH_SCENARIO). Player given real-life situation, chooses actions, story continues. After 3–5 decisions, gets verdict on fiqh soundness at each step.

### Games Hub UX Redesign

**Step 1: Hub view** (`/games`) — Shows 10 game cards, no course/difficulty picker on cards
**Step 2: Game launcher** (`/games/:gameSlug/launch`) — Course picker (filtered by content compatibility), unit picker, difficulty picker (3 buttons), Start button
**Step 3: Play** (`/games/:gameSlug/play?...`) — Existing pattern, no changes

### Course-Compatibility Matrix

New `contentRequirements` metadata on Game model:
```ts
{
  slug: 'fiqh-scenario',
  contentRequirements: {
    contentType: 'FIQH_SCENARIO',
    courseCategory: 'FIQH',
    minItems: 3,
  }
}
```

Hub card always appears, but launcher filters courses by this query.

### Migration Path — 26 → 10 Without Data Loss

**Principle:** Game type collapse, score preservation. Rename/merge GameType enum values, preserve all existing `GameScore` and `GameSession` rows via mapping.

---

## Decision: Eligible Courses Response Shape + Simple Enroll Endpoint

**Author:** Khwarizmi  
**Date:** 2026-05-18  
**Status:** IMPLEMENTED

### Context

Frontend `GameLauncher` calls `GET /games/:slug/eligible-courses?memberId=X` and extracts results via `raw.courses`. Backend was returning `raw.eligibleCourses` — key mismatch caused "No eligible courses" bug.

### Decisions

#### 1. Response key renamed: `eligibleCourses` → `courses`

Matches the frontend extraction pattern. Added fields per frontend contract:
- `courseName` (alias of `courseTitle`)
- `contentCount` (total content items for this game type on the course)
- `suggestedDifficulty` (≤8 items → EASY, ≤15 → MEDIUM, else HARD)

#### 2. New endpoint: `POST /api/v1/courses/:courseId/enroll`

- Reads `x-active-member-id` header (same pattern as games)
- Idempotent: returns 200 with existing enrollment if already enrolled
- No `requireParentRole` — any authenticated member can self-enroll via the learner picker
- Old `POST /enrollments` (body-based, parent-only) preserved for backward compat

#### 3. Self-member enrollment is already handled

The `selfMemberId` from the learner picker is a real `FamilyMember.id`. No special-casing needed — the enrollment query works by `memberId` directly.

### Impact

- **Ibn Sina (Frontend):** Can now use `raw.courses` extraction as-is. `courseName`, `contentCount`, `suggestedDifficulty` available for UI rendering.
- **Breaking:** Any code reading `response.data.data.eligibleCourses` must switch to `.courses`. Since this is fresh code from the 9-type collapse, no legacy consumers exist.

---

## Enrollment UX Simplification

**Author:** Ibn Sina (Frontend Dev)  
**Date:** 2026-05-18  
**Status:** IMPLEMENTED

### Decision

Simplified the CourseDetail enrollment flow to auto-use the active learner from `useFamilyStore().selectedMember` instead of always requiring a dropdown selection.

### Rationale

With the learner picker already selecting an active family member at the top of the app, forcing users to re-select the same member in a dropdown on CourseDetail was redundant friction. The dropdown remains as a fallback for the edge case where no active member is set.

### Implementation

- If `selectedMember` exists: show single "Enroll {name}" button
- If no `selectedMember`: show the dropdown (original behavior)
- Success message now includes member name for clarity

### Impact

- **UX:** One-click enrollment instead of select-then-click (saves a step for the common case)
- **Backward compatible:** Dropdown fallback ensures no regression if selectedMember is null
- **Pattern:** Other pages needing member context should follow the same pattern — prefer `selectedMember` from store, fallback to manual selection

**Schema Changes:**
- New enum: `QUICK_RECALL, PAIR_MATCH, FLASHCARD_SPRINT, CLOZE, WORD_SEARCH, SEQUENCE_IT, WORD_SCRAMBLE, VERIFY, CALLIGRAPHY_TRACE, FIQH_SCENARIO`
- New content models: `OrderedSequence`, `FiqhScenario` + `FiqhScenarioNode`
- Add `presentationConfig: Json?` to `Game` (themes/modes become data, not new types)

**Code Migration:**
- Backend: `generateRoundsForGameType()` switch 26 cases → 10
- Frontend: Delete ~17 redundant game components, keep 10 core ones
- Migration script: Prisma migration with raw SQL remapping old GameTypes to new ones

### Rollout Plan

1. **Phase A (1 sprint):** Backend enum + schema migration
2. **Phase B (1 sprint):** New Games Hub UI + Launcher page
3. **Phase C (1–2 sprints):** Author FiqhScenario content (manual)
4. **Phase D (optional):** OrderedSequence content authoring

### Recommendation

Proceed with Phase A immediately. It is reversible, ships value (less code = fewer bugs), and unblocks the real prize: a working Fiqh Scenario Tree in Phase C.

---

## Decision: Family Account vs. Learner Member — Auth & Game Identity

**Author:** Khaldun (Lead)  
**Date:** 2026-05-18  
**Status:** Proposed  
**Audience:** Ibn Sina (backend), Biruni (frontend), Khwarizmi (schema/migrations), Scribe (docs)

### Current State

**Data Model:** Schema cleanly splits **account holder** from **learner**:
- `Family` ──< `User` (parent login: email + password, role=PARENT)
- `Family` ──< `FamilyMember` (learner: name, age, optional PIN/username, streaks, points)
- Every learning/gameplay relation is hung off `FamilyMember`, **not** `User`

**At Login:**
- `register()` creates a `Family` and a `User` (PARENT). **No `FamilyMember` is created.**
- `login()` returns `{ accessToken, refreshToken, user: {id, email, role}, family: {id, name} }`
- JWT payload contains `userId, familyId, email, role` — **no `memberId`**

**Frontend State After Login:**
- `authStore` persists `{ user, family, accessToken, refreshToken }`
- `familyStore` tracks `members[]` and `selectedMember`, but is **not populated automatically** at login
- Active learner resolved by `useActiveMemberId()`: `selectedMember?.id || members[0]?.id` (can be undefined)
- **No member-picker UI exists**. App silently defaults to first member in array.

### Where the Game Flow Breaks

For a parent who has just registered and has **zero `FamilyMember` records**:
1. `members[]` is empty after `fetchMembers()` resolves
2. `activeMemberId` is `undefined` forever
3. `GameLauncher` shows a spinner that never resolves (loading is never cleared), OR
4. If user reaches `GamePlay` directly, `useGameRunner` quietly never auto-starts
5. If undefined memberId forwards to API, backend `startGame` → `checkParentalControls(undefined, …)` → Prisma validation error → 500 error

This matches the symptom: logged in as parent, no members, every game launch fails.

### Problems Identified

1. **No member is created for the parent at signup.** The schema expects at least one `FamilyMember`, but `register()` never creates one.
2. **No member-picker UI.** Even families with multiple members rely on `members[0]` — no way to pick who is playing.
3. **`useActiveMemberId()` can return `undefined`** and downstream callers don't all handle it. `GameLauncher` stuck-loads. `useGameRunner` silently no-ops.
4. **No backend guard.** `startGame()` accepts whatever `memberId` the controller hands it. Undefined/garbage values yield Prisma 500.
5. **JWT does not carry a `memberId`.** Frontend has to thread `memberId` through every request; nothing validates it belongs to the family.

### Recommended Solution: Option B — "Who's Learning Today?" Profile Picker

Reject:
- **Option A** (auto-create member for parent's email): Parent shouldn't silently become a "learner" with streaks/rank. Doesn't address multi-member case.
- **Option C** (admin-only family account): Many users *are* the primary learner (adult self-study). Forcing "add yourself" is bureaucratic and confusing.

**Option B captures both audiences:**

1. After login, route through `/select-learner` (Netflix-style picker) before dashboard
2. Picker shows every `FamilyMember` as tile, plus "Just me (myself)" tile and "+ Add a learner" tile
3. Picking "Just me" first time **prompts:** "Looks like you'd like to take courses yourself. We'll set up a learner profile in your name." → creates `FamilyMember` (linked to user) and selects it
4. Selected member persisted (zustand + localStorage), surfaced as `useActiveMemberId()`
5. "Switch learner" button lives in header
6. Every game/quiz/flashcard route asserts selected member; otherwise redirects to `/select-learner`

### Schema Changes

Minimal, additive, backward-compatible:

```prisma
model User {
  // ...existing fields...
  selfMemberId String? @unique
  selfMember   FamilyMember? @relation("UserSelfMember", fields: [selfMemberId], references: [id], onDelete: SetNull)
}

model FamilyMember {
  // ...existing fields...
  isAccountOwner Boolean @default(false)
  ownerUser      User?    @relation("UserSelfMember")
}
```

- `isAccountOwner=true` badges tile ("You") and protects from accidental deletion
- `selfMemberId` makes "is logged-in parent also a learner?" check a single lookup
- No existing data touched. Existing families keep working; new column defaults to `false`

### Backend Changes (Ibn Sina)

1. **`AuthService.register`** stays as-is — don't auto-create member. We want explicit picker moment.
2. **New endpoint `POST /api/families/:familyId/members/self`** — creates `FamilyMember` with `isAccountOwner=true`, links `User.selfMemberId`, defaults `age` from form. Idempotent.
3. **Guard `startGame` (and `submitRound`, `completeGame`, etc.):**
   - Verify `memberId` is valid UUID
   - Verify member exists and `familyId === req.user.familyId`
   - Return `400 Invalid member` on failure (not 500)
4. **JWT enrichment (optional, phase 2):** add `lastMemberId` to access token on refresh

### Frontend Changes (Biruni)

1. **New page `/select-learner`** (`pages/auth/SelectLearner.tsx`)
2. **Routing guard** in `App.tsx`: if `isAuthenticated && !selectedMember && route is not /select-learner`, redirect
3. **`familyStore`:** Persist `selectedMember` to localStorage, add `createSelfMember(age)` action
4. **`useActiveMemberId`:** Stop falling back to `members[0]`. Return `selectedMember?.id ?? undefined`
5. **`GameLauncher` + `useGameRunner`:** When `activeMemberId` is undefined, show friendly "Pick a learner to play" CTA linking to `/select-learner`
6. **Header:** Add "Playing as: <name> · switch" control on authenticated pages

### Migration Path for Existing Accounts

- New columns default safely; nothing breaks
- On next login, if `User.selfMemberId == null` AND `family.members.length == 0`, treat as brand-new; surface "Add a learner / Just me" prominently
- If `family.members.length >= 1` and `User.selfMemberId == null`, just show existing members (no auto-claim)
- No one-time backfill script needed

### Impact on Games

**How this fixes current errors:**
- Parent currently: Logs in → no `FamilyMember` exists → clicks game → `activeMemberId` undefined → stuck spinner or undefined propagates to API → 500
- After fix: Logs in → forced through `/select-learner` → picks "Just me" → backend creates `FamilyMember` → store selects it → clicks game → `activeMemberId` is real UUID → session created → game plays

**Game-system Validation to Add (defensive depth):**
1. Backend middleware `requireMember` on every `/api/games/*` route taking memberId
2. Frontend `gameService` interceptor: if `memberId === undefined`, abort and show toast
3. `gameStore.startGame`: add early `if (!memberId) throw`
4. `GameLauncher` early-return: call `setLoading(false)` so page renders friendly empty-state
5. Leaderboard/achievement pages: replace empty state with "Pick a learner" component

### Proposed Sequencing

1. **Sprint 1 (unblocks current errors):** Backend `requireMember` middleware + frontend `gameService` interceptor + `GameLauncher` `setLoading(false)` fix. Ships in a day; converts 500s into clear UX.
2. **Sprint 2 (real fix):** Schema migration, endpoint, `/select-learner` page, routing guard, header switcher
3. **Sprint 3 (polish):** Persist `selectedMember`, switch-learner animation, badge/streak audit, docs

---

## Decision: User Directive — Game Type Consolidation

**Date:** 2026-05-18T09:35:44Z  
**Author:** hrasheed (via Copilot)  
**Status:** Captured for team implementation

### Directive

Merge G8 (True/False / Verify) into G1 (Quick Recall) as a question type variant (True/False questions alongside MCQ). Final game count is 9 distinct mechanics, not 10.

### Rationale

User request — reduces redundancy further; binary judgment is just a 2-option MCQ.

---

## Decision: Games frontend rebuilt to 9-mechanic taxonomy

**Author:** Ibn Sina (Frontend Dev)  
**Date:** 2026-05-18  
**Status:** Implemented (build ✓)  
**Implements:** `khaldun-game-redesign.md` + user directive (merge True/False into Quick Recall → 9, not 10)

### What Changed

Collapsed 26 redundant game components into **9 distinct mechanics**:

| Slug | ActiveGameType | What it tests |
|---|---|---|
| `quick-recall` | QUICK_RECALL | Recall (MCQ + T/F merged) |
| `pair-match` | PAIR_MATCH | Association (memory & connect) |
| `flashcard-sprint` | FLASHCARD_SPRINT | Self-rated recall (SRS) |
| `cloze` | CLOZE | Productive recall (fill the gap) |
| `word-search` | WORD_SEARCH | Vocabulary recognition |
| `sequence-it` | SEQUENCE_IT | Order (timeline / isnad / syntax / narrative) |
| `word-scramble` | WORD_SCRAMBLE | Spelling |
| `calligraphy-trace` | CALLIGRAPHY_TRACE | Handwriting (Arabic only) |
| `fiqh-scenario` | FIQH_SCENARIO | Applied jurisprudence (Fiqh only) |

### Architectural Decisions

1. **Routing pattern:** `/games` → `/games/:gameSlug/launch` → `/games/:gameSlug/play?gameId=X&difficulty=Y`. Hub no longer launches games. Launcher is separate page picking course + difficulty.

2. **`useGameRunner` hook** in `frontend/src/hooks/useGameRunner.ts` DRYs the auto-start / submit / completeGame / playAgain / exit lifecycle for all 9 games. Each component now ~100-300 lines presentation only.

3. **Legacy back-compat via `mapToActiveType()`** in `utils/gameHelpers.ts` — backend records with old GameType values (MULTIPLE_CHOICE, SPEED_QUIZ, etc.) collapsed into 9 new types client-side. No backend migration required.

4. **Game content shapes preserved** — `startGame → submitRound → completeGame` API unchanged. New components consume existing payload shapes (pairs, narrators, events, segments, words, grid, scrambledWord, letter, tree, etc).

### Backend Ask (Khwarizmi)

Frontend expects new endpoint:
```
GET /api/v1/games/:gameSlug/eligible-courses?memberId=...
→ [{ gameId, courseId, courseName, contentCount, suggestedDifficulty }]
```

**Fallback active in meantime:** `gameService.getEligibleCourses()` catches 404 and falls back to filtering `/games/available` client-side. Functional but extra work — please add dedicated endpoint when convenient.

### Files

- **New:** `pages/games/{GameLauncher,QuickRecall,PairMatch,FlashcardSprint,Cloze,WordSearch,SequenceIt,WordScramble,CalligraphyTrace,FiqhScenario}Game.tsx`, `hooks/useGameRunner.ts`
- **Rewritten:** `pages/games/{GamesHub,GamePlay,index}.tsx`
- **Modified:** `types/game.ts`, `utils/gameHelpers.ts`, `stores/gameStore.ts`, `services/gameService.ts`, `App.tsx`
- **Deleted:** 26 old game components

### Verification

`npm run build` ✓ — 1531 modules transformed, no TS errors.

---

## Decision: Game Engine Collapse — 26 → 9 GameTypes

**Author:** Khwarizmi (Backend Dev)  
**Date:** 2026-05-18  
**Status:** Implemented (migration written, not yet applied to prod)  
**Implements:** `khaldun-game-redesign.md` + user directive

### What Changed

The game engine collapsed from **26 GameType enum values** to **9 canonical types**. G8 (Verify / True-False) was merged into G1 (Quick Recall) as a 2-option MCQ variant per user directive.

### Final 9 GameTypes

| Slug | Enum | Aggregates |
|---|---|---|
| `quick-recall` | `QUICK_RECALL` | SPEED_QUIZ, MULTIPLE_CHOICE, TRUE_FALSE, LISTENING_QUIZ, TRIVIA_BATTLE, DAILY_CHALLENGE |
| `pair-match` | `PAIR_MATCH` | TERM_MATCH, MEMORY_MATCH |
| `flashcard-sprint` | `FLASHCARD_SPRINT` | FLASHCARD_FLIP |
| `cloze` | `CLOZE` | FILL_IN_BLANK, AYAH_COMPLETION |
| `word-search` | `WORD_SEARCH` | WORD_SEARCH, MAZE_RUNNER, MAZE_NAVIGATOR |
| `sequence-it` | `SEQUENCE_IT` | SENTENCE_BUILD, HADITH_CHAIN, SEERAH_TIMELINE, STORY_PUZZLE |
| `word-scramble` | `WORD_SCRAMBLE` | WORD_SCRAMBLE, SPELLING_BEE |
| `calligraphy-trace` | `CALLIGRAPHY_TRACE` | CALLIGRAPHY_TRACE, PATTERN_CREATOR, MOSQUE_BUILDER |
| `fiqh-scenario` | `FIQH_SCENARIO` | FIQH_SCENARIO, ESCAPE_ROOM, KNOWLEDGE_EXPEDITION |

### Files Modified

- `backend/prisma/schema.prisma` — GameType enum (9 values); `Game.presentationConfig Json?` and `Game.courseCompatibility Json?` added
- `backend/prisma/migrations/20260518093544_collapse_game_types_to_9/migration.sql` — NEW raw-SQL migration with CASE mapping, deduplication, index fixes
- `backend/src/services/game.service.ts` — REWRITTEN: 2047 → ~1500 lines. New `GAME_DEFS` table, single `selectContent`, single `formatRounds` switch (9 branches), single `gradeAnswer`. New `getEligibleCourses(slug, memberId)` method.
- `backend/src/services/achievement.service.ts` — Updated GameType references
- `backend/src/controllers/game.controller.ts` — Added `getEligibleCourses` method
- `backend/src/routes/game.routes.ts` — Added `GET /games/:slug/eligible-courses`
- `backend/prisma/seed-games.ts` — REWRITTEN: 9 templates, one Game per template, badges remapped

### New API Endpoint

```
GET /api/games/:slug/eligible-courses
→ { success: true, data: [{ courseId, title, category }] }
```

Returns courses authenticated member is enrolled in satisfying game's `courseCompatibility.requires` checks. Used by launcher where users pick game first, then course.

### Migration Safety

- **GameSession FKs preserved:** Migration never deletes Game rows, only re-points `templateId` during dedup. Existing sessions/scores survive.
- **Enum swap pattern:** Create new enum, ALTER each referencing column with USING+CASE, drop old, rename.
- **Array column gotcha:** `game_parental_settings.allowedGameTypes` is `GameType[]` — must ALTER COLUMN before type swap and re-add after.

### Verification

- `npx prisma generate` ✅
- `npx tsc --noEmit` ✅ (zero errors)
- Migration SQL written but **not applied** — apply with `npx prisma migrate deploy`

### Follow-ups

- **Frontend (Ibn Sina):** Update launcher UI to call `/games/:slug/eligible-courses` after game selection
- **Ops:** Plan for downtime during migration — enum swap is brief table rewrite on 3 columns
- **QA:** Each 9 round formatters needs end-to-end test; old integration tests need slug+enum renames

---

## 2026-06-05T23:37:00: User directive

**By:** hrasheed (via Copilot)  
**What:** The al-Masar I'rab & Sarf course should be built as BOTH platform seed data (courses, units, questions, flashcards, Arabic terms following existing Prisma patterns) AND standalone interactive HTML lesson files as supplementary content. Not just HTML files alone.  
**Why:** User request — course content should live in the platform's database alongside existing courses, with the HTML lessons as supplementary enrichment material.

---

## al-Masār I'rab & Sarf — Architecture Mapping

**Author:** Khaldun (Lead Architect)  
**Date:** 2026-06-05  
**Status:** DECISION — Awaiting hrasheed approval before implementation begins

### Executive Summary

The al-Masār 8-week I'rab & Sarf course can be built almost entirely on existing Prisma models with **one targeted schema addition**. The standalone HTML files are the primary learning interface; the platform database is the secondary representation that powers SRS, games, and progress tracking. This distinction drives every decision below.

### 1. Five-Part Circuit → Prisma Model Mapping

#### Part 1 — Sarf Warm-up (Conjugation Drill)

**Primary interface:** Standalone HTML file (input cells, check/reveal buttons, JavaScript normalization)  
**Platform representation:** `Question` (type: `FILL_BLANK`) linked to the Week Unit

The conjugation drill table has ~10–20 blank cells per week (2 verb paradigms × partial rows). Each blank is a `FILL_BLANK` question.

**Decision:** Seed conjugation blanks as `FILL_BLANK` Questions. Accept that the drill table visual exists only in the HTML. No new model required.

#### Part 2 — Passage Reading (Clickable Word Annotations)

**Primary interface:** Standalone HTML file (`<span class="arabic-word">` with six `data-*` attributes)  
**Platform representation:** `ArabicTerm` with a new `metadata: Json?` field

The current `ArabicTerm` model has: `arabicText`, `transliteration`, `translation`, `audioUrl`. This covers exactly 2 of the 6 required data attributes.

**REQUIRED SCHEMA CHANGE:** Add `metadata: Json?` to `ArabicTerm`.  
Migration is a single `ALTER TABLE` — one nullable column, backwards compatible, no data loss.

The `metadata` JSON shape:
```json
{
  "vowelled": "عُلِمَ",
  "root": "ع ل م",
  "wordType": "verb",
  "irab": "فعل ماضٍ مبني للمجهول...",
  "sarf": "فَعِلَ — باب نصر — صحيح سالم",
  "passageWeek": 2
}
```

**Decision:** Extend `ArabicTerm` with `metadata: Json?`. One migration. No new model.

#### Part 3 — I'rab & Sarf Quiz (8 MCQ)

**Platform representation:** `Question` (type: `MULTIPLE_CHOICE`) + `QuizResult`

The I'rab/Sarf subtotal split is tracked in `QuizResult.answers: Json`. Tag each Question with a custom difficulty prefix or add a tag to `questionText` as a prefix marker (e.g., `[IRAB]` / `[SARF]`).

**Decision:** Use existing `Question` + `QuizResult`. Tag I'rab vs Sarf questions with `[IRAB]` / `[SARF]` prefix in `questionText` for sub-score calculation. No schema change.

#### Part 4 — Grammar Connection from Qatr al-Nada

**Platform representation:** Embedded in `Unit.content` (HTML rich text field, `@db.Text`)

Seed each weekly Qatr al-Nada rule as 2–3 `FlashCard` records (front: grammar rule question, back: definition/example).

**Decision:** Part 4 content lives in `Unit.content` HTML. Key rules additionally seeded as FlashCards for SRS. No new model.

#### Part 5 — Reveal & Review (Full Analysis Table)

**Platform representation:** Embedded in `Unit.content` (HTML) + `FlashCard`

The "Key Takeaways" bullets (I'rab patterns and Sarf patterns to internalize) become `FlashCard` records with `category: 'rule'`.

**Decision:** Part 5 lives in `Unit.content` HTML. Takeaway bullets seeded as `FlashCard` records. No new model.

### 2. Course Structure

**1 Course record** for the entire al-Masār program. **8 Units, one per week.** Each Unit contains ALL five parts of that week's circuit.

`Unit.content` stores the full assembled HTML for that week's five-part circuit.

### 3. Seed File Strategy

Pattern: `seed-masaar-{concern}.ts`

```
backend/prisma/
  seed-masaar-course.ts        ← Course record + 8 Week Units (with content HTML)
  seed-masaar-quizzes.ts       ← All 64 MCQ Questions (8/week × 8 weeks)
  seed-masaar-flashcards.ts    ← All FlashCards (~150 total: pattern + rule + vocabulary)
  seed-masaar-terms.ts         ← ArabicTerm records for passage word annotations
```

### 4. HTML Lesson Placement

The `maktab-coursebook-html/` precedent makes the repo-root location the established pattern:

```
/lesson-irab-sarf/
  lesson-irab-sarf-week1.html   ← already exists (in personal-vscode workspace)
  lesson-irab-sarf-week2.html
  ...
  lesson-irab-sarf-week8.html
```

This directory sits **at the repo root**, parallel to `maktab-coursebook-html/`.

### 5. Implementation Order and Dependencies

```
[1] Schema Migration (ArabicTerm.metadata)
       ↓
[2] seed-masaar-course.ts  ← Establishes Course + Unit IDs that all other seeds reference
       ↓
[3] seed-masaar-quizzes.ts     ← Depends on Unit IDs from [2]
    seed-masaar-flashcards.ts  ← Depends on Unit IDs from [2]  (parallel with [3])
    seed-masaar-terms.ts       ← Depends on Unit IDs from [2] + schema change from [1]
       ↓
[4] HTML Weeks 2–8  ← Pure authoring, no database dependency
```

### 6. Open Decisions Requiring hrasheed Input

1. **`ArabicTerm.metadata: Json?` migration** — approve before Khwarizmi starts `seed-masaar-terms.ts`.
2. **Conjugation drill in platform (Phase 2)** — do we want to build a native CLOZE-based conjugation game?
3. **HTML week 1 migration** — `lesson-irab-sarf-week1.html` currently lives in `personal-vscode` workspace. Move to `lesson-irab-sarf/`?
4. **Course linkage in HTML** — hardcoded `courseId` back-link or title-slug URL?

### Summary of Required Schema Change

**One migration:**

```prisma
model ArabicTerm {
  // existing fields...
  metadata  Json?   // NEW: { vowelled, root, wordType, irab, sarf, passageWeek }
}
```

All other parts of this course map to existing models without schema changes.

---

## Generated Audio Sync Contract

**Author:** Ibn Sina (Frontend Dev)  
**Date:** 2026-05-24T23:11:45-05:00  
**Status:** Proposed

### Context

The backend `POST /api/v1/units/:unitId/audio` endpoint already returns word timestamps alongside the generated audio URL and duration.

### Decision

Frontend audio orchestration should treat POST-generated audio with timestamps the same as pre-fetched synced audio, immediately routing it through the synced playback controls and page-level highlighting flow.

### Impact

First-run audio generation keeps word highlighting active in the main lesson body instead of silently falling back to unsynced playback.

