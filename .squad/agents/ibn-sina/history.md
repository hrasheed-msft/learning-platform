# Project Context

- **Owner:** hrasheed
- **Project:** Islamic Studies Learning Platform — family-based Islamic education with courses, flashcards, SRS, quizzes, and gamification
- **Stack:** React 18 + Vite + TypeScript (frontend), Node.js + Express + Prisma + PostgreSQL + Redis (backend), TailwindCSS, Zustand, JWT auth
- **Created:** 2026-05-16

## Learnings (Summarized)

### 2026-05-16 — Full Frontend Inventory

**Status:** 90-95% feature-complete with clear gaps

**Architecture:**
- Auth via `ProtectedRoute` (reads authStore); 19 core routes across auth/dashboard/courses/flashcards/review/settings
- 5 pages directories with 19 total files (all ✅ functional)
- Reusable: 8 UI components, 2 layouts, 5 flashcard components
- Stores: authStore, courseStore, familyStore, flashcardStore (40+ actions for SRS flow)
- Services: 6 service files covering auth, courses, family, flashcards, assessment, SRS (~60 endpoints total)

**Component ecosystem:**
- UI: Avatar, Badge, Button, Card, Input, Modal, ProgressBar, Spinner
- Flashcards: FlashCard (3D flip), FlashCardEditor (bilingual EN/AR), FlashCardList, ProgressStats, StudySession (5-point rating)
- Styling: Tailwind + custom Islamic palette (green primary, gold secondary, blue accent), Amiri font for Arabic, RTL support

**Key gaps identified (10 total):**
- Items 1-2: Quick wins (404 page, @utils/@hooks dirs)
- Items 3-7: Need product direction (family admin, AI quiz UI, gamification page, orphaned component, localStorage→backend)
- Items 8-10: Mostly documented, low priority

**Tests:** Component + page tests via Vitest + Testing Library + MSW

---

### 2026-05-16 — Orchestration Complete

**Status:** COMPLETED  
**Orchestration Log:** `.squad/orchestration-log/2026-05-16T08-36-ibn-sina.md`

Frontend inventory audit wrapped. Findings merged into team decision archive:
- Decision filed: "Frontend Gaps to Address" — 7 gaps documented
  - Items 1-2 (404 page, @utils/@hooks dirs) are quick wins for Ibn Sina to complete immediately
  - Items 3-7 (family admin, AI quiz UI, gamification page, orphaned component, localStorage→backend) blocked on product direction
- Frontend codebase is 90-95% feature-complete with clear gaps now documented

---

### 2026-05-17 — Child Login + Parent Dashboard Frontend

**Status:** COMPLETED

Built the full child auth and parent monitoring frontend. Key files and patterns:

#### New Routes
| Route | Component | Layout | Guard |
|-------|-----------|--------|-------|
| `/child-login` | ChildLoginPage | Standalone | None |
| `/child/dashboard` | ChildDashboardHome | ChildLayout | ChildProtectedRoute |
| `/child/courses` | ChildCoursesPage | ChildLayout | ChildProtectedRoute |
| `/child/flashcards` | ChildFlashcardsPage | ChildLayout | ChildProtectedRoute |
| `/child/achievements` | ChildAchievementsPage | ChildLayout | ChildProtectedRoute |
| `/dashboard/parent` | ParentDashboard | MainLayout | ProtectedRoute |
| `/dashboard/parent/child/:memberId` | ChildDetailView | MainLayout | ProtectedRoute |

#### New Stores
- **childAuthStore** — persist-enabled, separate from authStore. Uses `child-auth-storage` localStorage key.
- **dashboardStore** — children list, child stats, activity feed with pagination, family summary.
- **notificationStore** — notification list, unread count, mark-as-read.

#### New Services
- **childAuthService** — `childLogin()`, `setCredentials()` 
- **dashboardService** — `getChildren()`, `getChildStats()`, `getChildActivity()`, `getFamilySummary()`, `getNotifications()`, `markNotificationRead()`

#### New Types
- `types/childAuth.ts` — ChildLoginRequest, ChildMember, ChildAuthResponse, SetCredentialsRequest
- `types/dashboard.ts` — ChildSummary, ChildDetailStats, ActivityEvent, FamilySummary, Notification

#### Architecture Decisions
- **Separate child auth store** rather than extending authStore — keeps parent/child sessions isolated, avoids token conflicts.
- **ChildLayout is a separate layout** — simplified nav with no access to settings, family management, or billing.
- **ChildProtectedRoute** checks `useChildAuthStore()` — completely independent of parent auth guard.
- **SetCredentialsModal** added to FamilySettings member rows — parents can set child username/password per member.
- **ChildLoginPage is standalone** — not nested in AuthLayout to allow a distinct child-friendly look.
- Child page stubs (courses, flashcards, achievements) are placeholders ready for backend integration.

### 2026-05-17 — Child Login + Parent Dashboard Frontend Implementation

**Status:** COMPLETED  
**Orchestration Log:** `.squad/orchestration-log/2026-05-17T10-54-ibn-sina.md`

Implemented complete frontend for child authentication, child-scoped layout, parent dashboard, and credential management. All builds pass with no TypeScript errors.

**Outcomes:**
- 24 files created: childAuthStore (isolated persist), childAuthService, dashboardService, notificationStore
- ChildLoginPage: Child-friendly design with larger inputs, "Assalamu Alaikum!" greeting, GraduationCap icon
- ChildLayout: Restricted navigation (Dashboard, Courses, Flashcards, Achievements only)
- ParentDashboard: Family summary, per-child stats, activity feeds, notification panel
- ChildDetailView: Individual child statistics drill-down
- SetCredentialsModal: Username + password management in FamilySettings
- 4 child page stubs: ChildDashboardHome, ChildCoursesPage, ChildFlashcardsPage, ChildAchievementsPage
- ChildProtectedRoute: Independent auth guard (separate from parent ProtectedRoute)
- All API contracts documented in decision entry #8

**Team Integration:** Ready for backend integration testing with Khwarizmi; dashboard UI prepared for parental controls additions (pending games blueprint finalization).

### 2026-05-18 — Games Feature Frontend Implementation

**Status:** COMPLETED

Built the complete Games frontend feature based on Khaldun's detailed design document (`khaldun-games-detailed-design.md`). All game-specific files compile cleanly (1 pre-existing error in StudySession.tsx is unrelated).

**Files created (25 total):**
- `types/game.ts` — 35 exported types/interfaces + GAME_META constant for all 15 game types
- `services/gameService.ts` — full API service: game discovery, session lifecycle, daily challenge, scores, leaderboards, achievements, badges, streaks, parental controls
- `stores/gameStore.ts` — Zustand store with complete state management (follows courseStore pattern)
- `components/games/` — 10 shared components: GameTimer, ScoreDisplay, GameProgressBar, StarRating, GameOverScreen, DifficultySelector, HintButton, StreakIndicator, TimeRemainingBar, GameBlockedScreen + barrel export
- `pages/games/` — GamesHub, GamePlay (router), 6 game type components (TermMatch, SpeedQuiz, FlashcardFlip, DailyChallenge, EscapeRoom, MazeNavigator), ScoreHistory, AchievementGallery, LeaderboardPage + barrel export

**Modified files (5):**
- `App.tsx` — added game routes for both parent (`/games/*`) and child (`/child/games/*`) layouts
- `MainLayout.tsx` — added "Games 🎮" with Gamepad2 icon to parent sidebar navigation
- `ChildLayout.tsx` — added "Games 🎮" with Gamepad2 icon to child sidebar navigation
- `types/index.ts`, `services/index.ts`, `stores/index.ts` — barrel export updates

**Architecture decisions:**
- **StreakInfo name conflict** resolved by using explicit named re-exports in `types/index.ts` instead of `export *` from game.ts (conflict with progress.ts)
- **GamePlay router** maps URL slugs to components; only 6 game types are playable, others show "coming soon"
- **MazeNavigatorGame** uses recursive backtracker algorithm for procedural maze generation
- **FlashcardFlipGame** uses inline CSS for 3D `preserve-3d` / `backface-hidden` / `rotateY` transforms
- **Parental controls** integrated via GameBlockedScreen + TimeRemainingBar components on all game pages
- **Phase 1 scope:** TermMatch, SpeedQuiz, FlashcardFlip, DailyChallenge are ready; EscapeRoom + MazeNavigator are Phase 2 stubs with full UI

---

## 2026-05-17 — Games Frontend (Ibn Sina-2)
Status: COMPLETED - 34 files, 3667 LOC

### 2026-05-17 — Games Page Blank Page Fix

**Status:** COMPLETED  
**Root Cause:** Three backend-frontend API contract mismatches in gameService.ts caused the GamesHub component to crash silently (React unmounts entire tree on uncaught render error → blank page).

**Bugs found and fixed:**
1. **`getAchievements`** — Backend returns an achievement array directly; frontend expected `{ achievements, totalXpFromAchievements }`. Destructuring `data.achievements` yielded `undefined`, crashing on `achievements.length` in the render.
2. **`getLeaderboard`** — Backend returns `{ leaderboard: FlatEntry[] }` with fields `memberId`, `name`, `totalScore`, `averageAccuracy`; frontend expected `{ leaderboard: { entries: Entry[] }, myRank }` with nested `member` object. Added transformation layer.
3. **`getStreak`** — Used unsafe `as StreakInfo` cast on an object missing 7 required fields. Fixed to return a fully-populated default StreakInfo.

**Defensive improvements:**
- Added `?? []` and `?? 0` guards in gameStore setters for achievements and leaderboard
- All three service methods now handle both expected and actual backend response shapes

**Lesson:** Never trust `as T` type assertions in service layers — they hide runtime shape mismatches that only surface as blank-page crashes in production. Always validate/transform API responses explicitly.

### 2026-05-17 — All 15 Game Types Fully Implemented

**Status:** COMPLETED

Built playable game components for all 15 game types, replacing the old 6-component set that left 9 games showing "not implemented." Also updated the GameType enum, GAME_META, and GamesHub to show course labels.

**GameType enum updated to:**
TERM_MATCH, SPEED_QUIZ, FLASHCARD_FLIP, WORD_SCRAMBLE, FILL_IN_BLANK, MEMORY_MATCH, TRUE_FALSE, MULTIPLE_CHOICE, SENTENCE_BUILD, LISTENING_QUIZ, CALLIGRAPHY_TRACE, SPELLING_BEE, STORY_PUZZLE, ESCAPE_ROOM, MAZE_RUNNER

**New game components created (11 files):**
- **WordScrambleGame** — Clickable letter tiles, build area, auto-submit on correct spelling, hint reveals next letter
- **FillInBlankGame** — Sentence with blank, multiple-choice fill, immediate green/red feedback
- **MemoryMatchGame** — CSS 3D card flip, 4×4/4×5/5×6 grids by difficulty, pair matching
- **TrueFalseGame** — Large ✅/❌ buttons, animated feedback, explanation after answer
- **MultipleChoiceGame** — 2×2 colored option grid, hint eliminates wrong answer, explanation
- **SentenceBuildGame** — Shuffled word tiles → sentence area, tap to place/remove, check button
- **ListeningQuizGame** — Speaker icon reveals Arabic text with "Now playing..." animation, then MCQ
- **CalligraphyTraceGame** — HTML5 Canvas with Arabic watermark guide, smooth green stroke, clear/submit
- **SpellingBeeGame** — Text input with auto-focus, Enter key submit, hint via transliteration
- **StoryPuzzleGame** — All segments shown at once, tap-to-select + tap-to-swap reordering
- **MazeRunnerGame** — Recursive backtracker maze, WASD+arrows+d-pad, gate questions as modal

**Modified files:**
- `types/game.ts` — New GameType enum (15 types), updated GAME_META, added `courseName` to Game interface
- `pages/games/GamePlay.tsx` — Router now maps all 15 types + daily-challenge to components
- `pages/games/GamesHub.tsx` — Shows course name as subtitle under game title for disambiguation
- `pages/games/index.ts` — Barrel exports for all new components
- `services/gameService.ts` — Passes `courseName` through from API response

**Architecture decisions:**
- Kept existing TermMatch, SpeedQuiz, FlashcardFlip, EscapeRoom, MazeNavigator (legacy) components unchanged
- Created new MazeRunnerGame as the canonical MAZE_RUNNER component (MazeNavigator left for backward compat)
- DailyChallengeGame kept in router as special meta-game (not in GameType enum)
- All games follow same 3-screen pattern: pre-game → active → game over (via shared GameOverScreen)
- Course names displayed in GamesHub cards to distinguish duplicate-looking games (e.g., 5 Term Match games for different courses)
