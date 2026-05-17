# Decision: Game Engine Backend Implementation

**Author:** Khwarizmi  
**Date:** 2026-05-17  
**Status:** Implemented  

## Context

The team design doc (`khaldun-games-detailed-design.md`) specified a full game engine with 15 game types (5 for Phase 1), gamification layer, SRS integration, and parental controls. This decision covers the backend implementation choices.

## Decisions Made

### 1. Schema — 14 models, 8 enums
All 15 GameType enum values defined upfront (future-proofing), but only 5 active in Phase 1: TERM_MATCH, SPEED_QUIZ, FLASHCARD_FLIP, DAILY_CHALLENGE, WORD_SEARCH.

### 2. Content Selection Priority
SRS-due items first → recently incorrect → unseen → random fill. This maximizes learning value by prioritizing spaced-repetition-ready content.

### 3. SRS Writeback via SM-2
Game answers feed back into the flashcard SRS system: correct → rating 4, incorrect → rating 2, fast correct → rating 5. Shared `calculateNextReview()` from sm2-algorithm.service.

### 4. Scoring Formula
`BASE_POINTS(100) + SPEED_BONUS(max 50) × STREAK_MULTIPLIER(1x/1.5x/2x/3x)`. Stars: ≥90%=3★, ≥75%=2★, ≥50%=1★. XP = score×0.1 + stars×25.

### 5. Parental Controls — Whitelist Model
Empty `allowedGameTypes` array = all allowed. Non-empty = whitelist. Checked at game start. Includes time budget (weekday/weekend), difficulty cap, and optional enforce-after-hour.

### 6. Achievement System — Decoupled Check
Achievements checked after game completion via `AchievementService.checkAndAward()`. Each achievement has an independent async check function. New achievements auto-award XP and record activity events.

### 7. Daily Challenge — Deterministic Seed
Daily challenge content selected via date-based seed shuffle, ensuring all players get the same challenge per day. One attempt per member per day enforced via unique constraint.

## Files Created/Modified

| File | Lines | Purpose |
|------|-------|---------|
| `prisma/schema.prisma` | +~350 | 8 enums, 14 models, relations |
| `services/game.service.ts` | ~1095 | Core game engine |
| `services/achievement.service.ts` | ~210 | Achievement definitions + check |
| `controllers/game.controller.ts` | ~260 | 15 endpoint handlers |
| `routes/game.routes.ts` | ~135 | Express routes + validation |
| `index.ts` | +2 | Route registration |

## API Surface

- **Discovery:** GET /games, /games/unit/:id, /games/course/:id, /games/standalone
- **Session:** POST /games/start, POST .../rounds/:id/submit, POST .../complete, GET .../sessions/:id
- **Scores:** GET /games/scores, GET /games/leaderboard/:gameType
- **Achievements:** GET /games/achievements, GET /games/achievements/recent
- **Daily:** GET /games/daily-challenge, POST /games/daily-challenge/attempt
- **Parental:** GET/PUT /games/settings/:memberId, GET /games/time/:memberId
