# Decisions Log

## 2026-07-10T10:11:33-05:00: User Directive — End-to-End Testing Requirement

**By:** hrasheed (via Copilot)

**Directive:** Any new feature must be end-to-end tested in production after deployment before the team notifies the user that work is complete.

**Why:** User request — captured for team memory

---

## 2026-07-10: Decision — Maktab Child UX (Option B — Unified Experience)

**Author:** Khaldun (Lead/Architect)

**Status:** Pending Hassan's ratification

**Decision:** Adopt **Option B — Unified Experience** for the Maktab child UX. The existing `/child/*` route tree and `ChildLayout` become program-aware rather than building a separate Maktab app.

### Key Points

1. **No separate app/domain.** The `/child/*` route tree is already structured correctly with its own auth, layout, and pages.
2. **Bridge the enrollment gap** by auto-creating `CourseEnrollment` records when `ProgramEnrollment` is created (backend transaction in `program.service.ts`).
3. **The GradeDashboard (`/child/maktab`) is the cross-subject view.** It already exists and works once CourseEnrollment records are present.
4. **"Next lesson"** will be a computed field added to the stage-summary API response (Phase 2).
5. **Nav filtering + learner-switch PIN** are independent bug fixes that don't affect architecture direction.

### Rationale

- Maktab is the primary child use case; it should be the default mode of the child experience, not an add-on.
- Code reuse: lesson player, quiz page, flashcard system, child layout are all shared.
- Single auth system avoids confusion.
- Existing partial implementation (GradeDashboard, ChildDashboardHome Maktab section) is 70% there — we're completing it, not rebuilding.

### Blocked On

Hassan's approval of: PIN vs password for switch gate, auto-enrollment scope (all stage courses vs path-filtered), and Phase 1 priority order.

---

## 2026-07-10T18:32:12-05:00: Fix /child/maktab Empty Page (Blank Page Bug)

**Filed by:** Biruni (Tester)

**Priority:** HIGH — production regression, child users see blank page after successful enrollment

### Context

After parent enrollment was verified working, the child experience at `/child/maktab` is broken. A logged-in child (account: `ibnsharif`, member ID: `b32bf819-1662-47c5-b80f-2e2ca6bd26ab`) sees a completely blank page. The child IS actively enrolled in "Maktab An Nasihah" — the enrollment data is valid.

**E2E test reproducing the issue:** `frontend/e2e/authenticated-child-learning.spec.ts`
**Screenshot:** `frontend/test-results/child-maktab-page.png`

### Root Cause Chain

#### Bug 1 — Backend HTTP 500 (BLOCKER)

**File:** `backend/src/services/program.service.ts`, lines 172–185
**Endpoint:** `GET /api/v1/programs/enrollment/:memberId/stage-summary`

The Prisma query in `getStageSummary()` uses both `select` and `include` on the same `program` relation, which is invalid. This causes HTTP 500 on every request to the stage summary endpoint.

**Owner:** Khwarizmi (Backend)

#### Bug 2 — Backend Response Shape Mismatch

**File:** `backend/src/services/program.service.ts`, lines 193–221

Even after fixing Bug 1, `getStageSummary()` returned an array, but the frontend expected a single object. This causes response shape mismatch.

**Owner:** Khwarizmi (Backend)

#### Bug 3 — Frontend Crash on Missing `currentStage.courses`

**File:** `frontend/src/pages/program/GradeDashboard.tsx`, lines 265–289

When `stageSummary` is null, the component renders the fallback path which calls `.map()` on `currentStage.courses`, but that property is absent. This throws a TypeError.

**Owner:** Ibn Sina (Frontend)

### Recommended Actions

1. **Khwarizmi:** Fix Prisma query (Bug 1) + align response shape (Bug 2)
2. **Ibn Sina:** Add null-safety guard for `currentStage.courses` (Bug 3) as defensive programming

---

## 2026-07-10T18:32:12-05:00: UX Pattern — Empty / Error States in Child-Facing Pages

**Proposed by:** Ibn Sina

**Context:** GradeDashboard blank-page bug (stage-summary 500 + missing courses array)

### Decision

**Adopt a three-branch render guard as the standard pattern for child pages with optional/partial data:**

1. **Happy path** — data is fully present → render the full UI.
2. **Fallback / partial data** — primary data source failed but secondary source has content → render from secondary source with no progress indicators.
3. **Empty state** — both sources absent → render a friendly, branded empty-state card. Never crash, never blank.

**Error surfacing standard:** When a store `error` is non-null, render a small inline banner (`⚠️ {error} — Some data may be unavailable.`) above the page content.

### Rationale

- Child users cannot self-diagnose or refresh intelligently; a blank page with no message is the worst possible outcome.
- The enrollment and stage-summary endpoints are separate with different response shapes. Partial responses are normal during backend incidents.
- Inline error banners expose failures during diagnosis without disrupting the happy path.

### Scope

- Applies to all child-facing pages: `GradeDashboard`, `ChildDashboardHome`, `ChildCoursesPage`, `ChildDuaProgressPage`, `ChildNamesProgressPage`, and any future `/child/*` pages.

### Applied In

- `frontend/src/pages/program/GradeDashboard.tsx` — commit b0d3fcf

---

## 2026-07-10T23:00:25-05:00: Child UX Phase 1 — PIN, Nav Filter, Maktab Grouping

**Author:** Ibn Sina

**Status:** Ready for team review

**Requested by:** Hassan (via Khaldun Phase 1 plan)

### Decision 1 — ChildProtectedRoute: Option (a) — Parent-with-Child-Selected

**Context:** When a parent selects a child on SelectLearner, should they get a "view-as-child" experience inside the `/child/*` route tree?

**Decision: Option (a) chosen.**

- Allow `/child/*` access when `parentAuth.isAuthenticated && selectedMember?.isAccountOwner === false`. No child auth token required.

**Rationale:**
- Least friction for parents checking child progress or helping a child navigate.
- No new auth flow needed; the parent's existing JWT already authorizes data fetches.
- Child pages already guard data fetches via `member.id` — the parent is effectively acting on behalf of the selected child using the parent's session.

### Decision 2 — PIN Gate: Only Child→Parent Transitions

**Context:** When should the PIN be required?

**Decision:** Only when switching FROM a child member (isAccountOwner === false) TO a parent/account-owner member. All other transitions are ungated:
- Parent→child: no gate
- Parent→parent: no gate
- First selection: no gate

**Rationale:** The threat model is a child picking up a parent's tablet and tapping the parent tile to access settings/billing. A PIN on all transitions would annoy parents unnecessarily.

### Decision 3 — PIN Degradation: Allow Switch if Endpoint 404s

**Context:** Khwarizmi's PIN endpoints (`/auth/parent-pin/*`) may not be deployed when the frontend ships.

**Decision:** If `verifyParentPin` throws a non-429 error, log a warning and call `onVerified()` anyway. The PIN gate "fails open" until the backend is live.

**Rationale:** Better to have a temporarily ungated switch than to permanently block parents from using the app.

### Decision 4 — Maktab Course Grouping: Client-Side Join

**Context:** The `/courses/enrollments/member/:id` response doesn't include a `programId` source discriminator.

**Decision:** Client-side join — fetch both `programEnrollments` and `courseEnrollments`. Build a `Set<courseId>` from `programEnrollment.currentStage.courses`. Classify each enrollment by membership in the set.

**Rationale:**
- Works today without waiting for a backend API change.
- Once Khwarizmi's enrollment bridge lands, courses will appear automatically.

### Decision 5 — Empty State: Maktab-Aware Messaging

**Context:** If a child has Maktab enrollment but no individual courses, the "My Courses" empty state was generic.

**Decision:** Two-branch empty state:
- If `hasMaktab === true`: "Your Maktab subjects are on your Maktab dashboard. Ask your parent to enroll you in additional individual courses here."
- If `hasMaktab === false`: "Ask your parent to enroll you in a course or a Maktab program to start learning here."

**Rationale:** Avoids telling a Maktab-enrolled child they have no courses when they actually do (just in a different part of the app).

### Decision 6 — PIN Setup UX: Weak PIN Rejection Client-Side

**Decision:** Reject weak PINs client-side before submission: `0000`, `1111`, `2222`, `3333`, `4444`, `5555`, `6666`, `7777`, `8888`, `9999`, `1234`, `4321`, `0123`, `9876`.

**Rationale:** Protects parents who would otherwise set a trivially guessable PIN.

---

## 2026-07-10: Contract Decision — PIN Gate & Enrollment Bridge

**Author:** Khwarizmi (Backend)

### 1. Enrollment Bridge — Program → CourseEnrollment Auto-Creation

**Decision:** When `ProgramService.enrollMember()` creates a `ProgramEnrollment`, it now **also** creates `CourseEnrollment` rows for every published course in the starting stage (wrapped in a single `$transaction`; uses `skipDuplicates: true`).

**Impact on Ibn Sina:**
- `/child/courses` will now automatically return the Maktab stage's courses after enrollment — no frontend change needed.
- `CourseEnrollment.status = 'ACTIVE'`, `progress = 0`, `startedAt = now()` — matches individual enrollment defaults.
- **Backfill complete:** 5 existing `CourseEnrollment` rows created for 2 pre-existing program enrollments.

### 2. Parent PIN Gate — New Endpoints

**Decision:** PIN stored on the **`User` model** (not `FamilyMember`). Each parent's login account (`User`) holds:
- `parentPinHash String?` — bcrypt hash (cost 10)
- `pinSetAt DateTime?`
- `pinAttempts Int @default(0)` — reset on success or expiry
- `pinLockedUntil DateTime?` — set for 30 seconds after 3 failures

**New Endpoints (all require parent JWT):**
- `GET /api/v1/auth/parent-pin/status` — returns whether the authenticated parent has set a PIN.
- `POST /api/v1/auth/parent-pin` — body: `{ "pin": "XXXX" }` (4 digits, rejects weak PINs).
- `POST /api/v1/auth/parent-pin/verify` — body: `{ "memberId": "<any FamilyMember.id>", "pin": "XXXX" }`.

**Frontend Integration Notes:**
1. Call `GET /auth/parent-pin/status` on load. If `hasPin: false`, show PIN setup screen. If `hasPin: true`, show verify prompt when switching from child to parent.
2. Before switching to account-owner member, show the PIN modal.
3. On HTTP 429, parse the message for seconds remaining and show a countdown.

### Migration Notes

- Migration `20260710201500_add_parent_pin` — adds unused columns to `family_members`.
- Migration `20260710210000_move_parent_pin_to_user` — adds 4 columns to `users`, drops temporary columns from `family_members`.

---

## 2026-07-10: Decision — stage-summary API Response Shape Contract

**Author:** Khwarizmi (Backend)

**Commit:** cbacd5b

**Decision:** `GET /api/v1/programs/enrollment/:memberId/stage-summary` now returns a single `StageProgressSummary` object (or `null` when no active enrollment), aligned to the frontend TypeScript interface.

### Canonical Response Shape

```json
{
  "success": true,
  "data": {
    "stageId": "<uuid>",
    "stageName": "Foundation 1",
    "totalCourses": 3,
    "completedCourses": 0,
    "overallProgress": 42,
    "subjectProgress": [
      {
        "courseId": "<uuid>",
        "courseTitle": "Maktab Foundation 1",
        "category": "FIQH",
        "progress": 60,
        "totalUnits": 3,
        "completedUnits": 2
      }
    ]
  }
}
```

### Rationale

The prior implementation returned an array of enrollment objects with an incompatible shape, causing a blank `/child/maktab` page for all enrolled children. The Prisma `select`+`include` mix on the same relation also caused HTTP 500.

### Breaking Change

Yes — response changed from `Array<EnrollmentSummary>` to `StageProgressSummary | null`. No other backend consumers identified.

---

## 2026-07-11: Contract Note — Phase 2 Stage Summary: New Fields

**From:** Khwarizmi

**For:** Ibn Sina

**Commit:** `a60c291`

**Endpoint:** `GET /api/v1/programs/enrollment/:memberId/stage-summary` (header: `x-active-member-id: <memberId>`)

### What Changed

`getStageSummary()` now returns new fields **alongside all existing fields** (additive only).

### New Fields in TypeScript Types

```typescript
export interface NextUnitShape {
  id: string;
  title: string;
  orderIndex: number;
  courseId: string;
  courseSlug: string | null;
}

export interface SubjectProgressEntry {
  // ... (existing fields)
  nextUnit: NextUnitShape | null;
  lastActivityAt: string | null; // ISO 8601 UTC string
  unitsCompletedLast7Days: number;
}

export interface StageProgressSummary {
  // ... (existing fields)
  nextUp: {
    subjectSlug: string;
    courseId: string;
    unit: NextUnitShape;
  } | null;
  streak: {
    current: number;
    longest: number;
    lastActivityAt: string | null;
  };
  weeklyActivity: {
    date: string; // YYYY-MM-DD UTC
    unitsCompleted: number;
  }[];
}
```

### Zero-Progress / Fresh Enrollment Guarantee

When a child is freshly enrolled with no completed units:
- `nextUnit` = first eligible unit of each course (non-null)
- `nextUp` = first course's first unit
- `streak` = `{ current: 0, longest: 0, lastActivityAt: null }`
- `weeklyActivity` = 7 entries all with `unitsCompleted: 0`

### Path Filtering Note

`nextUnit` respects `Unit.includedInPaths`. Units with an empty `includedInPaths` array appear for **all** learning paths.

### Deep-Link Pattern

```
/child/courses/:courseId/learn?unitId=<nextUnit.id>
```

Use `nextUp.unit.id` for the primary Continue CTA on `ChildDashboardHome`.

---

## 2026-07-11: UX Pattern Decisions — Child Dashboard Phase 2

**Author:** Ibn Sina

**Feature:** Next-lesson CTA, streak card, weekly activity chart

**Commit:** 48523ff

### Decision 1 — "All caught up" copy & visual treatment

**Choice:** Amber/orange gradient panel with 🎉 emoji, "You're all caught up!" heading, and two CTA shortcuts (Games, Flashcards).

**Rationale:** Celebratory rather than empty-state. Amber avoids the deep green associated with in-progress work.

### Decision 2 — Streak visuals (orange, flame icon)

**Choice:** Orange colour family (`bg-orange-100`, `text-orange-500`) for all streak surfaces.

**Rationale:** Orange is warm, energetic, and distinct from the platform's primary green (progress) and amber (all-caught-up). Creates a visual vocabulary: orange = effort/momentum.

### Decision 3 — Weekly activity chart: div-bars, no library

**Choice:** Plain `<div>` bars with `height` set as a percentage of max units completed that week. Min height 8% for zero days. Today highlighted with `ring-2 ring-orange-300`.

**Rationale:** No new dependency. Simple enough to maintain. Kids don't need axis labels or tooltips.

### Decision 4 — Resume route pattern: `/child/courses/{courseId}/learn?unit={unitId}`

**Choice:** Land on CourseLearner with `?unit=<id>` query param rather than navigating directly to UnitViewer.

**Rationale:** CourseLearner shows the full unit list, scrolls to the target unit. Direct UnitViewer navigation skips the list, which can feel disorienting.

### Decision 5 — Degraded behavior (backend fields absent)

All Phase 2 fields are optional on every TS interface. Components guard with `?? null` / `?? 0` throughout. If the backend hasn't deployed:
- Hero CTA section is hidden
- Streak card is hidden
- Weekly chart is hidden

---

## 2026-07-13: Decision — Enrollment Bug Fixes (AGE_CATEGORY_MIDPOINT, Stage Fetch, DEFAULT_STAGES)

**From:** Ibn Sina (Frontend Dev)

**Status:** Implemented

**File:** `frontend/src/pages/program/ProgramCatalog.tsx`

### Bug 1 — AGE_CATEGORY_MIDPOINT Keys Were Wrong

**Problem:** The map used lowercase descriptive keys that never matched the actual Prisma enum values returned by the API. The fallback ageCategory lookup always returned `undefined`, so any member without a numeric age would always fall through to the "stage cannot be auto-detected" path.

**Fix:** Keys updated to match Prisma enum values. `ADULT` gets midpoint `25`.

### Bug 2 — Programs Fetched Without Stages

**Problem:** `fetchPrograms()` calls `GET /api/v1/programs` which returns programs without populated `stages` arrays. The EnrollModal always fell back to `DEFAULT_STAGES` — a static placeholder that no longer matched the real program's stage numbers and names.

**Fix:** `handleEnrollClick` converted to `async`. Before opening the modal it calls `programService.getProgram(program.slug)` (which hits `GET /programs/slug/:slug` with full stage data).

### Bug 3 — DEFAULT_STAGES Had Wrong Stage Numbers and Ranges

**Problem:** The 6-stage placeholder had completely different age ranges than the real 12-stage program.

**Fix:** DEFAULT_STAGES updated to 12 stages matching the real Maktab An Naṣīḥah curriculum exactly.

### Verification

`npx tsc --noEmit` — exit code 0, zero errors.

---

## 2026-07-13: Ibn Sina Decision — View Switching + Stage Auto-Detection Fix

**Author:** Ibn Sina (Frontend Dev)

**Status:** Implemented

### Bug 1 — Maktab Enrollment Stage Silently Wrong

**Root Cause:** `detectStageNumber` compared `age >= s.ageMin` where `age` was typed as `number` but could be `null` at runtime. JavaScript coerces `null` to `0`, so `0 >= 4` is always false.

**Fix:**
1. **Null guard:** `if (age != null && age > 0)` before range comparison.
2. **ageCategory fallback:** When `age` is null, look up representative midpoints.
3. **Surface in UI:** Added "Starting Stage" section in `EnrollModal`.
4. **Amber card notice:** When `member.age` is null, shows "⚠️ Age not set — stage estimated from age category" in amber.

**Architectural Decisions:**
- Helper functions extracted to **module level** — pure, testable.
- `resolveStages(program)` encapsulates fallback logic.
- Enroll button: `disabled={!selectedMemberId || isEnrolling || selectedStageNumber === undefined}`.

### Bug 2 — No Parent↔Child View Switching Controls

**Root Cause (Gap A):** When a child member was selected, there was no UI entry point to switch to the child's Student View.

**Fix A — MainLayout "Switch to Student View":** When `selectedMember?.isAccountOwner === false`, renders a prominent dark-green "🎓 Switch to Student View" link with the member's name below.

**Root Cause (Gap B):** When a parent arrived at `/child/dashboard`, there was no way back to the parent view.

**Fix B — ChildLayout "Parent View" Banner:** When `isParentAuth && !isChildSession`, renders a sticky amber banner at the top with "← Parent View" link back to `/dashboard`.

**Validation:** `npx tsc --noEmit` passes clean (0 errors).

---

## 2026-07-13: Ibn Sina — UX 10-Fix Decision Record

**Author:** Ibn Sina (Frontend Dev)

**Status:** Implemented

**Scope:** Parent–child navigation UX review — all 10 issues

### Issue 1 — HIGH: Enrollment CTA on ChildDashboardHome

Added `{!isLoading && !activeProgramEnrollment && <div>...Enroll CTA...</div>}` block immediately after the greeting.

### Issue 2 — HIGH: "Switch to Student View" not visible on first login

Replaced the single conditional with a three-branch conditional in `MainLayout`.

### Issue 3 — HIGH: EnrollModal should pre-select active child member

Changed `selectedMemberId` initial state to use `preselectedMember.id` when `isAccountOwner === false`.

### Issue 4 — MED: GradeDashboard empty-state `/programs` link confusing in child sessions

Extracted `isChildSession` from `useChildAuthStore`. Wrapped the `/programs` CTA in guard.

### Issue 5 — MED: No "Add a learner" shortcut for zero-learner families

Handled in Issue 2's three-branch conditional.

### Issue 6 — MED: ChildLayout Logout sends to /child-login when parent is previewing

Branched `handleLogout` on `isParentViewing`.

### Issue 7 — MED: ageCategory rendered raw all-caps in ChildLayout

Added `formatAgeCategory` helper as a component-level const.

### Issue 8 — LOW: No parent/child distinction in SelectLearner tile UI

Added role badges inside tile buttons (shown only when `!isCurrent`).

### Issue 9 — LOW: No "Switch child" shortcut in parent preview banner

Added a "Switch child" `Link` to `/select-learner` alongside the "← Parent View" link.

### Issue 10 — LOW: No Maktab progress mini-card on ChildDashboardHome

Added a horizontal mini-card `Link` to `/child/maktab` between the streak/activity section and the quick-stats grid.

### Validation

`cd frontend && npx tsc --noEmit` → **exit 0, zero errors**

---

## 2026-07-13: Decision — Enrollment Stage-Move Endpoint

**Author:** Khwarizmi

**Status:** Implemented

### Context

Two live children were enrolled in wrong maktab stages (Ibn Sharif in Foundation 1; Ibn Sharif 2 in Coursebook 2). Both are PRE_TEEN and should be in Coursebook 5. No API endpoint existed to move a ProgramEnrollment to a different stage.

### Decisions

#### 1. `PATCH /enrollment/:enrollmentId/stage` rather than PUT or POST

- PATCH is semantically correct for partial resource update.
- Body: `{ stageNumber: number }` — logical stage identifier.

#### 2. Delete-then-create strategy for CourseEnrollment bridging

- Delete only CourseEnrollment rows for courses **exclusive** to the old stage.
- Create missing new-stage CourseEnrollments with `skipDuplicates: true`.

#### 3. Transaction wraps update + delete + create

- Ensures atomicity: if new CourseEnrollment creation fails, the stage pointer is not moved.

#### 4. One-shot migration script for live data

- Script `backend/prisma/migrate-fix-enrollment-stages.ts` performs the same logic directly via Prisma.
- Script is idempotent: no-ops if member is already on target stage.
- Run: `DATABASE_URL="<prod_url>" npx ts-node backend/prisma/migrate-fix-enrollment-stages.ts`

### Affected Files

- `backend/src/services/program.service.ts` — `moveEnrollmentStage()` added
- `backend/src/routes/program.routes.ts` — `PATCH /enrollment/:enrollmentId/stage` added
- `backend/prisma/migrate-fix-enrollment-stages.ts` — one-shot data fix script (new)

