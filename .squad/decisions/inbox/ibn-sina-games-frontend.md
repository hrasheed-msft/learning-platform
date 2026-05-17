# Decision: Games Feature Frontend Architecture

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
