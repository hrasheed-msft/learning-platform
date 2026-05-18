# Skill: Game Mechanic Audit

> Detecting when "many games" are really "one game with costumes."

## When to Use

When a codebase has a large catalog of game/quiz/activity types and you suspect redundancy, or when content variety feels artificial. Applies broadly: any taxonomy of "things to do" (game types, lesson formats, exercise variants) that grew organically.

## The Core Question

**If the user closed their eyes, would two activities feel different to play?**

If no → same mechanic, different skin. Collapse.

## Audit Method

1. **Find the generator layer.** In a game engine this is usually a switch statement that produces round/turn data. (e.g., `generateRoundsFor<X>()` in a service file.)
2. **Diff the output shape of each branch.** Ignore flavor strings (names, descriptions, theme labels). Compare the structural keys and the player's required input.
3. **Group by input modality + cognitive task:**
   - Recognition (pick from options) → MCQ family
   - Recall (produce the answer) → fill-in / cloze family
   - Pairing (match two sets) → memory/connect family
   - Ordering (arrange items) → sequence family
   - Production with novel input modality (canvas, audio, drag-line) → distinct
4. **Verdict matrix:** for each game, identify (a) input modality, (b) cognitive task, (c) content shape consumed. Games sharing all three are the same game.

## Red Flags

- Two game types differ only by added cosmetic string fields (`roomName`, `direction`, `stageNumber`)
- A "scenario" or "branching" game whose generator emits the same shape as MCQ
- Frontend components for two games share >70% of their JSX
- Naming pattern of "X Runner", "X Navigator", "X Challenge", "X Battle" for variants of the same mechanic

## Refactor Pattern

- One enum value per distinct mechanic
- Variation moves to a `presentationConfig: Json?` field on the game definition row
- Migration: map old enum values → new enum + presentationConfig; preserve historical scores via FK to the game definition row
- Frontend: one component per mechanic, themed by presentationConfig

## Outputs Expected

1. **Categorization table** — old types grouped by actual mechanic
2. **Proposed taxonomy** — N distinct mechanics, each justified by the "eyes closed" test
3. **Mapping table** — every old type → new type + theme/mode
4. **What you lose / gain** — honest accounting

## Anti-Patterns to Avoid

- **Don't just rename without merging.** "Maze Runner" and "Maze Navigator" being different code paths is not solved by renaming — it's solved by deleting one.
- **Don't preserve unused cosmetics.** If a `roomName` field is set by the backend and never rendered by the frontend, delete it; don't migrate it.
- **Don't add themes back speculatively.** Ship the lean version, let user data prove themes matter before paying their complexity cost.

## Related

- Used on Islamic Learning Platform games audit (2026-05-18): 26 game types → 10 distinct mechanics. See `.squad/decisions/inbox/khaldun-game-redesign.md`.
