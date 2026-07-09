# Project Context

- **Owner:** hrasheed
- **Project:** Islamic Studies Learning Platform — family-based Islamic education with courses, flashcards, SRS, quizzes, and gamification
- **Stack:** React 18 + Vite + TypeScript (frontend), Node.js + Express + Prisma + PostgreSQL + Redis (backend), TailwindCSS, Zustand, JWT auth
- **Created:** 2026-05-16

## Learnings

<!-- Append new learnings below. Each entry is something lasting about the project. -->

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
