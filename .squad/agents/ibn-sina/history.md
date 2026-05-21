# Project Context

- **Owner:** hrasheed
- **Project:** Islamic Studies Learning Platform — family-based Islamic education with courses, flashcards, SRS, quizzes, and gamification
- **Stack:** React 18 + Vite + TypeScript (frontend), Node.js + Express + Prisma + PostgreSQL + Redis (backend), TailwindCSS, Zustand, JWT auth
- **Created:** 2026-05-16

## Work History (Summarized)

### 2026-05-16 — Full Frontend Inventory [ARCHIVED]
**Status:** 90-95% feature-complete; 10 gaps identified  
**Architecture:** Auth via ProtectedRoute (19 core routes); 8 UI components; 4 stores; 6 services (~60 endpoints); Tailwind + Islamic palette + RTL support  
**Outcome:** Inventory completed; gaps documented in decisions.md

### 2026-05-17 — Child Login + Parent Dashboard Frontend
**Status:** COMPLETED | 24 files created  
**Deliverables:** ChildLoginPage, ChildLayout, ParentDashboard, childAuthStore, dashboardStore, notificationStore  
**Architecture:** Separate child auth store; ChildProtectedRoute independent; SetCredentialsModal in FamilySettings  
**Result:** All builds pass; no TypeScript errors

### 2026-05-17 — Games Frontend Phase 1 (15 Game Types)
**Status:** COMPLETED | 25 new files  
**Deliverables:** 10 shared components, 6 playable games (TermMatch, SpeedQuiz, FlashcardFlip, DailyChallenge, EscapeRoom, MazeNavigator), GamePlay router  
**Key Fixes:** 3 backend-frontend API contract mismatches resolved (achievements shape, leaderboard structure, streak fields)  
**Architecture:** GameType enum established with GAME_META; all games follow 3-screen pattern

### 2026-05-17 — Games Frontend Phase 2 (Expanded 15→26)
**Status:** COMPLETED | 11 new components  
**New Games:** WordScramble, FillInBlank, MemoryMatch, TrueFalse, MultipleChoice, SentenceBuild, ListeningQuiz, CalligraphyTrace, SpellingBee, StoryPuzzle, MazeRunner  
**Result:** GamePlay router maps all 26 slugs; GAME_META updated; build clean

### 2026-05-17 — Games Expansion (Additional 11 Components)
**Status:** COMPLETED | 9 new components + MazeNavigator routed  
**New Games:** AyahCompletion, FiqhScenario, HadithChain, WordSearch, KnowledgeExpedition, TriviaBattle, MosqueBuilder, PatternCreator, SeerahTimeline  
**Result:** All 26 game types fully playable; GamePlay router complete; build clean

### 2026-05-17 — Games Full Implementation (Phase 1 Complete, 14:57:13Z)
**Status:** COMPLETED | Full team integration  
**Frontend Deliverables:** 26 game types, all components built, router complete, parental controls integrated  
**Backend Parallel (Khwarizmi):** GameType enum 15→26, POST /games/start validation relaxed, content selection fallback, 26 templates + 69 seed games  
**Team Coordination:** Parallel work completed without blockers; API contracts synchronized; both decisions merged into decisions.md  
**Build Status:** ✅ Clean (frontend) + ✅ Clean (backend)  
**Phase 1 Completion:** All 26 types playable end-to-end with parental controls integrated

**Next Phase Roadmap:**
1. Leaderboards (global/family/class-based)
2. Multiplayer (Family Duel backend)
3. Achievements (milestone triggers)
4. Notifications (game completion, achievement unlocks)
5. Analytics (per-user performance dashboard)

---

**History Last Summarized:** 2026-05-17T14:57:13Z  
**File Size Before:** 20,239 bytes | **After:** ~3.6 KB (82% reduction)

## Learnings

### 2026-05-17 — useActiveMemberId Pattern
- **Problem:** All 26 game components used `selectedMember?.id` from `useFamilyStore()`, but `selectedMember` is only set via explicit `selectMember()` call — nobody does that. Result: "Start Game" silently fails for every game.
- **Fix:** Created `frontend/src/hooks/useActiveMemberId.ts` — returns `selectedMember?.id || members[0]?.id` with auto-fetch of members. Updated all 26 game components to use this hook.
- **Pattern:** GamesHub already had `activeMemberId = selectedMember?.id || members[0]?.id` inline. The hook centralizes this pattern.
- **Key file:** `frontend/src/hooks/useActiveMemberId.ts`
- **GamesHub key fix:** `filteredGames.map` used `key={game.id}` which can duplicate when same template creates multiple games. Changed to composite key `${game.id}-${game.template.type}-${index}`.


### 2026-05-18 — Games frontend rebuilt: 26 → 9 mechanics

- **Driver:** `khaldun-game-redesign.md` consolidated 26 redundant game components into 9 distinct mechanics. User directive merged True/False into Quick Recall — final = 9.
- **9 games (slug → ActiveGameType):** quick-recall, pair-match, flashcard-sprint, cloze, word-search, sequence-it, word-scramble, calligraphy-trace, fiqh-scenario.
- **New routing pattern:** `/games` (hub) → `/games/:gameSlug/launch` (course + difficulty picker) → `/games/:gameSlug/play?gameId=X&difficulty=Y`. Replaces old `/games/play/:gameType` direct-launch flow.

## Learnings

- **2026-05-18 – Game start 422 fix**: The `POST /games/start` endpoint requires either a valid `gameId` (UUID) or a `gameType` string. When a course has no pre-existing Game row, `gameId` is null and gets serialized as the string `"null"` in URL params. The fix: (1) omit `gameId` from URL when falsy, (2) change `gameService.startGame()` to accept an object with optional `gameId`, `gameType`, and `courseId`, (3) derive `gameType` from the game slug via `SLUG_TO_TYPE` in `useGameRunner` as a fallback identifier. This ensures the backend always receives at least one valid identifier.
- **Launcher pattern:** Hub no longer launches games. New `GameLauncher.tsx` fetches eligible courses for the chosen mechanic, lets user pick course + difficulty, writes selection to `gameStore.setLauncherSelection`, then navigates to play route. GamePlay re-hydrates from URL params if direct-loaded.
- **DRY lifecycle:** `frontend/src/hooks/useGameRunner.ts` centralizes auto-start / submit / playAgain / exit-to-hub for all 9 games. Uses `startAttempted` ref to prevent double-start in StrictMode.
- **Legacy back-compat:** `mapToActiveType()` in `utils/gameHelpers.ts` collapses old GameTypes (MULTIPLE_CHOICE / SPEED_QUIZ / TRIVIA_BATTLE / ESCAPE_ROOM / MAZE_RUNNER / etc) into the 9 new ActiveGameType values, so backend records with legacy types still route correctly.
- **Eligible courses fallback:** `gameService.getEligibleCourses(slug, memberId)` calls `/games/:slug/eligible-courses` but falls back to filtering `/games/available` by `mapToActiveType(g.template.type)` if endpoint 404s. Backend (Khwarizmi) needs to add the dedicated endpoint.
- **GAME_META gotcha:** had to keep WORD_SCRAMBLE/WORD_SEARCH/FIQH_SCENARIO/CALLIGRAPHY_TRACE in the **new** section only — the legacy duplicates caused `TS1117: multiple properties with the same name`. Removed duplicates from legacy block.
- **Pre-existing fix:** Removed unused `user` destructure in `StudySession.tsx` to unblock typecheck (TS6133, pre-existing from prior commit).
- **Key files:** `pages/games/{GamesHub,GameLauncher,GamePlay}.tsx`, 9 new game components in `pages/games/`, `hooks/useGameRunner.ts`, `stores/gameStore.ts` (launcher state), `services/gameService.ts` (getEligibleCourses), `types/game.ts` (ActiveGameType + GAME_META), `utils/gameHelpers.ts` (mapToActiveType / slug maps / shuffle), `App.tsx` (routes).
- **Build:** `npm run build` ✓ (1531 modules, 507kB main bundle).

### 2026-05-18 — Games "No eligible courses" fix + Enrollment simplification
- **Problem 1:** `gameService.getEligibleCourses` extracted `raw.courses` but backend returns `eligibleCourses`. Also mapped `c.courseName` but backend sends `courseTitle`.
- **Fix 1:** Changed extraction to `raw?.eligibleCourses ?? raw?.courses ?? []` and field mapping to `c.courseName ?? c.courseTitle ?? c.course?.title ?? 'Untitled'`.
- **Problem 2:** CourseDetail enrollment required picking a member from dropdown even though learner picker already selects an active member.
- **Fix 2:** If `selectedMember` exists in familyStore, show a single "Enroll {name}" button. Dropdown only appears as fallback when no active member. Success message now includes member name.
- **Pattern:** Use `selectedMember` from `useFamilyStore()` as primary; `selectedMemberId` state as fallback for no-active-member edge case.
- **Key files:** `services/gameService.ts` (line 129), `pages/courses/CourseDetail.tsx` (enrollment section).
- **Build:** `npx tsc --noEmit` ✓ clean.

### 2026-05-20 — TTS Audio Player UI (Frontend)
- **Status:** COMPLETED | 3 new files, 1 modified page, 1 updated barrel
- **Deliverables:**
  - `components/AudioPlayer.tsx` — Reusable player with play/pause, seekable progress bar, speed control (0.75x–1.5x), RTL support, error state
  - `components/UnitAudioButton.tsx` — "Listen" button with Arabic/English language toggle, loading/error states, client-side URL caching per language
  - `services/audioService.ts` — API service calling `POST /api/v1/units/:unitId/audio`
  - `pages/courses/UnitViewer.tsx` — Integrated UnitAudioButton in unit header section
- **Architecture:** Component caches audio URL per language in local state so repeated clicks don't re-generate. AudioPlayer uses native `<audio>` element with custom Tailwind UI. RTL-aware for Arabic content. "AI-generated audio" disclosure tooltip.
- **API contract:** `POST /api/v1/units/:unitId/audio` body `{ language: "ar" | "en" }` → `{ url: string, duration: number }`
- **Build:** `npx tsc --noEmit` ✓ clean

### 2026-05-20 — Video Player UI (Frontend)
- **Status:** COMPLETED | 3 new files, 1 modified page
- **Deliverables:**
  - `components/VideoPlayer.tsx` — HTML5 video player with custom controls (play/pause, seekable progress, speed control 0.75x–2x, fullscreen), dark cinema-style UI, AI-Generated badge, RTL support, auto-hiding controls
  - `components/UnitVideoButton.tsx` — "Watch" button with Arabic/English language toggle, 3 states (idle → generating → ready), 5-second polling while generating, estimated time display, per-language URL caching
  - `services/videoService.ts` — API service calling `POST /api/v1/units/:unitId/video` for both generation and status polling
  - `pages/courses/UnitViewer.tsx` — Integrated UnitVideoButton in new "📚 Study Aids" grouped section alongside audio (grid: side-by-side on desktop, stacked on mobile)
- **Architecture:** Consistent with AudioPlayer patterns—same caching strategy, RTL handling, error states. Video-specific: polling with interval ref, generating state animation, fullscreen API. Buttons grouped under "Study Aids" heading with responsive 2-col grid. AI disclaimer on playback.
- **API contract:** `POST /api/v1/units/:unitId/video` body `{ language: "ar" | "en" }` → `{ status: "generating" | "ready", url?: string, estimatedTime?: number }`
- **Build:** `npx tsc --noEmit` ✓ clean

### 2026-05-20 — Audio Sync Frontend (SyncedTextPlayer)
- **Status:** COMPLETED | 5 new components + 1 store
- **Team:** Collaborated with Khwarizmi (backend TTS) and Khaldun (architecture); Commit 99cffa5
- **Deliverables:**
  - `components/AudioPlayer/SyncedTextPlayer.tsx` — Main player managing real-time text sync state; props: unitId, content, language, initialPlaybackRate
  - `components/AudioPlayer/TextHighlight.tsx` — Renders text sections with word-level highlighting; auto-scrolls to current word; RTL/LTR per section
  - `components/AudioPlayer/AudioControls.tsx` — Playback controls: play/pause/stop, time display, seek slider, speed selector (0.75×–2×), language toggle
  - `components/AudioPlayer/AudioMetadata.tsx` — Resource info: duration, file size, generated date, voice, buffering status
  - `hooks/useAudioSync.ts` — Core hook: currentTimeMs sync, textSync data fetch, play/pause/seek/speed state management, fallback to on-demand TTS if pre-gen unavailable
  - `stores/audioStore.ts` — Zustand: currentUnitId, currentTimeMs, isPlaying, duration, textSync, audioUrl, playbackRate, + action creators
- **API Integration:** Fetch from `/api/v1/units/:unitId/audio` (pre-gen) → fallback `/api/v1/units/:unitId/audio/fallback` (streaming TTS)
- **Sync Algorithm:** 60 FPS via RAF timeupdate listener; word finder: `words.find(w => w.sectionId === section && w.startMs <= ms < w.endMs)`; auto-scroll with smooth behavior
- **RTL Support:** Dynamic per-section: CSS `direction: rtl|ltr`, `unicode-bidi: bidi-override`, `text-align: right|left`; Arabic text rendered with diacritics (`textWithDiacritics`); font: Noto Naskh Arabic
- **Speed Control:** 0.75×, 1×, 1.5×, 2× — maintains sync accuracy via `currentTime` recalculation
- **Error Handling:** Fallback UX smooth; if pre-gen unavailable → streams on-demand TTS without sync data (generic progress bar)
- **A11y:** ARIA labels on all buttons; keyboard nav: Space (play/pause), Arrow Keys (seek), Volume (speed); screen reader announcements
- **Performance:** Lazy-load TextHighlight per section (virtualization for long content); memoized word arrays; RAF time updates avoid requestIdleCallback lag
- **Testing:** Unit tests (useAudioSync hook), integration tests (SyncedTextPlayer with mock responses), E2E (sync precision, RTL rendering, seek updates, speed changes, language toggle)
- **Build:** `npx tsc --noEmit` ✓ clean; ready for integration with Khwarizmi's backend
- **Related:** Khaldun's architecture (word boundaries, cumulative offsets, TextSync schema); Khwarizmi's TTS service (SSML chunking, Azure Speech integration)

### 2026-05-21 — "Add a Learner" Fix + Performance Optimization
- **Status:** COMPLETED | 4 files modified
- **Issue 1 (Add Learner button broken):** The button navigated to `/settings`, but `ProtectedRoute` requires `selectedMember` — which is null on the learner picker. Fix: replaced navigation with an inline modal (name + age form) that calls `familyService.addMember` directly, then refreshes the learner list.
- **Issue 2 (Slow first load):** Initial bundle was ~507kB monolith. Fixes:
  1. `React.lazy()` + `Suspense` for all route components except Login/Register/SelectLearner
  2. Vite `manualChunks` — splits vendors into react, state, ui, content chunks
  3. Google Fonts loaded non-render-blocking (preload + media=print swap pattern)
- **Result:** Initial JS bundle → 45kB (gzipped 11kB). Pages load on demand. Build clean.
- **Key files:** `App.tsx`, `pages/SelectLearner.tsx`, `vite.config.ts`, `index.html`
- **Pattern:** Keep only critical-path components eager (layouts, login, learner picker). Everything else lazy.
