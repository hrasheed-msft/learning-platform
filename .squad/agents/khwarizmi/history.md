For detailed work history prior to 2026-07-09, see `.squad/agents/khwarizmi/history-archive.md`

Key prior work:
- 2026-05-16: Seed data (50+ courses, 62+ units, 450+ questions, 530+ flashcards)
- 2026-05-17: Games backend (all 26 game types with type-specific engines)
- 2026-05-17: Parent dashboard + child auth APIs
- 2026-05-18: Game engine collapse (26→9 types, migration written)
- 2026-05-20: TTS/audiobook integration, video generation pipeline
- 2026-05-21: Coursebook images → Azure Blob Storage
- 2026-06-20: Content slugs & versioning schema, anti-rush backend (Fisher-Yates, cooldown), migration + backfill script
- 2026-07-04: Resume progress payload ordering + learner fallback for active unit determination
- 2026-07-09: Foundation 1 & 2 seed files, weekend path tagging, flashcard tag backfill, quran longer surahs, program/programstage/programenrollment schema + API

## Quick Status (Most Recent)

**Program/ProgramStage/ProgramEnrollment Schema + API (2026-07-09):** ✅ COMPLETE
- Maktab curriculum abstraction: Program (named curriculum), ProgramStage (year/grade), ProgramEnrollment (child enrollment tracking)
- Added `LearningPath` (AFTER_SCHOOL, WEEKEND) and `Gender` (MALE, FEMALE) enums
- Added `Program`, `ProgramStage`, `ProgramEnrollment` models; extended `Unit` with `includedInPaths`, `FamilyMember` with `gender`, `FlashCard` with `stageTag`/`subjectTag`
- Created `program.service.ts` (listPrograms, getProgramBySlug, enrollMember, getMemberEnrollments, getStageSummary) and `program.routes.ts` (5 endpoints)
- Wired into main routes at `/api/v1/programs`; routes use `/slug/:slug` to avoid UUID regex collision
- Ran `prisma generate` clean, `tsc --noEmit` zero errors; migration pending team review
- Key decisions: `ProgramEnrollment.status` stays String for flexibility; M2M implicit join table; `ageMax: 99` for open-ended ranges

**Foundation 1 & 2 Seed Files (2026-07-09):** ✅ COMPLETE
- `seed-maktab-foundation1.ts`: ages 4–5, 3 units (quran/dua/99-names), 16 questions, 18 flashcards, category FIQH
- `seed-maktab-foundation2.ts`: ages 5–6 (ageLevels both EARLY_CHILD/CHILD), 3 units, 18 questions, 20 flashcards
- Wired before `seedMaktabCoursebook1` in seed.ts (correct age ordering); idempotent upsert pattern; flashcardIndex resets per unit
- All 17/14 du'ās per syllabus

**Quran Longer Surahs Seed (2026-07-09):** ✅ COMPLETE
- `seed-quran-longer-surahs.ts`: Al-Kahf (first 10 ayahs via client-side slice), Yasin, As-Sajdah, Al-Mulk, Al-Waqi'ah, Ar-Rahman
- Surahs 93–94 excluded (already in Juz Amma); Al-Kahf partial via `limitToAyahs` param on `fetchSurahData()`
- Wired into seed.ts after `seedQuranMemorizationCourse()`; ageLevels: ['CHILD', 'PRE_TEEN', 'TEEN'] for CB5–CB8 ages 10–14
- Same pattern/no new abstractions as Juz Amma seed (deliberate copy-and-adapt for independent readability)

**FlashCard Tag Backfill (2026-07-09):** ✅ COMPLETE
- `seed-flashcard-tags.ts`: idempotent post-processing backfill for `FlashCard.stageTag` and `FlashCard.subjectTag`
- Scopes to maktab flashcards by `course.slug startsWith 'maktab-'` (catches Foundation 1/2 despite unit slug pattern)
- Slug parsing explicit/fail-fast; Foundation mapping (F1/F2), Coursebook (CB*), Further Studies normalization (faith→AQAID, essentials/devotional/money/contemporary→FIQH)
- Idempotent via overwrite semantics; batched/chunked updates
- Wired into seed.ts immediately after `seedWeekendPathTags()`

**Weekend Path Content Tagging (2026-07-09):** ✅ COMPLETE
- `seed-weekend-path-tags.ts`: fully idempotent post-processing, resets all maktab units to `[]` then applies AFTER_SCHOOL restrictions
- Three categories restricted: Tārīkh (slug `-tarikh`), Aqā'id (slug `-aqaid`), Further Studies (faith/identity/money/contemporary)
- Uses `endsWith` pattern matching to avoid false positives; wired after `seedGames()` at end of content seeding
- Supports standalone `npx ts-node` execution

**Stage-Summary Bug Fix (2026-07-10):** ✅ COMPLETE
- Root cause: `getStageSummary` combined `select` AND `include` on the same `program` relation → Prisma throws; manifested as HTTP 500 on `/enrollment/:memberId/stage-summary`
- Fix: Rewrote `getStageSummary` to use ONLY `include` chains; also aligned response shape with frontend `StageProgressSummary` interface
- New shape: `{ stageId, stageName, totalCourses, completedCourses, overallProgress (0-100), subjectProgress[] }` — `subjectProgress` populated from `CourseEnrollment.progress` + `UnitProgress.completedAt` count
- Returns `null` (not array) when member has no active enrollment; matches `StageProgressSummary | null` on frontend
- Build: `tsc` clean; verified HTTP 200 with correct shape in prod (`stageId`, `stageName`, `subjectProgress[]` all populated)
- Commit: `cbacd5b` — pushed to main; container redeployed ~7 min after push

**ageMin/ageMax on currentStage (2026-07-10):** ✅ COMPLETE
- Root cause: `getMemberEnrollments` `currentStage` select omitted `ageMin`/`ageMax` → frontend `GradeDashboard.tsx` showed "Ages –"
- Fix: Added `ageMin: true, ageMax: true` to `currentStage` select in both `getMemberEnrollments` and `enrollMember` (consistency); additive-only, no API surface rename
- Build: `tsc` clean; commit `3019bc3` pushed to main
- Verified: API returns `"ageMin": 4, "ageMax": 5` on `currentStage`; E2E shows "Ages 4–5" correctly; 1 test passed in 14.2s

- `ProgramStage` select fields must be enumerated explicitly — omitting a field from `select: {}` silently drops it from the response; always cross-check select against what the frontend reads
## Learnings

- Idempotent seed pattern: upsert-based with explicit slug/composite keys for safe re-runs and student data preservation
- M2M implicit join tables adequate until metadata on relations is needed
- Open-ended age bands modeled with explicit integer caps (e.g., `ageMax: 99`)
- Program seeding is final step — depends on all course slugs existing first
- Backend ready for Sprint 1: schema generated, services complete, routes wired
- Prisma forbids mixing `select` and `include` on the same relation in a single query — always use one or the other; prefer `include` for nested relations, `select` when you need column-level control at a leaf
- `CourseEnrollment.progress` (Int 0-100) + `UnitProgress.completedAt` (nullable DateTime) are the canonical progress signals; unit completion = `completedAt IS NOT NULL`
- Manually-created Prisma migration directories work with `migrate deploy`, BUT if you push a migration and then change its SQL in a subsequent commit, Prisma's `_prisma_migrations` checksum will diverge. Fix: restore the original SQL and create a new migration for the corrected change.
- `User.selfMemberId` is not set during registration in this codebase — do NOT rely on it to find the parent's FamilyMember. Use `familyId + isAccountOwner=true` to find the account-owner member, or store parent-level data on the `User` model directly.
- Some families may have NO account-owner FamilyMember (e.g., accounts created before that pattern was established). Prefer User model for parent-scoped data (PIN, settings) rather than FamilyMember.
- For backfill scripts: the local `.env` points to `localhost:5432` (dev DB). To run against prod, set `DATABASE_URL` from the Azure Container App secret: `az containerapp secret show --secret-name database-url`.
- Blob upload pattern for seeds: do a TWO-STEP upsert — (1) keep `content:` in the `create:` block, do NOT set `content:` in the `update:` block, (2) after the upsert, check `isBlobStorageAvailable() && unit.content && !unit.contentUrl` and call `uploadUnitContent` + `prisma.unit.update`. This keeps seeds idempotent and prevents re-populating the DB column after migration.
- `@azure/storage-blob` was already in `backend/package.json` at `^12.31.0` — no install needed.
- The `content` column is kept (not dropped) after adding `contentUrl` to allow rollback and gradual migration. A future cleanup migration will drop it once all content is confirmed in blob storage.

**Program→Course Enrollment Bridge (2026-07-10):** ✅ COMPLETE
- `program.service.ts` `enrollMember()` now wraps creation in `$transaction`, fetches starting stage's published courses, `createMany` `CourseEnrollment` rows with `skipDuplicates: true`. Debug log shows count.
- Backfill script `backend/scripts/backfill-program-course-enrollments.ts`: idempotent, iterates active `ProgramEnrollment` rows, creates missing `CourseEnrollment` rows.
- Backfill ran against prod: 5 rows created across 2 enrollments (Ibn Sharif Foundation 1: 3/3, second member CB2: 2/3 already existed).
- Verified: `/courses/enrollments/member/b32bf819-1662-47c5-b80f-2e2ca6bd26ab` returns 3 Maktab Foundation 1 courses.

**Parent PIN Gate (2026-07-10):** ✅ COMPLETE
- Schema: added `parentPinHash`, `pinSetAt`, `pinAttempts`, `pinLockedUntil` to `User` model (not FamilyMember — see learnings).
- Migration: `20260710201500_add_parent_pin` (to family_members, already applied) + `20260710210000_move_parent_pin_to_user` (moves to users, cleans up family_members).
- `parent-pin.service.ts`: `setPin`/`getPinStatus`/`verifyPin` — bcrypt cost 10, weak-PIN set rejection, 3-attempt/30s lockout stored on User row.
- Routes added to `auth.routes.ts`: `POST /auth/parent-pin`, `POST /auth/parent-pin/verify`, `GET /auth/parent-pin/status`.
- Verified in prod: `GET /status` → `{hasPin:false}`, `POST` (pin 5823) → `{success:true}`, `GET /status` → `{hasPin:true}`, verify correct → `{verified:true}`, verify wrong → `{verified:false,remainingAttempts:2}`.

**Phase 2 Stage Summary — Next-Unit + Activity/Streak (2026-07-11):** ✅ COMPLETE
- Items #5 (next-unit surfacing) and #6 (activity data) from Khaldun's proposal — additive-only.
- `getStageSummary()` rewritten to 4 batched queries (zero N+1): enrollment+stage, courseEnrollments, unitProgress IN enrollmentIds, units IN courseIds. All aggregation in JS.
- New per-course fields: `nextUnit: { id, title, orderIndex, courseId, courseSlug } | null` (respects `includedInPaths` + `enrollment.path`), `lastActivityAt: ISO | null`, `unitsCompletedLast7Days: number`.
- New top-level fields: `nextUp: { subjectSlug, courseId, unit } | null` (primary Continue CTA pointer), `streak: { current, longest, lastActivityAt }` (UTC calendar days), `weeklyActivity: [{ date, unitsCompleted }] × 7 days`.
- Schema: added `@@index([enrollmentId, completedAt])` to `unit_progress` table; migration `20260711120000_add_unit_progress_activity_index`.
- TypeScript types `StageProgressSummary`, `SubjectProgressEntry`, `NextUnitShape` exported from `program.service.ts` for Ibn Sina.
- Fresh-enrollment path verified: nextUnit = first unit of first course, streak = 0, weeklyActivity = 7 zeros.
- Commit: `a60c291` — pushed to main; verified in prod after container redeploy (~4 min).

**Enrollment Stage-Move Endpoint + Live Data Fix (2026-07-13):** ✅ COMPLETE
- Added `ProgramService.moveEnrollmentStage(enrollmentId, stageNumber)` to `program.service.ts`:
  1. Loads enrollment with currentStage courses + program.stages
  2. Resolves target stage by stageNumber; errors if same stage or not found
  3. Transaction: updates `currentStageId`, deletes old-stage-only CourseEnrollments (shared courses like Quran preserved), creates missing new-stage CourseEnrollments (`skipDuplicates: true`)
  4. Returns updated enrollment with `currentStage` select
- Added `PATCH /api/v1/programs/enrollment/:enrollmentId/stage` to `program.routes.ts`:
  - Protected: `authenticate + requireActiveMember + requireParentRole`
  - Validation: `enrollmentId` UUID, `stageNumber` positive integer
- CI/CD pipeline failing (3/3 most recent runs) → endpoint not yet deployed
- Created one-shot migration script `backend/prisma/migrate-fix-enrollment-stages.ts`:
  - Fixes Ibn Sharif (b32bf819) + Ibn Sharif 2 (c73a8265): both moved Foundation 1 / CB2 → CB5 (stageNum=7)
  - Idempotent (skips if already on target stage); logs all changes
  - Run: `DATABASE_URL="<prod_url>" npx ts-node backend/prisma/migrate-fix-enrollment-stages.ts`
- `tsc --noEmit` passes with zero errors
- Learnings: insert new class methods BEFORE the class closing brace, not after it

**Unit Content → Azure Blob Storage Migration (2026-07-17):** ✅ COMPLETE
- Root cause: `units.content @db.Text` stores full HTML/Arabic content inline in PostgreSQL — primary cost driver
- Schema: added `contentUrl String?` to `Unit` model; `content` retained as deprecated nullable fallback
- Migration: `20260717_add_unit_content_url/migration.sql` — `ALTER TABLE "units" ADD COLUMN "contentUrl" TEXT`
- New helper: `backend/prisma/helpers/blob-upload.ts` — `uploadUnitContent()`, `isBlobStorageAvailable()`
- New script: `backend/prisma/migrate-content-to-blob.ts` — idempotent, `--dry-run` / `--no-clear` flags
- Infra: Added `Standard_LRS StorageV2` storage account + `course-content` blob container (public Blob access, CORS GET *) to `infra/resources.bicep`; KV secret + Container App env var wired
- API: `getUnit()` now returns `content.contentUrl` alongside `content.text` (backward compatible)
- Seeds: Applied two-step upsert+blob pattern to top 5 files (further-studies-nw, CB3, CB1, CB2, CB4); documented pattern in seed.ts comment block for remaining 32 files
- `@azure/storage-blob ^12.31.0` already in package.json

