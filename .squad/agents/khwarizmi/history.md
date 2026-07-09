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

## Learnings

### 2026-06-23T09:49:39-05:00 — Quran memorization surah review units
- `backend/prisma/seed-quran-memorization.ts` now treats each surah as a sequence of ayah units followed by a final full-surah review unit, so downstream consumers should expect one extra unit per surah.
- Pattern: keep single-ayah HTML generation in `buildUnitContent()` and build aggregate review HTML in a separate helper (`buildSurahReviewContent()`) to avoid overloading the per-ayah path.
- Review units can safely reuse the existing everyayah URL scheme (`https://everyayah.com/data/khalefa_al_tunaiji_64kbps/{SSS}{VVV}.mp3`) for each ayah instead of introducing a new audio source format.
- Key file path: `backend/prisma/seed-quran-memorization.ts`.

### 2026-07-04T00:23:33.053-04:00 — Resume progress payload ordering + learner fallback
- `CourseService.getMemberEnrollments()` now returns `unitProgress` ordered by `{ updatedAt desc, createdAt desc }` and includes `unit.orderIndex` metadata so consumers can choose the latest active unit deterministically.
- Resume behavior depends on activity recency, not just "first incomplete unit"; this prevents older partially-complete units from hijacking "continue where you left off."
- Frontend learner flow now always refreshes enrollments for the active member before computing resume state and sorts progress rows by timestamps.
- Key paths: `backend/src/services/course.service.ts`, `backend/src/__tests__/course.service.test.ts`, `frontend/src/pages/courses/CourseLearner.tsx`, `frontend/src/types/progress.ts`.
