# Project Context

- **Owner:** hrasheed
- **Project:** Islamic Studies Learning Platform — family-based Islamic education with courses, flashcards, SRS, quizzes, and gamification
- **Stack:** React 18 + Vite + TypeScript (frontend), Node.js + Express + Prisma + PostgreSQL + Redis (backend), TailwindCSS, Zustand, JWT auth
- **Created:** 2026-05-16

## Learnings

<!-- Append new learnings below. Each entry is something lasting about the project. -->

### 2026-05-16 — Full Frontend Inventory

#### Routing Map (App.tsx)
**Public routes** (redirect to /dashboard if authenticated):
| Route | Component | Layout |
|-------|-----------|--------|
| `/` → redirects to `/login` | — | AuthLayout |
| `/login` | LoginPage | AuthLayout |
| `/register` | RegisterPage | AuthLayout |
| `/forgot-password` | ForgotPasswordPage | AuthLayout |
| `/reset-password/:token` | ResetPasswordPage | AuthLayout |
| `/verify-email/:token` | VerifyEmailPage | AuthLayout |

**Protected routes** (redirect to /login if unauthenticated):
| Route | Component | Layout |
|-------|-----------|--------|
| `/dashboard` | FamilyDashboard | MainLayout |
| `/dashboard/child/:memberId` | ChildDashboard | MainLayout |
| `/dashboard/member/:memberId` | MemberProgress | MainLayout |
| `/courses` | CourseCatalog | MainLayout |
| `/courses/:courseId` | CourseDetail | MainLayout |
| `/courses/:courseId/learn` | CourseLearner | MainLayout |
| `/courses/:courseId/units/:unitId` | UnitViewer | MainLayout |
| `/courses/:courseId/units/:unitId/quiz` | QuizPage | MainLayout |
| `/courses/:courseId/flashcards` | CourseFlashCardsPage | MainLayout |
| `/courses/:courseId/flashcards/study` | StudySessionPage | MainLayout |
| `/courses/:courseId/flashcards/review` | StudySessionPage | MainLayout |
| `/courses/:courseId/units/:unitId/flashcards` | UnitFlashCardsPage | MainLayout |
| `/courses/:courseId/units/:unitId/flashcards/study` | StudySessionPage | MainLayout |
| `/courses/:courseId/units/:unitId/flashcards/review` | StudySessionPage | MainLayout |
| `/reviews` | ReviewSessionPage | MainLayout |
| `/settings` | FamilySettings | MainLayout |
| `*` (catch-all) → redirects to `/dashboard` | — | — |

Auth guard: `ProtectedRoute` reads `useAuthStore().isAuthenticated`.

#### Pages (frontend/src/pages/)
- **auth/** — 5 files, all ✅ functional (login, register, forgot/reset password, verify email)
- **dashboard/** — 3 files, all ✅ functional (FamilyDashboard, ChildDashboard, MemberProgress)
- **courses/** — 5 files, all ✅ functional (CourseCatalog, CourseDetail, CourseLearner, UnitViewer, QuizPage)
- **flashcards/** — 4 files, all ✅ functional (StudySessionPage, ReviewSessionPage, UnitFlashCardsPage, CourseFlashCardsPage)
- **review/** — 1 file, ✅ functional (ReviewSession — standalone SRS review with 5-point rating)
- **settings/** — 1 file, ✅ functional (FamilySettings — name, members CRUD, subscription display)

#### Reusable Components (frontend/src/components/)
- **ui/** — Avatar, Badge, Button, Card (with Header/Title/Description/Content/Footer), Input, Modal, ProgressBar, Spinner/LoadingOverlay — all ✅ complete
- **layouts/** — AuthLayout (gradient bg, centered card), MainLayout (collapsible sidebar, nav, logout) — all ✅ complete
- **flashcards/** — FlashCard (3D flip), FlashCardEditor (bilingual EN/AR form), FlashCardList (grid + actions), ProgressStats (stat cards + breakdown), StudySession (rating system + keyboard shortcuts) — all ✅ complete

#### Zustand Stores (frontend/src/stores/)
- **authStore** — user, family, tokens, isAuthenticated, isLoading; actions: login, register, logout, refreshAuth. Uses persist middleware.
- **courseStore** — courses[], selectedCourse, units[], enrollments[], filters; actions: fetchCourses, fetchCourse, fetchUnits, enrollMember, unenrollMember, etc.
- **familyStore** — members[], selectedMember; actions: fetchMembers, addMember, updateMember, removeMember, selectMember.
- **flashcardStore** — flashCards[], dueCards[], statistics, currentSession, categories[], tags[]; 40+ actions for CRUD, progress, study sessions, filters.

#### Services (frontend/src/services/)
- **api.ts** — Axios instance, base URL `VITE_API_URL || '/api/v1'`, 30s timeout, auth interceptor with token refresh on 401.
- **authService** — 8 endpoints (login, register, logout, forgot/reset password, verify email, refresh, resend verification)
- **courseService** — 9 endpoints (CRUD courses/units, enrollments, progress)
- **familyService** — 9 endpoints (family CRUD, members CRUD, switch member, progress) — ⚠️ admin invite endpoints stubbed but not implemented
- **flashcardService** — 20+ endpoints (CRUD, batch create, reorder, metadata, progress, due cards, stats, reviews)
- **assessmentService** — 5 endpoints (quiz questions, submit, results, member progress)
- **srsService** — 6 endpoints (due reviews, submit review, history, memorization items, stats)

#### Types (frontend/src/types/)
- **user.ts** — UserRole, AgeCategory, SubscriptionStatus, Family, User, FamilyMember, auth request/response types
- **course.ts** — CourseCategory (7 subjects), AgeLevel (5 levels), Course, Unit, UnitContent, VideoResource, AudioResource, ArabicTerm, filters
- **flashcard.types.ts** — FlashCardStatus enum, FlashCardDifficulty enum, FlashCard, FlashCardProgress, StudySession, review types, filter types
- **assessment.ts** — QuestionType (5 formats), QuestionDifficulty, Question, QuizQuestion, QuizSubmission, QuizResult
- **progress.ts** — EnrollmentStatus, UnitStatus, SkillLevel, CourseEnrollment, UnitProgress, MemberProgress, Achievement, StreakInfo
- **srs.ts** — ContentType (5 types), MemorizationStatus, Rating, MemorizationItem, ReviewDueResponse, ReviewStats, RATING_LABELS

#### UI Gaps & Issues Found
1. **Missing barrel export**: `courses/index.ts` does NOT export `CourseLearner` — import works via direct path in App.tsx but barrel is incomplete.
2. **No flashcards/index.ts**: The flashcards page directory has no barrel export file.
3. **Family admin features stubbed**: `familyService` has `getAdmins`, `inviteAdmin`, `removeAdmin`, `acceptAdminInvite` — all unimplemented.
4. **No 404 page**: Catch-all route silently redirects to `/dashboard` instead of showing a proper 404.
5. **No utils/ directory**: Vite config aliases `@utils` but no `src/utils/` directory exists.
6. **No hooks/ directory**: Vite config aliases `@hooks` but no `src/hooks/` directory exists.
7. **README promises "AI-Powered automatic quiz generation"** — no frontend UI for this exists.
8. **README promises "Gamification: Points, streaks, achievements"** — ChildDashboard shows locked achievement badges but there's no dedicated achievements/leaderboard page.
9. **Review streak tracking uses localStorage** instead of backend persistence.
10. **ReviewSessionPage vs review/ReviewSession.tsx**: Route `/reviews` maps to `ReviewSessionPage` (from flashcards/), but there's also a separate `review/ReviewSession.tsx` component that isn't routed.

#### Styling & Design
- **Tailwind config**: Custom Islamic palette (primary=green #359963, secondary=gold #d6823e, accent=blue #577da1), custom fonts (Inter, Amiri for Arabic, Poppins for headings), 4 custom animations.
- **Arabic support**: `.arabic-text` CSS class with RTL direction, Amiri font, 1.5em size. FlashCard component has bilingual support.
- **Accessibility**: `:focus-visible` outline set to primary green. Keyboard shortcuts throughout (quiz, flashcards, reviews).
- **Responsive**: MainLayout has mobile sidebar toggle. No dedicated breakpoint customization beyond Tailwind defaults.
- **Fonts loaded**: Inter, Amiri, Poppins — should verify these are in index.html `<link>` tags (not checked).

#### Test Coverage
- Component tests: FlashCard, FlashCardEditor, FlashCardList, ProgressStats, StudySession
- Page tests: ChildDashboard, CourseCatalog, FamilyDashboard, MemberProgress, QuizPage, ReviewSession
- Integration: learning-flow.test.ts
- Test infra: Vitest + Testing Library + MSW for mocking

---

### 2026-05-16 — Orchestration Complete

**Status:** COMPLETED  
**Orchestration Log:** `.squad/orchestration-log/2026-05-16T08-36-ibn-sina.md`

Frontend inventory audit wrapped. Findings merged into team decision archive:
- Decision filed: "Frontend Gaps to Address" — 7 gaps documented
  - Items 1-2 (404 page, @utils/@hooks dirs) are quick wins for Ibn Sina to complete immediately
  - Items 3-7 (family admin, AI quiz UI, gamification page, orphaned component, localStorage→backend) blocked on product direction
- Frontend codebase is 90-95% feature-complete with clear gaps now documented
