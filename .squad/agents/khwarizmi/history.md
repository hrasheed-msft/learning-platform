For detailed work history prior to 2026-05-20, see `.squad/agents/khwarizmi/history-archive.md`

Key prior work:
- 2026-05-16: Seed data (50+ courses, 62+ units, 450+ questions, 530+ flashcards)
- 2026-05-17: Games backend (all 26 game types with type-specific engines)
- 2026-05-17: Parent dashboard + child auth APIs
- 2026-05-18: Game engine collapse (26→9 types, migration written)
- 2026-05-20: TTS/audiobook integration, video generation pipeline
- 2026-05-21: Coursebook images → Azure Blob Storage

## Session 2026-06-20T19:47:13Z
- Security fix for correctAnswer stripping in getQuestions API documented

## Session 2026-06-20T16:12:48-05:00 — Schema Migration: Content Slugs & Versioning

### What was done
- Added `slug String? @unique` and `contentVersion Int @default(1)` to Course model
- Added `slug String?` and `@@unique([courseId, slug])` to Unit model
- Added `externalId String? @unique` to Question model
- Created migration manually (non-interactive env): `backend/prisma/migrations/20260620211248_add_content_slugs_versioning/migration.sql`
- Wrote idempotent backfill script: `backend/prisma/backfill-slugs.ts`
- Regenerated Prisma client; `tsc --noEmit` passes clean

### Key decisions
- Used nullable (`String?`) for all three new fields — Postgres treats NULLs as distinct in unique indexes, so multiple NULL rows don't collide. This avoids the default-empty-string footgun on Unit's composite unique.
- Composite unique `@@unique([courseId, slug])` on Unit is safe with NULLs in Postgres.
- Backfill script uses kebab-case slug generation, de-duplication with numeric suffixes, question externalIds follow pattern `{unit-slug}-q{n}`, and processes in 500-row transaction chunks for safety.
- Did NOT run `migrate dev` (applied); migration is review-ready only.

### Key file paths
- `backend/prisma/schema.prisma` — Course, Unit, Question models updated
- `backend/prisma/migrations/20260620211248_add_content_slugs_versioning/migration.sql`
- `backend/prisma/backfill-slugs.ts`

---

## Team Coordination — Anti-Rush Implementation (2026-06-20T22:18:56Z)

**Cross-Agent Update:** Orchestrated with Ibn Sina (Frontend) on integrated anti-rush measures.

### Decisions Merged from Inbox
1. **Anti-Rush Backend — Question Randomization & Retry Cooldown** — Fisher-Yates shuffle for questions/options, 15-min cooldown after failed attempts, CooldownError 429 response, new cooldown-status endpoint
2. **Content Slugs & Versioning Schema** — Course.slug, Unit.slug, Question.externalId for safe idempotent seeding
3. **Maktab Seed Files — Idempotent Upsert Pattern** — All 10 seed files converted to upsert pattern for student data preservation

### Impact on Current Work
- Schema migration created; backfill script ready for post-migration slug generation
- Assessment service updated with Fisher-Yates and cooldown enforcement
- New CooldownError class carries flat response shape for frontend timer consumption
- All seed files now safe for re-runs; student progress preserved across course updates

### Handoff to Ibn Sina
Ibn Sina implements matching frontend: cooldown countdown UI, locked quiz screen, delayed answer reveal on fail, gated review panel.

## Session 2026-07-09T18:47:56-05:00 — Foundation 1 & 2 Seed Files

### What was done
- Created `backend/prisma/seed-maktab-foundation1.ts` exporting `seedMaktabFoundation1`
  - Course slug: `maktab-foundation-1`, ageLevels: `['EARLY_CHILD']`
  - 3 units: `foundation-1-quran`, `foundation-1-dua`, `foundation-1-99-names`
  - 16 quiz questions (3 + 8 + 5), 18 flashcards (3 + 10 + 5), all upserted idempotently
- Created `backend/prisma/seed-maktab-foundation2.ts` exporting `seedMaktabFoundation2`
  - Course slug: `maktab-foundation-2`, ageLevels: `['EARLY_CHILD', 'CHILD']`
  - 3 units: `foundation-2-quran`, `foundation-2-dua`, `foundation-2-99-names`
  - 18 quiz questions (5 + 8 + 5), 20 flashcards (5 + 10 + 5), all upserted idempotently
- Wired both into `backend/prisma/seed.ts` before `seedMaktabCoursebook1` (correct age ordering)
- `tsc --noEmit` passes clean

### Key decisions
- flashcardIndex resets to 0 per unit (not cumulative across units in these files) — consistent with single-unit seed file pattern where `unitId_orderIndex` is the unique key
- Both courses use `category: 'FIQH'` consistent with other maktab courses
- Foundation 2 gets `ageLevels: ['EARLY_CHILD', 'CHILD']` to cover the 5–6 transition age
- All 17 Foundation 1 du'ās and all 14 Foundation 2 du'ās included verbatim per syllabus spec

## Session 2026-07-09T19:14:32-05:00 — Weekend Path Content Tagging Script

### What was done
- Created `backend/prisma/seed-weekend-path-tags.ts` exporting `seedWeekendPathTags()`
- Script is fully idempotent: resets all `maktab-*` units to `includedInPaths: []` first, then applies restrictions
- Three categories restricted to `['AFTER_SCHOOL']`:
  1. Tārīkh units — matched by slug suffix `-tarikh` (CB1–CB8, 6B, 6G)
  2. Aqā'id units — matched by slug suffix `-aqaid` (CB1–CB8, 6B, 6G)
  3. Further Studies NW: `maktab-fs-faith`, `maktab-fs-identity`, `maktab-fs-money`, `maktab-fs-contemporary`
- Wired into `seed.ts` as a post-processing step after `seedGames()`, at the very end of content seeding
- `tsc --noEmit` passes clean; also supports standalone `npx ts-node prisma/seed-weekend-path-tags.ts`

### Key decisions
- MVP uses unit-level tagging only. Per-topic splits within a subject (e.g., "Fiqh keeps first 4 of 8 topics") deferred — that requires splitting large subject units into smaller ones
- Reset-then-tag pattern for idempotency: `updateMany` with `startsWith: 'maktab-'` sets all to `[]` first, then three targeted `updateMany` calls apply AFTER_SCHOOL restrictions
- Used `endsWith: '-tarikh'` and `endsWith: '-aqaid'` rather than `contains` to avoid false positives from any future slug that might embed these strings mid-word

### Key file paths
- `backend/prisma/seed-weekend-path-tags.ts` — new file
- `backend/prisma/seed.ts` — import + call added after `seedGames()`

## Learnings

### 2026-07-09T19:58:03-05:00 — FlashCard stage/subject backfill
- `backend/prisma/seed-flashcard-tags.ts` queries FlashCards by `course.slug startsWith 'maktab-'` rather than `unit.slug startsWith 'maktab-'` so Foundation 1/2 cards are included even though their unit slugs are `foundation-1-*` / `foundation-2-*`.
- Foundation unit slug mapping is explicit: `foundation-1-quran|dua|99-names` → `F1`, `foundation-2-quran|dua|99-names` → `F2`, with subject tags `QURAN`, `DUA`, `99NAMES`.
- Coursebook mapping is regex-safe: `maktab-{1..5,6b,6g,7,8}-{fiqh|ahadith|sirah|tarikh|aqaid|akhlaq|adab}` → `CB*` stage tags plus subject tags from the suffix.
- Further Studies uses explicit slug-to-subject mapping: `faith → AQAID`, `hadith → AHADITH`, `identity → AKHLAQ`, `living → ADAB`, and the mixed/legal modules (`essentials-1`, `essentials-2`, `devotional`, `money`, `contemporary`) normalize to `FIQH`.
- Wired `seedFlashcardTags()` into `backend/prisma/seed.ts` immediately after `seedWeekendPathTags()` as the second maktab post-processing pass.

### 2026-06-23T09:49:39-05:00 — Quran memorization surah review units
- `backend/prisma/seed-quran-memorization.ts` now treats each surah as a sequence of ayah units followed by a final full-surah review unit, so downstream consumers should expect one extra unit per surah.
- Pattern: keep single-ayah HTML generation in `buildUnitContent()` and build aggregate review HTML in a separate helper (`buildSurahReviewContent()`) to avoid overloading the per-ayah path.
- Review units can safely reuse the existing everyayah URL scheme (`https://everyayah.com/data/khalefa_al_tunaiji_64kbps/{SSS}{VVV}.mp3`) for each ayah instead of introducing a new audio source format.
- Key file path: `backend/prisma/seed-quran-memorization.ts`.

### 2026-07-09T18:47:56-05:00 — Quran Memorization — Longer Surahs seed
- Created `backend/prisma/seed-quran-longer-surahs.ts` exporting `seedQuranLongerSurahs()`.
- Covers 6 surahs from maktab CB5–CB8: Al-Kahf (first 10 ayahs only), Yasin, As-Sajdah, Al-Mulk, Al-Waqi'ah, Ar-Rahman. Surahs 93–94 intentionally excluded (already in Juz Amma course).
- Al-Kahf partial-surah handling: `fetchSurahData()` accepts an optional `limitToAyahs` param that slices all three arrays (arabic/translit/translation) client-side after the full API fetch. `surah.number === 18` triggers this path.
- Wired into `seed.ts`: import + `await seedQuranLongerSurahs()` immediately after `seedQuranMemorizationCourse()`.
- Pre-existing `tsc` errors in `program.service.ts` are unrelated; no errors introduced in new files.

### 2026-07-09T20:00:07.116-05:00 — Maktab program seed wiring
- `backend/prisma/seed-maktab-program.ts` follows the standalone/imported pattern used by `seed-weekend-path-tags.ts`: exported seed function plus `require.main === module` runner with Prisma disconnect in `finally`.
- Program-stage seeding is idempotent via `program.upsert()` and `programStage.upsert()` keyed by `slug` and `programId_stageNumber`; stage-course relations are normalized on re-run with `courses: { set: [], connect: [...] }`.
- Quran memorization is modeled as both a dedicated Stage 12 and a cross-cutting attachment on stages 1–11, so the same two Quran course slugs appear throughout the age ladder without needing a separate join model.
- Open-ended age bands in `ProgramStage` use explicit integer caps (`ageMax: 99`) because the schema requires concrete `Int` bounds for `ageMax`.
- User preference: place the program seed as the final step in `backend/prisma/seed.ts`, after all course seeds and `seedWeekendPathTags()`, because it depends on existing course slugs.
- Key file paths: `backend/prisma/seed-maktab-program.ts`, `backend/prisma/seed.ts`.

### 2026-07-04T00:23:33.053-04:00 — Resume progress payload ordering + learner fallback
- `CourseService.getMemberEnrollments()` now returns `unitProgress` ordered by `{ updatedAt desc, createdAt desc }` and includes `unit.orderIndex` metadata so consumers can choose the latest active unit deterministically.
- Resume behavior depends on activity recency, not just "first incomplete unit"; this prevents older partially-complete units from hijacking "continue where you left off."
- Frontend learner flow now always refreshes enrollments for the active member before computing resume state and sorts progress rows by timestamps.
- Key paths: `backend/src/services/course.service.ts`, `backend/src/__tests__/course.service.test.ts`, `frontend/src/pages/courses/CourseLearner.tsx`, `frontend/src/types/progress.ts`.

### 2026-07-09T18:43:25.089-05:00 — Program/ProgramStage/ProgramEnrollment schema + API

**What was done:**
- Added `LearningPath` (AFTER_SCHOOL, WEEKEND) and `Gender` (MALE, FEMALE) enums to schema.
- Added `Program`, `ProgramStage`, `ProgramEnrollment` models — the curriculum wrapper layer for Online Maktab.
- Extended `Unit` with `includedInPaths LearningPath[]` for weekend/after-school content filtering.
- Extended `FamilyMember` with `gender Gender?` and `programEnrollments ProgramEnrollment[]`.
- Extended `FlashCard` with `stageTag String?` and `subjectTag String?` for cross-stage du'ā/99 Names views.
- Extended `Course` with `programStages ProgramStage[]` M2M relation (Prisma implicit join table).
- Created `backend/src/services/program.service.ts` — listPrograms, getProgramBySlug, enrollMember, getMemberEnrollments, getStageSummary.
- Created `backend/src/routes/program.routes.ts` — 5 endpoints under `/api/v1/programs`.
- Wired routes into `backend/src/index.ts` and `backend/src/routes/index.ts`.
- Ran `prisma generate` — clean. Ran `tsc --noEmit` — zero errors.
- Did NOT run `prisma migrate` — migration to be handled separately.

**Key decisions:**
- `ProgramEnrollment.status` kept as `String` (not enum) for forward flexibility (ACTIVE/PAUSED/COMPLETED) — mirrors the `CourseEnrollment` pattern.
- `GET /api/v1/programs/:slug` routed as `/slug/:slug` to avoid regex collision with `/:programId` UUID routes sharing the same router.
- `getStageSummary` uses `currentStage.orderIndex` to compute `isCompleted`; this is safe even if stages are reordered because orderIndex drives the comparison.
- M2M between Course and ProgramStage is an implicit Prisma join table — no explicit join model needed until we need to store ordering or metadata on the relation.

**Key file paths:**
- `backend/prisma/schema.prisma` — enums and models added/extended
- `backend/src/services/program.service.ts`
- `backend/src/routes/program.routes.ts`
- `backend/src/index.ts` — programRoutes wired at `/api/v1/programs`

## Team Coordination — Sprint 1 Completion (2026-07-09T18:59)

**Scribe Update:** Sprint 1 batch completed with all agents unblocked.

### Decisions Documented
- #40 — Maktab Online School — 4 Key Decisions Confirmed (Foundation UI, Longer surahs, Du'ā audio, Teacher role Phase 2)
- #42 — Maktab Foundation Seed Files (Foundation 1 & 2 created, wired)
- #43 — Quran Memorization — Longer Surahs Seed (6 surahs covered, wired)
- #44 — Program/ProgramStage/ProgramEnrollment Schema + API (Documented above)

### Cross-Agent Status
- ✅ Backend ready: Schema generated, service layer complete, routes wired
- ✅ Frontend (Ibn Sina) ready: All UI components built, type-safe, gracefully fallback
- ✅ Seed scripts ready: F1/F2/Surahs wired into seed.ts in correct age order
- ✅ All TypeScript clean: tsc --noEmit passes for both backend and frontend

### Next Steps
1. Prisma migration scheduling (after schema review)
2. Integration test coverage (enrollment flow E2E)
3. Seed validation (verify stage/course/unit hierarchy)
4. Child-first UI build-out (Foundation UI, 3–4 weeks per Decision #40)

## Session 2026-07-09T19:14:32-05:00 — Weekend Path Content Tagging Script (Background Agent)

### What was completed
- Created `backend/prisma/seed-weekend-path-tags.ts` exporting `seedWeekendPathTags()`
- Script is fully idempotent: resets all `maktab-*` units to `includedInPaths: []` first, then applies restrictions
- Three categories restricted to `['AFTER_SCHOOL']`:
  1. Tārīkh units — matched by slug suffix `-tarikh` (CB1–CB8, 6B, 6G)
  2. Aqā'id units — matched by slug suffix `-aqaid` (CB1–CB8, 6B, 6G)
  3. Further Studies NW: `maktab-fs-faith`, `maktab-fs-identity`, `maktab-fs-money`, `maktab-fs-contemporary`
- Wired into `seed.ts` as a post-processing step after `seedGames()`, at the very end of content seeding
- `tsc --noEmit` passes clean; also supports standalone `npx ts-node prisma/seed-weekend-path-tags.ts`

### Key design decisions
- MVP uses unit-level tagging only. Per-topic splits within a subject (e.g., "Fiqh keeps first 4 of 8 topics") deferred — that requires splitting large subject units into smaller ones
- Reset-then-tag pattern for idempotency: `updateMany` with `startsWith: 'maktab-'` sets all to `[]` first, then three targeted `updateMany` calls apply AFTER_SCHOOL restrictions
- Used `endsWith: '-tarikh'` and `endsWith: '-aqaid'` rather than `contains` to avoid false positives from any future slug that might embed these strings mid-word

### Files touched
- **New:** `backend/prisma/seed-weekend-path-tags.ts`
- **Modified:** `backend/prisma/seed.ts` (import + call added after `seedGames()`)

### Agent Outcome
✅ **COMPLETED** — Background agent delivered working seed file, wired into pipeline, tsc clean.
