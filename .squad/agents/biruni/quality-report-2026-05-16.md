# Quality Audit Report — Islamic Studies Learning Platform

**Auditor:** Biruni (Tester/QA)  
**Date:** 2026-05-16  
**Scope:** Full platform audit — tests, code quality, security, frontend/backend, docs, config

---

## Executive Summary

The platform has **14 vitest test files** (7 frontend, 7 backend) covering core features like SM-2 algorithm, auth, courses, and flashcards. However, significant gaps exist: **no React Error Boundary**, **sensitive data logged to console**, **44 stale Vite timestamp files** cluttering the frontend directory, **logout doesn't invalidate tokens**, and **multiple list endpoints lack pagination**. The last test overhaul (Dec 2025) brought tests to 98 passing, but 5+ months have passed with no documented test updates. Docs are similarly dated (all from Dec 2025).

---

## 1. Test Inventory

### Frontend Tests (7 files in `frontend/src/__tests__/`)
| File | What it tests |
|------|--------------|
| `setup.ts` | Global mocks (matchMedia, IntersectionObserver, localStorage) |
| `pages/CourseCatalog.test.tsx` | Course browsing, filtering, search (221 lines — largest) |
| `pages/FamilyDashboard.test.tsx` | Parent dashboard, member display |
| `pages/MemberProgress.test.tsx` | Progress tracking display |
| `pages/ChildDashboard.test.tsx` | Child learning dashboard |
| `pages/QuizPage.test.tsx` | Quiz flow, answer selection |
| `pages/ReviewSession.test.tsx` | Flashcard review session |
| `integration/learning-flow.test.ts` | **PLACEHOLDER ONLY** — documents expected flows, no implementation |

### Backend Tests (7 files in `backend/src/__tests__/`)
| File | What it tests |
|------|--------------|
| `setup.ts` | Test env vars, Prisma/Redis mocks |
| `auth.service.test.ts` | Registration, login, JWT |
| `course.service.test.ts` | Course CRUD, enrollment, progress |
| `srs.service.test.ts` | Spaced repetition logic |
| `flashcard/flashcard.service.test.ts` | Flashcard CRUD |
| `flashcard/sm2-algorithm.service.test.ts` | SM-2 algorithm (31 tests — most thorough) |
| `integration/flashcard-study-session.test.ts` | Full study journey with real DB |

### Additional Manual Test Files
- `backend/test-api-endpoints.ts` — Axios-based API smoke tests (hardcoded creds: `admin123`)
- `backend/test-api.ps1` — PowerShell equivalent

### Vitest Config
- Both `frontend/vitest.config.ts` and `backend/vitest.config.ts` exist and are well-configured
- Coverage provider: v8, reporters: text/json/html
- Scripts: `test`, `test:coverage` (both), `test:watch` (backend only)

---

## 2. Test Coverage Gaps

### 🔴 CRITICAL — No Tests Exist For:
- **React Error Boundary** — doesn't exist at all
- **Route/controller layer** (backend) — only service-layer tested
- **Middleware** — auth, validation, error middleware untested
- **Family management** — no `family.service.test.ts`
- **User service** — no `user.service.test.ts`
- **Assessment/quiz service** — no `assessment.service.test.ts`
- **Frontend stores** — authStore, courseStore, familyStore, flashcardStore untested
- **Frontend services** — authService, courseService, etc. untested
- **E2E tests** — none
- **Integration tests** — frontend integration is placeholder-only

### 🟡 MEDIUM — Partial Coverage:
- Flashcard component has tests in `components/flashcards/__tests__/` but other components don't
- Frontend pages tested for rendering but not for error/edge cases

---

## 3. Bug Hunting Findings

### 🔴 CRITICAL

| # | Issue | Location | Details |
|---|-------|----------|---------|
| 1 | **Sensitive data logged to console** | `frontend/src/services/authService.ts:20-23` | Logs email, API URL, and full login response (tokens!) |
| 2 | **Logout doesn't invalidate tokens** | `backend/src/services/auth.service.ts:164-168` | `logout()` is a no-op — just `console.log`. Refresh tokens remain valid for 30 days |
| 3 | **OpenAI API key in .env** | `backend/.env:35` | Real API key committed. Must rotate immediately |

### 🟠 HIGH

| # | Issue | Location | Details |
|---|-------|----------|---------|
| 4 | **JWT secrets have weak defaults** | `backend/src/config/index.ts:57-58` | Falls back to `'default-access-secret'` if env var missing — should throw |
| 5 | **`as any` casts in production** | Multiple frontend files | `ReviewSessionPage.tsx:64`, `CourseCatalog.tsx:52`, `MemberProgress.tsx:225`, `QuizPage.tsx:47` |
| 6 | **26 console.log statements** | Throughout frontend/backend | Debug logging left in production code |
| 7 | **PIN stored in plaintext** | `backend/src/services/family.service.ts:132-146` | Child PINs compared as plain text, not hashed |
| 8 | **No React Error Boundary** | `frontend/src/App.tsx` | Entire app can crash without graceful fallback |
| 9 | **Missing pagination on 5+ endpoints** | Backend services | `getMemberEnrollments`, `getMemberProgress`, `getMemberResults`, `getItems` all fetch unbounded |

### 🟡 MEDIUM

| # | Issue | Location | Details |
|---|-------|----------|---------|
| 10 | **6 TODO comments** | Backend services | Email sending, token invalidation, AI generation, streak calculation unimplemented |
| 11 | **No rate limiting on auth endpoints** | `backend/src/index.ts` | Global 100 req/15min is too lenient for login/reset |
| 12 | **Missing `useMemo` on filter** | `frontend/src/pages/courses/CourseCatalog.tsx:14-17` | Re-filters all courses every render |
| 13 | **No code splitting** | `frontend/src/App.tsx` | No `React.lazy()` or `Suspense` — all pages in initial bundle |
| 14 | **No structured logging** | Backend | Only Morgan HTTP logging, no Winston/Pino for business events |
| 15 | **Hardcoded test creds** | `backend/test-api-endpoints.ts` | `admin@islamic-learning.com` / `admin123` |

### 🔵 LOW

| # | Issue | Location | Details |
|---|-------|----------|---------|
| 16 | **Weak email verification tokens** | `backend/src/services/auth.service.ts:70,249` | UUID-based instead of cryptographic random |
| 17 | **No HTTPS enforcement** | Backend | Expected to be handled by reverse proxy |
| 18 | **Missing password special char requirement** | `backend/src/routes/auth.routes.ts:33-38` | Only requires uppercase/lowercase/digit |

---

## 4. Accessibility Gaps

| Severity | Issue | Details |
|----------|-------|---------|
| 🟠 HIGH | Missing alt text | Only ~12.5% of image instances have alt attributes |
| 🟠 HIGH | Missing form labels | Search/filter inputs lack `<label>` elements (auth forms are fine) |
| 🟠 HIGH | Missing aria-labels | Interactive buttons (menu, logout, nav) lack screen reader support |
| 🟡 MEDIUM | Missing keyboard handlers | Only `FlashCard.tsx` has `onKeyDown` — rest of app inaccessible via keyboard |
| 🟡 MEDIUM | Loading spinners lack `role="status"` | Only `FlashCardList` has it |
| 🟡 MEDIUM | No skip-to-content link | `MainLayout.tsx` has no skip navigation |

---

## 5. Documentation Inventory

All docs are from **December 2025** — nearly 5 months stale:

| Document | Last Modified | Status |
|----------|--------------|--------|
| `LOCAL_DEVELOPMENT.md` | 2025-12-23 | ✅ Useful setup guide |
| `AZURE_DEPLOYMENT.md` | 2025-12-19 | ⚠️ May be outdated |
| `CONTENT_CREATION.md` | 2025-12-25 | ℹ️ Content guidelines |
| `FLASHCARDS_IMPLEMENTATION_PLAN.md` | 2025-12-29 | 📋 Historical planning |
| `FLASHCARD_API.md` | 2025-12-29 | ⚠️ May not reflect current API |
| `FLASHCARD_FIXES_2025-12-31.md` | 2025-12-31 | 📋 Historical |
| `FLASHCARD_IMPLEMENTATION_TASKS.md` | 2025-12-29 | 📋 Historical |
| `FLASHCARD_TEST_RESULTS.md` | 2025-12-30 | 📋 Historical |
| `FLASHCARD_TROUBLESHOOTING.md` | 2025-12-30 | ⚠️ Useful but may be stale |
| `TEST_OVERHAUL_PLAN.md` | 2025-12-31 | 📋 Historical |
| `TEST_OVERHAUL_SUMMARY.md` | 2025-12-31 | 📋 Historical |
| `AI_QUESTION_GENERATION_ANALYSIS.md` | 2025-12-29 | 📋 Feature analysis |
| `task-assignments.md` | 2025-12-19 | 📋 Historical |
| `task-assignments-detailed.md` | 2025-12-24 | 📋 Historical |

**Observation:** No docs updated since Dec 2025. Several are historical/planning docs that could be archived. Active reference docs (API, deployment, development) need freshness review.

---

## 6. Build & Config Issues

### 🟠 HIGH: 44 Stale Timestamp Files
The `frontend/` directory contains **44 `.timestamp-*.mjs` files** — Vite build artifacts that should not be committed:
- 27 `vite.config.ts.timestamp-*.mjs` files
- 17 `vitest.config.ts.timestamp-*.mjs` files

**Root cause:** `frontend/.gitignore` does not include `*.timestamp-*` pattern.  
**Fix:** Add `*.timestamp-*.mjs` to `frontend/.gitignore` and remove tracked files.

### 🟡 MEDIUM: No Root package.json
No monorepo-level package.json — no single `npm test` command to run all tests. Each package must be tested independently.

### 🟡 MEDIUM: Backend .env in Repo
`backend/.env` appears to be tracked (contains real database credentials and API keys). Even though `.gitignore` lists `.env`, verify it's actually being ignored by git.

---

## 7. Security Scorecard

| Area | Status | Notes |
|------|--------|-------|
| Helmet.js | ✅ | Security headers configured |
| Password hashing | ✅ | bcrypt, 12 rounds |
| JWT expiry | ✅ | 24h access, 30d refresh |
| Input validation | ✅ | express-validator + Zod |
| CORS | ✅ | Properly scoped to frontend URL |
| Rate limiting | ⚠️ | Global only, not per-endpoint |
| Token invalidation | ❌ | Logout is a no-op |
| Secret management | ❌ | API key in .env, weak JWT defaults |
| PIN security | ❌ | Plaintext storage/comparison |
| COPPA compliance | ⚠️ | Parent role exists but no explicit consent flow |

---

## Priority Action Items

### Immediate (This Week)
1. 🔴 Rotate OpenAI API key and remove from git history
2. 🔴 Remove sensitive console.log in authService.ts
3. 🔴 Add `*.timestamp-*.mjs` to frontend/.gitignore and clean up 44 files

### Short-term (This Sprint)
4. 🟠 Implement token blacklist for logout
5. 🟠 Make JWT secrets required (throw on missing)
6. 🟠 Hash child PINs with bcrypt
7. 🟠 Add React Error Boundary
8. 🟠 Add pagination to unbounded list endpoints
9. 🟠 Add stricter rate limiting on auth endpoints

### Medium-term (Next Sprint)
10. 🟡 Add tests for: family service, user service, assessment service, middleware, stores
11. 🟡 Implement code splitting with React.lazy
12. 🟡 Add accessibility: alt text, form labels, aria-labels, keyboard handlers
13. 🟡 Replace console.log with structured logging (Winston/Pino)
14. 🟡 Update stale documentation
15. 🟡 Add `useMemo` to filter operations

---

*Report generated by Biruni (QA) — 2026-05-16*
