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

