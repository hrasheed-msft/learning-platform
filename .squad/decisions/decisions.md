# Decisions Archive

**Last Updated:** 2026-07-09T19:23:09Z
**Total Decisions:** 1
**Archival Note:** Entries older than 2026-06-09 moved to archive-2026-06-09.md

---

## 2026-06-05T23:37:00: User directive

**By:** hrasheed (via Copilot)  
**What:** The al-Masar I'rab & Sarf course should be built as BOTH platform seed data (courses, units, questions, flashcards, Arabic terms following existing Prisma patterns) AND standalone interactive HTML lesson files as supplementary content. Not just HTML files alone.  
**Why:** User request — course content should live in the platform's database alongside existing courses, with the HTML lessons as supplementary enrichment material.
---
# Ibn Sina Decision — Du'ā & 99 Names Standalone Progression Views (2026-07-09T19:14:32.655-05:00)

**Author:** Ibn Sina (Frontend Dev)
**Status:** Implemented — awaiting Khwarizmi's `/api/v1/flashcards/progress?subjectTag=` endpoint

---

## What Was Built

Two new child-facing pages that show cross-stage SRS progress for Du'ā memorisation and 99 Names of Allāh, plus a supporting service, Zustand store, and type definitions. Navigation wired in from ChildDashboardHome and GradeDashboard.

---

## Files Created

| File | Purpose |
|------|---------|
| `frontend/src/types/duaProgress.types.ts` | `DuaProgressItem`, `NameProgressItem`, `SrsStatus`, `STATUS_CONFIG`, `STAGE_LABELS`, `STAGE_ORDER` |
| `frontend/src/services/dua-progress.service.ts` | API calls to Khwarizmi's planned `/flashcards/progress?subjectTag=` endpoints |
| `frontend/src/stores/duaProgressStore.ts` | Zustand store — `duaItems`, `namesItems`, `fetchDuaProgress`, `fetchNamesProgress` |
| `frontend/src/pages/child/ChildDuaProgressPage.tsx` | Du'ā progress page with collapsible stage sections, per-item expand/practice |
| `frontend/src/pages/child/ChildNamesProgressPage.tsx` | 99 Names grid with status-tinted cards, milestone celebrations, progress ring |

## Files Modified

| File | Change |
|------|--------|
| `frontend/src/App.tsx` | Added `/child/duas` and `/child/99-names` routes |
| `frontend/src/services/index.ts` | Exported `duaProgressService` |
| `frontend/src/stores/index.ts` | Exported `useDuaProgressStore` |
| `frontend/src/pages/child/ChildDashboardHome.tsx` | Added "Islamic Practice" section with Du'ā + 99 Names quick-access cards |
| `frontend/src/pages/program/GradeDashboard.tsx` | SubjectCard onClick now routes to `/child/duas` or `/child/99-names` for DUA/NAMES categories |

---

## Key Decisions

### 1. Static 99-Names Dataset Embedded in Component
All 99 Names with Arabic text, transliteration, and meaning are embedded as a `StaticName[]` constant directly in `ChildNamesProgressPage.tsx`. The grid always shows all 99 cards — cards that haven't been seeded yet appear in "Not Started" state. This matches the "graceful fallback" pattern from Decision #41.

### 2. Silent Error Swallowing in Store
`fetchDuaProgress` and `fetchNamesProgress` catch API errors silently (no `set({ error })`) so pages render an empty-state UI rather than an error screen when Khwarizmi's endpoint is not yet live.

### 3. Service Design for Khwarizmi's Endpoint
Both service methods call `GET /api/v1/flashcards/progress` with `?memberId=&subjectTag=DUA|99NAMES`. Khwarizmi needs to build this endpoint to return `{ items: [], total, dueCount }`. The TypeScript contract is defined in `duaProgress.types.ts`.

### 4. Stage Grouping Pre-populates All Stages
`groupByStage()` pre-seeds every stage from `STAGE_ORDER` in the map so collapsible section headers always render in curriculum order (F1 → CB8), even if some stages have no du'ās yet.

### 5. Routing
- `/child/duas` → `ChildDuaProgressPage` (child-protected)
- `/child/99-names` → `ChildNamesProgressPage` (child-protected)
- Both use `lazy()` for code splitting

### 6. "Practice" Navigation
Individual practice buttons navigate to `/child/flashcards` with `{ practiceCardId }` state. "Practice All Due" buttons navigate with `{ subjectTag, mode: 'review' }` state. The `ChildFlashcardsPage` can be upgraded later to consume this state.

---

## Validation
`npx tsc --noEmit` passes clean ✓

---
# Decision: Weekend Path Content Tagging — Unit-Level MVP Approach

**Author:** Khwarizmi (Backend Dev)
**Date:** 2026-07-09
**File:** `backend/prisma/seed-weekend-path-tags.ts`

## Context

The maktab Online School supports two learning paths: `AFTER_SCHOOL` and `WEEKEND`. Weekend-path students attend fewer sessions per week, so they see a reduced subset of content within each course. The `Unit.includedInPaths LearningPath[]` field (added in Decision #44) holds the tagging.

## Decision: MVP uses unit-level granularity

Per-topic splits within a subject (e.g., "Fiqh: weekend keeps first 4 of 8 topics") were considered but deferred. All Fiqh topics live in a single unit's HTML blob — splitting them requires breaking each large subject unit into per-topic units, which is a content restructuring task. MVP tags at the **subject/unit** level only.

## What is tagged as AFTER_SCHOOL only

1. **Tārīkh (Islamic History)** — all coursebook units (`maktab-1-tarikh` through `maktab-8-tarikh`, 6B/6G variants)
2. **Aqā'id (Beliefs/Creed)** — all coursebook units (`maktab-1-aqaid` through `maktab-8-aqaid`, 6B/6G variants)
3. **Further Studies NW** — four subjects only:
   - `maktab-fs-faith` (Faith & Belief)
   - `maktab-fs-identity` (A Muslim Identity)
   - `maktab-fs-money` (Money & Wealth)
   - `maktab-fs-contemporary` (Contemporary Matters)

## Implementation choices

- **Idempotency via reset-then-tag:** Script first resets all `maktab-*` units to `includedInPaths: []`, then applies restrictions. Re-running always produces the same final state.
- **`endsWith` matching** (not `contains`): Avoids false positives if future slugs embed "tarikh" or "aqaid" as substrings mid-word.
- **Standalone-runnable:** The file exports `seedWeekendPathTags()` and also supports direct invocation via `npx ts-node prisma/seed-weekend-path-tags.ts`.
- **Wired at end of `seed.ts`:** Called after `seedGames()` as a final post-processing pass.

## Deferred work

- Per-topic filtering within shared subjects (requires unit splitting)
- Foundation courses (F1/F2) — currently only Qur'ān/Du'ā/99 Names, no Tārīkh/Aqā'id to tag
- Quran Memorization courses — standalone courses, not subject to path filtering at this time

