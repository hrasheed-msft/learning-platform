# Decisions Archive

**Last Updated:** 2026-05-17T10:54:54Z  
**Total Decisions:** 9  
**Source:** Merged from .squad/decisions/inbox/ on 2026-05-17

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

