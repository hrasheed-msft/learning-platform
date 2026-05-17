# Project Context

- **Owner:** hrasheed
- **Project:** Islamic Studies Learning Platform — family-based Islamic education with courses, flashcards, SRS, quizzes, and gamification
- **Stack:** React 18 + Vite + TypeScript (frontend), Node.js + Express + Prisma + PostgreSQL + Redis (backend), TailwindCSS, Zustand, JWT auth
- **Created:** 2026-05-16

## Learnings (Summarized)

**ARCHIVE NOTE:** This file reached 20.2 KB on 2026-05-17T10:54:54Z. Historical entries from 2026-05-16 (Architecture Audit, Maktab Analysis) have been archived. See orchestration logs in `.squad/orchestration-log/` for full details.

### Summary of Prior Work (2026-05-16)

**Architecture Audit:** Completed comprehensive inventory. Platform is 90-95% feature-complete (15+ models, 70+ routes, 20+ pages). Known gaps: Gamification trigger logic, Directus integration, email verification, SRS consolidation opportunity, seed file fragmentation. **Ref:** decisions.md #1

**Maktab Coursebook Strategy:** Analyzed 10 HTML coursebooks + parent guides. HTML-to-Prisma mapping strategy defined: subject-centric courses (1 course per subject per level), auto-generation from parent guide quizzes (high quality), flashcard extraction, gender-differentiated variants. **Ref:** Orchestration log 2026-05-16

**Games + Parent Dashboard Research:** Three interconnected features designed: 13 game types (7 course-integrated, 6 standalone), parent dashboard (stats/activity/notifications), child login (JWT role branching on FamilyMember). All architectural decisions documented with 8 open questions. **Ref:** decisions.md #4 (high-level overview), inbox/khaldun-games-detailed-design.md (full 3335-line blueprint)

---

### 2026-05-17 — Games Detailed Design + Parental Controls Addendum

**Status:** COMPLETED  
**Orchestration Log:** `.squad/orchestration-log/2026-05-17T10-54-khaldun.md`

Games engine detailed design document finalized with parental controls section added. Document now 3335 lines, provides full implementation blueprint for engineering teams.

**Outcomes:**
- Complete 13-game catalog with mechanics, scoring, difficulty scaling, SRS integration
- Game engine state machine architecture (IDLE → LOADING → READY → PLAYING → COMPLETED)
- Content selection algorithm (4-tier priority: SRS-due, recently-wrong, unseen, random)
- 15-endpoint API specification (game metadata, lifecycle, scoring, leaderboards)
- Frontend component architecture (GameLauncher, GameBoard, GameResult, ParentalControlsPanel)
- Placement strategy (course-integrated, standalone hub, habit formation widgets)
- Phase 1 vs Phase 2 scope clearly delineated (5 games MVP vs leaderboard/multiplayer future)
- Gamification layer: Points, achievements, reward unlock progression
- **NEW: Section 12 — Parental Controls** (Khaldun-4, Haiku)
  - Time Limits: DailyTimeLimit model per child + game type (e.g., 30 min/day Term Match)
  - Type Restrictions: Blocklist of restricted games per child
  - Enforcement: Game launch checks; parent dashboard usage tracking
  - Age-Based Defaults: Auto-apply restrictions by AgeCategory
  - Dashboard UI: Parental Controls panel with full CRUD
  - Notification Alerts: Parent notified on limit approach/restriction attempt

**Implementation Readiness:** Design includes scoring formulas, UI wireframes, test case scenarios, pseudocode. Sufficient for Khwarizmi (backend) and Ibn Sina (frontend) to implement without guessing.

**Full Document Reference:** `.squad/decisions/inbox/khaldun-games-detailed-design.md` (3335 lines; kept as reference artifact; summary merged to decisions.md entry #9)

**Team Handoff:** All three features (Child Auth, Parent Dashboard, Games) now have complete backend + frontend designs. Ready for parallel implementation sprint.

### 2026-05-16 — Maktab Coursebook HTML Structure & Conversion Analysis

**Status:** COMPLETED  
**Deliverable:** `.squad/decisions/inbox/khaldun-maktab-conversion-strategy.md` (10 sections, 600+ lines)

Comprehensive analysis of 10 Maktab coursebook HTML files and parent guides completed. Strategy document provides architectural blueprint for converting all coursebooks into platform courses with quizzes, flashcards, and ArabicTerms.

**Key Findings:**

1. **Consistent HTML Structure** across all 10 coursebooks:
   - `<section class="subject">` (7-8 per book: Fiqh, Ahadith, Sirah, Tarikh, Aqaid, Akhlaq, Adab, Dua)
   - `<article class="topic">` (3-15 per subject; individual lessons)
   - Content: `<p>` (narrative), `<ul>` (lists), `<div class="arabic">` (RTL with diacritics), `<div class="diagram">` (PNG references)
   - Parent guides (parallel structure): Summary + Quiz + Discussion per topic

2. **HTML-to-Prisma Mapping Decision:** Subject-centric Course architecture
   - `<section class="subject">` → Prisma `Course` (title, category, ageLevels)
   - `<article class="topic">` → Prisma `Unit` (title, description, content as @db.Text HTML)
   - Rationale: Islamic education is subject-centric; enables cross-level subject progression (Fiqh Book 1 → 2 → ... → 8)

3. **Quiz Generation Rules:**
   - Source: Parent guide quizzes (3-4 per topic) → migrate directly to Platform Questions
   - Type mapping: "Is it...?" → TRUE_FALSE, "Which...?" → MULTIPLE_CHOICE, "Match..." → MATCHING, "Fill..." → FILL_BLANK
   - AI gap-filling: Generate additional questions if parent guide has <3 per unit
   - Difficulty assignment: Book 1-2 = EASY, Book 3-5 = MEDIUM, Book 6-8 = HARD, FurtherStudiesNW = HARD
   - Target: 3-5 questions per Unit (3 from parent guide + 1-2 AI if depth warrants)

4. **Flashcard Generation Rules:**
   - Categories: vocabulary, definition, pattern, example, rule (Prisma enum)
   - Extraction heuristic: Arabic terms + translations → vocabulary, concept definitions → definition, rules in lists → rule, Quranic refs → example
   - Per-unit target: 5-8 flashcards (adjusted by content depth)
   - Arabic support: Split front/back with frontArabic/backArabic (preserve diacritics: "Shahādah" → "الشهادة")
   - Tags: category + subject (e.g., ["vocabulary", "fiqh"])

5. **Seed Script Pattern:**
   - File naming: `backend/prisma/seed-maktab-coursebook{N}.ts` (N = 1-8, 6b/6g for gender variants, fs for FurtherStudies)
   - Template: Upsert Course → Upsert Units → Create Questions → Create FlashCards → Create ArabicTerms
   - IDs: kebab-case with coursebook identifier (e.g., `coursebook1-fiqh-shahada`)
   - Key pattern: Helper functions for HTML parsing (extractSubjects, extractTopics, extractParentGuideQuestions, extractFlashcardTerms)

6. **Arabic Text Handling Strategy:**
   - Preservation: Extract full Unicode with diacritics intact (UTF-8, already in HTML)
   - Storage: arabicText (Unicode with diacritics), transliteration (Latin with diacritics for UI), translation (English)
   - Flashcards: Split Arabic vs English (frontArabic, front, backArabic, back)
   - HTML content: Keep `<div class="arabic">` tags inline in Unit.content for semantic rendering
   - Font recommendation: `font-family: 'Amiri', 'Scheherazade New', serif` for diacritics rendering

7. **Coursebook Priority Order:**
   - Priority 1: Book 1 (ages 6-7; simplest; validates pattern)
   - Priority 2: Book 2 (incremental complexity)
   - Priority 3: Book 4 (mid-level; tests content depth before gender differentiation)
   - Priority 4: Book 6 Boys (tests gender variant handling)
   - Priority 5: Book 5 (intermediate level)
   - Priority 6: Book 3 (confirms pattern stability)
   - Priority 7: Book 7 (advanced jurisprudence)
   - Priority 8: Book 8 (highest complexity)
   - Priority 9: Book 6 Girls (gender-specific variant)
   - Priority 10: FurtherStudiesNW (specialized, highest difficulty)
   - Rationale: Early books validate pattern quickly; Book 6 Boys before Girls; Book 7-8 last for robustness before advanced content

8. **Unresolved Decisions (with Recommendations):**
   - **Image handling:** Keep PNG filenames in Unit.content for Phase 1; defer CDN migration to Phase 2
   - **Gender-differentiated books:** Create separate Courses (coursebook6-boys-fiqh, coursebook6-girls-fiqh) rather than single Course with variant flag (simpler query/recommend logic)
   - **Learning Objectives:** Store in Unit.description (already supports text)
   - **Parent guide quizzes:** Migrate directly to Platform Questions (educator-designed; high quality)

9. **Implementation Checklist for Khwarizmi:**
   - Parse all 10 coursebooks + parent guides to extract subjects/topics/quizzes
   - Generate 10 seed-maktab-coursebook{N}.ts files following template
   - Validate seed scripts: no data loss, all FKs resolve
   - Seed test DB; verify counts and spot-check content
   - Run seed scripts against production DB (with backup)
   - Spot-check UI rendering (especially Arabic + diacritics + RTL)

10. **Key Files & References:**
    - HTML: Coursebook1.html (ages 6-7, simplest), Coursebook4.html (ages 9-10, mid-level), Coursebook6Boys.html (gender-differentiated)
    - Guides: Coursebook1-parent-guide.html (shows summary+quiz+discussion structure)
    - Exemplar seed: backend/prisma/seed-sarf-course.ts (rich HTML, Arabic fields)
    - Schema: backend/prisma/schema.prisma (Course/Unit/Question/FlashCard/ArabicTerm models)

**Edge Cases Documented:**
- Coursebooks 6B/6G: Gender-differentiated content → separate courses
- FurtherStudiesNW: Highest complexity → last in priority order
- Image embedding: 267 PNGs in images/ directory → filenames embedded in Unit.content
- Learning Objectives: Present in most books → store in Unit.description
- Quiz coverage: Parent guides provide 3-4 Qs per topic → supplement with AI if needed

**Next Steps:**
- Strategy document approved by team
- Khwarizmi (Implementation Agent) takes ownership
- Execution follows coursebook priority order (Books 1, 2, 4, 6B first)
- CI/CD integration of seed scripts with validation

---

### 2026-05-17 — Games, Parent Dashboard & Child Auth Design Document

**Status:** COMPLETED  
**Deliverable:** `.squad/decisions/inbox/khaldun-games-dashboard-childauth-research.md`

Comprehensive research and design document covering three interconnected features: Games (13 game types across course-integrated and standalone categories), Parent Dashboard (statistics, activity feed, notifications, comparative views), and Child/Teen Login (username-only auth with JWT role branching).

**Key Architectural Decisions:**

1. **Child Auth on FamilyMember (Option A):** Add username/passwordHash/loginEnabled fields directly to FamilyMember rather than creating a separate ChildCredential model. FamilyMember is already the child identity anchor — separate model would require unnecessary joins on every child auth check.

2. **JWT Role Branching:** Child JWTs use `role: "CHILD"` with `sub` = FamilyMember ID (not User ID). Middleware branches on role to resolve actor identity. Route protection matrix documented for all 15+ route categories.

3. **Games use existing content:** Phase 1 games (Term Match, Speed Quiz, Flashcard Flip, Daily Challenge) are 100% auto-generated from existing Question, FlashCard, and ArabicTerm data. No manual content authoring needed for initial launch.

4. **SRS writeback from games:** Game results feed back into FlashCardProgress (correct answer = SM-2 rating 4, incorrect = rating 2). Playing games reduces review burden — major engagement lever.

5. **ActivityEvent as shared infrastructure:** Single model written by all learning activities (quiz, course, game, flashcard milestones), read by parent dashboard and notification system. Unifies the activity tracking layer.

6. **Single Prisma migration for all 3 features:** 10 new models + modifications to 4 existing models. Implementation is phased (Child Auth → Parent Dashboard → Games) but schema lands atomically to avoid migration churn.

7. **Implementation order:** Child Auth first (establishes child-as-actor identity), Parent Dashboard second (reads child activity data), Games third (children play, parents monitor). Dependency chain is clear.

8. **13 game types designed:** 7 course-integrated (Term Match, Ayah Completion, Fiqh Scenario, Hadith Chain, Word Search, Speed Quiz, Flashcard Flip) + 6 standalone (Daily Challenge, Knowledge Expedition, Trivia Battle, Mosque Builder, Pattern Creator, Seerah Timeline). Each has content source, difficulty scaling, age mapping, and trigger conditions documented.

**Open Questions (8):** Documented in design doc with recommendations. Key pending decisions: global vs family-scoped usernames, SRS writeback confirmation, email digest deferral to Phase 2.

---

## 2026-05-17 — Cross-Agent Session Summary

**Team Session:** Games research + Catalog fix (2026-05-17T10:30:29Z)

### Khwarizmi's Parallel Work
**Status:** Course catalog loading bug FIXED ✅

1. **Pagination limit issue:** `courseStore.ts` defaultFilters.limit was 12; bumped to 50. All 17 published courses now load.
2. **Rate limiter stabilization:** Moved health check above rate limiter middleware in `backend/src/index.ts`. Prevents monitoring endpoint exhaustion.
3. **Error handling robustness:** Frontend `getErrorMessage()` now handles both error response shapes.
4. **Dev config:** Rate limit increased 100 → 1000 in `.env`.

**Impact on Games/Dashboard Work:** Clean catalog ensures users can browse all courses before engaging with games feature. Stable health checks ensure Phase 2 monitoring for large feature rollouts.

### Next Phase Handoff
- **Khaldun:** Design document ready for team review (8 open questions capture decision gates)
- **Khwarizmi:** Available to implement Child Auth (Phase 1 of games/dashboard work)
- **Team:** Consensus needed on 8 architectural decisions before implementation sprint

### 2026-05-17 — Games Engine Detailed Design Document

**Status:** COMPLETED
**Deliverable:** `.squad/decisions/inbox/khaldun-games-detailed-design.md` (~900 lines)

Comprehensive implementation blueprint covering all 13 game types with full specifications. Key architectural decisions made in this document:

1. **Phase 1 scope: 5 games** — Term Match, Speed Quiz, Flashcard Flip, Daily Challenge, Word Search. Chosen for highest engagement-to-effort ratio (3×S + 1×S-reuse + 1×M).

2. **Game engine is a state machine** — IDLE → LOADING → READY → PLAYING → COMPLETED/ABANDONED. State transitions managed client-side (Zustand), session lifecycle server-side.

3. **Content selection algorithm: 4-tier priority** — (1) SRS-due items, (2) recently-wrong items, (3) unseen items, (4) random. Diversity constraint: max 2 items per unit in standalone games.

4. **No mid-game difficulty adaptation** — Feels unfair; between-session suggestions only. Phase 2 may add adaptive difficulty within Knowledge Expedition.

5. **SRS rating mapping standardized** — Fast correct → 5, correct → 4, slow correct → 3, incorrect → 2, timeout → 1. Uses existing `sm2-algorithm.service.ts` (1-5 scale).

6. **Streak grace period: 1 day** — Miss 1 day without breaking streak (once per gap). Prevents frustration while maintaining habit pressure.

7. **XP is cosmetic only** — No content gating, no pay-to-win. XP unlocks Knowledge Expedition cities and Mosque Builder materials.

8. **Quality gates hide unavailable games** — If a unit lacks minimum content (e.g., <4 ArabicTerms for Term Match), the game simply doesn't appear. No broken empty games.

9. **Sprint plan: 4 sprints (8 weeks)** — Foundation → First Games → More Games + Hub → Gamification + Polish.

10. **Data model: 13 new Prisma models** — GameTemplate, Game, GameSession, GameRound, GameScore, BadgeDefinition, UserBadge, UserAchievement, Leaderboard, LeaderboardEntry, DailyChallenge, DailyChallengeAttempt, UserStreakRecord, StreakAchievement.

**Key file paths:**
- Design doc: `.squad/decisions/inbox/khaldun-games-detailed-design.md`
- Existing SM-2: `backend/src/services/flashcard/sm2-algorithm.service.ts`
- Existing schema: `backend/prisma/schema.prisma`
- Frontend stores: `frontend/src/stores/` (gameStore.ts will be new)
**Key file paths:**
- Design doc: `.squad/decisions/inbox/khaldun-games-detailed-design.md`
- Existing SM-2: `backend/src/services/flashcard/sm2-algorithm.service.ts`
- Existing schema: `backend/prisma/schema.prisma`
- Frontend stores: `frontend/src/stores/` (gameStore.ts will be new)
- Backend services pattern: `backend/src/services/` (game/ directory will be new)

### 2026-05-17 — Games Detailed Design + Parental Controls Addendum

**Status:** COMPLETED  
**Orchestration Log:** `.squad/orchestration-log/2026-05-17T10-54-khaldun.md`

Games engine detailed design document finalized with parental controls section added. Document now 3335 lines, provides full implementation blueprint for engineering teams.

**Outcomes:**
- Complete 13-game catalog with mechanics, scoring, difficulty scaling, SRS integration
- Game engine state machine architecture (IDLE → LOADING → READY → PLAYING → COMPLETED)
- Content selection algorithm (4-tier priority: SRS-due, recently-wrong, unseen, random)
- 15-endpoint API specification (game metadata, lifecycle, scoring, leaderboards)
- Frontend component architecture (GameLauncher, GameBoard, GameResult, ParentalControlsPanel)
- Placement strategy (course-integrated, standalone hub, habit formation widgets)
- Phase 1 vs Phase 2 scope clearly delineated (5 games MVP vs leaderboard/multiplayer future)
- Gamification layer: Points, achievements, reward unlock progression
- **NEW: Section 12 — Parental Controls** (Khaldun-4, Haiku)
  - Time Limits: DailyTimeLimit model per child + game type (e.g., 30 min/day Term Match)
  - Type Restrictions: Blocklist of restricted games per child
  - Enforcement: Game launch checks; parent dashboard usage tracking
  - Age-Based Defaults: Auto-apply restrictions by AgeCategory
  - Dashboard UI: Parental Controls panel with full CRUD
  - Notification Alerts: Parent notified on limit approach/restriction attempt

**Implementation Readiness:** Design includes scoring formulas, UI wireframes, test case scenarios, pseudocode. Sufficient for Khwarizmi (backend) and Ibn Sina (frontend) to implement without guessing.

**Full Document Reference:** `.squad/decisions/inbox/khaldun-games-detailed-design.md` (3335 lines; kept as reference artifact; summary merged to decisions.md entry #9)

**Team Handoff:** All three features (Child Auth, Parent Dashboard, Games) now have complete backend + frontend designs. Ready for parallel implementation sprint.
