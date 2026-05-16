# Project Context

- **Owner:** hrasheed
- **Project:** Islamic Studies Learning Platform — family-based Islamic education with courses, flashcards, SRS, quizzes, and gamification
- **Stack:** React 18 + Vite + TypeScript (frontend), Node.js + Express + Prisma + PostgreSQL + Redis (backend), TailwindCSS, Zustand, JWT auth
- **Created:** 2026-05-16

## Learnings

<!-- Append new learnings below. Each entry is something lasting about the project. -->

### 2026-05-16 — Full Architectural Inventory

#### System Architecture
- **Frontend:** React 18 + Vite + TypeScript, TailwindCSS, Zustand (4 stores: auth, course, family, flashcard), React Router v6, Axios API layer
- **Backend:** Express + TypeScript, Prisma ORM, PostgreSQL, Redis, JWT auth (access+refresh tokens), bcrypt, rate limiting, Helmet, CORS
- **CMS:** Directus configured via Docker (port 8055) pointing at same PostgreSQL DB — but NOT actively integrated into app code. It's scaffolded only.
- **Routing:** `frontend/src/App.tsx` — ProtectedRoute/PublicRoute pattern with nested layouts (AuthLayout, MainLayout)

#### Database Schema (Prisma — 2 migrations applied)
- **Core models:** Family → User, FamilyMember (with ageCategory, streaks, points)
- **Content:** Course → Unit → (VideoResource, AudioResource, ArabicTerm, Question, FlashCard)
- **Assessment:** Question (MCQ, T/F, Matching, Fill-blank), QuizResult
- **Flashcards:** FlashCard (with SM-2 fields), FlashCardProgress (per-member tracking)
- **SRS:** MemorizationItem (AYAH, HADITH, DUA, TERM types), ReviewLog
- **Progress:** CourseEnrollment, UnitProgress
- **Gamification:** Achievement model exists

#### Backend Routes (all under /api/v1)
- **Auth:** 8 endpoints (register, login, refresh, logout, forgot/reset password, verify email, resend verification)
- **Family:** 8 endpoints (CRUD members, switch member, get progress)
- **Courses:** 9 endpoints (list, detail, units, enrollments, progress)
- **Assessments:** 5 endpoints (questions, submit, results, AI generate)
- **SRS:** 6 endpoints (due items, all items, add, review, history, stats) — SM-2 algorithm fully implemented
- **Flashcards:** 23 endpoints (CRUD, batch, reorder, metadata, progress, review, due cards, stats, reset)
- **Users:** 6 endpoints (profile, password, settings, achievements)

#### Frontend Pages (all real implementations, no placeholders)
- **Auth:** Login, Register, ForgotPassword, ResetPassword, VerifyEmail
- **Dashboard:** FamilyDashboard (stats+member cards), ChildDashboard (streaks, goals, badges), MemberProgress
- **Courses:** CourseCatalog (search+filter), CourseDetail (enrollment), CourseLearner (unit navigation), UnitViewer (video+reading+completion), QuizPage (MCQ/TF/fill-blank with timing)
- **Flashcards:** StudySessionPage, ReviewSessionPage, UnitFlashCardsPage, CourseFlashCardsPage
- **Settings:** FamilySettings (name, add/delete members)
- **UI Components:** Avatar, Badge, Button, Card, Input, Modal, ProgressBar, Spinner
- **Flashcard Components:** FlashCard, FlashCardEditor, FlashCardList, ProgressStats, StudySession

#### Zustand Stores
- `authStore` — login/register/logout/refresh with persist middleware
- `courseStore` — courses, units, enrollments, filters
- `familyStore` — members CRUD, selectMember
- `flashcardStore` — comprehensive: CRUD, metadata, progress/review, study session management (start/end/next/rate)

#### Seeded Courses (11 total)
- **In main seed.ts (6):** Intro to Tawheed (3 units, 8 Qs), Stories of the Prophets (5 units, 7 Qs), Learn Arabic Basics (3 units, 6 Qs), Five Pillars of Islam (5 units, 7 Qs), Daily Duas and Adhkar (3 units), How to Pray - Hanafi Way (6 units)
- **Separate seed files (5):** Advanced Sarf/Arabic Morphology (2+ units, flashcards+quizzes), Habits to Win (16 units), Hujjatullah Al-Balighah (7 units), Tazkiyah (7 units), Rawai Hadaratina (7 units)
- **Note:** Separate seed files are NOT called by main seed.ts — they must be run independently and depend on demo family existing first

#### Maktab Coursebook HTML Content
- **10 coursebook packages** (9 numbered + FurtherStudiesNW), each with student book + parent guide
- Coursebook 1-5 (ages ~6-12), Coursebook 6 splits into Boys/Girls versions, Coursebook 7-8, FurtherStudiesNW (advanced)
- Well-structured HTML with CSS classes: `.subject`, `.topic`, `.toc`, `.arabic` (RTL support), `.diagram`
- Subjects per book: Fiqh, Ahadith, Sirah, Tarikh, Aqaid, Akhlaq, Dua
- 267 PNG images in images/ directory
- Sizes range from 69KB (Book 1) to 641KB (FurtherStudies) — progressive complexity
- **This is the content source for upcoming Maktab course creation work**

#### Test Coverage
- Backend: auth.service, course.service, srs.service, flashcard.service, SM-2 algorithm, integration (flashcard study session)
- Frontend: 6 page tests (FamilyDashboard, ChildDashboard, CourseCatalog, MemberProgress, QuizPage, ReviewSession), 5 flashcard component tests, 1 integration test (learning flow)

#### README vs Reality — Gaps Found
- **"AI-Powered: Automatic quiz question generation"** — endpoint exists (`POST /assessments/generate`) but no AI service implementation found; likely a stub
- **Directus CMS** — Docker config exists but NO active integration in app code; Directus README lists "Collections to Create" as future work
- **Gamification** — Achievement model exists in schema, `GET /users/me/achievements` endpoint exists, but no achievement-granting logic found (no trigger on quiz completion, streak milestones, etc.)
- **Multi-Age Support** — ageCategory field exists on FamilyMember, courses have ageLevels array, but no evidence of content filtering by age in course service
- **Email verification** — endpoint exists but no email sending service configured

#### Architecture Concerns
- **Vite timestamp files:** 25+ orphaned `.mjs` timestamp files in frontend/ root — build artifact pollution
- **Directus credentials hardcoded** in docker-compose.yml (DB_PASSWORD, ADMIN_PASSWORD)
- **Seed file fragmentation:** 5 course seed files not connected to main seed.ts; no unified seeding strategy
- **Dual SRS systems:** Both MemorizationItem (general SRS) and FlashCardProgress (flashcard-specific SM-2) exist — potential conceptual overlap
- **new_course_description.txt:** 65KB file with full video transcripts for "Habits to Win" course — this course is already seeded via seed-habits-course.ts
- **No gamification engine:** Achievement model is passive; no logic awards achievements

#### Key File Paths
- Frontend entry: `frontend/src/App.tsx`
- Backend entry: `backend/src/index.ts`
- Schema: `backend/prisma/schema.prisma`
- Main seed: `backend/prisma/seed.ts`
- Stores: `frontend/src/stores/` (authStore, courseStore, familyStore, flashcardStore)
- Services: `frontend/src/services/` (api, auth, course, family, flashcard, assessment, srs)
- Backend routes: `backend/src/routes/` (auth, family, course, assessment, srs, user, flashcard/)
- Maktab content: `maktab-coursebook-html/` (10 coursebooks + parent guides + images/)
- Docs: `docs/` (14 files including flashcard implementation plans, deployment, content creation guides)

---

### 2026-05-16 — Orchestration Complete

**Status:** COMPLETED  
**Orchestration Log:** `.squad/orchestration-log/2026-05-16T08-36-khaldun.md`

Architecture inventory audit wrapped. Findings merged into team decision archive:
- Decision filed: "Architecture Inventory Key Findings" (Informational) — 5 findings documented for team awareness
- No blocking items; specific decisions deferred to respective workstreams (SRS consolidation, gamification activation, Maktab ingestion, seed orchestration)
- Team can now make informed architectural decisions based on full system visibility
