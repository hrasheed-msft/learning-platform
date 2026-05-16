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
