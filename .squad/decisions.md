# Squad Decisions

## Active Decisions

### 1. Ibn Sina Decision — Maktab Nav Entry Point (2026-07-09)
**Author:** Ibn Sina (Frontend Dev)
**Status:** Implemented

Parents reported inability to find the evening (After-School) vs Weekend learning path selector. The feature was fully built in `ProgramCatalog` (`/programs`) with an `EnrollModal` but had no navigation entry in `MainLayout.tsx`, so the page was unreachable via sidebar.

**Decision:** Added `{ name: 'Maktab 🕌', href: '/programs', icon: GraduationCap }` to the navigation array in `frontend/src/components/layouts/MainLayout.tsx`, placed after "Courses". Added `GraduationCap` to lucide-react imports.

**Rationale:**
- Minimal, targeted fix — only one missing array entry.
- Emoji style matches "Games 🎮"; 🕌 signals Islamic school context.
- `GraduationCap` signals formal curriculum-level learning, distinct from `BookOpen` (Courses) and `Brain` (Reviews).
- Active state via `location.pathname.startsWith('/programs')`.

**Files Changed:**
- **Modified:** `frontend/src/components/layouts/MainLayout.tsx`

**Validation:** `npx tsc --noEmit` passes clean.

---

### 2. Quduri Taharah Seed — Bilingual Content Format (2026-07-14)
**Author:** Khwarizmi

Implemented seed file for Mukhtasar al-Quduri's Kitab al-Taharah targeting TEEN/ADULT audiences.

**Key Decisions:**
- **Bilingual Format:** Side-by-side `<div class="bilingual-text">` layout (unlike CB1-2 inline Arabic). Rationale: Classical texts require direct Arabic-English pairing
- **FlashCard orderIndex:** Per-unit reset (not global). Aligns with schema's @@unique[unitId, orderIndex] constraint
- **Translation Disclaimers:** All English translations marked `[AI-Generated Translation]` for clarity and future scholarly attribution
- **Question Difficulty:** MEDIUM/HARD (targets teens/adults; tests legal conditions, exceptions, scholarly differences)

**Status:** Implemented in `backend/prisma/seed-quduri-taharah.ts` (2092 lines)

---

### 8. Quduri Salah Seed — Bilingual Content Format (2026-07-14)
**Author:** Khwarizmi

Implemented seed file for Mukhtasar al-Quduri's Kitab al-Salah targeting TEEN/ADULT audiences, following the exact pattern of Decision #2 (Taharah seed).

**Key Decisions:**
- **Same Format as Taharah:** Reuses bilingual `<div class="bilingual-text">` layout, `[AI-Generated Translation]` disclaimers, per-unit orderIndex reset for flashcards
- **8 Units:** Awqat al-Salah, Adhan, Shurut al-Salah, Fara'id al-Salah, Sifat al-Salah, Al-Jama'ah, Salat al-Musafir, Salat al-Jumu'ah wa al-'Idayn
- **Hanafi-Distinctive Rulings:** Highlighted in questions — double shadow for Dhuhr end, white shafaq for Maghrib, qahqahah breaking wudu', min Jumu'ah 3 besides imam, qunut in Witr year-round, muhazat al-mar'ah invalidating man's prayer
- **Totals:** 42 questions, 35 flashcards, 55 Arabic terms

**Status:** Implemented in `backend/prisma/seed-quduri-salah.ts` (1318 lines); wired into `seed.ts`

---

### 40. Maktab Online School — 4 Key Decisions Confirmed (2026-07-09)
**By:** hrasheed (via Copilot)

**Decision 1 — Foundation UI: Build child-first UI**
hrasheed confirmed: build a new child-first UI for ages 4–6 (not just adapt existing ChildDashboard). Higher quality path chosen over faster adaptation.

**Decision 2 — Longer surahs (CB5–8): Build them out**
hrasheed confirmed: DO NOT skip longer surahs. Build out the content for longer surahs (Yāsīn, As-Sajdah, Al-Mulk, Al-Wāqi'ah, Ar-Raḥmān, Al-Kahf first 10) using the same approach as the Juz Amma seed (per-ayah units with Arabic text, transliteration, translation, audio from everyayah.com).

**Decision 3 — Du'ā audio: Plan for MP3s**
hrasheed confirmed: Assume we will have MP3 files for du'ā recitation. hrasheed can record them personally if no other source is found. Design the system to reference MP3 audio files. No TTS fallback needed.

**Decision 4 — Teacher role: Phase 2**
hrasheed confirmed: Teacher/facilitator role is Phase 2. Not blocking MVP definition.

**Why:** These 4 decisions were surfaced in the Maktab Online School research spike (docs/maktab-online-school-spike.html) as blockers for Sprint 1 planning.

---

### 41. Ibn Sina Decision — Program Enrollment UI + Grade Dashboard (2026-07-09)
**Author:** Ibn Sina (Frontend Dev)
**Status:** Implemented

Built the complete Program Enrollment UI and Grade Dashboard for the Maktab An Naṣīḥah curriculum. The backend (Khwarizmi) is building the Program/ProgramStage/ProgramEnrollment API concurrently; these components are type-safe against the agreed schema.

**Key Decisions:**

#### 1. TypeScript-first, API-ready with graceful fallback
- All components type against `frontend/src/types/program.ts` interfaces aligned with Khwarizmi's schema decision
- `ProgramCatalog` ships static `DEFAULT_STAGES` and `PLACEHOLDER_PROGRAM` constants so the page renders beautifully even before the backend API is live — no hard dependency on `/api/programs` being ready.
- `GradeDashboard` falls back to `currentStage.courses` (embedded in enrollment response) when `stageSummary` is unavailable.

#### 2. Separate Zustand store (`programStore.ts`)
- Program state is isolated from course state — different domain, different lifecycle.
- `isEnrolling` is a separate boolean from `isLoading` so the enrollment modal can show a spinner independently of page-level loading states.

#### 3. Child-first design decisions
- All interactive elements have `min-h-[44px]` for touch-friendly tap targets.
- Subject cards use large category emojis as the primary visual identifier — kids 4–7 recognize emoji faster than text labels.
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

Created two new maktab seed files (`seed-maktab-foundation1.ts`, `seed-maktab-foundation2.ts`) for the pre-coursebook foundation stages (ages 4–6).

**Key Choices:**

#### flashcardIndex resets per unit
Each unit's flashcards start at `orderIndex = 0`. The composite unique key `unitId_orderIndex` ensures no collisions. This differs from the coursebook seeds which use a single running `flashcardIndex` across all units in the file, but is correct here because the uniqueness constraint is per-unit.

#### Foundation 2 ageLevels includes both EARLY_CHILD and CHILD
Foundation 2 spans ages 5–6, which straddles the boundary. Both levels are included so it surfaces correctly for both age groups in the catalogue.

#### Both courses use category FIQH
All maktab curriculum courses use `FIQH` as their category. The broader du'ā and Qur'ān subject matter fits within this category label consistent with team convention.

#### Foundation seeds called before Coursebook 1 in seed.ts
Age ordering: Foundation 1 (4–5) → Foundation 2 (5–6) → Coursebook 1 (6–7) → ... Coursebook 8. The call order in `seed.ts` reflects this natural age progression.

**Files Created:**
- `backend/prisma/seed-maktab-foundation1.ts`
- `backend/prisma/seed-maktab-foundation2.ts`

**Files Modified:**
- `backend/prisma/seed.ts` — imports + calls added before `seedMaktabCoursebook1`

---

### 43. Quran Memorization — Longer Surahs Seed (2026-07-09)
**Author:** Khwarizmi (Backend Dev)

**Context:**
The maktab syllabus CB5–CB8 requires memorization of longer surahs by older students. The existing Juz Amma course (`seed-quran-memorization.ts`) covers short surahs (Al-Fatiha + surahs 93–114). A second standalone seed is needed.

**Decisions Made:**

#### 1. Exclude surahs 93 and 94 from the new course
Surahs 93 (Ad-Duha) and 94 (Ash-Sharh) appear in the CB5 syllabus but are already fully seeded in the Juz Amma course. Duplicating them would create two courses with identical units for the same content, leading to double-counting of completion and confusing students. **They are skipped.**

#### 2. Al-Kahf partial-surah via client-side slice
The api.quran.com v4 API does not support a stable `per_page`/`from_ayah` offset that guarantees exactly 10 results across all pagination implementations. Rather than craft a fragile pagination URL, we fetch all 110 verses and slice `[:10]` client-side. This is safe because the full chapter is ~11 KB JSON — negligible overhead. The `limitToAyahs` parameter on `fetchSurahData()` keeps the logic self-contained.

#### 3. Reuse exact same pattern as Juz Amma seed
No new abstractions introduced. The new file is a deliberate copy-and-adapt to keep both seeds independently readable and runnable. Shared helpers (HTML builders, slug generation, audio URL builder) are inlined rather than extracted to a shared module — this avoids a new dependency that would force both seeds to import from a third file.

#### 4. ageLevels: `['CHILD', 'PRE_TEEN', 'TEEN']`
The CB5–CB8 syllabus targets ages 10–14. Including CHILD (10+) covers CB5 students who may appear in the CHILD age category depending on their profile.

**Files Affected:**
- `backend/prisma/seed-quran-longer-surahs.ts` — new file
- `backend/prisma/seed.ts` — import + call added after `seedQuranMemorizationCourse()`

---

### 44. Program/ProgramStage/ProgramEnrollment Schema + API (2026-07-09)
**Author:** Khwarizmi (Backend Dev)
**Status:** Implemented — pending migration

**Context:**
Online Maktab requires a curriculum-level abstraction above the existing `Course` model. A `Program` is a named curriculum (e.g., "Maktab An Nasihah"), a `ProgramStage` is a year/grade within it, and `ProgramEnrollment` tracks which child is in which program on which learning path.

**Decisions:**

#### 1. `LearningPath` and `Gender` as first-class enums
Both become PostgreSQL native enums via Prisma. This makes invalid values a hard DB-level error rather than a silent string mismatch.

#### 2. `ProgramEnrollment.status` stays `String`, not enum
Mirrors `CourseEnrollment.status`. Keeps flexibility to add statuses (e.g., `GRADUATED`) without a migration for every edge case.

#### 3. Course ↔ ProgramStage is an implicit M2M
No join model. Prisma's implicit join table (`_CourseToProgamStage`) is adequate until we need to store ordering or additional metadata on the relationship.

#### 4. `GET /programs/:slug` served at `/programs/slug/:slug`
The Express router cannot distinguish `/programs/some-slug` (string) from `/programs/:programId` (UUID) purely by regex without reordering. Using a dedicated `/slug/` prefix eliminates the ambiguity cleanly.

#### 5. `Unit.includedInPaths` — empty array = all paths
An empty array means the unit is available on every learning path. A non-empty array restricts to listed paths only. Frontend must filter units by the enrolled member's `path` before displaying them.

#### 6. `FlashCard.stageTag` / `subjectTag` — nullable Strings
Kept as plain strings (e.g., `"F1"`, `"DUA"`) rather than enums. Stage codes are not stable enough to model as DB-level enums; filtering is done at query-time by the frontend or service layer.

#### 7. Migration not run
`prisma generate` succeeded. The actual `migrate dev` / `migrate deploy` will be executed once the team has reviewed the schema and scheduled a maintenance window.

**Impact:**
- **Frontend (Ibn Sina):** New `/api/v1/programs` endpoints available. Enroll via `POST /programs/:programId/enroll`. Use stage-summary endpoint for grade-level progress UI.
- **Seed scripts:** Can now reference `Program` and `ProgramStage` models.
- **FamilyMember:** Now carries optional `gender` — seed scripts and registration flow can optionally populate this.

---

### 45. Prod Deploy Gap — SWA Cache-Control + Orphan Config + skip_app_build (2026-07-09)
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
3. **Further Studies normalization:** Mixed modules map to broad subject tags (e.g., `maktab-fs-identity` → `AKHLAQ`, essentials/devotional → `FIQH`).
4. **Idempotency via overwrite:** Re-running always overwrites `stageTag` and `subjectTag`; updates batched and chunked to avoid row-at-a-time writes.

**Files:**
- `backend/prisma/seed-flashcard-tags.ts`

---

### 47. Program seed decisions (2026-07-09)
**Author:** Khwarizmi (Backend Dev)

Seeded the new `Program` / `ProgramStage` layer for "Maktab An Nasihah" curriculum using existing course slugs as source of truth.

**Key Decisions:**
1. **Content-only and idempotent:** Uses `program.upsert()` and `programStage.upsert()`; stage-course links reset with `set: []` + `connect`.
2. **Quran memorization cross-cutting:** Stage 12 is the explicit "Quran Memorization" stage; both Quran courses also connected to stages 1–11.
3. **Open-ended age ranges use `ageMax: 99`:** For "14+" ranges, seed uses `99` as explicit upper bound.
4. **Seed ordering:** `seedMaktabProgram()` called in `seed.ts` after all course seeds and `seedWeekendPathTags()` so all referenced course slugs exist first.

**Files:**
- `backend/prisma/seed-maktab-program.ts`
- Modified: `backend/prisma/seed.ts`

---

### 48. Ibn Sina Decision — ProgramCatalog Must Fetch Family Members on Mount (2026-07-09)
**Author:** Ibn Sina (Frontend Dev)
**Status:** Implemented

## Problem

The "Enroll in Maktab An Naṣīḥah" popup showed no children to select, and the "Start the Journey" button stayed permanently disabled. Root cause: `ProgramCatalog` (`/programs`) fetched programs on mount but never fetched family members. `EnrollModal` (nested in the same file) reads its learner list from `useFamilyStore().members`. Navigating directly to `/programs` via the new Maktab sidebar link left the family store empty → empty learner grid → `selectedMemberId` stuck at `''` → disabled CTA.

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

- Matches the established app-wide pattern — no new abstractions.
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
**Status:** Implemented — green in production

**Context:**
Enrollment feature hit production with undetected bugs (members filtered incorrectly, modal crashed on live payloads, routes misaligned). CI showed green but real users saw failures. This decision formalizes mandatory production verification before reporting task completion.

**Key Decisions:**

#### 1. Production Completion Gate is mandatory
No feature is "done" until:
- Code deploys to production (`git push main` → CI passes)
- Authenticated end-to-end test passes against production
- Real user journeys verified with designated test account (hassan.rasheed1@live.com)

This replaces "code review + CI green" as the completion bar.

#### 2. Authenticated E2E infrastructure
- `frontend/playwright.config.ts` — configured for both local and CI environments
- `frontend/e2e/authenticated-enrollment.spec.ts` — logs in as test account, enrolls child in Maktab An Naṣīḥah, verifies stage display
- `frontend/.env.e2e.example` — template for test credentials (email/password never committed)
- `docs/e2e-authenticated-testing.md` — runbook for developers
- `package.json` test:e2e scripts — `test:e2e:ui` for dev, `test:e2e` for CI
- Credentials passed via `process.env.TEST_EMAIL` / `process.env.TEST_PASSWORD`; never in source

#### 3. Root causes fixed
- **(a) EnrollModal member filtering:** Backend didn't return `isActive` → frontend treated missing as falsy → users vanished. Fixed: treat missing `isActive` as `true`, exclude `isAccountOwner`.
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
- Enrollment flow end-to-end in production with test account: **✓ Verified**
- Commits green on main: `486e75b` (E2E), `85b2f34` (rollup fix), `9dd913d` (program routes)

---

### 50. Ibn Sina Decision — Dashboard Reconcile: Parent Progress Display (2026-07-19)

**Author:** Ibn Sina (Frontend Dev)
**Status:** Implemented

**Context**

Two dashboard views showed inconsistent progress data:
- Parent Dashboard (children overview list) had no progress % column
- Child Dashboard showed per-course progress bars reading `enrollment.progress` from backend

Khwarizmi was simultaneously fixing `isUnitComplete` (to trigger on `readingCompleted` alone) and updating `getChildrenWithStats` to return `overallProgress` and correct `coursesEnrolled`/`coursesCompleted` counts.

**Decision**

1. **Extend `ChildSummary` type:** Added `overallProgress: number` and `coursesCompleted: number` to `ChildSummary` in `frontend/src/types/dashboard.ts`. These are computed by the backend `getChildrenWithStats` endpoint — frontend treats them as read-only.

2. **Add Overall Progress column to ParentDashboard:** In the children overview list (`ParentDashboard.tsx`), added a "Progress" stat cell showing `child.overallProgress%` (hidden sm:block, styled identically to other stat cells). Updated the "Courses" stat to read `{N} active` + optional `({M} done)` suffix.

3. **No changes to ChildDetailView or ChildDashboardHome:** Both views already read progress from the correct backend fields: `ChildDetailView` uses `course.progress` from `selectedChildStats.courseProgress`; `ChildDashboardHome` uses `enrollment.progress ?? 0` from `useChildEnrollments`.

**Rationale**

Single source of truth: both parent and child views now read from the same backend-computed `enrollment.progress`. When Khwarizmi's `isUnitComplete` fix lands, both dashboards update correctly with zero further frontend changes.

**Files Changed**

- **Modified:** `frontend/src/types/dashboard.ts` — added `overallProgress`, `coursesCompleted` to `ChildSummary`
- **Modified:** `frontend/src/pages/dashboard/ParentDashboard.tsx` — added Progress stat, improved Courses stat

**Validation**

`npx tsc --noEmit` passed with zero errors.

---

### 51. Unit Completion = readingCompleted Only (2026-07-19)

**Author:** Khwarizmi
**Status:** Implemented

**Context**

Course progress was permanently stuck at 0% for all enrolled members. The `isUnitComplete()` helper in `course.service.ts` required all three flags (`videoCompleted && readingCompleted && quizCompleted`) to be true simultaneously. In practice, most course units have no video content, so `videoCompleted` is never set → no unit ever passes the gate → `enrollment.progress` stays 0%.

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
| `frontend/src/types/dashboard.ts` | `ChildSummary` already had `overallProgress` and `coursesCompleted` — no change needed |

**Impact on Quiz-Completion-Only Flows**

Quiz completion alone (`quizCompleted = true`, `readingCompleted = false`) will **NOT** mark a unit complete under the new logic. This is intentional: a learner who jumps straight to the quiz without reading the lesson has not completed the unit. If a future flow (e.g., assessment-only mode) needs quiz-only completion, introduce a separate flag or a dedicated completion pathway rather than widening the `isUnitComplete` gate again.

**Alternatives Rejected**

- **Any-of-three**: Would let a video-only or quiz-only action count as complete — too broad, degrades learning integrity.
- **Weighted/ordered**: Over-engineered for current needs; revisit if curriculum team requires richer completion criteria.

---

### 52. Unit Content → Azure Blob Storage Migration (2026-07-17)

**Author:** Khwarizmi (Backend Dev)
**Date:** 2026-07-17
**Status:** Implemented

**Decision**

Unit lesson content (rich HTML, Arabic text) is migrated from `units.content @db.Text` (PostgreSQL) to Azure Blob Storage. The DB now stores a `contentUrl String?` pointing to the blob URL. The `content` column is retained as a deprecated nullable fallback until all records are confirmed migrated, at which point a separate cleanup migration will drop it.

**Why**

The `content` column was the primary PostgreSQL storage cost driver. Each unit stores 10–80 KB of HTML content with Arabic text. At ~50,000 lines across 37 seed files and hundreds of units, the cost differential between Azure Blob Storage and Azure PostgreSQL Flexible Server for this bulk text data is significant. Blob Storage is orders of magnitude cheaper per GB for static content.

**What Changed**

**Schema (`backend/prisma/schema.prisma`)**
- Added `contentUrl String?` to `Unit` model
- Annotated `content String? @db.Text` as deprecated

**Migration (`backend/prisma/migrations/20260717_add_unit_content_url/migration.sql`)**
```sql
ALTER TABLE "units" ADD COLUMN "contentUrl" TEXT;
```

**New Files**
- `backend/prisma/helpers/blob-upload.ts` — `uploadUnitContent()` and `isBlobStorageAvailable()` utility
- `backend/prisma/migrate-content-to-blob.ts` — idempotent one-time migration script (run against prod)

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

**Seed Files — Two-Step Pattern (top 5 by volume)**
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

### 53. Khaldun Review: Unit Content → Azure Blob Storage Migration (2026-07-17)

**Date:** 2026-07-17
**Reviewer:** Khaldun (Lead / Architect)
**Verdict:** APPROVED WITH NOTES

**Area-by-Area Review**

1. **`infra/resources.bicep` — Storage Account + Container:** APPROVED
   - `Standard_LRS StorageV2` is appropriate for non-critical content (source of truth remains the seed files)
   - Public blob access (`publicAccess: 'Blob'`) is intentional — course content is educational material meant for enrolled users' browsers to fetch directly without passing through the API
   - CORS `GET *` is correct for cross-origin fetch from SWA
   - Connection string stored in Key Vault and passed as Container App secret — good
   - Outputs include `storageAccountName` and `storageEndpoint` — useful for CI/CD

2. **`backend/prisma/schema.prisma` — `contentUrl` column:** APPROVED
   - Nullable `String?` allows gradual migration
   - Comment marks `content` as deprecated — good signal for future devs
   - No breaking changes to existing queries

3. **`backend/prisma/migrations/20260717_add_unit_content_url/migration.sql`:** APPROVED
   - Simple `ADD COLUMN` with nullable TEXT — zero-downtime DDL on PostgreSQL
   - No default, no constraint — safe for production

4. **`backend/prisma/helpers/blob-upload.ts`:** APPROVED
   - Singleton container client pattern avoids repeated connection initialization
   - Content-Type header set to `text/html; charset=utf-8`
   - 24h cache-control is reasonable for curriculum content that changes infrequently
   - `isBlobStorageAvailable()` allows graceful degradation in local dev

5. **`backend/prisma/migrate-content-to-blob.ts`:** APPROVED
   - Idempotent: `WHERE content IS NOT NULL AND contentUrl IS NULL`
   - `--dry-run` shows what would be migrated without side effects
   - `--no-clear` allows parallel validation (blob + DB both available during testing)
   - Per-unit error handling — one failure doesn't abort the batch
   - Disconnects Prisma on exit

6. **`backend/src/services/course.service.ts` — `getUnit()` response shape:** APPROVED
   - Returns both `content.text` and `content.contentUrl` — frontend can choose
   - After migration, `text` will be null, but field is present for backward compat
   - No breaking API contract change

7. **Seed files (coursebook1–4, further-studies):** APPROVED
   - Two-step pattern: upsert with inline content → conditional blob upload
   - Guard: `isBlobStorageAvailable() && unit.content && !unit.contentUrl`
   - `update` clause in upsert does NOT include `content` — re-seeding won't overwrite blob URLs
   - Without `AZURE_STORAGE_CONNECTION_STRING`, seeds still populate inline content — local dev works

8. **Frontend: types, hook, UnitViewer:** APPROVED WITH CONCERN
   - `useUnitContent` hook correctly prioritizes `contentUrl` over `text`
   - Graceful fallback: on blob fetch failure, falls back to `content.text` if available
   - Loading skeleton and error states handled in UnitViewer
   - `SyncedTextContent` uses `dangerouslySetInnerHTML` — this is **pre-existing** and applies equally to inline content. The blob source doesn't introduce new XSS surface since we control blob uploads

**Concerns / Follow-Up Items**

- **CONCERN 1: No HTML sanitization on blob content (low risk, document)** — `dangerouslySetInnerHTML` renders blob HTML without sanitization. Currently safe because only our seed scripts and migration script upload to the blob container. Follow-up: If admin content editing is ever added, add DOMPurify or similar before render.

- **CONCERN 2: CORS origin wildcard** — `allowedOrigins: ['*']` is fine for now (public educational content), but when moving to a custom domain, tighten to the specific SWA domain(s).

- **CONCERN 3: No blob CDN layer** — For production traffic at scale, consider placing Azure CDN or Front Door in front of the blob endpoint. The 24h `Cache-Control` header is already CDN-friendly.

**Final Verdict**

**APPROVED WITH NOTES** — Ship it. The implementation is sound, backward-compatible, and safely idempotent. Follow-up items (sanitization, CORS tightening, CDN) are non-blocking enhancements for a future iteration.

---

### 54. Learner-Switching UI Flow (2026-07-21)

**Author:** Ibn Sina  
**Date:** 2026-07-21  
**Status:** Implemented

**Decision**

Introduced a `isParentInStudentMode` flag in `familyStore` to distinguish between two parent→child scenarios:

1. **Parent previewing** (from parent dashboard → child view): `isParentInStudentMode = false` → amber "Parent preview" banner shown in `ChildLayout`
2. **Parent in student mode** (SelectLearner → pick child): `isParentInStudentMode = true` → no banner, full student UX, "Switch Learner" button available in sidebar

**Key Rules**

- **Switch Learner button** is always visible in left nav when `isParentAuth === true` (both `ChildLayout` and `MainLayout`).
- The button requires PIN verification (`authService.verifyParentPin`) before proceeding to `/select-learner`.
- If parent has no PIN configured, a toast message shows ("Set a parent PIN in Settings…") and the switch proceeds anyway.
- PIN status is pre-fetched on mount to avoid latency at click time.
- `isParentInStudentMode` is included in `familyStore` `partialize` so it survives page refreshes.

**Files Changed**

- `frontend/src/stores/familyStore.ts` — added `isParentInStudentMode` state + action + persist
- `frontend/src/pages/SelectLearner.tsx` — `completeSelect` sets the flag
- `frontend/src/components/auth/ParentPinModal.tsx` — `targetMember` now optional; added `memberId`, `title`, `description` props
- `frontend/src/components/layouts/ChildLayout.tsx` — Switch Learner button, refined `isParentViewing` logic
- `frontend/src/components/layouts/MainLayout.tsx` — replaced multi-branch switcher with unified PIN-gated "Switch Learner" button

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
| 1 | Parent → child (Student View) | `/child/dashboard` | No preview banner; Switch Learner in sidebar; student nav visible |
| 2 | Parent → self (Parent View) | `/dashboard` | Stays on /dashboard; Switch Learner visible; parent nav; no preview banner |
| 3 | Switch Learner from ChildLayout | `/child/dashboard` | PIN modal with "Enter your PIN to switch learner"; correct PIN → /select-learner |
| 4 | Switch Learner from MainLayout | `/dashboard` | PIN modal same description; correct PIN → /select-learner |
| 5 | Child direct login bypass | `/child/dashboard` | Not redirected to /select-learner or /child-login; Switch Learner absent |
| 6 | Parent preview banner | `/child/dashboard` | "Parent preview" banner + "← Parent View" link + Switch Learner button all visible |

**State Injected**

All tests use `page.addInitScript` to inject `localStorage`:

- `auth-storage`: parent auth (accessToken, refreshToken, user, family, isAuthenticated)
- `family-storage`: `{ selectedMember, isParentInStudentMode }` — the new flag from Ibn Sina's implementation
- `child-auth-storage` (Test 5 only): `{ member, isAuthenticated: true, isChildSession: true, accessToken: 'mock-token' }`

**Key Technical Decisions**

1. **`isParentInStudentMode`** distinguishes "parent in full student mode" (no banner) from "parent previewing child view" (amber banner). Tests 1 and 6 use the same selectedMember but differ only in this flag.

2. **Test 5 (child direct login)** uses a mock JWT — the routing test only requires `isAuthenticated && isChildSession` to be true in the Zustand store. API calls will fail with 401 but the page must NOT redirect.

3. **Switch Learner locator** in sidebar tests is scoped to `aside` (`page.locator('aside').getByRole(...)`) to avoid ambiguity with the banner's own Switch Learner button in Test 6.

4. **PIN status wait** (Tests 3 & 4): `page.waitForResponse('/auth/parent-pin/status')` before clicking — same race condition guard established in `phase1-pin-gate.spec.ts`. Without this, `hasPinCache` may not be populated and the PIN modal may not appear.

5. **Auto-submit on 4th digit**: `firstInput.pressSequentially(parentPin, { delay: 100 })` — React focus management advances input focus, and the modal auto-submits after the 4th digit.

**Test Account Constants**

- Parent email: `hassan.rasheed1@live.com` (env: `E2E_PARENT_EMAIL`)
- Parent PIN: `5823` (env: `E2E_PARENT_PIN`)
- Ibn Sharif (child): `id = b32bf819-1662-47c5-b80f-2e2ca6bd26ab`, `familyId = fb93318f-648d-4bee-808e-71ff89f6c371`
- Hassan self-enrolled member: `id = 885ba420-5188-44f0-bbf1-30e622ec65aa`

---

### 56. Maktab Coursebook 5 — Unit Split Restructure (2026-07-26)

**Date:** 2026-07-26  
**Author:** Khwarizmi (Backend Dev)  
**Status:** Implemented  

**Summary**

Completely rewrote `backend/prisma/seed-maktab-coursebook5.ts` to split 7 large multi-topic units into **22 focused single-topic units**. Each unit now covers exactly ONE main topic/heading, and every quiz tests only that unit's content.

**Before:** 7 units × multiple unrelated sub-topics per unit  
**After:** 22 units × 1 focused topic each

**Key Changes**

- 7 → 22 units (3x more granular)
- 112 questions redistributed (5–6 per unit)
- ~58 flashcards redistributed across all 22 units
- ~50 Arabic terms redistributed from the original 7 units
- Old unit slugs not deleted (new units have new slugs; a separate migration/cleanup script would be needed)

**File Stats**

- **File:** `backend/prisma/seed-maktab-coursebook5.ts`
- **Size:** ~176KB (was 179KB)
- **Lines:** 2774
- **TypeScript check:** ✅ No errors (`npx tsc --noEmit`)

---

### 57. Maktab Coursebook Audit & Unit Split Plan (2026-07-26)

**Date:** 2026-07-26
**Author:** Khaldun (Lead/Architect), Khwarizmi

**Part 1: Answer Correctness Audit Results**

Audit method: Parse every `prisma.question.upsert` block in each file by splitting on that token, then extract `type`, `correctAnswer`, and `options` fields. For `MULTIPLE_CHOICE`, verify `correctAnswer` is in the parsed options array. For `TRUE_FALSE`, verify value is `'True'` or `'False'`. `FILL_BLANK` is exempt (no options check needed).

**Verdict: All 12 files pass the correctness audit.**

Every `correctAnswer` in a `MULTIPLE_CHOICE` question exactly matches one of the strings in its `options` array. Every `TRUE_FALSE` question has `correctAnswer` of `'True'` or `'False'`. No questions have `type: 'MULTIPLE_CHOICE'` with missing or undefined options.

**Part 2: Unit Split Plan**

**Design Principle:** Each current unit bundles an entire subject (Fiqh, Aḥādīth, Sīrah, etc.) into one large unit. The goal is to split each subject unit into **topic-focused sub-units**, each covering ONE main topic, so that quizzes are targeted rather than broad.

Slug pattern: `maktab-{N}-{subject}-{topic}` (for coursebooks); `foundation-{N}-{subject}-{topic}` (for foundation); `maktab-fs-{topic}` (for further studies).

**Status:** Decision approved; Coursebook 5 implementation complete. Remaining coursebooks (1–4, 6–8) to follow.

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

**ArabicTerm seeding (review units):** Unchanged — one entry per full ayah.

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

## Governance

- All meaningful changes require team consensus
- Document architectural decisions here
- Keep history focused on work, decisions focused on direction
- **PRODUCTION COMPLETION GATE (mandatory):** Feature is not complete until authenticated E2E passes against production
