# Project Context

- **Owner:** hrasheed
- **Project:** Islamic Studies Learning Platform — family-based Islamic education with courses, flashcards, SRS, quizzes, and gamification
- **Stack:** React 18 + Vite + TypeScript (frontend), Node.js + Express + Prisma + PostgreSQL + Redis (backend), TailwindCSS, Zustand, JWT auth
- **Created:** 2026-05-16

## Learnings

<!-- Append new learnings below. Each entry is something lasting about the project. -->

### Backend Inventory Audit — 2026-05-16

#### Prisma Schema (17 models)
- **Family & User**: Family, User, FamilyMember — family-based multi-tenant model. Users are parents (PARENT/ADMIN), FamilyMembers are learners with age categories (EARLY_CHILD through ADULT), streaks, and points.
- **Course & Content**: Course (category: QURAN/HADITH/FIQH/SEERAH/ARABIC/ISLAMIC_HISTORY), Unit (ordered, rich HTML content), VideoResource, AudioResource, ArabicTerm.
- **Assessment**: Question (MULTIPLE_CHOICE/TRUE_FALSE/MATCHING/FILL_BLANK, supports AI-generated flag), QuizResult (scored 0-100, pass/fail).
- **FlashCard system**: FlashCard (front/back with Arabic support, category/tags, difficulty enum), FlashCardProgress (SM-2 algorithm: easeFactor, interval, repetitions, status enum NEW→LEARNING→REVIEWING→MASTERED). Two enums: FlashCardStatus, FlashCardDifficulty.
- **Progress & Enrollment**: CourseEnrollment (ACTIVE/PAUSED/COMPLETED, 0-100%), UnitProgress (video/reading/quiz completion per unit).
- **SRS (Memorization)**: MemorizationItem (AYAH/HADITH/DUA/TERM), ReviewLog — separate from FlashCard SRS. Uses simplified SM-2 with fixed intervals.
- **Gamification**: Achievement (type-based, earned per FamilyMember).

#### API Routes (7 route groups, ~50+ endpoints)
- **Auth** `/api/v1/auth`: register, login, refresh, logout, forgot-password, reset-password, verify-email, resend-verification
- **Family** `/api/v1/family`: CRUD members, switch member (PIN-based child login), get member progress. All authenticated, write ops require PARENT role.
- **Courses** `/api/v1/courses`: list/get courses (public w/ optional auth), units (authenticated), enrollments (PARENT only for enroll/unenroll), progress tracking.
- **Assessments** `/api/v1/assessments`: get questions by unit, submit quiz, get results, AI question generation (stub).
- **SRS** `/api/v1/srs`: due items, all items, add item, submit review, history, stats — all by memberId.
- **Users** `/api/v1/users`: profile CRUD, password change, settings, achievements.
- **FlashCards** `/api/v1/` (mounted at root v1): Full CRUD (create, batch create, get by unit/course/id, update, delete, reorder), metadata (categories, tags, count), progress (initialize, review, due cards, stats, unit/course progress, recent reviews, reset).

#### Middleware
- **auth.middleware.ts**: JWT Bearer token authentication (`authenticate`), role-based authorization (`requireRole`, `requireParentRole`), optional auth (`optionalAuth`). Verifies user exists in DB on every request.
- **validate.middleware.ts**: express-validator integration, transforms errors to structured map.
- **error.middleware.ts**: Centralized error handler with custom error classes (AppError, BadRequest, Unauthorized, Forbidden, NotFound, Conflict, Validation, InternalServer). Dev mode shows stack traces.
- **notFound.middleware.ts**: 404 catch-all.
- **Rate limiting**: express-rate-limit configured in index.ts (configurable window/max).
- **Security**: helmet, cors (configured origin), body size limit 10mb.

#### Services Implementation
- **auth.service**: Full register (family+user transaction), login, refresh, forgot/reset password, email verify. bcrypt hashing. JWT access+refresh tokens.
- **family.service**: Full CRUD, age category auto-calculation, PIN-based member switching, progress aggregation.
- **course.service**: Paginated listing with filters (category, ageLevel, search), enrollment management, unit progress upsert, auto-calculates course completion %.
- **assessment.service**: Quiz grading with detailed answer feedback, auto-awards points (100 for perfect, 50 for pass, 10 for fail), updates unit progress on pass.
- **srs.service**: SM-2 with fixed interval table [0,1,3,7,14,30,60,120,240 days], review logging, retention rate calculation.
- **flashcard/flashcard.service**: Full CRUD with filtering/pagination, batch create in transaction, reorder, category/tag metadata.
- **flashcard/flashcard-progress.service**: SM-2 algorithm (proper implementation), status transitions with messages, due card retrieval, statistics, reset operations.
- **flashcard/sm2-algorithm.service**: Full SM-2 implementation (ease factor adjustment, interval calculation, status transitions), rating time suggestions, future review prediction, daily target calculator.

#### Seed Data (12 courses total)
**Main seed (seed.ts) — 6 courses:**
1. Introduction to Tawheed (FIQH, CHILD/PRE_TEEN/TEEN) — 3 units with rich HTML, questions
2. Stories of the Prophets (SEERAH, CHILD/PRE_TEEN) — 5 units (Adam, Nuh, Ibrahim, Musa, Isa)
3. Learn Arabic Basics (ARABIC, EARLY_CHILD/CHILD) — units on alphabet, numbers
4. The Five Pillars of Islam (FIQH, CHILD/PRE_TEEN/TEEN) — units on Salah etc.
5. Daily Duas and Adhkar (QURAN, EARLY_CHILD/CHILD/PRE_TEEN) — eating/drinking, protection
6. My First Prayer (FIQH, EARLY_CHILD/CHILD) — wudu, clothes, movements

**Independent seed files — 6 additional courses:**
7. Advanced Sarf - Arabic Morphology (seed-sarf-course.ts + parts 2-5) — multi-part, advanced Arabic morphology
8. Sarf Flashcards (seed-sarf-flashcards.ts) — flashcard data for Sarf course
9. Sarf Quizzes (seed-sarf-quizzes.ts) — comprehensive quiz questions per unit
10. Habits to Win Here and Hereafter (seed-habits-course.ts) — Yaqeen Institute series, TEEN/ADULT
11. Hujjatullah Al-Balighah (seed-hujjatullah-course.ts) — Shah Wali Allah, FIQH, ADULT
12. From the Glories of Our Civilization (seed-rawai-hadaratina-course.ts) — al-Sibai, ISLAMIC_HISTORY, TEEN/ADULT
13. Tazkiyah: Purification of the Soul (seed-tazkiyah-course.ts) — al-Jilani/Ibn Taymiyyah, AQEEDAH, TEEN/ADULT

Note: Sarf seed uses non-standard schema fields (descriptionArabic, titleArabic, level, ageCategory, category:'LANGUAGE', estimatedHours) that don't exist in the current Prisma schema — will fail on seed unless schema is updated or seed is fixed.

#### Database Migrations (2)
1. `20251223212736_v1` — Initial schema (Family, User, FamilyMember, Course, Unit, VideoResource, AudioResource, ArabicTerm, Question, QuizResult, CourseEnrollment, UnitProgress, MemorizationItem, ReviewLog, Achievement)
2. `20251229225721_add_flashcards` — Added FlashCard, FlashCardProgress models with SM-2 fields and enums

#### Directus CMS
- docker-compose.yml running Directus CMS on port 8055, connected to same PostgreSQL database (`islamic_learning_dev`). Shares DB with backend — can be used for content management alongside the API.

#### TODOs / Incomplete Items
1. **Email sending** — auth.service has 3 TODOs: send verification email (register), send reset email (forgotPassword), send verification email (resendVerification). No email transport configured.
2. **Redis token invalidation** — logout just logs, doesn't actually invalidate refresh tokens in Redis.
3. **AI question generation** — assessment.service.generateQuestions returns placeholder; OpenAI integration not implemented.
4. **FlashCard review streak** — flashcard-progress.service has TODO for calculating review streak.
5. **Sarf seed schema mismatch** — seed-sarf-course.ts uses fields not in current Prisma schema (descriptionArabic, titleArabic, level, ageCategory as string, category:'LANGUAGE', estimatedHours). Will fail at runtime.
6. **Two parallel SRS systems** — MemorizationItem+ReviewLog (srs.service) and FlashCard+FlashCardProgress (flashcard services) both implement SM-2 independently. Could be consolidated.
7. **Assessment getQuestions exposes correctAnswer** — returns correctAnswer and explanation in GET response (line assessment.service.ts:41), leaking answers to client before quiz submission.

---

### 2026-05-16 — Orchestration Complete

**Status:** COMPLETED  
**Orchestration Log:** `.squad/orchestration-log/2026-05-16T08-36-khwarizmi.md`

Backend inventory audit wrapped. Findings merged into team decision archive:
- Decision filed: "Fix Sarf Seed / Schema Mismatch" — Recommends Option 3 (update schema + audit seeds)
- Decision filed: "Consolidate Dual SRS Systems" — Recommends migrating MemorizationItem to FlashCard SRS (FlashCard is more mature, reduces duplication)
- Critical issue identified: Quiz answers exposed in GET endpoint (item 7 above) — should be fixed immediately
- Backend is feature-complete with clear architectural decisions needed on SRS consolidation and schema extensions
