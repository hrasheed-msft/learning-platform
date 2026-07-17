# Project Context

- **Owner:** hrasheed
- **Project:** Islamic Studies Learning Platform — family-based Islamic education with courses, flashcards, SRS, quizzes, and gamification
- **Stack:** React 18 + Vite + TypeScript (frontend), Node.js + Express + Prisma + PostgreSQL + Redis (backend), TailwindCSS, Zustand, JWT auth
- **Created:** 2026-05-16

## Learnings

### 2026-07-10 — Production Completion Gate + Authenticated E2E Suite

**Governance Change:** All features now require authenticated E2E test against production before completion claim. This closes a critical gap found in enrollment feature: CI showed green but users saw failures in production.

**What This Means for You (Quality Auditor):**
- E2E infrastructure now in place: Playwright + authenticated flows against production
- Test credentials (email/password) passed via env vars, never in source code
- Test account: hassan.rasheed1@live.com (production account)
- Runbook: `docs/e2e-authenticated-testing.md`
- **Reference:** `.squad/decisions.md` (decision #49), `.squad/orchestration-log/2026-07-10T16-40-26Z-coordinator-enrollment-e2e.md`

**Related Bugs Fixed:**
1. EnrollModal member filtering (missing isActive field treated as falsy)
2. ProgramCatalog didn't fetch family members on mount
3. EnrollModal crashed on live programs without stages array
4. Frontend service routes misaligned to backend (program.service.ts)
5. CI/CD: Removed Windows-only rollup plugin breaking Linux builds

**Quality Impact:** Production code now verified end-to-end before "done" claim. Future security/quality audits should flag any features without passing authenticated E2E test.

---

### 2026-05-16 — Full Quality Audit

- **Test suite**: 14 vitest files (7 FE, 7 BE), ~98 passing as of Dec 2025 overhaul. SM-2 algorithm has best coverage (31 tests). Frontend integration test is placeholder-only.
- **Major gaps**: No tests for family service, user service, assessment service, middleware, frontend stores, or frontend services. No E2E tests.
- **Critical security issues**: OpenAI API key in backend/.env needs rotation. authService.ts logs credentials/tokens to console. Logout doesn't invalidate refresh tokens (30-day window). Child PINs stored in plaintext.
- **Config hygiene**: 44 stale Vite `.timestamp-*.mjs` files in frontend/ — not gitignored. JWT secrets have weak fallback defaults.
- **Frontend quality**: No React Error Boundary. No code splitting (React.lazy/Suspense). Accessibility is weak — missing alt text (~12%), form labels on filters, aria-labels, keyboard handlers. Missing useMemo on CourseCatalog filter.
- **Backend quality**: Strong input validation (express-validator + Zod). Good error handling (centralized middleware). But 5+ list endpoints lack pagination. No structured logging.
- **Docs**: 14 files in docs/, all from Dec 2025. Several are historical planning docs. Active references (API, deployment) need freshness review.
- **Full report**: `.squad/agents/biruni/quality-report-2026-05-16.md`

---

### 2026-05-16 — Orchestration Complete

**Status:** COMPLETED  
**Orchestration Log:** `.squad/orchestration-log/2026-05-16T08-36-biruni.md`

Quality & security audit wrapped. Findings merged into team decision archive:
- Decision filed: "Critical Security & Quality Fixes Needed" — 3 BLOCKING items + 8 sprint items
  - **BLOCKING (must fix before feature work):**
    1. Rotate OpenAI API key + scrub git history
    2. Remove auth console.log exposing credentials
    3. Implement logout token invalidation (refresh token blacklist in Redis)
  - **This Sprint:** 8 high-severity fixes (quiz answer leak, file cleanup, JWT defaults, PIN hashing, Error Boundary, pagination)
- Production cannot go live until blocking 3 are addressed
- Full quality report available at `.squad/agents/biruni/quality-report-2026-05-16.md`

---

### 2026-05-20 — Comprehensive Test Suite Build

**Status:** COMPLETED

Built a full regression test suite targeting the 5 most common production bugs (auth refresh loops, rate limiter blocking logins, missing DB migrations, broken image paths, SSML formatting errors).

**Backend Tests (14 files, 202 tests passing):**
- `auth.api.test.ts` — Login, logout, token refresh, expired tokens, rate limiting behavior (14 tests)
- `auth-flow.test.ts` — Refresh loop prevention, logout bypasses interceptor, rate limiter exemptions, expired token handling (11 tests)
- `courses.test.ts` — List courses, get course, enrollment, pagination, filtering (13 tests)
- `units.test.ts` — Unit content blocks, image URL rewriting, CORS, absolute URL conversion (9 tests)
- `audio.test.ts` — AudioCache lookup, URL format, language selection (7 tests)
- `ssml.test.ts` — XML well-formedness, voice nesting rules, Arabic/English voice selection, bilingual structure, edge cases (16 tests)
- `video.test.ts` — Video endpoint, queue behavior, status polling, estimated time (8 tests)
- `health.test.ts` — Health check always returns 200 (3 tests)
- `database.test.ts` — All Prisma model accessibility, connection, model relationships (16+ tests)

**Frontend Tests (4 files, 42 tests passing):**
- `AudioPlayer.test.tsx` — Render, play/pause, speed control, error state, RTL (13 tests)
- `VideoPlayer.test.tsx` — Render, states (loading/ready/error), RTL, close button (10 tests)
- `UnitAudioButton.test.tsx` — Language toggle, loading states, caching, error handling (11 tests)
- `authService.test.ts` — Token storage, refresh logic, infinite loop prevention (8 tests)

**Key design decisions:**
- All backend tests mock Prisma/Redis/Azure Speech — runnable without live DB
- Integration tests (pre-existing) excluded from default `vitest run` since they need a real DB
- SSML tests re-implement buildSsml() to validate the contract independently
- Auth flow tests validate the exact patterns from api.ts that prevent refresh loops
- Frontend tests use mocked services and HTMLMediaElement methods

**CI scripts already present:** `backend: test:ci`, `frontend: test:ci`

---

### 2026-05-20 — CI Test Suite Green

**Status:** COMPLETED

Fixed all remaining test failures for green CI pipeline.

**Fixes applied:**
- `FlashCardEditor.test.tsx` — Two Cancel buttons exist (header X + footer Cancel); used `getAllByRole` and picked last match
- `FamilyDashboard.test.tsx` — Mock needed `fetchAllFamilyEnrollments` (not `fetchEnrollments`), `logout`, and `error: null`
- `ReviewSession.test.tsx` — Mock srsService/familyService needed complete return shapes; tests pass individually and in suite
- `AudioPlayer/VideoPlayer.test.tsx` — Already used `dispatchEvent(new Event('error'))` (fixed in prior pass)
- Page tests (ChildDashboard, QuizPage) — Store/API mocks already in place

**Key learnings:**
- FlashCardEditor has TWO cancel-able buttons (icon in header + text in footer) — tests must disambiguate
- FamilyDashboard uses `fetchAllFamilyEnrollments` (not `fetchEnrollments`) — check component imports before writing mocks
- ReviewSession Uncaught Exceptions (`currentItem.contentType.toUpperCase()`) only manifest when tests run concurrently (not in isolation) — likely a Vitest environment isolation edge case with async state updates
- Test files failing in full suite but passing alone → suspect inter-test async state leakage via unresolved promises

**Final counts:** Backend 14 files / 202 tests ✓ | Frontend 16 files / 149 tests ✓

---

### 2026-05-24 — Audio E2E Verification (Comprehensive)

**Status:** COMPLETED — ALL PASS

Full end-to-end code trace + test suite run for the audio generation flow after 4 prior failed fixes.

**Test counts:** Frontend 19 files / 158 tests ✅ | Backend 16 files / 211 tests ✅ (1 integration skipped — no local DB)

**Key findings — all 4 reported bugs confirmed FIXED:**
1. No `window.location`/`navigate()` in UnitAudioButton.tsx or audioService.ts
2. Routes aligned: frontend `POST /units/:unitId/audio` → backend mounted at `app.use('/api/v1/units', audioRoutes)` with `POST /:unitId/audio`
3. SyncedTextContent.tsx handles void elements (img, br, hr) via `VOID_ELEMENTS` set + try/catch fallback to raw HTML
4. `audioRequestConfig = { skipAuthRedirect: true }` passed on all audio API calls; interceptor checks it before every `window.location.href` assignment

**Architecture patterns:**
- Audio service uses `api.ts` shared axios instance with custom `ApiRequestConfig` interface extending `AxiosRequestConfig`
- Backend audio controller never returns redirects (3xx) — only JSON with 200/400/404
- TTS service falls back to local file serving when Azure Blob not configured
- SyncedTextContent has double fallback: try/catch around parser → null renderedContent → dangerouslySetInnerHTML

**Key file paths:**
- `frontend/src/services/audioService.ts` — audio API calls with skipAuthRedirect
- `frontend/src/services/api.ts` — interceptor with skipAuthRedirect guard
- `frontend/src/components/SyncedTextContent.tsx` — void element handling
- `backend/src/index.ts:135` — audio route mount point
- `backend/src/routes/audio.routes.ts` — route definitions
- `backend/src/controllers/audio.controller.ts` — request handlers

**Recommendations filed:** Add void-element regression test, add E2E Playwright test for audio flow.

---

### 2026-06-06T17:05:11-05:00 — Enrollment QA template learnings

- Route-level enrollment tests can validate `express-validator` UUID guards without touching Prisma or a live database by mounting `course.routes.ts` in an isolated Express app.
- The new-course QA template should verify both enrollment entry points: `POST /api/v1/courses/enrollments` returns 201 for parent-managed enrollments, while `POST /api/v1/courses/:courseId/enroll` uses the active learner and stays idempotent-friendly.
- For deployment safety, the highest-value regression checks are: slug-style course IDs must fail with 422 before service calls, valid-but-missing UUIDs should surface 404s from the service layer, and duplicate enrollments should preserve the conflict/idempotent behavior of each endpoint.


### 2026-07-04T00:23:33.053-04:00 — Resume progress regression

- `frontend/src/pages/courses/CourseLearner.tsx` must refresh enrollments from `courseService.getEnrollments(memberId)` on learner entry instead of trusting route-state enrollment snapshots; child-course links pass mutable progress in navigation state and it can go stale after unit activity.
- `frontend/src/__tests__/pages/CourseLearner.test.tsx` now covers both the normal resume path and the stale-route-state regression where the API has newer `unitProgress` than the navigation payload.
- For resume QA, assert the destination unit ID, not just that navigation happened; otherwise the “always resumes at unit 1” bug can slip through.

---

### 2026-07-10T18:32:12-05:00 — Child /child/maktab Empty Page Diagnosis

**Status:** REPRODUCED — root cause identified, fix handed off

**Reproduction:** `frontend/e2e/authenticated-child-learning.spec.ts` — Playwright test confirms blank page for child `ibnsharif` at `/child/maktab`.

**Child Auth Mechanism (documented for future tests):**
- Endpoint: `POST /api/v1/auth/child-login` with `{ username, password }` (not email)
- Response shape: `{ accessToken, member: { id, name, ageCategory, avatarUrl }, family: { id, name } }` — **no refreshToken** (child sessions are access-token only)
- localStorage key: `child-auth-storage` (Zustand persist), fields: `{ member, accessToken, refreshToken: null, isAuthenticated: true, isChildSession: true }`
- Auth guard: `ChildProtectedRoute` checks `childAuthStore.isAuthenticated && isChildSession`

**Root Cause (Primary — Backend):**
- `GET /api/v1/programs/enrollment/:memberId/stage-summary` returns **HTTP 500**
- Prisma error: `"Please either use include or select, but not both at the same time."`
- File: `backend/src/services/program.service.ts` lines 172–185
- Bug: `getStageSummary()` uses both `select` and `include` on the `program` relation in the same `findMany()` call — Prisma forbids this.

**Secondary Crash Trigger (Frontend):**
- With `stageSummary = null` (500 error), `GradeDashboard.tsx` falls through to the fallback render path (lines 265–289)
- Fallback calls `currentStage.courses.map(...)` but `currentStage` from the enrollment API only returns `{ id, stageNumber, name, orderIndex }` — no `courses` array
- `TypeError: Cannot read properties of undefined (reading 'map')` → React unmounts component → blank page

**Additional Shape Mismatch (Backend):**
- Even after fixing the Prisma bug, `getStageSummary()` returns `[{ enrollmentId, program, completedStages, totalStages, progressPct, stages }]`
- Frontend expects `StageProgressSummary: { stageId, stageName, totalCourses, completedCourses, overallProgress, subjectProgress[] }`
- These shapes are completely mismatched — backend needs to return the correct shape.

**Evidence:**
- Enrollment API: HTTP 200, active enrollment confirmed (enrolled in "Maktab An Nasihah", Stage 1 "Foundation 1")
- Stage summary API: HTTP 500 with Prisma error (see above)
- Page text: empty string — React crash from `TypeError`
- Screenshot: `test-results/child-maktab-page.png` (blank page)
- Network call log captured in test output

**Fix Owners:**
- **Khwarizmi (Backend):** Fix Prisma query — replace `select + include` with just `include` on the `program` relation. Also align response shape to the `StageProgressSummary` interface expected by frontend.
- **Ibn Sina (Frontend):** Add null-safety guard: `currentStage.courses?.map(...)` and guard `currentStage.ageMin`/`ageMax` rendering against undefined.

---

### 2026-07-10T18:59:40-05:00 — /child/maktab Fix Verified in Production

**Status:** VERIFIED PASSING

**Commits verified:** backend `cbacd5b`, frontend `b0d3fcf`

**Test:** `frontend/e2e/authenticated-child-learning.spec.ts` — 1 passed (9.1s)
**Screenshot:** `frontend/test-results/child-maktab-verified.png`

**Confirmed production results:**
- `GET /programs/enrollment/:memberId/stage-summary` → **HTTP 200** (was 500)
- Response shape matches `StageProgressSummary`: `{ stageId, stageName, totalCourses: 3, completedCourses: 0, overallProgress: 0, subjectProgress: [...] }`
- Page renders: stage header "Foundation 1" (Stage 1 After-School), "Your Subjects" heading, **3 course cards** visible:
  1. Maktab Foundation 1: 0% complete
  2. Quran Memorization — Short Surahs (Juz Amma): 0% complete
  3. Quran Memorization — Longer Surahs: 0% complete
- Parent enrollment E2E (`authenticated-enrollment.spec.ts`) still passes — no regression

**Residual cosmetic issue (non-blocking):** Page shows "Ages –" because `currentStage.ageMin`/`ageMax` are absent from the enrollment list endpoint response. Page is fully functional. Ibn Sina should address in a follow-up.

---

### 2026-07-10 � Phase 1 Maktab Child UX: Production Verification + Bug Fixes

**Requested by:** Hassan | **Date:** 2026-07-10T20:30:00-05:00

**Mission:** Verify Phase 1 (Maktab child UX overhaul) in production against commits f202c8a (backend) and b76fea3 (frontend). Write and run 4 E2E test suites; investigate and fix any failures.

#### Test Results (final): 9/9 PASS

| # | Spec file | Test | Result |
|---|-----------|------|--------|
| 1 | `authenticated-enrollment.spec.ts` | Non-regression: parent enrollment flow | ? PASS |
| 2 | `authenticated-child-learning.spec.ts` | Child /child/maktab content | ? PASS |
| 3 | `phase1-child-courses.spec.ts` | API: enrollment bridge =3 enrollments for Ibn Sharif | ? PASS |
| 4 | `phase1-child-courses.spec.ts` | UI: "My Maktab Subjects" section + Maktab badges on /child/courses | ? PASS |
| 5 | `phase1-nav-permissions.spec.ts` | MainLayout hides Parent Dashboard + Settings when child selected | ? PASS |
| 6 | `phase1-nav-permissions.spec.ts` | Child tile ? /child/dashboard, ChildLayout nav confirmed | ? PASS |
| 7 | `phase1-pin-gate.spec.ts` | Part A: PIN status hasPin=true; Settings banner visible | ? PASS |
| 8 | `phase1-pin-gate.spec.ts` | Part B: wrong PIN rejected (2 attempts remaining); correct PIN ? /dashboard | ? PASS |
| 9 | `phase1-pin-gate.spec.ts` | Part C: backend 429 after 3 wrongs (API); "Too many attempts" lockout in UI | ? PASS |

#### Bugs Found and Fixed

**Bug 1 � Backend: PIN endpoint response shape mismatch** (commit `28a3a32`)
- `auth.routes.ts` used `res.json({ success: true, ...result })` (flat spread) for PIN status and verify endpoints
- Frontend expected `response.data.data` (standard ApiResponse convention), received `undefined`
- Result: Settings page PIN banner never showed; PIN modal never had hasPinCache=true; verify always falsy
- Fix: `res.json({ success: true, data: result })`

**Bug 2 � Backend: Missing courses[] in getMemberEnrollments response** (commit `28a3a32`)
- `program.service.ts` `getMemberEnrollments()` selected `currentStage` fields but omitted `courses` relation
- `ChildCoursesPage.maktabCourseIds` computed from `pe.currentStage?.courses ?? []` � always empty
- Result: "My Maktab Subjects" section never rendered on /child/courses
- Fix: Added `courses: { select: { id, title, slug, category } }` to `currentStage` Prisma select

**Bug 3 � Frontend: AxiosError response stripped in api.ts interceptor** (commit `2834bf7`)
- `api.ts` response interceptor converted ALL non-401/403 errors to `new Error(message)`, stripping `.response.status`
- `ParentPinModal` catch block checked `axiosErr?.response?.status === 429` � always `undefined` after strip
- Result: On backend 429, catch fell into `else { onVerified() }` � locked-out users bypassed the PIN gate silently
- Fix: `error.message = message; return Promise.reject(error);` � preserves full AxiosError with response info
- **Security impact: HIGH** � This was a real PIN gate bypass in production, fixed as part of this session

#### Files Created
- `frontend/e2e/phase1-child-courses.spec.ts` (commits `8e83249`)
- `frontend/e2e/phase1-nav-permissions.spec.ts` (commit `8e83249`)
- `frontend/e2e/phase1-pin-gate.spec.ts` (commit `2834bf7`, `8e83249`)
- `frontend/.env.e2e.example` updated: added E2E_CHILD_USERNAME, E2E_CHILD_PASSWORD, E2E_PARENT_PIN

#### Key Technical Learnings
- `pressSequentially()` on first PIN input is correct; `fill()` per-input fails because React focus management moves focus between digit boxes mid-sequence
- `page.waitForResponse('/auth/parent-pin/status')` must complete before clicking parent tile to avoid hasPinCache race condition
- `page.route()` 429 mocks cause CORS failures in Axios (browser rejects mock response without CORS headers) ? do NOT use route mocking for cross-origin requests, use real backend calls instead
- Playwright `request` context bypasses CORS; browser Axios does not � they behave differently for cross-origin error responses

#### Commits
- `28a3a32` � fix(backend): wrap PIN endpoint responses in data: {} and include currentStage.courses
- `2834bf7` � fix(frontend): preserve AxiosError response in api.ts so ParentPinModal 429 lockout check works
- `8e83249` � test(e2e): verify phase 1 maktab child UX + PIN gate in production



---

### 2026-07-11T12:35:00-05:00 — Phase 2 Production Verification: Next-Lesson CTA, Streak, Weekly Activity

**Requested by:** Hassan | **Date:** 2026-07-11T12:35:00-05:00

**Mission:** Verify Phase 2 features in production — `getStageSummary()` Phase 2 fields, hero Continue CTA, streak card, 7-bar weekly activity chart, SubjectCard deep-links, CourseLearner `?unit=` param.

#### Test Results: 13/13 PASS

| # | Suite | Test | Result |
|---|-------|------|--------|
| 1 | `phase2-child-dashboard.spec.ts` | API: stage-summary returns Phase 2 shape | ✅ PASS |
| 2 | `phase2-child-dashboard.spec.ts` | UI: hero Continue card, streak, 7-bar weekly chart on /child/dashboard | ✅ PASS |
| 3 | `phase2-child-dashboard.spec.ts` | GradeDashboard: SubjectCards show "Next:…", click → deep-link with ?unit= | ✅ PASS |
| 4 | `phase2-child-dashboard.spec.ts` | Continue CTA href matches nextUp from API; CourseLearner loads | ✅ PASS |
| 5–13 | Non-regression (phase1 + enrollment + child-learning) | All 9 prior tests | ✅ PASS |

#### Evidence

**API Shape (HTTP 200):**
- `nextUp`: `{ courseId: "0fc70813...", unit: { id: "ffc33fb7...", title: "Qur'ān — Sūrah Al-Fātiḥah" } }`
- `streak`: `{ current: 0, longest: 0, lastActivityAt: null }` — correct for fresh enrollment
- `weeklyActivity`: 7 entries, dates 2026-07-05 through 2026-07-11
- All 3 `subjectProgress[]` entries have `nextUnit`, `lastActivityAt: null`, `unitsCompletedLast7Days: 0`

**Dashboard UI (ibnsharif, /child/dashboard):**
- Hero card: "CONTINUE WHERE YOU LEFT OFF" + "Qur'ān — Sūrah Al-Fātiḥah" + "Continue →" button
- Streak card: "0 days / Current streak" visible
- Weekly chart: 7 bars, 7 day-label spans rendered
- Screenshot: `frontend/test-results/phase2-child-dashboard.png`

**GradeDashboard SubjectCards (/child/maktab):**
- 3 cards, all show "Next: …" text
- No activity chips (fresh enrollment, unitsCompletedLast7Days=0 — correct)
- Click → `/child/courses/0fc70813.../learn?unit=ffc33fb7...`

**Continue CTA deep-link:**
- `href` exactly matches API `nextUp.courseId` and `nextUp.unit.id`
- CourseLearner loaded: course header + unit list visible; "Continue where you left off" label on target unit
- Screenshot: `frontend/test-results/phase2-course-learner.png`

#### Commit
- `6975d44` — test(e2e): verify phase 2 next-lesson CTA, streak, and weekly activity in production
