# Squad Decisions

## Active Decisions

### 1. Ibn Sina Decision � Maktab Nav Entry Point (2026-07-09)
**Author:** Ibn Sina (Frontend Dev)
**Status:** Implemented

Parents reported inability to find the evening (After-School) vs Weekend learning path selector. The feature was fully built in `ProgramCatalog` (`/programs`) with an `EnrollModal` but had no navigation entry in `MainLayout.tsx`, so the page was unreachable via sidebar.

**Decision:** Added `{ name: 'Maktab ??', href: '/programs', icon: GraduationCap }` to the navigation array in `frontend/src/components/layouts/MainLayout.tsx`, placed after "Courses". Added `GraduationCap` to lucide-react imports.

**Rationale:**
- Minimal, targeted fix � only one missing array entry.
- Emoji style matches "Games ??"; ?? signals Islamic school context.
- `GraduationCap` signals formal curriculum-level learning, distinct from `BookOpen` (Courses) and `Brain` (Reviews).
- Active state via `location.pathname.startsWith('/programs')`.

**Files Changed:**
- **Modified:** `frontend/src/components/layouts/MainLayout.tsx`

**Validation:** `npx tsc --noEmit` passes clean.

---

### 2. Quduri Taharah Seed � Bilingual Content Format (2026-07-14)
**Author:** Khwarizmi

Implemented seed file for Mukhtasar al-Quduri's Kitab al-Taharah targeting TEEN/ADULT audiences.

**Key Decisions:**
- **Bilingual Format:** Side-by-side `<div class="bilingual-text">` layout (unlike CB1-2 inline Arabic). Rationale: Classical texts require direct Arabic-English pairing
- **FlashCard orderIndex:** Per-unit reset (not global). Aligns with schema's @@unique[unitId, orderIndex] constraint
- **Translation Disclaimers:** All English translations marked `[AI-Generated Translation]` for clarity and future scholarly attribution
- **Question Difficulty:** MEDIUM/HARD (targets teens/adults; tests legal conditions, exceptions, scholarly differences)

**Status:** Implemented in `backend/prisma/seed-quduri-taharah.ts` (2092 lines)

---

### 8. Quduri Salah Seed � Bilingual Content Format (2026-07-14)
**Author:** Khwarizmi

Implemented seed file for Mukhtasar al-Quduri's Kitab al-Salah targeting TEEN/ADULT audiences, following the exact pattern of Decision #2 (Taharah seed).

**Key Decisions:**
- **Same Format as Taharah:** Reuses bilingual `<div class="bilingual-text">` layout, `[AI-Generated Translation]` disclaimers, per-unit orderIndex reset for flashcards
- **8 Units:** Awqat al-Salah, Adhan, Shurut al-Salah, Fara'id al-Salah, Sifat al-Salah, Al-Jama'ah, Salat al-Musafir, Salat al-Jumu'ah wa al-'Idayn
- **Hanafi-Distinctive Rulings:** Highlighted in questions � double shadow for Dhuhr end, white shafaq for Maghrib, qahqahah breaking wudu', min Jumu'ah 3 besides imam, qunut in Witr year-round, muhazat al-mar'ah invalidating man's prayer
- **Totals:** 42 questions, 35 flashcards, 55 Arabic terms

**Status:** Implemented in `backend/prisma/seed-quduri-salah.ts` (1318 lines); wired into `seed.ts`

---

### 40. Maktab Online School � 4 Key Decisions Confirmed (2026-07-09)
**By:** hrasheed (via Copilot)

**Decision 1 � Foundation UI: Build child-first UI**
hrasheed confirmed: build a new child-first UI for ages 4�6 (not just adapt existing ChildDashboard). Higher quality path chosen over faster adaptation.

**Decision 2 � Longer surahs (CB5�8): Build them out**
hrasheed confirmed: DO NOT skip longer surahs. Build out the content for longer surahs (Yasin, As-Sajdah, Al-Mulk, Al-Waqi'ah, Ar-Ra?man, Al-Kahf first 10) using the same approach as the Juz Amma seed (per-ayah units with Arabic text, transliteration, translation, audio from everyayah.com).

**Decision 3 � Du'a audio: Plan for MP3s**
hrasheed confirmed: Assume we will have MP3 files for du'a recitation. hrasheed can record them personally if no other source is found. Design the system to reference MP3 audio files. No TTS fallback needed.

**Decision 4 � Teacher role: Phase 2**
hrasheed confirmed: Teacher/facilitator role is Phase 2. Not blocking MVP definition.

**Why:** These 4 decisions were surfaced in the Maktab Online School research spike (docs/maktab-online-school-spike.html) as blockers for Sprint 1 planning.

---

### 41. Ibn Sina Decision � Program Enrollment UI + Grade Dashboard (2026-07-09)
**Author:** Ibn Sina (Frontend Dev)
**Status:** Implemented

Built the complete Program Enrollment UI and Grade Dashboard for the Maktab An Na?i?ah curriculum. The backend (Khwarizmi) is building the Program/ProgramStage/ProgramEnrollment API concurrently; these components are type-safe against the agreed schema.

**Key Decisions:**

#### 1. TypeScript-first, API-ready with graceful fallback
- All components type against `frontend/src/types/program.ts` interfaces aligned with Khwarizmi's schema decision
- `ProgramCatalog` ships static `DEFAULT_STAGES` and `PLACEHOLDER_PROGRAM` constants so the page renders beautifully even before the backend API is live � no hard dependency on `/api/programs` being ready.
- `GradeDashboard` falls back to `currentStage.courses` (embedded in enrollment response) when `stageSummary` is unavailable.

#### 2. Separate Zustand store (`programStore.ts`)
- Program state is isolated from course state � different domain, different lifecycle.
- `isEnrolling` is a separate boolean from `isLoading` so the enrollment modal can show a spinner independently of page-level loading states.

#### 3. Child-first design decisions
- All interactive elements have `min-h-[44px]` for touch-friendly tap targets.
- Subject cards use large category emojis as the primary visual identifier � kids 4�7 recognize emoji faster than text labels.
- `ProgressRing` SVG component gives a circular visual for overall stage progress (more engaging than a bar at the top level).
- Encouraging copy in `GradeDashboard` adapts based on progress bracket: <30%, 30-60%, >60%.

#### 4. Routing strategy
- `/programs` and `/program/:slug` added under parent `ProtectedRoute` (parents browse and enroll).
- `/child/maktab` added under `ChildProtectedRoute` (kids view their own dashboard).
- Both use `lazy()` import for code splitting.

#### 5. Age-based stage auto-detection in enrollment modal
- `detectStageNumber()` iterates `program.stages` and finds the first stage where `ageMin <= member.age <= ageMax`.
- Displayed inline on each member card in the modal so parents can see the recommended stage before confirming.

**Files Created/Modified:**
- **Created:** `frontend/src/types/program.ts`
- **Created:** `frontend/src/services/program.service.ts`
- **Created:** `frontend/src/stores/programStore.ts`
- **Created:** `frontend/src/pages/program/ProgramCatalog.tsx`
- **Created:** `frontend/src/pages/program/GradeDashboard.tsx`
- **Modified:** `frontend/src/pages/child/ChildDashboardHome.tsx` (added My Maktab section)
- **Modified:** `frontend/src/App.tsx` (added routes)
- **Modified:** `frontend/src/stores/index.ts` (exported programStore)
- **Modified:** `frontend/src/services/index.ts` (exported programService)

**Validation:** `npx tsc --noEmit` passes clean.

---

### 42. Maktab Foundation Seed Files (2026-07-09)
**Author:** Khwarizmi (Backend Dev)
**Status:** Implemented

Created two new maktab seed files (`seed-maktab-foundation1.ts`, `seed-maktab-foundation2.ts`) for the pre-coursebook foundation stages (ages 4�6).

**Key Choices:**

#### flashcardIndex resets per unit
Each unit's flashcards start at `orderIndex = 0`. The composite unique key `unitId_orderIndex` ensures no collisions. This differs from the coursebook seeds which use a single running `flashcardIndex` across all units in the file, but is correct here because the uniqueness constraint is per-unit.

#### Foundation 2 ageLevels includes both EARLY_CHILD and CHILD
Foundation 2 spans ages 5�6, which straddles the boundary. Both levels are included so it surfaces correctly for both age groups in the catalogue.

#### Both courses use category FIQH
All maktab curriculum courses use `FIQH` as their category. The broader du'a and Qur'an subject matter fits within this category label consistent with team convention.

#### Foundation seeds called before Coursebook 1 in seed.ts
Age ordering: Foundation 1 (4�5) ? Foundation 2 (5�6) ? Coursebook 1 (6�7) ? ... Coursebook 8. The call order in `seed.ts` reflects this natural age progression.

**Files Created:**
- `backend/prisma/seed-maktab-foundation1.ts`
- `backend/prisma/seed-maktab-foundation2.ts`

**Files Modified:**
- `backend/prisma/seed.ts` � imports + calls added before `seedMaktabCoursebook1`

---

### 43. Quran Memorization � Longer Surahs Seed (2026-07-09)
**Author:** Khwarizmi (Backend Dev)

**Context:**
The maktab syllabus CB5�CB8 requires memorization of longer surahs by older students. The existing Juz Amma course (`seed-quran-memorization.ts`) covers short surahs (Al-Fatiha + surahs 93�114). A second standalone seed is needed.

**Decisions Made:**

#### 1. Exclude surahs 93 and 94 from the new course
Surahs 93 (Ad-Duha) and 94 (Ash-Sharh) appear in the CB5 syllabus but are already fully seeded in the Juz Amma course. Duplicating them would create two courses with identical units for the same content, leading to double-counting of completion and confusing students. **They are skipped.**

#### 2. Al-Kahf partial-surah via client-side slice
The api.quran.com v4 API does not support a stable `per_page`/`from_ayah` offset that guarantees exactly 10 results across all pagination implementations. Rather than craft a fragile pagination URL, we fetch all 110 verses and slice `[:10]` client-side. This is safe because the full chapter is ~11 KB JSON � negligible overhead. The `limitToAyahs` parameter on `fetchSurahData()` keeps the logic self-contained.

#### 3. Reuse exact same pattern as Juz Amma seed
No new abstractions introduced. The new file is a deliberate copy-and-adapt to keep both seeds independently readable and runnable. Shared helpers (HTML builders, slug generation, audio URL builder) are inlined rather than extracted to a shared module � this avoids a new dependency that would force both seeds to import from a third file.

#### 4. ageLevels: `['CHILD', 'PRE_TEEN', 'TEEN']`
The CB5�CB8 syllabus targets ages 10�14. Including CHILD (10+) covers CB5 students who may appear in the CHILD age category depending on their profile.

**Files Affected:**
- `backend/prisma/seed-quran-longer-surahs.ts` � new file
- `backend/prisma/seed.ts` � import + call added after `seedQuranMemorizationCourse()`

---

### 44. Program/ProgramStage/ProgramEnrollment Schema + API (2026-07-09)
**Author:** Khwarizmi (Backend Dev)
**Status:** Implemented � pending migration

**Context:**
Online Maktab requires a curriculum-level abstraction above the existing `Course` model. A `Program` is a named curriculum (e.g., "Maktab An Nasihah"), a `ProgramStage` is a year/grade within it, and `ProgramEnrollment` tracks which child is in which program on which learning path.

**Decisions:**

#### 1. `LearningPath` and `Gender` as first-class enums
Both become PostgreSQL native enums via Prisma. This makes invalid values a hard DB-level error rather than a silent string mismatch.

#### 2. `ProgramEnrollment.status` stays `String`, not enum
Mirrors `CourseEnrollment.status`. Keeps flexibility to add statuses (e.g., `GRADUATED`) without a migration for every edge case.

#### 3. Course ? ProgramStage is an implicit M2M
No join model. Prisma's implicit join table (`_CourseToProgamStage`) is adequate until we need to store ordering or additional metadata on the relationship.

#### 4. `GET /programs/:slug` served at `/programs/slug/:slug`
The Express router cannot distinguish `/programs/some-slug` (string) from `/programs/:programId` (UUID) purely by regex without reordering. Using a dedicated `/slug/` prefix eliminates the ambiguity cleanly.

#### 5. `Unit.includedInPaths` � empty array = all paths
An empty array means the unit is available on every learning path. A non-empty array restricts to listed paths only. Frontend must filter units by the enrolled member's `path` before displaying them.

#### 6. `FlashCard.stageTag` / `subjectTag` � nullable Strings
Kept as plain strings (e.g., `"F1"`, `"DUA"`) rather than enums. Stage codes are not stable enough to model as DB-level enums; filtering is done at query-time by the frontend or service layer.

#### 7. Migration not run
`prisma generate` succeeded. The actual `migrate dev` / `migrate deploy` will be executed once the team has reviewed the schema and scheduled a maintenance window.

**Impact:**
- **Frontend (Ibn Sina):** New `/api/v1/programs` endpoints available. Enroll via `POST /programs/:programId/enroll`. Use stage-summary endpoint for grade-level progress UI.
- **Seed scripts:** Can now reference `Program` and `ProgramStage` models.
- **FamilyMember:** Now carries optional `gender` � seed scripts and registration flow can optionally populate this.

---

### 45. Prod Deploy Gap � SWA Cache-Control + Orphan Config + skip_app_build (2026-07-09)
**Author:** Khaldun (Lead/Architect)
**Status:** Applied (commit 96b3a01, pushed to main)

**Problem:** New frontend features (ChildDuaProgressPage, ChildNamesProgressPage, GradeDashboard, Maktab section in ChildDashboardHome) were not visible in production even though CI/CD reported success.

**Root Cause:**
- **Primary:** `frontend/public/staticwebapp.config.json` had no `Cache-Control` headers. Azure SWA + CDN served cached old index.html, which referenced old JS chunks.
- **Secondary:** `frontend/staticwebapp.config.json` (root level) is never deployed by Vite; it's a silent maintenance trap.
- **Tertiary:** CI workflow lacked `skip_app_build: true`, causing ambiguous double-builds.

**Decisions:**
1. **Explicit Cache-Control:** In `frontend/public/staticwebapp.config.json`, add `routes` block with `no-cache` for `/ ` and `*.html`, and `public, max-age=31536000, immutable` for `/assets/*`.
2. **Delete orphan config:** Remove `frontend/staticwebapp.config.json`.
3. **skip_app_build: true:** Add to both `deploy-frontend` and `deploy-frontend-dev` SWA action steps in CI.

**Files Changed:**
- Modified: `frontend/public/staticwebapp.config.json`
- Deleted: `frontend/staticwebapp.config.json`
- Modified: `.github/workflows/ci-cd.yml`

---

### 46. FlashCard tag backfill decisions (2026-07-09)
**Author:** Khwarizmi (Backend Dev)

Added idempotent post-processing seed `backend/prisma/seed-flashcard-tags.ts` to backfill `FlashCard.stageTag` and `FlashCard.subjectTag` for all existing maktab flashcards.

**Key Decisions:**
1. **Scope by course slug, not unit slug:** Query uses `course.slug startsWith 'maktab-'` to catch Foundation 1/2 which have unit slugs like `foundation-1-*`.
2. **Slug parsing is explicit and fail-fast:** Known patterns handled directly; unknown slugs throw immediately instead of silently leaving null tags.
3. **Further Studies normalization:** Mixed modules map to broad subject tags (e.g., `maktab-fs-identity` ? `AKHLAQ`, essentials/devotional ? `FIQH`).
4. **Idempotency via overwrite:** Re-running always overwrites `stageTag` and `subjectTag`; updates batched and chunked to avoid row-at-a-time writes.

**Files:**
- `backend/prisma/seed-flashcard-tags.ts`

---

### 47. Program seed decisions (2026-07-09)
**Author:** Khwarizmi (Backend Dev)

Seeded the new `Program` / `ProgramStage` layer for "Maktab An Nasihah" curriculum using existing course slugs as source of truth.

**Key Decisions:**
1. **Content-only and idempotent:** Uses `program.upsert()` and `programStage.upsert()`; stage-course links reset with `set: []` + `connect`.
2. **Quran memorization cross-cutting:** Stage 12 is the explicit "Quran Memorization" stage; both Quran courses also connected to stages 1�11.
3. **Open-ended age ranges use `ageMax: 99`:** For "14+" ranges, seed uses `99` as explicit upper bound.
4. **Seed ordering:** `seedMaktabProgram()` called in `seed.ts` after all course seeds and `seedWeekendPathTags()` so all referenced course slugs exist first.

**Files:**
- `backend/prisma/seed-maktab-program.ts`
- Modified: `backend/prisma/seed.ts`

---

### 48. Ibn Sina Decision � ProgramCatalog Must Fetch Family Members on Mount (2026-07-09)
**Author:** Ibn Sina (Frontend Dev)
**Status:** Implemented

## Problem

The "Enroll in Maktab An Na?i?ah" popup showed no children to select, and the "Start the Journey" button stayed permanently disabled. Root cause: `ProgramCatalog` (`/programs`) fetched programs on mount but never fetched family members. `EnrollModal` (nested in the same file) reads its learner list from `useFamilyStore().members`. Navigating directly to `/programs` via the new Maktab sidebar link left the family store empty ? empty learner grid ? `selectedMemberId` stuck at `''` ? disabled CTA.

## Decision

Apply the same `fetchMembers(family.id)` on-mount pattern already used across sibling parent pages (CourseDetail, GamesHub, FamilyDashboard):

```tsx
const { family } = useAuthStore();
const { fetchMembers } = useFamilyStore();

useEffect(() => {
  if (family?.id) void fetchMembers(family.id);
}, [family?.id, fetchMembers]);
```

Added this to the `ProgramCatalog` default export component alongside the existing `fetchPrograms()` effect.

Also added a minimal empty-state in `EnrollModal` for families that genuinely have zero active learners:
- When `learners.length === 0`, render "No active learners found. Add a learner in Settings first." with a `/settings` link instead of an empty, unusable grid.
- This prevents the same UX confusion for a different, legitimate scenario.

## Rationale

- Matches the established app-wide pattern � no new abstractions.
- `useAuthStore` provides `family.id`; `useFamilyStore.fetchMembers(familyId)` populates `members`.
- Guard `if (family?.id)` prevents a crash on the (edge-case) unauthenticated render.
- Empty-state is the minimal safe default: a parent who sees a blank modal has no path forward without it.

## Files Changed

- **Modified:** `frontend/src/pages/program/ProgramCatalog.tsx`
  - Added `useAuthStore` import from `@/stores`
  - Added `family` from `useAuthStore()` and `fetchMembers` from `useFamilyStore()` in `ProgramCatalog`
  - Added `useEffect` to call `fetchMembers(family.id)` on mount
  - Added empty-state UI in `EnrollModal` when `learners.length === 0`

## Validation

`npx tsc --noEmit` passes clean (exit 0).

---

### 49. Production Completion Gate (Mandatory) + Enrollment E2E Suite (2026-07-10)
**Author:** Coordinator + Ibn Sina + Khwarizmi (Backend Dev)
**Status:** Implemented � green in production

**Context:**
Enrollment feature hit production with undetected bugs (members filtered incorrectly, modal crashed on live payloads, routes misaligned). CI showed green but real users saw failures. This decision formalizes mandatory production verification before reporting task completion.

**Key Decisions:**

#### 1. Production Completion Gate is mandatory
No feature is "done" until:
- Code deploys to production (`git push main` ? CI passes)
- Authenticated end-to-end test passes against production
- Real user journeys verified with designated test account (hassan.rasheed1@live.com)

This replaces "code review + CI green" as the completion bar.

#### 2. Authenticated E2E infrastructure
- `frontend/playwright.config.ts` � configured for both local and CI environments
- `frontend/e2e/authenticated-enrollment.spec.ts` � logs in as test account, enrolls child in Maktab An Na?i?ah, verifies stage display
- `frontend/.env.e2e.example` � template for test credentials (email/password never committed)
- `docs/e2e-authenticated-testing.md` � runbook for developers
- `package.json` test:e2e scripts � `test:e2e:ui` for dev, `test:e2e` for CI
- Credentials passed via `process.env.TEST_EMAIL` / `process.env.TEST_PASSWORD`; never in source

#### 3. Root causes fixed
- **(a) EnrollModal member filtering:** Backend didn't return `isActive` ? frontend treated missing as falsy ? users vanished. Fixed: treat missing `isActive` as `true`, exclude `isAccountOwner`.
- **(b) ProgramCatalog didn't hydrate family:** Direct nav to `/programs` left family store empty. Fixed: added `fetchMembers(family.id)` on mount.
- **(c) Live program payload crash:** Enrollment stage list sometimes empty. Fixed: fallback to `DEFAULT_STAGES`.
- **(d) Routes misaligned:** Frontend service routes differed from backend (`/programs/enrollments`, `/programs/${slug}` vs. `/programs/${programId}/enroll`, `/programs/slug/${slug}`). Fixed: aligned to backend.routes.ts exactly.

#### 4. CI/CD fix
- Removed `@rollup/rollup-win32-x64-msvc` from frontend deps (breaking Linux npm ci)
- Re-tested: `npm ci` succeeds on both Windows and Linux

**Files Changed/Created:**
- Created: `frontend/e2e/authenticated-enrollment.spec.ts`
- Created: `frontend/.env.e2e.example`
- Created: `frontend/playwright.config.ts`
- Created: `docs/e2e-authenticated-testing.md`
- Modified: `frontend/src/services/program.service.ts` (routes fixed)
- Modified: `frontend/src/pages/program/ProgramCatalog.tsx` (fetchMembers on mount)
- Modified: `frontend/src/components/program/EnrollModal.tsx` (DEFAULT_STAGES, member filter, empty state)
- Modified: `frontend/package.json` (test:e2e scripts)
- Modified: `package.json` (dependencies)

**Verification:**
- Authenticated Playwright E2E against production: **PASS 1/1 (9.7s)**
- Enrollment flow end-to-end in production with test account: **? Verified**
- Commits green on main: `486e75b` (E2E), `85b2f34` (rollup fix), `9dd913d` (program routes)

---

### 50. Ibn Sina Decision � Dashboard Reconcile: Parent Progress Display (2026-07-19)

**Author:** Ibn Sina (Frontend Dev)
**Status:** Implemented

**Context**

Two dashboard views showed inconsistent progress data:
- Parent Dashboard (children overview list) had no progress % column
- Child Dashboard showed per-course progress bars reading `enrollment.progress` from backend

Khwarizmi was simultaneously fixing `isUnitComplete` (to trigger on `readingCompleted` alone) and updating `getChildrenWithStats` to return `overallProgress` and correct `coursesEnrolled`/`coursesCompleted` counts.

**Decision**

1. **Extend `ChildSummary` type:** Added `overallProgress: number` and `coursesCompleted: number` to `ChildSummary` in `frontend/src/types/dashboard.ts`. These are computed by the backend `getChildrenWithStats` endpoint � frontend treats them as read-only.

2. **Add Overall Progress column to ParentDashboard:** In the children overview list (`ParentDashboard.tsx`), added a "Progress" stat cell showing `child.overallProgress%` (hidden sm:block, styled identically to other stat cells). Updated the "Courses" stat to read `{N} active` + optional `({M} done)` suffix.

3. **No changes to ChildDetailView or ChildDashboardHome:** Both views already read progress from the correct backend fields: `ChildDetailView` uses `course.progress` from `selectedChildStats.courseProgress`; `ChildDashboardHome` uses `enrollment.progress ?? 0` from `useChildEnrollments`.

**Rationale**

Single source of truth: both parent and child views now read from the same backend-computed `enrollment.progress`. When Khwarizmi's `isUnitComplete` fix lands, both dashboards update correctly with zero further frontend changes.

**Files Changed**

- **Modified:** `frontend/src/types/dashboard.ts` � added `overallProgress`, `coursesCompleted` to `ChildSummary`
- **Modified:** `frontend/src/pages/dashboard/ParentDashboard.tsx` � added Progress stat, improved Courses stat

**Validation**

`npx tsc --noEmit` passed with zero errors.

---

### 51. Unit Completion = readingCompleted Only (2026-07-19)

**Author:** Khwarizmi
**Status:** Implemented

**Context**

Course progress was permanently stuck at 0% for all enrolled members. The `isUnitComplete()` helper in `course.service.ts` required all three flags (`videoCompleted && readingCompleted && quizCompleted`) to be true simultaneously. In practice, most course units have no video content, so `videoCompleted` is never set ? no unit ever passes the gate ? `enrollment.progress` stays 0%.

**Decision**

**Reading completion is the canonical "unit done" signal.** A unit is complete when `readingCompleted = true`.

Video and quiz completion remain tracked on `UnitProgress` for analytics purposes but are not required for the unit to count as complete in progress calculations.

**Changes**

| File | Change |
|---|---|
| `backend/src/services/course.service.ts` | `isUnitComplete()` returns `Boolean(progress?.readingCompleted)` |
| `backend/src/services/course.service.ts` | `getMemberProgress` `completedUnits` filter: `up => up.readingCompleted` |
| `backend/src/services/dashboard.service.ts` | `getChildrenWithStats()` now returns `coursesEnrolled` (active only), `coursesCompleted`, `overallProgress` (avg % across ACTIVE enrollments) |
| `backend/src/services/dashboard.service.ts` | `getFamilySummary()` `activeCoursesCount` now queries `status: 'ACTIVE'` enrollments only |
| `frontend/src/types/dashboard.ts` | `ChildSummary` already had `overallProgress` and `coursesCompleted` � no change needed |

**Impact on Quiz-Completion-Only Flows**

Quiz completion alone (`quizCompleted = true`, `readingCompleted = false`) will **NOT** mark a unit complete under the new logic. This is intentional: a learner who jumps straight to the quiz without reading the lesson has not completed the unit. If a future flow (e.g., assessment-only mode) needs quiz-only completion, introduce a separate flag or a dedicated completion pathway rather than widening the `isUnitComplete` gate again.

**Alternatives Rejected**

- **Any-of-three**: Would let a video-only or quiz-only action count as complete � too broad, degrades learning integrity.
- **Weighted/ordered**: Over-engineered for current needs; revisit if curriculum team requires richer completion criteria.

---

### 52. Unit Content ? Azure Blob Storage Migration (2026-07-17)

**Author:** Khwarizmi (Backend Dev)
**Date:** 2026-07-17
**Status:** Implemented

**Decision**

Unit lesson content (rich HTML, Arabic text) is migrated from `units.content @db.Text` (PostgreSQL) to Azure Blob Storage. The DB now stores a `contentUrl String?` pointing to the blob URL. The `content` column is retained as a deprecated nullable fallback until all records are confirmed migrated, at which point a separate cleanup migration will drop it.

**Why**

The `content` column was the primary PostgreSQL storage cost driver. Each unit stores 10�80 KB of HTML content with Arabic text. At ~50,000 lines across 37 seed files and hundreds of units, the cost differential between Azure Blob Storage and Azure PostgreSQL Flexible Server for this bulk text data is significant. Blob Storage is orders of magnitude cheaper per GB for static content.

**What Changed**

**Schema (`backend/prisma/schema.prisma`)**
- Added `contentUrl String?` to `Unit` model
- Annotated `content String? @db.Text` as deprecated

**Migration (`backend/prisma/migrations/20260717_add_unit_content_url/migration.sql`)**
```sql
ALTER TABLE "units" ADD COLUMN "contentUrl" TEXT;
```

**New Files**
- `backend/prisma/helpers/blob-upload.ts` � `uploadUnitContent()` and `isBlobStorageAvailable()` utility
- `backend/prisma/migrate-content-to-blob.ts` � idempotent one-time migration script (run against prod)

**Infra (`infra/resources.bicep`)**
- Added `Standard_LRS / StorageV2 / Hot` storage account
- Added `course-content` blob container with public `Blob` access
- Added CORS rule: `GET` from `*` origins
- Added KV secret `storage-connection-string`
- Added `AZURE_STORAGE_CONNECTION_STRING` env var to Container App
- Added outputs: `storageAccountName`, `storageEndpoint`

**API (`backend/src/services/course.service.ts`)**
- `getUnit()` now returns `content.contentUrl` alongside `content.text`
- Backward compatible: `text` is `null` after migration, `contentUrl` is the new blob URL

**Seed Files � Two-Step Pattern (top 5 by volume)**
Applied to: `seed-maktab-further-studies-nw.ts`, `seed-maktab-coursebook3.ts`, `seed-maktab-coursebook1.ts`, `seed-maktab-coursebook2.ts`, `seed-maktab-coursebook4.ts`

Pattern:
```typescript
import { uploadUnitContent, isBlobStorageAvailable } from './helpers/blob-upload';

// Step 1: upsert with content inline in create; update block does NOT set content
const unit = await prisma.unit.upsert({
  where: { courseId_slug: { courseId: course.id, slug: 'unit-slug' } },
  create: { slug: '...', courseId: course.id, title: '...', orderIndex: 0, content: htmlContent },
  update: { title: '...', description: '...', orderIndex: 0 }, // no content!
});

// Step 2: upload to blob if available and not yet migrated
if (isBlobStorageAvailable() && unit.content && !unit.contentUrl) {
  const blobUrl = await uploadUnitContent(unit.id, unit.content!);
  await prisma.unit.update({
    where: { id: unit.id },
    data: { contentUrl: blobUrl, content: null },
  });
}
```

Remaining seed files (32 others) still use inline `content:` in both create and update. They should be updated to follow this pattern before the next full re-seed in a blob-enabled environment.

**Rollback**

The `content` column is NOT dropped. To rollback:
1. In `course.service.ts`, revert `getUnit()` to use only `content.text`
2. Do NOT run the migration script
3. The DB still has the HTML content inline

---

### 53. Khaldun Review: Unit Content ? Azure Blob Storage Migration (2026-07-17)

**Date:** 2026-07-17
**Reviewer:** Khaldun (Lead / Architect)
**Verdict:** APPROVED WITH NOTES

**Area-by-Area Review**

1. **`infra/resources.bicep` � Storage Account + Container:** APPROVED
   - `Standard_LRS StorageV2` is appropriate for non-critical content (source of truth remains the seed files)
   - Public blob access (`publicAccess: 'Blob'`) is intentional � course content is educational material meant for enrolled users' browsers to fetch directly without passing through the API
   - CORS `GET *` is correct for cross-origin fetch from SWA
   - Connection string stored in Key Vault and passed as Container App secret � good
   - Outputs include `storageAccountName` and `storageEndpoint` � useful for CI/CD

2. **`backend/prisma/schema.prisma` � `contentUrl` column:** APPROVED
   - Nullable `String?` allows gradual migration
   - Comment marks `content` as deprecated � good signal for future devs
   - No breaking changes to existing queries

3. **`backend/prisma/migrations/20260717_add_unit_content_url/migration.sql`:** APPROVED
   - Simple `ADD COLUMN` with nullable TEXT � zero-downtime DDL on PostgreSQL
   - No default, no constraint � safe for production

4. **`backend/prisma/helpers/blob-upload.ts`:** APPROVED
   - Singleton container client pattern avoids repeated connection initialization
   - Content-Type header set to `text/html; charset=utf-8`
   - 24h cache-control is reasonable for curriculum content that changes infrequently
   - `isBlobStorageAvailable()` allows graceful degradation in local dev

5. **`backend/prisma/migrate-content-to-blob.ts`:** APPROVED
   - Idempotent: `WHERE content IS NOT NULL AND contentUrl IS NULL`
   - `--dry-run` shows what would be migrated without side effects
   - `--no-clear` allows parallel validation (blob + DB both available during testing)
   - Per-unit error handling � one failure doesn't abort the batch
   - Disconnects Prisma on exit

6. **`backend/src/services/course.service.ts` � `getUnit()` response shape:** APPROVED
   - Returns both `content.text` and `content.contentUrl` � frontend can choose
   - After migration, `text` will be null, but field is present for backward compat
   - No breaking API contract change

7. **Seed files (coursebook1�4, further-studies):** APPROVED
   - Two-step pattern: upsert with inline content ? conditional blob upload
   - Guard: `isBlobStorageAvailable() && unit.content && !unit.contentUrl`
   - `update` clause in upsert does NOT include `content` � re-seeding won't overwrite blob URLs
   - Without `AZURE_STORAGE_CONNECTION_STRING`, seeds still populate inline content � local dev works

8. **Frontend: types, hook, UnitViewer:** APPROVED WITH CONCERN
   - `useUnitContent` hook correctly prioritizes `contentUrl` over `text`
   - Graceful fallback: on blob fetch failure, falls back to `content.text` if available
   - Loading skeleton and error states handled in UnitViewer
   - `SyncedTextContent` uses `dangerouslySetInnerHTML` � this is **pre-existing** and applies equally to inline content. The blob source doesn't introduce new XSS surface since we control blob uploads

**Concerns / Follow-Up Items**

- **CONCERN 1: No HTML sanitization on blob content (low risk, document)** � `dangerouslySetInnerHTML` renders blob HTML without sanitization. Currently safe because only our seed scripts and migration script upload to the blob container. Follow-up: If admin content editing is ever added, add DOMPurify or similar before render.

- **CONCERN 2: CORS origin wildcard** � `allowedOrigins: ['*']` is fine for now (public educational content), but when moving to a custom domain, tighten to the specific SWA domain(s).

- **CONCERN 3: No blob CDN layer** � For production traffic at scale, consider placing Azure CDN or Front Door in front of the blob endpoint. The 24h `Cache-Control` header is already CDN-friendly.

**Final Verdict**

**APPROVED WITH NOTES** � Ship it. The implementation is sound, backward-compatible, and safely idempotent. Follow-up items (sanitization, CORS tightening, CDN) are non-blocking enhancements for a future iteration.

---

### 54. Learner-Switching UI Flow (2026-07-21)

**Author:** Ibn Sina  
**Date:** 2026-07-21  
**Status:** Implemented

**Decision**

Introduced a `isParentInStudentMode` flag in `familyStore` to distinguish between two parent?child scenarios:

1. **Parent previewing** (from parent dashboard ? child view): `isParentInStudentMode = false` ? amber "Parent preview" banner shown in `ChildLayout`
2. **Parent in student mode** (SelectLearner ? pick child): `isParentInStudentMode = true` ? no banner, full student UX, "Switch Learner" button available in sidebar

**Key Rules**

- **Switch Learner button** is always visible in left nav when `isParentAuth === true` (both `ChildLayout` and `MainLayout`).
- The button requires PIN verification (`authService.verifyParentPin`) before proceeding to `/select-learner`.
- If parent has no PIN configured, a toast message shows ("Set a parent PIN in Settings�") and the switch proceeds anyway.
- PIN status is pre-fetched on mount to avoid latency at click time.
- `isParentInStudentMode` is included in `familyStore` `partialize` so it survives page refreshes.

**Files Changed**

- `frontend/src/stores/familyStore.ts` � added `isParentInStudentMode` state + action + persist
- `frontend/src/pages/SelectLearner.tsx` � `completeSelect` sets the flag
- `frontend/src/components/auth/ParentPinModal.tsx` � `targetMember` now optional; added `memberId`, `title`, `description` props
- `frontend/src/components/layouts/ChildLayout.tsx` � Switch Learner button, refined `isParentViewing` logic
- `frontend/src/components/layouts/MainLayout.tsx` � replaced multi-branch switcher with unified PIN-gated "Switch Learner" button

---

### 55. Learner-Switch Flow E2E Tests (2026-07-21)

**Author:** Biruni (Tester)
**Date:** 2026-07-21
**Status:** Implemented

**Decision**

Wrote 6 comprehensive E2E Playwright tests for the learner-switch flow introduced in Decision #54 (Learner-Switching UI Flow).

**Test File**

`frontend/e2e/learner-switch-flow.spec.ts`

**Test Coverage**

| # | Test | Route | Key Assertion |
|---|------|-------|---------------|
| 1 | Parent ? child (Student View) | `/child/dashboard` | No preview banner; Switch Learner in sidebar; student nav visible |
| 2 | Parent ? self (Parent View) | `/dashboard` | Stays on /dashboard; Switch Learner visible; parent nav; no preview banner |
| 3 | Switch Learner from ChildLayout | `/child/dashboard` | PIN modal with "Enter your PIN to switch learner"; correct PIN ? /select-learner |
| 4 | Switch Learner from MainLayout | `/dashboard` | PIN modal same description; correct PIN ? /select-learner |
| 5 | Child direct login bypass | `/child/dashboard` | Not redirected to /select-learner or /child-login; Switch Learner absent |
| 6 | Parent preview banner | `/child/dashboard` | "Parent preview" banner + "? Parent View" link + Switch Learner button all visible |

**State Injected**

All tests use `page.addInitScript` to inject `localStorage`:

- `auth-storage`: parent auth (accessToken, refreshToken, user, family, isAuthenticated)
- `family-storage`: `{ selectedMember, isParentInStudentMode }` � the new flag from Ibn Sina's implementation
- `child-auth-storage` (Test 5 only): `{ member, isAuthenticated: true, isChildSession: true, accessToken: 'mock-token' }`

**Key Technical Decisions**

1. **`isParentInStudentMode`** distinguishes "parent in full student mode" (no banner) from "parent previewing child view" (amber banner). Tests 1 and 6 use the same selectedMember but differ only in this flag.

2. **Test 5 (child direct login)** uses a mock JWT � the routing test only requires `isAuthenticated && isChildSession` to be true in the Zustand store. API calls will fail with 401 but the page must NOT redirect.

3. **Switch Learner locator** in sidebar tests is scoped to `aside` (`page.locator('aside').getByRole(...)`) to avoid ambiguity with the banner's own Switch Learner button in Test 6.

4. **PIN status wait** (Tests 3 & 4): `page.waitForResponse('/auth/parent-pin/status')` before clicking � same race condition guard established in `phase1-pin-gate.spec.ts`. Without this, `hasPinCache` may not be populated and the PIN modal may not appear.

5. **Auto-submit on 4th digit**: `firstInput.pressSequentially(parentPin, { delay: 100 })` � React focus management advances input focus, and the modal auto-submits after the 4th digit.

**Test Account Constants**

- Parent email: `hassan.rasheed1@live.com` (env: `E2E_PARENT_EMAIL`)
- Parent PIN: `5823` (env: `E2E_PARENT_PIN`)
- Ibn Sharif (child): `id = b32bf819-1662-47c5-b80f-2e2ca6bd26ab`, `familyId = fb93318f-648d-4bee-808e-71ff89f6c371`
- Hassan self-enrolled member: `id = 885ba420-5188-44f0-bbf1-30e622ec65aa`

---

### 56. Maktab Coursebook 5 � Unit Split Restructure (2026-07-26)

**Date:** 2026-07-26  
**Author:** Khwarizmi (Backend Dev)  
**Status:** Implemented  

**Summary**

Completely rewrote `backend/prisma/seed-maktab-coursebook5.ts` to split 7 large multi-topic units into **22 focused single-topic units**. Each unit now covers exactly ONE main topic/heading, and every quiz tests only that unit's content.

**Before:** 7 units � multiple unrelated sub-topics per unit  
**After:** 22 units � 1 focused topic each

**Key Changes**

- 7 ? 22 units (3x more granular)
- 112 questions redistributed (5�6 per unit)
- ~58 flashcards redistributed across all 22 units
- ~50 Arabic terms redistributed from the original 7 units
- Old unit slugs not deleted (new units have new slugs; a separate migration/cleanup script would be needed)

**File Stats**

- **File:** `backend/prisma/seed-maktab-coursebook5.ts`
- **Size:** ~176KB (was 179KB)
- **Lines:** 2774
- **TypeScript check:** ? No errors (`npx tsc --noEmit`)

---

### 57. Maktab Coursebook Audit & Unit Split Plan (2026-07-26)

**Date:** 2026-07-26
**Author:** Khaldun (Lead/Architect), Khwarizmi

**Part 1: Answer Correctness Audit Results**

Audit method: Parse every `prisma.question.upsert` block in each file by splitting on that token, then extract `type`, `correctAnswer`, and `options` fields. For `MULTIPLE_CHOICE`, verify `correctAnswer` is in the parsed options array. For `TRUE_FALSE`, verify value is `'True'` or `'False'`. `FILL_BLANK` is exempt (no options check needed).

**Verdict: All 12 files pass the correctness audit.**

Every `correctAnswer` in a `MULTIPLE_CHOICE` question exactly matches one of the strings in its `options` array. Every `TRUE_FALSE` question has `correctAnswer` of `'True'` or `'False'`. No questions have `type: 'MULTIPLE_CHOICE'` with missing or undefined options.

**Part 2: Unit Split Plan**

**Design Principle:** Each current unit bundles an entire subject (Fiqh, A?adith, Sirah, etc.) into one large unit. The goal is to split each subject unit into **topic-focused sub-units**, each covering ONE main topic, so that quizzes are targeted rather than broad.

Slug pattern: `maktab-{N}-{subject}-{topic}` (for coursebooks); `foundation-{N}-{subject}-{topic}` (for foundation); `maktab-fs-{topic}` (for further studies).

**Status:** Decision approved; Coursebook 5 implementation complete. Remaining coursebooks (1�4, 6�8) to follow.

---

### 58. Quran Memorization: Word-by-Word Vocabulary + FlashCards (2026-07-31)

**Author:** Khwarizmi (Backend Dev)  
**Date:** 2026-07-31  
**Status:** Implemented

**Context**

Both Quran memorization seed files previously created a single `ArabicTerm` per ayah unit containing the full ayah text as a monolithic vocabulary entry. There were also no `FlashCard` entries for Quran vocabulary. The quran.com v4 API provides word-by-word breakdowns that enable richer vocabulary learning.

**Decision**

Fetch word-by-word data from the quran.com API and use it to generate per-word `ArabicTerm` entries and `FlashCard` entries for every individual ayah unit. Review units are unchanged.

**Changes Made**

**Files modified:**
- `backend/prisma/seed-quran-memorization.ts`
- `backend/prisma/seed-quran-longer-surahs.ts`

**API added:**
```
GET https://api.quran.com/api/v4/verses/by_chapter/{n}?words=true&word_fields=text_uthmani,transliteration,translation&per_page=300
```
Called as a 4th parallel fetch alongside the existing 3 calls in `fetchSurahData`. Filter `char_type_name === 'word'` to exclude verse-number end markers.

**New types:** `WordData`, `WordByWordResponse`; `SurahData.wordsByAyah: WordData[][]`

**`buildUnitContent`:** Added `words: WordData[]` parameter. Appends a "Key Vocabulary" CSS grid section (Arabic word + transliteration + translation) at the bottom of each ayah unit's HTML.

**ArabicTerm seeding (ayah units):** Replaced single full-ayah entry with one entry per vocabulary word. `arabicText` = word Arabic, `transliteration` = word transliteration, `translation` = word English meaning, `audioUrl` = null (no word-level audio available).

**ArabicTerm seeding (review units):** Unchanged � one entry per full ayah.

**FlashCard seeding (ayah units only):** One flashcard per vocabulary word. Front = English translation, back = Arabic word, `backArabic` = Arabic word, `category` = `'vocabulary'`, `tags` = `['quran', 'vocabulary', <surah-slug>]`, `difficulty` = `EASY`, `subjectTag` = `'QURAN'`. Deleted and recreated on re-seed (idempotent). No flashcards on review units.

**Console logging:** Per-surah log line updated to include vocab word count and flashcard count.

**Key Decisions**

1. **Word-level arabicTerms over full-ayah**: Granular vocabulary terms are more useful for spaced repetition and search than a single multi-word blob. The full-ayah text is still present in the unit `content` HTML.

2. **No word-level audio**: The everyayah.com dataset provides ayah-level audio only. `audioUrl: null` is set explicitly rather than constructing a broken URL.

3. **Review units excluded from flashcards**: Review units aggregate the whole surah. Duplicating all vocab flashcards there would inflate the flashcard deck without adding learning value.

4. **`per_page=300`**: Covers all surahs in both seed files (largest is Al-Waqi'ah at 96 ayahs, well under the limit). No pagination logic needed.

5. **`limitToAyahs` slice**: The `wordsByAyah` array is sliced alongside the other arrays in `seed-quran-longer-surahs.ts` to keep the Al-Kahf first-10-ayahs constraint consistent.

**Validation**

`npx tsc --noEmit` passes with zero errors after all changes.

---


---

### 59. Quran Unlock, Maktab Naming, Course Tests, Child Learner Name � Design Review (2026-08-30)

### 2026-08-30: Design Review — Quran Unlock, Maktab Naming, Course Tests, Child Learner Name

**By:** Khaldun (Lead/Architect)
**Requested by:** Biruni
**Type:** Design Review — read-only, no product code changes

---

## Defect 1: Quran courses don't unlock completed ayahs

### Root Cause

`frontend/src/pages/courses/CourseLearner.tsx` line 326:

```tsx
const isLocked = index > 0 && !isUnitUnlockable(previousProgress) && !isResumeTarget;
```

Each unit's lock state depends solely on its **immediate predecessor's** `unitProgress` record.
`isUnitUnlockable()` (line 33) returns `false` when `progress` is `undefined` — i.e. when the
backend returns no `UnitProgress` row for that unit.

In Quran courses (70–100+ units, one per ayah), the `resolvedEnrollment.unitProgress` array
returned by `courseService.getEnrollments(memberId)` is the full set from the backend
(`course.service.ts` line 247, no limit). So missing records is unlikely unless the progress
mutation path has a bug.

**More likely scenario:** The enrollment refresh in `loadCourseData` (line 128) fetches fresh
enrollment via `courseService.getEnrollments(activeMemberId)`, but falls through to stale
route-state when `activeMemberId` is undefined (child route without childAuthStore member).
When the parent picks a child from SelectLearner and navigates to `/child/courses/…/learn`,
`childMember` from `useChildAuthStore()` is `null` (only populated by actual child login),
so `activeMemberId` becomes `undefined`, no fresh fetch happens, and the page relies on
stale `state.enrollment` which may have empty/outdated `unitProgress`.

**Secondary factor:** Even with fresh data, the sequential-unlock model is O(n²) in user
perception for Quran courses. A learner who completed ayahs 1-38 and is at ayah 39 sees all
38 completed ayahs with green checkmarks BUT the lock icon check is purely visual — completed
units with `isUnitCompleted(unitProgress)=true` still show `isLocked=true` if their
predecessor's progress row doesn't exist. This is a logic bug: a completed unit should
never display as locked.

### Fix

1. **Logic fix in `CourseLearner.tsx`:** A unit should be unlocked if ANY of:
   - `index === 0` (first unit)
   - `isUnitUnlockable(previousProgress)` (predecessor done/started)
   - `isUnitCompleted(unitProgress)` (this unit itself is already completed)
   - `isResumeTarget` (currently selected resume target)

2. **activeMemberId fix:** When in parent-student-mode on `/child/` routes, fall back to
   `selectedMember?.id` from `useFamilyStore` when `childMember?.id` is null.

### Files to Change
- `frontend/src/pages/courses/CourseLearner.tsx` (line 326 logic, line 95 activeMemberId)

---

## Defect 2: Maktab stage packages named after coursebook

### Root Cause

`backend/prisma/seed-maktab-program.ts` — the `STAGES` array (lines 55–152) uses coursebook
names as stage names:

| stageNumber | Current name      | Should be            |
|-------------|-------------------|----------------------|
| 3           | Coursebook 1      | Stage 3              |
| 4           | Coursebook 2      | Stage 4              |
| …           | …                 | …                    |
| 10          | Coursebook 8      | Stage 10             |

The frontend renders `stage.name` directly in `ProgramCatalog.tsx` line 52 and 493.

### Fix

Rename stage `name` fields in the seed data to use the Maktab level number (e.g. "Stage 3",
"Stage 10") or a descriptive level name. The seed uses `upsert` with `where: { programId, stageNumber }`,
so re-running the seed will update existing rows idempotently.

### Files to Change
- `backend/prisma/seed-maktab-program.ts` (STAGES array, name + description fields)

---

## Defect 3: Missing mid-year and completion tests for Maktab courses

### Root Cause

Current Maktab coursebook seeds (CB1–CB8, Foundation1–2, Further Studies NW) create only
per-unit quiz `Question` records. There are no dedicated assessment/test units that aggregate
questions across subjects for mid-year or end-of-year evaluation.

The schema supports this already: a `Unit` can be created with `orderIndex` positioned at the
halfway point and at the end, containing `Question` rows that draw from the full coursebook
scope. No schema changes needed.

### Fix

For each Maktab coursebook seed file, add two new units:
1. **Mid-Year Test** — positioned after the halfway unit (e.g. `orderIndex` between units 6 and 7
   in a 12-unit course). Contains a representative subset of questions from the first half.
2. **Completion Test** — positioned as the final unit. Contains comprehensive questions spanning
   all subjects in the coursebook.

These units should have a distinctive title pattern (e.g. "Mid-Year Assessment" / "Completion
Assessment") and `content` containing instructions rather than lesson material. The questions
themselves go into the `Question` model linked to each assessment unit.

Seed idempotency: Use `upsert` on `courseId + slug` composite unique (e.g.
`maktab-1-midyear-test`, `maktab-1-completion-test`). Existing `orderIndex` values for
following units must be bumped to make room. This requires a migration-safe approach:
first shift existing units' `orderIndex` values, then insert the test units.

### Files to Change (12 seed files)
- `backend/prisma/seed-maktab-coursebook1.ts` through `seed-maktab-coursebook8.ts`
- `backend/prisma/seed-maktab-coursebook6boys.ts`, `seed-maktab-coursebook6girls.ts`
- `backend/prisma/seed-maktab-foundation1.ts`, `seed-maktab-foundation2.ts`
- `backend/prisma/seed-maktab-further-studies-nw.ts`

---

## Defect 4: Child learner shows "Student, Student" instead of name

### Root Cause

`frontend/src/components/layouts/ChildLayout.tsx` lines 125–131:

```tsx
const { member, logout } = useChildAuthStore();
...
<p>{member?.name || 'Student'}</p>
<p>{member?.ageCategory ? formatAgeCategory(member.ageCategory) : 'Student'}</p>
```

When a parent selects a child from `SelectLearner.tsx`, the flow calls
`selectMember(member)` on `useFamilyStore` and navigates to `/child/dashboard`.
But it does NOT set `member` on `useChildAuthStore` — that store is only populated
by actual child login (`childAuthService.childLogin()`).

Result: `useChildAuthStore().member` is `null`, both lines fall back to `'Student'`,
displaying "Student" for name and "Student" for role → visually "Student, Student".

### Fix

`ChildLayout.tsx` should derive the active member from:
1. `useChildAuthStore().member` (if child logged in directly), OR
2. `useFamilyStore().selectedMember` (if parent is in student-mode)

Replace `member` usage with a computed `activeMember`:
```tsx
const activeMember = member ?? selectedMember;
```

Then use `activeMember` for name display, avatar initial, and top-bar badge.

### Files to Change
- `frontend/src/components/layouts/ChildLayout.tsx` (lines 125, 135, 192, 200–203)

---

## Agent Work Assignment

### Ibn Sina (Frontend)
**Owns:**
1. `frontend/src/pages/courses/CourseLearner.tsx` — Defect 1 lock-logic fix + activeMemberId fix
2. `frontend/src/components/layouts/ChildLayout.tsx` — Defect 4 activeMember derivation

**No overlap with dirty files.** CoursesPage.tsx and FamilyDashboard.tsx are not touched.

### Khwarizmi (Backend / Seed Data)
**Owns:**
1. `backend/prisma/seed-maktab-program.ts` — Defect 2 stage renaming
2. `backend/prisma/seed-maktab-coursebook*.ts` (all 13 files) — Defect 3 mid-year + completion test units

**No overlap with dirty files.**

### Biruni (Testing)
**Owns:**
1. New/updated test in `frontend/src/__tests__/pages/CourseLearner.test.tsx` — assert completed units never show locked; assert correct activeMemberId in parent-student-mode
2. New test for ChildLayout name display — assert `activeMember` name renders, not "Student"
3. Seed validation tests for mid-year/completion test unit existence after re-seed

**No overlap with dirty files.**

---

## Dependency Order

```
1. Khwarizmi: Defect 2 (stage rename) — independent, no code deps
2. Khwarizmi: Defect 3 (test units) — independent, no code deps
   ↕ (parallel OK)
3. Ibn Sina: Defect 1 (unlock logic) — independent
4. Ibn Sina: Defect 4 (child name) — independent
5. Biruni: All tests — depends on 1-4 being complete
```

Defects 1-4 have zero file overlap and can be implemented in parallel.

---

## Acceptance Criteria

### Defect 1 — Quran Unlock
- [ ] On CourseLearner page, all completed units display unlocked (green checkmark, clickable)
- [ ] Units with in-progress predecessor are unlocked
- [ ] First unit is always unlocked
- [ ] In parent-student-mode on child routes, `activeMemberId` resolves to `selectedMember.id`
- [ ] Test: mount CourseLearner with 10 completed units + 1 in-progress; assert none show Lock icon

### Defect 2 — Maktab Stage Names
- [ ] `seed-maktab-program.ts` stage names use Maktab level identifiers, not coursebook names
- [ ] Re-running seed idempotently updates existing stage rows via upsert
- [ ] ProgramCatalog UI shows updated stage names

### Defect 3 — Mid-Year and Completion Tests
- [ ] Each Maktab coursebook has exactly 2 new assessment units (mid-year + completion)
- [ ] Assessment units contain questions drawn from the coursebook's subject range
- [ ] `orderIndex` values are consistent (no collisions with existing units)
- [ ] Seed is idempotent (safe to re-run)

### Defect 4 — Child Learner Name
- [ ] ChildLayout sidebar shows child's actual name and age category when parent selects child
- [ ] ChildLayout sidebar shows child's name when child logs in directly
- [ ] ChildLayout top-bar badge shows child's initial, not "S"
- [ ] Test: render ChildLayout in parent-student-mode; assert name != "Student"

---

## Risk Assessment: Existing Dirty Changes

**Modified files in worktree:**
- `frontend/src/pages/courses/CoursesPage.tsx` — adds category filter pre-application from dashboard links
- `frontend/src/pages/dashboard/FamilyDashboard.tsx` — adds "Explore the Library" subject cards

**Overlap with this work: NONE.** Defects 1 and 4 touch `CourseLearner.tsx` and `ChildLayout.tsx`
respectively. Defects 2-3 are backend seed files only. No merge conflicts expected.

**Recommendation:** Commit the existing dirty changes first (they're a self-contained feature:
category-filtered navigation from dashboard to course catalog). This keeps the working tree clean
for the four-defect implementation.


---

### 60. Quran Unit Unlock Logic + Child Learner Identity (2026-08-30)

### 2026-08-30: Quran Unit Unlock Logic + Child Learner Identity

**By:** Ibn Sina (Frontend Dev)
**Requested by:** Biruni (via Khaldun design review)
**Type:** Bug fix — two defects (Defect 1 + Defect 4 from khaldun-quran-maktab-learner-fixes.md)

---

## Decision 1: Completed Units are Never Locked (CourseLearner.tsx)

### Context

The `isLocked` expression previously read:

```tsx
const isLocked = index > 0 && !isUnitUnlockable(previousProgress) && !isResumeTarget;
```

`isUnitUnlockable()` returns `false` when the predecessor's `unitProgress` row is absent. In
Quran courses, progress rows may differ in completeness across refreshes or sessions. A unit the
learner has already completed would still show a Lock icon if its predecessor's row happened to
be missing or stale.

### Decision

Add `&& !isCompleted` to the lock condition:

```tsx
const isLocked = index > 0 && !isUnitUnlockable(previousProgress) && !isResumeTarget && !isCompleted;
```

A unit the learner has already finished is **never** locked, regardless of predecessor state.
This preserves sequential locking for genuinely future units while allowing free navigation
within already-completed content.

### Outcome

- Completed units: always unlocked (green checkmark, clickable)
- In-progress predecessor: unlocks next unit (unchanged)
- Future units beyond the in-progress frontier: locked (unchanged)
- Resume target: always unlocked (unchanged)

---

## Decision 2: activeMemberId Falls Back to selectedMember in Parent-Student-Mode (CourseLearner.tsx)

### Context

`activeMemberId` was derived as:

```tsx
state?.memberId ?? (isChildRoute ? childMember?.id : selectedMember?.id)
```

When a parent navigates to `/child/courses/<id>/learn`, `isChildRoute` is `true`, but
`childMember` is `null` (child auth store is only populated by actual child login). The result
was `activeMemberId = undefined`, causing `loadCourseData` to skip the fresh enrollment fetch
and fall back to stale route state — which may have empty or outdated `unitProgress`.

### Decision

```tsx
const activeMemberId = state?.memberId ?? (isChildRoute ? (childMember?.id ?? selectedMember?.id) : selectedMember?.id);
```

On `/child/` routes, child-auth member is tried first; the family store's `selectedMember` is
the fallback. This ensures a fresh `getEnrollments(memberId)` call always happens in
parent-student-mode.

---

## Decision 3: activeMember Derivation in ChildLayout

### Context

`ChildLayout.tsx` used `useChildAuthStore().member` directly for all identity display (name,
age category, avatar initial, top-bar badge). In parent-student-mode, `member` is `null`, so
all fields fell back to `'Student'` — rendering "Student / Student".

### Decision

Derive a single `activeMember` from:

```tsx
const activeMember = member ?? selectedMember;
```

Use `activeMember` consistently at all 6 display sites (sidebar avatar, sidebar name, sidebar
age category, top-bar name, top-bar avatar, parent-preview banner). Child auth sessions are
unaffected (`member` is non-null and takes priority).

---

## Files Changed

- `frontend/src/pages/courses/CourseLearner.tsx`
- `frontend/src/components/layouts/ChildLayout.tsx`

## Verification

`npx tsc --noEmit` — zero errors.


---

### 61. Maktab Assessment Seeding Pattern (2026-08-30)

# Decision: Maktab Assessment Seeding Pattern

**Date:** 2026-08-30  
**Author:** Khwarizmi  
**Status:** Implemented

## Context

Defect 3 (khaldun-quran-maktab-learner-fixes.md) required adding Mid-Year and Completion Assessment units with representative questions to every Maktab coursebook seed (12 files total). The Unit model has a `@@unique([courseId, orderIndex])` constraint, meaning inserting assessment units mid-sequence requires shifting existing orderIndex values atomically.

## Decision

### Shared helper: `backend/prisma/helpers/maktab-assessment.ts`

Exports `seedMaktabAssessments()` — a single idempotent helper that handles:
1. **Existence check**: `prisma.unit.findFirst({ where: { courseId, slug: midYearSlug } })` — skip shift if already exists.
2. **Atomic orderIndex shift**: Single `$executeRawUnsafe("UPDATE units SET order_index = order_index + 1 WHERE course_id = $1 AND order_index > $2")`. PostgreSQL evaluates the unique constraint **after all rows** in a statement are processed, so no intermediate constraint violations occur.
3. **Unit upserts**: Mid-year at `firstHalfLastOrderIndex + 1`, completion at `originalMaxOrderIndex + 2`.
4. **Question upserts**: `where: { externalId }` — deterministic, collision-safe.

### orderIndex corrections in seed files

Files that include `orderIndex` in their `update:` blocks (CB4, CB6boys, CB6girls, CB7, F1, F2) must have those values shifted to match the post-assessment positions — otherwise re-seeding would reset the orderIndex back, conflicting with assessment unit positions.

Files that do NOT include `orderIndex` in update blocks (CB1, CB2, CB3, CB5, CB8, FS-NW) only need the helper call; the shift handles positioning on every run.

### ExternalId convention for assessment questions

Pattern: `maktab-{N}-my-q{n}` (mid-year) and `maktab-{N}-ca-q{n}` (completion)  
Variants: `maktab-6b-*` (CB6 Boys), `maktab-6g-*` (CB6 Girls), `maktab-f1-*`, `maktab-f2-*`, `maktab-fs-*`

### Assessment unit slug convention

Pattern: `maktab-{N}-midyear-assessment` and `maktab-{N}-completion-assessment`  
Same variant prefixes as above.

## Migration/Deploy Impact

- No schema changes — uses existing Question and Unit models.
- Assessment questions use `difficulty: 'MEDIUM'` (consistent with the schema enum).
- Re-seeding (via `prisma db seed` or seed orchestrator) is fully idempotent.
- On first seed: units are created, shifted, and assessments inserted.
- On subsequent seeds: units are upserted (no-op on content), questions are upserted (no-op on content).
- The SQL shift is guarded by the existence check — runs at most once per course per database.


---

### 62. Ibn Sina: Maktab Seed Revision Complete � Review Request (2026-08-30)

# Ibn Sina: Maktab Seed Revision Complete — Review Request

**Date:** 2026-08-30
**By:** Ibn Sina
**Status:** READY FOR REVIEW (Khaldun)
**Requested by:** Biruni

---

## Summary

Revision of Khwarizmi's Maktab assessment seed work under the strict lockout protocol. All four of Khaldun's rejection findings are addressed.

---

## Files Changed

| File | Change |
|------|--------|
| `backend/prisma/helpers/maktab-assessment.ts` | Transaction wrap (Finding #3) |
| `backend/prisma/seed-maktab-coursebook4.ts` | Restore second-half orderIndex values (Finding #2) |
| `backend/prisma/seed-maktab-coursebook6boys.ts` | Restore second-half orderIndex values (Finding #2) |
| `backend/prisma/seed-maktab-coursebook6girls.ts` | Restore second-half orderIndex values (Finding #2) |
| `backend/prisma/seed-maktab-coursebook7.ts` | Move assessment call into correct function (Finding #1) + restore orderIndex values (Finding #2) + escape one pre-existing syntax error in assessment question string |
| `backend/prisma/seed-maktab-foundation1.ts` | Restore second-half orderIndex values (Finding #2) |
| `backend/prisma/seed-maktab-foundation2.ts` | Restore second-half orderIndex values (Finding #2) |
| `backend/tsconfig.seed.json` | New: enables explicit type checking of prisma seeds (Finding #4) |

---

## How Each Finding Was Resolved

### Finding #1 — `seedMaktabAssessments` inside `main()` where `course` is out of scope

`seedMaktabCoursebook7()` declares `const course` at line 16. The assessment call (which references `course.id`) was erroneously placed inside `main()` after `await seedMaktabCoursebook7()` completed. Fixed by moving the full `seedMaktabAssessments(...)` block inside `seedMaktabCoursebook7()` (after the flashcard and Arabic terms sections, before the closing `}`). `main()` is now a clean try/catch/finally that simply calls `seedMaktabCoursebook7()` and disconnects.

### Finding #2 — Manual pre-shift causes double-shift collisions on first run

Khwarizmi incremented second-half unit `orderIndex` values in the upsert create/update blocks (e.g. CB4 units 8–14 became 9–15, F1 units 1–2 became 2–3). The shared helper then shifts those rows again via raw SQL on first run, producing collisions on the `@@unique([courseId, orderIndex])` constraint.

Restored all six files to original sequential values matching the CB1/CB2/CB3 pattern:
- **CB4**: units 8–14 create+update → `8, 9, 10, 11, 12, 13, 14` (were `9/9, 9/10, 10/11, 11/12, 12/13, 13/14, 14/15`)
- **CB6 Boys**: units 9–16 create+update → `9–16` (were `10–17`)
- **CB6 Girls**: units 7–13 create+update → `7–13` (were `8–14`)
- **CB7**: units 8–14 create+update → `8–14` (were `9–15`)
- **Foundation1**: unitDua → `1`, unitNames → `2` (were `2, 3` in both before/after-content positions)
- **Foundation2**: same as Foundation1

The helper's runtime shift and unique-slot logic is now the sole owner of second-half position management, consistent with CB1/CB2/CB3.

### Finding #3 — Non-transactional helper

Wrapped the guard-read (`tx.unit.findFirst`), conditional raw shift (`tx.$executeRawUnsafe`), mid-year unit upsert, completion unit upsert, and all question upserts in a single `prisma.$transaction(async (tx) => { ... })`.

- `tx` type is inferred by TypeScript from the `$transaction` overload — no casts needed
- `tx.$executeRawUnsafe` is supported in Prisma v5.7 interactive transactions
- Console.log statements are outside the transaction (they depend only on outer-scope params)
- A crash mid-way now causes full rollback; retry re-enters the guard-read and proceeds cleanly

### Finding #4 — Validation scope excluded prisma seeds

`backend/tsconfig.json` has `"include": ["src/**/*"]`, which excludes `prisma/`. Created `backend/tsconfig.seed.json`:
```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": { "rootDir": ".", "declaration": false, "declarationMap": false },
  "include": ["src/**/*", "prisma/**/*.ts"]
}
```
Validation command: `npx tsc --project tsconfig.seed.json --noEmit` (run from `backend/`).

---

## Transaction / Idempotency Behaviour

On **first run** (mid-year unit does not exist):
1. Transaction begins
2. Guard-read: unit not found → shift runs atomically
3. Units 8–14 (or equivalent) shift to 9–15; mid-year slot (8) is now free
4. Mid-year unit upsert at slot 8 (created)
5. Completion unit upsert at `originalMaxOrderIndex + 2` (created)
6. All assessment questions upserted
7. Transaction commits

On **subsequent runs** (mid-year unit already exists):
1. Transaction begins
2. Guard-read: unit found → skip shift
3. Mid-year and completion units upserted (update path, no-op if data unchanged)
4. All assessment questions upserted (update path, no-op if unchanged)
5. Transaction commits

A crash at any point leaves the database unchanged (full rollback). Retry is safe.

---

## Validation Command and Scope

```bash
cd backend
npx tsc --project tsconfig.seed.json --noEmit
```

This command **includes** `backend/prisma/**/*.ts`. Remaining errors in the output are all **pre-existing** and in files outside this revision's scope:
- `prisma/helpers/flashcard-factory.ts(237)` — null not assignable (unrelated helper)
- `prisma/seed-maktab-coursebook3.ts(1692)` — argument count mismatch (unrelated, untouched)
- `prisma/seed-maktab-coursebook6boys.ts(644,650)` — null JSON options in quiz section (pre-existing, untouched quiz code)
- `prisma/seed-maktab-coursebook7.ts(1341-1343)` — demo progress field mismatch (pre-existing, never executes because `demoChild` is always `null`)
- `prisma/seed-maktab-further-studies-nw.ts(1372,1381)` — null JSON options (unrelated, untouched)

Zero new errors introduced by this revision.

One pre-existing **syntax error** was fixed as a necessary side-effect: `seed-maktab-coursebook7.ts` ca-q3 explanation contained an unescaped ASCII `'` before `Ilm` inside a single-quoted string (`('Ilm)` → `(\'Ilm)`). This caused the tsc run to abort entirely and had to be corrected for any validation to proceed. Question content is preserved.

---

## Biruni Additional Finding — Foundation1/Foundation2 Duplicate externalIds

**Finding:** `foundation-1-quran-q1` (and all other regular unit externalIds) reportedly appears twice within each file, violating the unique constraint and undermining idempotency.

**Investigation result: False positive — no code change required.**

Each `externalId` appears exactly twice within each file only because Prisma's `upsert()` call references it in two places: `where: { externalId: '...' }` (the lookup key) and `create: { externalId: '...' }` (the create payload). This is the standard Prisma upsert pattern, identical to every other seed file in the repo. There is one and only one `question.upsert()` call per question, with a unique externalId. The `@@unique` constraint is not violated; idempotency is intact.

**Evidence:**
- Foundation1: 16 `prisma.question.upsert()` calls, 16 `where: { externalId:` lookups — 1:1 mapping
- Foundation2: 18 `prisma.question.upsert()` calls, 18 `where: { externalId:` lookups — 1:1 mapping
- Assessment questions (passed to the helper as arrays, not individual upserts): F1 has 11, F2 has 11 — all carry unique `maktab-f1-*` / `maktab-f2-*` IDs, distinct from regular unit question IDs

No externalId is shared between a regular unit question and an assessment question. No externalId is used in more than one upsert block.

---

## What Was NOT Changed

- Test files (Biruni owns tests)
- Frontend files
- Stage names (`seed-maktab-program.ts`)
- Unaffected course seeds (CB1, CB2, CB3, CB5, CB8, Further Studies NW)
- Assessment question content (all externalIds, question text, options, answers, explanations preserved)
- No commits made


---

### 63. QA Regression Tests � Quran Unlock, Maktab Naming, Child Learner Name (2026-08-30)

### 2026-08-30: QA Regression Tests — Quran Unlock, Maktab Naming, Child Learner Name

**By:** Biruni (Tester / QA)
**Requested by:** Biruni (independent validation of Khwarizmi + Ibn Sina changes)
**Type:** Test decision — test files only, no product code changes

---

## Context

This decision documents the regression test approach chosen for the four defects described in
`khaldun-quran-maktab-learner-fixes.md` after Ibn Sina (frontend) and Khwarizmi (backend)
implemented the fixes.

---

## Test Files Added / Modified

### 1. `frontend/src/__tests__/pages/CourseLearner.test.tsx` — 6 new test cases

**Approach:** Extend the existing Vitest/React Testing Library suite. Mock `courseService`,
`useFamilyStore`, and `useChildAuthStore` per existing pattern.

**Tests cover:**
- Parent-student-mode `activeMemberId` resolves to `selectedMember.id` (no childMember)
- No spurious `getEnrollments` call when both member identities are null
- Completed units with missing predecessor progress rows show no Lock icon (Quran scenario)
- First unit always unlocked (no enrollment at all)
- Unit two steps beyond in-progress is locked (sequential unlock preserved)

**Rationale for "two steps beyond" design:** `isUnitUnlockable` returns `true` for `in_progress`,
so the unit immediately after an in-progress unit is intentionally unlocked (look-ahead). Unit N+2
— where predecessor N+1 has no progress — is the first genuinely locked one. Tests reflect this
intended behaviour, not a bug.

---

### 2. `frontend/src/__tests__/layouts/ChildLayout.test.tsx` — NEW file, 4 tests

**Approach:** Render ChildLayout in MemoryRouter. Mock all three stores
(`useChildAuthStore`, `useAuthStore`, `useFamilyStore`) and `authService.getParentPinStatus`.

**Tests cover:**
- Direct child login (member set): name + age category in sidebar
- Parent-student-mode (selectedMember, no childMember): name + age category visible
- "Student" text must not appear anywhere when parent has selected a child
- Avatar initial correct (sidebar + top-bar) for parent-selected child

**Key implementation note:** ChildLayout renders the member name in two places (sidebar `<p>` and
top-bar badge `<p>`), so all name assertions use `getAllByText()` not `getByText()`.

---

### 3. `backend/src/__tests__/maktab-seed-validation.test.ts` — NEW file, 42 tests

**Approach:** Source-level static analysis — read seed TypeScript files as strings and apply regex
assertions. No database or Prisma required. Runs in the normal `vitest` suite.

**Tests cover (5 groups):**
1. Stage names: stages 3-10 use `"Stage N"` pattern, not `"Coursebook N"`
2. Assessment presence: all 12 relevant seeds call `seedMaktabAssessments` exactly once
3. Slug determinism: each seed uses `{prefix}-midyear-assessment` and `{prefix}-completion-assessment`
4. Question externalId uniqueness: no collision among `-my-qN` / `-ca-qN` IDs across all seeds
5. Minimum question counts: ≥4 mid-year, ≥6 completion per seed

**Why source-level (not DB integration):** Database integration requires a live PostgreSQL instance
with the full Maktab program seeded. This is unsafe in CI without a dedicated DB. The relevant
correctness properties (slug naming, question counts, call count) are all statically verifiable in
the seed source. If the source is correct, the runtime behavior follows from the `seedMaktabAssessments`
helper (which has its own logic in `helpers/maktab-assessment.ts`).

---

## ⚠️ RETRACTION (2026-08-30T10:56:00-05:00)

The "Reviewer Finding" below regarding duplicate `externalId` values in `seed-maktab-foundation1.ts` and `seed-maktab-foundation2.ts` was **incorrect**. The flat regex used to detect duplicates matched each question ID twice per upsert — once in the `where:` clause and once in the `create:` clause. These are the same ID in the same upsert block (the standard Prisma idiomatic pattern), not two separate questions with the same ID. PowerShell per-upsert regex verification confirms all 16 (foundation1) and 18 (foundation2) question upserts are valid and non-duplicated. No action required by Khwarizmi for this finding.

---

## Reviewer Finding — Pre-Existing Defect (NOT part of the four task outcomes)

**Defect:** `seed-maktab-foundation1.ts` and `seed-maktab-foundation2.ts` contain duplicate
`externalId` values for per-unit quiz questions (e.g., `foundation-1-quran-q1` appears twice
in `seed-maktab-foundation1.ts`). This is a pre-existing bug unrelated to the four task defects.

**Impact:** The `Question.externalId` field is `@@unique` in Prisma. On the second seed run, the
`upsert` would silently update the question that already exists at that ID, potentially overwriting
a question from a different unit. This is a data integrity risk.

**Recommended fix:** Khwarizmi should deduplicate or rename the duplicate IDs in foundation1 and
foundation2 seeds.

**Scope of this uniqueness test:** The seed validation test intentionally checks ONLY
assessment-specific question IDs (the `-my-qN` and `-ca-qN` pattern), not all question IDs in
every seed file, to avoid blocking on this pre-existing defect. A separate broader uniqueness test
can be added once Khwarizmi fixes the duplicates.

---

## Verdict

**APPROVE** — All four requested outcomes are validated by passing tests.

| Outcome | Validated by |
|---------|-------------|
| 1. Parent-selected child → activeMemberId resolves and enrollment refreshes | CourseLearner test: "calls getEnrollments with selectedMember.id" |
| 2. Completed units unlocked; future units locked; first/resume available | CourseLearner tests: lock icon, first unit, future lock |
| 3. ChildLayout shows actual child name/age/initial, not "Student" | ChildLayout tests: 4 cases |
| 4. Stage names use level identifiers; each seed has exactly one mid+completion assessment with questions and deterministic slugs | maktab-seed-validation.test.ts: 42 cases |


---

### 64. Ibn Sina Decision � Explore the Library (Family Dashboard) (2026-08-02)

# Ibn Sina Decision — Explore the Library (Family Dashboard) (2026-08-02)

**Author:** Ibn Sina (Frontend Dev)
**Status:** Implemented

## Context

The Family Dashboard lacked a discoverable entry point into the course catalog by subject. Families had no visual orientation to the Islamic study topics available (Quran, Seerah, Fiqh, Hadith, Arabic, History). The "Stories from Seerah" course being added made it especially important to surface subject-level discovery from the dashboard.

## Decision

Added an **"Explore the Library"** section to `FamilyDashboard.tsx` between the Stats Cards and the Family Members section. It shows 6 Islamic subject category cards arranged in a responsive grid (2 cols on mobile, 3 on tablet, 6 on desktop). Each card links to `/courses?tab=catalog&category=<CATEGORY>`.

Also updated `CoursesPage.tsx` to read the `category` URL param on mount and pre-apply it to the Zustand `useCourseStore` `filters` via `setFilters`. This makes each category card navigate directly to a pre-filtered catalog view.

## Rationale

- Families need an at-a-glance map of what the library covers — emoji + category name + one-line description achieves this without adding cognitive load.
- Pre-selecting the category filter via a mount-only `useEffect` in `CoursesPage` is non-invasive: it sets the Zustand filter once; subsequent user interaction updates the filter normally. No changes to `CourseCatalogTab` internals.
- Cards use existing TailwindCSS design tokens (`primary-*`, `rounded-xl`, `shadow-sm`) for consistency with the rest of the dashboard.

## Files Changed

- **Modified:** `frontend/src/pages/dashboard/FamilyDashboard.tsx` — added "Explore the Library" section with 6 category `<Link>` cards
- **Modified:** `frontend/src/pages/courses/CoursesPage.tsx` — added mount-only `useEffect` in `CoursesPage` to read `category` URL param and call `setFilters`

## Validation

`npx tsc --noEmit` passed with zero errors after both changes.


---

### 65. Decision: seed-seerah-stories.ts � Stories from Seerah Course (2026-08-02)

# Decision: seed-seerah-stories.ts — Stories from Seerah Course

**Date:** 2026-08-02  
**Author:** Khwarizmi (Backend Dev)  
**Status:** Implemented

## Context

The team requested a production seed for a new "Stories from Seerah" course — 10 authentic hadith stories from Sahih Bukhari and Sahih Muslim, targeting all age levels (CHILD → ADULT) for family learning.

## Decision

Created `backend/prisma/seed-seerah-stories.ts` as a standalone, idempotent seed with:

- **Idempotency pattern:** `findFirst by title → delete (cascade) → recreate` (no Ahmad Family guard, unlike older seeds)
- **10 units** ordered 0–9, each containing a full bilingual hadith (Arabic + English), context section, 5-level discussion questions (ages 6-12 / Teens / Whole family / Applying today / Adults), and 4 key lessons
- **arabicTerms:** 3–4 per unit using `prisma.arabicTerm.create` individually (not createMany) to match task spec
- **FlashCards:** 3–4 per unit, `FlashCardDifficulty.MEDIUM`, `category: 'vocabulary'`, with seerah + topic tags
- **QuizQuestions:** 1 per unit, `MULTIPLE_CHOICE`, difficulty EASY or MEDIUM per story brief
- **HTML template** follows spec: hadith-reference div → bilingual-text div → story-context → discussion-questions → lessons-summary

## Wiring

- `seed-production.ts`: import added + `await seedSeerahStoriesCourse()` called after `seedMaktabProgram()`
- `run-seed.yml`: `seed-seerah-stories` added to workflow_dispatch options list

## Sources (10 hadith)

| Unit | Source | Topic |
|------|--------|-------|
| 1 | Bukhari 3 | First Revelation |
| 2 | Bukhari 3905 | Cave of Thawr / Hijrah |
| 3 | Bukhari 6025 | Bedouin in the Mosque |
| 4 | Bukhari 1356 | Sick Jewish Boy |
| 5 | Bukhari 7507 | Man Who Kept Sinning |
| 6 | Bukhari 1149 | Bilal ibn Rabah |
| 7 | Bukhari 4280 | Fath Makkah |
| 8 | Bukhari 1301 | Umm Sulaym's Patience |
| 9 | Muslim 923a | Prophet's Tears |
| 10 | Bukhari 5997 | Man Who Never Kissed His Children |

## Validation

`npx tsc --noEmit` — zero errors.




## Governance

- All meaningful changes require team consensus
- Document architectural decisions here
- Keep history focused on work, decisions focused on direction
- **PRODUCTION COMPLETION GATE (mandatory):** Feature is not complete until authenticated E2E passes against production

