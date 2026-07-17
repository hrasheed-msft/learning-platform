# Ibn Sina — Frontend Dev

**Focus:** React component development, user flows, performance optimization, audio/video UI, gaming frontend

## Project Context

- **Owner:** hrasheed
- **Project:** Islamic Studies Learning Platform — family-based Islamic education with courses, flashcards, SRS, quizzes, and gamification
- **Stack:** React 18 + Vite + TypeScript (frontend), Node.js + Express + Prisma + PostgreSQL + Redis (backend), TailwindCSS, Zustand, JWT auth
- **Created:** 2026-05-16

## Learnings

### Blob Storage Content Migration — useUnitContent hook (2026-07-17T09:58:43-05:00)

- **`useUnitContent` hook added** (`frontend/src/hooks/useUnitContent.ts`): Resolves unit HTML content from either `contentUrl` (Azure Blob fetch) or inline `content.text`. Returns `{ html, loading, error }`.
- **Backward compat preserved:** When `contentUrl` is absent, `content.text` is used directly — no network round trip, zero behaviour change for existing units.
- **Error fallback:** On blob fetch failure, error message shown; if `content.text` is also available it still renders (belt-and-suspenders).
- **`UnitContent` type updated** (`frontend/src/types/course.ts`): Added `contentUrl?: string | null` and tightened `text` to `string | null`.
- **Quran audio enhancement effect** gated on both `loading` AND `contentLoading` so the DOM enhancement runs after fetched HTML is rendered, not before.
- **`hasInteractiveLessonLink`** now tests `resolvedHtml ?? ''` so the Masaar lesson CTA still works for blob-delivered content once fetched.
- `npx tsc --noEmit` passed with zero errors after all changes.

### Parent–Child Navigation UX — 10-Issue Fix (2026-07-13T21:10:35-05:00)

All 10 issues from the parent-child navigation review resolved in a single pass. `npx tsc --noEmit` passed with zero errors.

- **Enrollment CTA on ChildDashboardHome:** Added `{!isLoading && !activeProgramEnrollment && ...}` block directly after greeting. `isLoading` and `activeProgramEnrollment` were already available in scope; `Link` was already imported.
- **MainLayout learner switcher always visible:** Replaced single `isAccountOwner === false` guard with a three-branch conditional: child selected → "Switch to Student View"; `members.length === 0` → "Add a learner" (amber, links to `/settings`); `members.length > 0 && !selectedMember` → "Student view" (green, links to `/select-learner`). Added `members` to `useFamilyStore()` destructure.
- **EnrollModal pre-selects active child:** Added `selectedMember: preselectedMember` from `useFamilyStore`. Changed `selectedMemberId` initial state to `preselectedMember?.isAccountOwner === false ? preselectedMember.id : ''`. Added mount `useEffect` to sync `selectedStageNumber` for pre-selected member once stages are available.
- **GradeDashboard empty-state fix:** Extracted `isChildSession` from `useChildAuthStore`. Wrapped the `/programs` CTA in `{!isChildSession && (...)}` so child direct logins see only the "ask your parent" text without a confusing parent-facing link.
- **ChildLayout logout fix:** Branched `handleLogout` on `isParentViewing`: if true → `navigate('/dashboard')` (parent session still active); else → `logout()` + `navigate('/child-login')`.
- **ageCategory formatting:** Added `formatAgeCategory` helper (`replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, ...)`) as a component-level const. Replaced raw `.replace('_', ' ')` with `member?.ageCategory ? formatAgeCategory(member.ageCategory) : 'Student'`. The helper handles multi-underscore categories like `PRE_TEEN` → "Pre Teen" correctly.
- **SelectLearner Parent/Student badges:** Added role badges conditional on `!isCurrent` to avoid overlapping with the "Current" badge. `member.isAccountOwner` → amber "Parent" badge; `!member.isAccountOwner` → green "Student" badge. Tile already had `relative` positioning.
- **"Switch child" in parent preview banner:** Wrapped the existing "← Parent View" link and new "Switch child" link in a `flex gap-2 shrink-0` container. Both render only inside `{isParentViewing && ...}`.
- **Maktab mini-card on ChildDashboardHome:** Added a horizontal `Link` card between streak/activity section and quick-stats grid, visible only when `activeProgramEnrollment` is set. Shows stage name, "My Maktab" label, progress %, and links to `/child/maktab`.

### Enrollment Bug Trilogy (2026-07-13T20:23:51-05:00)

- **AGE_CATEGORY_MIDPOINT keys must match Prisma enum exactly:** API returns `EARLY_CHILD`, `CHILD`, `PRE_TEEN`, `TEEN`, `ADULT`. Any mismatch causes silent fallthrough to "stage cannot be detected" for all ageCategory-based lookups. Always verify map keys against the backend enum source of truth.
- **`GET /programs` omits stages:** The programs list endpoint does not populate stage arrays. Always call `GET /programs/slug/:slug` (or equivalent detail endpoint) before opening EnrollModal to ensure `program.stages` is populated. Use on-demand fetch at click time; don't eagerly fetch all programs with full stages.
- **DEFAULT_STAGES must mirror real program stages:** Static fallback stages used for both display AND stage number detection. If the fallback stageNumbers diverge from the real program's stageNumbers, detected stageNumber N from DEFAULT_STAGES maps to wrong stage N in the backend. Always keep DEFAULT_STAGES in sync with the real curriculum on both stageNumber and ageMin/ageMax.
- **Parent-view Logout gap:** When `isParentViewing=true` in ChildLayout, the Logout button calls `childAuthStore.logout()` and navigates to `/child-login`. This is wrong for parent sessions — they haven't authenticated via child-login. Branch logout behaviour on `isParentViewing`.

### Stage Auto-Detection + View Switching (2026-07-13T16:28:11-05:00)


- **Null age coercion bug:** `age >= s.ageMin` when `age` is a runtime null coerces null → 0, so `0 >= 4` is always false → no stage matches → backend defaults to stage 1. Fix: explicitly guard `if (age != null && age > 0)` before the range comparison.
- **ageCategory fallback:** When age is null, map ageCategory to a representative midpoint (young_children→5, children→9, teens→13, adults→null) and run the same range-find on that midpoint. Adults have no usable midpoint → must pick manually.
- **Surface detected stage in UI:** Always show the detected stage name in the EnrollModal (not just silently pass to backend). Parent can expand a `<details>` widget to override. If detection fails (adults, or truly no age data), show a required `<select>` — never silently default.
- **Enroll button gate:** `disabled={!selectedMemberId || isEnrolling || selectedStageNumber === undefined}` prevents submission when stage is required but unset.
- **Module-level helpers:** Moved `detectStageNumber`, `getDetectionSource`, `getStageDisplay` outside of `EnrollModal` so they can be pure, testable, and receive `stages: ProgramStage[]` as a parameter. This avoids stale closure issues and makes the helpers reusable.
- **resolveStages helper:** Encapsulates `program.stages.length > 0 ? program.stages : DEFAULT_STAGES` logic in one place; called once inside `EnrollModal` to get `stages` constant used throughout.
- **Parent↔Child view switching:** Two gaps were missing: (A) no "Student View" button when a child is selected in MainLayout sidebar, (B) no "Parent View" back-banner in ChildLayout. Both are trivially detectable: (A) `selectedMember?.isAccountOwner === false`, (B) `isParentAuth && !isChildSession`. Both fixed with < 20 lines each.
- **ChildLayout useAuthStore:** Import `useAuthStore` separately from `useChildAuthStore`; both stores are needed simultaneously. `isChildSession` lives on `useChildAuthStore`, `isAuthenticated` lives on `useAuthStore`.
- **TypeScript cast for runtime nulls:** `member.age as number | null | undefined` silences the strict-mode false-positive that would flag `age != null` as always-true, while preserving runtime correctness.
- **Commit:** (pending push)

### Child UX Phase 1 — PIN Gate, Nav Filter, Maktab Courses, SelectLearner Redirect (2026-07-10T23:00:25-05:00)

- **ChildProtectedRoute dual-path (Option a):** Updated the guard to allow access when `useAuthStore().isAuthenticated && selectedMember?.isAccountOwner === false` (parent viewing child) in addition to the existing child-direct-login path. Simpler than a full child-auth login from SelectLearner, and avoids duplicating the child login flow. Redirect falls back to `/select-learner` (not `/child-login`) so parents aren't asked for child credentials unnecessarily.
- **SelectLearner routing split:** `member.isAccountOwner === false` → navigate to `/child/dashboard`; otherwise → `/dashboard`. The `isAccountOwner` field is optional (`boolean | undefined`) so `=== false` is the safe check (avoids catching `undefined` as child).
- **PIN gate only on child→parent transition:** Only gate when `currentIsChild && switchingToParent`. Parent→child, parent→parent, and first-time selections are all ungated. `hasPinCache` is pre-fetched on mount so the modal opens instantly.
- **Graceful PIN degradation:** If `verifyParentPin` throws any non-429 error (endpoint not deployed yet), log a warning and call `onVerified()` anyway. Once Khwarizmi's backend is up, the guard activates automatically with zero frontend changes.
- **useChildEnrollments fallback:** `effectiveMemberId = childMember?.id ?? selectedMember?.id`. Returns a synthetic `ChildMember` object from `FamilyMember` fields so all child pages work in both auth paths without separate hooks.
- **Maktab course grouping via client-side join:** Fetch `programEnrollments` via `useProgramStore`, extract `currentStage.courses[].id` into a `Set<string>`, then classify each `CourseEnrollment` as Maktab by `maktabCourseIds.has(courseId)`. Works today and will also work once Khwarizmi's enrollment bridge auto-creates `CourseEnrollment` rows.
- **Navigation parentOnly flag:** Added `parentOnly: true` to nav items instead of hardcoding href strings in the filter. Cleaner and easier to extend.
- **Commit:** b76fea3 pushed to main; build ✅ (14.45s, 1548 modules, zero TS errors).

### GradeDashboard Null-Safety — Defending Against stage-summary 500 (2026-07-10T18:32:12-05:00)
- **Root Cause:** `currentStage` from `/programs/enrollment/:memberId` only carries `{ id, stageNumber, name, orderIndex }` — no `courses` array. When `/programs/enrollment/:memberId/stage-summary` returns 500, `stageSummary` stays null and `activeEnrollment.stageProgress` is also undefined, so `summary?.subjectProgress` is falsy. The component fell through to the else-branch and called `currentStage.courses.map()` → `TypeError: Cannot read properties of undefined (reading 'map')` → React unmounted the tree → blank page.
- **Fix Pattern (three-branch guard):**
  1. Happy path: `summary?.subjectProgress?.length > 0` → render subject cards from summary.
  2. Fallback: `(currentStage?.courses ?? []).length > 0` → render static course cards from the enrollment's courses array when present.
  3. Empty state: both sources absent → render "Your Maktab journey is being prepared / No lessons available yet" card. Never crash.
- **Error Surfacing:** Added `error` from `programStore` and rendered an inline red banner (`⚠️ {error} — Some progress data may be unavailable.`) so API failures are visible during diagnosis rather than silently blank.
- **Key Rule:** Never call `.map()` on a property that comes from a partial API response without `?? []` or a length-check guard. Enrollment and stage-summary are two separate endpoints with different response shapes; always destructure defensively.
- **Commit:** b0d3fcf pushed to main; build ✅.

### Authenticated E2E Testing — Playwright Against Production (2026-07-10T16:40:00Z)
- **Infrastructure Added:** `frontend/playwright.config.ts`, `frontend/e2e/authenticated-enrollment.spec.ts`, `frontend/.env.e2e.example`, `docs/e2e-authenticated-testing.md`
- **Credential Strategy:** Test email/password passed via `process.env.TEST_EMAIL` / `process.env.TEST_PASSWORD` (env vars only, never in source code)
- **Test Account:** hassan.rasheed1@live.com (designated production account for E2E)
- **Workflow:** Log in with test credentials, enroll child in Maktab An Naṣīḥah, verify stage display renders
- **Status:** ✅ Production E2E PASS 1/1 in 9.7s
- **Pattern for Future Work:** All feature work now requires authenticated E2E test before completion claim

### Program Service Routes Must Match Backend Exactly (2026-07-10T16:40:00Z)
- **Root Cause:** Frontend `program.service.ts` routes differed from backend:
  - Frontend (WRONG): `/programs/enrollments`, `/programs/${slug}`, `/programs/stage-summary/member/{id}`
  - Backend (CORRECT): `/programs/${programId}/enroll`, `/programs/slug/${slug}`, `/programs/enrollment/${id}`, `/programs/enrollment/${id}/stage-summary`
- **Fix:** Updated all routes in `frontend/src/services/program.service.ts` to match backend exactly
- **Learning:** Always cross-reference backend `routes.ts` when building frontend service methods. Route mismatch is a silent failure (API returns 404 but frontend may not surface the error clearly)
- **Related Decision:** Decision #49 documents all 4 enrollment bugs and their fixes

### ProgramCatalog Must Fetch Family Members on Mount (2026-07-09T22:53:10-05:00)
- `EnrollModal` in `ProgramCatalog.tsx` builds its learner list from `useFamilyStore().members`. When a parent navigates directly to `/programs` via the Maktab sidebar link, the family store is empty → no learner buttons render → `selectedMemberId` stays `''` → "Start the Journey" stays disabled.
- Fix: call `fetchMembers(family.id)` on mount in `ProgramCatalog`, where `family` comes from `useAuthStore()`. Guard with `if (family?.id)`.
- App-wide pattern: CourseDetail, GamesHub, FamilyDashboard all use this exact shape.
- Also added empty-state message in `EnrollModal` when `learners.length === 0`: "Add a learner in Settings first" with a `/settings` link.

---

## Quick Status (Most Recent)

**Enrollment Bug Fixes + Parent-Child UX Review (2026-07-13T20:23:51-05:00):** ✅ COMPLETE
- **Commit:** (pending)
- **Bug 1 — AGE_CATEGORY_MIDPOINT keys:** Fixed from lowercase descriptive keys (`young_children`, `children`, `teens`, `adults`) to actual Prisma enum values (`EARLY_CHILD`, `CHILD`, `PRE_TEEN`, `TEEN`, `ADULT`). `ADULT` midpoint set to 25 (not null).
- **Bug 2 — Programs fetched without stages:** `handleEnrollClick` converted to async; now calls `programService.getProgram(program.slug)` before opening EnrollModal so real stage data is always present. Falls back gracefully on fetch error.
- **Bug 3 — DEFAULT_STAGES mismatch:** Replaced 6-stage placeholder (Seedling→Scholar, wrong age ranges) with correct 12-stage curriculum (Foundation 1-2, Coursebook 1-8, Further Studies, Quran Memorization) typed as `ProgramStage[]`.
- **TypeScript:** `npx tsc --noEmit` — exit 0, zero errors.
- **UX Review:** `.squad/log/uux-review-parent-child-2025-07.md` — 10 issues found (3 HIGH, 4 MED, 3 LOW). Key findings: no enrollment CTA on ChildDashboardHome when unenrolled, sidebar "Switch to Student View" not discoverable on first login (requires selectedMember to already be set), ChildLayout Logout sends parent-preview users to /child-login instead of /dashboard, ageCategory displayed raw all-caps in ChildLayout.
- **Decisions:** `.squad/decisions/inbox/ibn-sina-enrollment-fix.md`


- **Commit:** 48523ff pushed to main; build ✅ (1877 modules, 0 TS errors, 2m 24s)
- **Types:** Added `NextUnit`, `StreakData`, `WeeklyActivityDay`, `NextUp` to `program.ts`; extended `SubjectProgress` (nextUnit, lastActivityAt, unitsCompletedLast7Days) and `StageProgressSummary` (nextUp, streak, weeklyActivity) — all optional for defensive degradation.
- **CourseLearner:** Added `useSearchParams`; `?unit=<id>` query param overrides the auto-selected resume unit. Navigating to `/child/courses/<courseId>/learn?unit=<unitId>` now scrolls to and highlights that specific unit.
- **GradeDashboard/SubjectCard:** Shows "Next: <title>" with ChevronRight icon (or "All caught up ✨"), "🔥 X this week" chip when unitsCompletedLast7Days > 0, "Last practiced <relative time>" line via `date-fns/formatDistanceToNow`. Card onClick now appends `?unit=<id>` when nextUnit is present. Streak pill added to header banner.
- **ChildDashboardHome:** Hero Continue CTA (dark green card, unit title, subject name, "Continue →" link) when `nextUp` is present. "You're all caught up! 🎉" celebratory panel with Games/Flashcards shortcuts when `nextUp` is null. Streak card (flame icon, current/longest, last active). `WeeklyActivityChart` (7 proportional div-bars, today highlighted orange, day labels). Streak stat tile now driven by live `streak.current`. `fetchMemberStageSummary` called on mount.
- **Degraded behavior:** When backend hasn't deployed new fields, all new UI sections are simply absent (optional chaining / null guards throughout). No crashes.
- **Route pattern:** `/child/courses/{courseId}/learn?unit={unitId}` — lands on CourseLearner, which scrolls to and marks the specified unit as the resume target.

- **Context:** New frontend features (ChildDuaProgressPage, ChildNamesProgressPage, GradeDashboard, Maktab section) not visible in production despite successful CI/CD.
- **Root Cause:** `frontend/public/staticwebapp.config.json` had no `Cache-Control` headers. Azure SWA + CDN served cached old index.html referencing old JS chunks.
- **Fix:** Added `no-cache, no-store, must-revalidate` for HTML routes and `public, max-age=31536000, immutable` for `/assets/*`. Deleted orphan `frontend/staticwebapp.config.json` (root level, never deployed by Vite). Added `skip_app_build: true` to CI SWA deploy steps.
- **Commit:** 96b3a01 pushed to main.
- **Relevant to:** All future frontend deployments must ensure SPA cache headers are correct to prevent stale app shells.

---

**Maktab Nav Entry Point (2026-07-09T21:58:27-05:00):** ✅ COMPLETE
- **Problem:** Parents couldn't find the evening/weekend learning-path selector. The feature existed in `ProgramCatalog`'s `EnrollModal` but had no sidebar link.
- **Fix:** Added `GraduationCap` icon import and `{ name: 'Maktab 🕌', href: '/programs', icon: GraduationCap }` entry to the `navigation` array in `frontend/src/components/layouts/MainLayout.tsx`, placed after "Courses".
- **Key Learning:** The evening (After-School) vs Weekend learning-path selector lives inside `ProgramCatalog`'s `EnrollModal` (rendered at `/programs`). The only thing missing was the sidebar nav entry. Active-state highlighting uses `location.pathname.startsWith('/programs')` which correctly highlights for both `/programs` and `/program/:slug`.
- `npx tsc --noEmit` passes clean.

---

**Anti-Rush Frontend: Cooldown Countdown + Delayed Answer Reveal (2026-06-20T17:18:56-05:00):** ✅ COMPLETE
- `CooldownStatus` type added to `assessment.ts`
- `getCooldownStatus(unitId)` method added to `assessmentService.ts` → `GET /assessments/units/:unitId/cooldown-status`
- On page load: cooldown status checked concurrently with questions fetch; if active, pre-quiz "Quiz Locked" screen shown
- On submit failure (`passed: false`): cooldown status fetched from backend to get authoritative `retryAt`; falls back to `now + 15min` if endpoint fails
- 429 handling: parses `retryAt`/`retryAfterMinutes` from error response body
- Countdown useEffect ticks every second from `cooldownEndsAt` → `cooldownSecondsLeft`
- "Try Again" button only visible when `cooldownSecondsLeft === 0`; replaced by amber countdown card while waiting
- Review panel gated by `passed`: failed students see ✅/❌ + their own answer only; passed students get full `correctAnswer` + `explanation` reveal
- `npx tsc --noEmit` passes clean

---

**Quiz Answer Security Fix (2026-06-20T14:01:24-05:00):** ✅ COMPLETE
- Removed `correctAnswer`/`explanation` from GET question flow
- Score and review panel now driven by `submitQuiz()` response
- `QuizSubmissionResponse` type aligned with actual backend shape
- `npx tsc --noEmit` passes clean

---
- Created `SyncedTextContent` component for inline highlighting
- Refactored `UnitAudioButton` to emit sync state via callback
- Updated `UnitViewer` to coordinate highlighting from audio playback
- Build passes; tests passing
- Decision #20 created

---

## Key Recent Learnings (2026-06-05 onwards)

### Maktab Nav Entry — Path Selection Lives in EnrollModal (2026-07-09T21:58:27-05:00)
- The AFTER_SCHOOL vs WEEKEND learning-path picker is inside `ProgramCatalog`'s `EnrollModal` at `/programs`.
- Parents previously had no route to this page from the sidebar — the feature was invisible despite being fully built.
- Fix is always a single-line nav entry: `{ name: 'Maktab 🕌', href: '/programs', icon: GraduationCap }` in `MainLayout`'s `navigation` array.
- `startsWith('/programs')` active-state check correctly highlights for both the catalog page and individual program slug pages (`/program/:slug`).

### Quiz Answer Security — Submit-Response-Driven Grading (2026-06-20T14:01:24-05:00)
- `getQuestions()` intentionally omits `correctAnswer`/`explanation` — never trust GET data for grading.
- Score, `isCorrect`, `correctAnswer`, and `explanation` all come exclusively from `submitQuiz()` response (`answers[]` array).
- Pattern: add `submitResult: QuizSubmissionResponse | null` state; populate it from the submit response; review panel does `.find(a => a.questionId === q.id)` to correlate with rendered questions.
- Graceful degradation: if submit fails, show zeros for score and a "Results unavailable" note in review panel — never expose correctAnswers client-side before submission.
- `QuizSubmissionResponse` was mismatched against the backend (`results` vs `answers`, extra fields `attemptNumber/bestScore/masteryThreshold`); fixed to `{id, score, passed, correctCount, totalQuestions, pointsEarned, answers: GradedAnswer[]}`.
- Added `GradedAnswer` interface to `frontend/src/types/assessment.ts`.
- Key files: `frontend/src/pages/courses/QuizPage.tsx`, `frontend/src/types/assessment.ts`, `backend/src/services/assessment.service.ts`.

### Interactive Lesson CTA Surfacing (2026-06-06T17:09:20-05:00)
- `UnitViewer` already renders `unit.content.text` HTML directly (raw when idle, parsed/preserved through `SyncedTextContent` during audio sync), so backend-authored lesson `<a>` tags work without extra frontend parsing changes.
- For al-Masār units, add a dedicated top-of-content CTA only when the HTML content already references `/lessons/masaar-irab-sarf/week-N.html`; derive the canonical button URL from `orderIndex + 1` so the button stays consistent even if inline copy changes.
- Style inline lesson anchors explicitly inside `.unit-content` so backend-provided links remain obvious and tappable within long-form lesson text.

### 2026-06-06T17:42:46Z — al-Masār HTML Lessons Complete (Weeks 1–8)
✅ **ALL EIGHT HTML LESSONS DELIVERED** (Parallel with Khwarizmi seed generation)

**Architecture Notes:**
- Each HTML file is self-contained (no external JS dependencies beyond basic HTML5)
- Markup structure ready for platform ingestion (matches maktab-coursebook-html semantic format)
- Grammar metadata baked into HTML `data-*` attributes for word-level lookup
- Platform linkage ready for routing decision

---

## Session History (Recent)

### 2026-05-24 — Audio Text Sync Ownership & Inline Highlighting
**Orchestration Log:** `.squad/orchestration-log/2026-05-24T14-34-31Z-ibn-sina.md`

✅ **COMPLETE**

**Deliverables:**
- `SyncedTextContent.tsx` — Parses lesson HTML, applies word-level highlighting
- Refactored `UnitAudioButton` — Owns playback controls only; emits sync state via callback
- Updated `UnitViewer` — Accepts sync state and coordinates highlighting

**Key Changes:**
- Removed embedded TextHighlight popup (eliminated duplicate text surface)
- Keeps audio player compact in Study Aids card
- Learners follow highlighted words in the context of existing lesson body
- Component tests ✅, integration tests ✅, build ✅

**Decision Created:** #20 — Inline Audio Sync — Ownership and Page-Level Content Highlighting (2026-05-24)

---

## Archived History

For detailed history prior to 2026-06-20, see history-archive-2026-07-09.md
