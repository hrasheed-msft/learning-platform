import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useFamilyStore } from '@/stores/familyStore';
import { useChildAuthStore } from '@/stores/childAuthStore';

// Layouts (keep eager — needed immediately)
import MainLayout from '@/components/layouts/MainLayout';
import AuthLayout from '@/components/layouts/AuthLayout';
import ChildLayout from '@/components/layouts/ChildLayout';

// Auth Pages (keep eager — first pages users see)
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';

// Lazy-loaded auth pages
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage'));
const VerifyEmailPage = lazy(() => import('@/pages/auth/VerifyEmailPage'));
const ChildLoginPage = lazy(() => import('@/pages/auth/ChildLoginPage'));

// Learner Picker (keep eager — critical path after login)
import SelectLearner from '@/pages/SelectLearner';

// Dashboard Pages (lazy)
const FamilyDashboard = lazy(() => import('@/pages/dashboard/FamilyDashboard'));
const ChildDashboard = lazy(() => import('@/pages/dashboard/ChildDashboard'));
const MemberProgress = lazy(() => import('@/pages/dashboard/MemberProgress'));
const ParentDashboard = lazy(() => import('@/pages/dashboard/ParentDashboard'));
const ChildDetailView = lazy(() => import('@/pages/dashboard/ChildDetailView'));

// Course Pages (lazy)
const CoursesPage = lazy(() => import('@/pages/courses/CoursesPage'));
const CourseDetail = lazy(() => import('@/pages/courses/CourseDetail'));
const CourseLearner = lazy(() => import('@/pages/courses/CourseLearner'));
const UnitViewer = lazy(() => import('@/pages/courses/UnitViewer'));
const QuizPage = lazy(() => import('@/pages/courses/QuizPage'));

// Flashcard Pages (lazy)
const StudySessionPage = lazy(() => import('@/pages/flashcards/StudySessionPage'));
const ReviewSessionPage = lazy(() => import('@/pages/flashcards/ReviewSessionPage'));
const UnitFlashCardsPage = lazy(() => import('@/pages/flashcards/UnitFlashCardsPage'));
const CourseFlashCardsPage = lazy(() => import('@/pages/flashcards/CourseFlashCardsPage'));

// Games Pages (lazy)
const GamesHub = lazy(() => import('@/pages/games/GamesHub'));
const GameLauncher = lazy(() => import('@/pages/games/GameLauncher'));
const GamePlay = lazy(() => import('@/pages/games/GamePlay'));
const ScoreHistory = lazy(() => import('@/pages/games/ScoreHistory'));
const AchievementGallery = lazy(() => import('@/pages/games/AchievementGallery'));
const LeaderboardPage = lazy(() => import('@/pages/games/LeaderboardPage'));

// Settings Pages (lazy)
const FamilySettings = lazy(() => import('@/pages/settings/FamilySettings'));
const ParentPinSetup = lazy(() => import('@/pages/settings/ParentPinSetup'));

// Child Pages (lazy)
const ChildDashboardHome = lazy(() => import('@/pages/child/ChildDashboardHome'));
const ChildCoursesPage = lazy(() => import('@/pages/child/ChildCoursesPage'));
const ChildFlashcardsPage = lazy(() => import('@/pages/child/ChildFlashcardsPage'));
const ChildAchievementsPage = lazy(() => import('@/pages/child/ChildAchievementsPage'));

// Program Pages (lazy)
const ProgramCatalog = lazy(() => import('@/pages/program/ProgramCatalog'));
const GradeDashboard = lazy(() => import('@/pages/program/GradeDashboard'));

// Child Islamic Progress Pages (lazy)
const ChildDuaProgressPage = lazy(() => import('@/pages/child/ChildDuaProgressPage'));
const ChildNamesProgressPage = lazy(() => import('@/pages/child/ChildNamesProgressPage'));

// Loading fallback for lazy routes
function PageLoader() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
    </div>
  );
}

// Protected Route Component (parent/admin users)
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();
  const { selectedMember } = useFamilyStore();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to learner picker if no active member is selected
  if (!selectedMember && location.pathname !== '/select-learner') {
    return <Navigate to="/select-learner" replace />;
  }

  return <>{children}</>;
}

// Public Route Component (redirect if authenticated)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

// Child Protected Route (requires child session OR parent viewing a child member)
function ChildProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated: isChildAuth, isChildSession } = useChildAuthStore();
  const { isAuthenticated: isParentAuth } = useAuthStore();
  const { selectedMember } = useFamilyStore();

  // Option (a): allow if child has their own session OR parent selected a child member
  const parentViewingChild =
    isParentAuth && selectedMember !== null && selectedMember.isAccountOwner === false;

  if (!((isChildAuth && isChildSession) || parentViewingChild)) {
    return <Navigate to="/select-learner" replace />;
  }

  return <>{children}</>;
}

// Requires authentication only (no active member needed — used by learner picker)
function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
    <Routes>
      {/* Child Login — standalone page, not inside AuthLayout */}
      <Route path="/child-login" element={<ChildLoginPage />} />

      {/* Learner Picker — requires auth but not an active member */}
      <Route
        path="/select-learner"
        element={
          <RequireAuth>
            <SelectLearner />
          </RequireAuth>
        }
      />

      {/* Public Auth Routes */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <AuthLayout />
          </PublicRoute>
        }
      >
        <Route index element={<Navigate to="/login" replace />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="verify-email/:token" element={<VerifyEmailPage />} />
      </Route>

      {/* Child Routes — separate layout, child auth required */}
      <Route
        path="/child"
        element={
          <ChildProtectedRoute>
            <ChildLayout />
          </ChildProtectedRoute>
        }
      >
        <Route path="dashboard" element={<ChildDashboardHome />} />
        <Route path="courses" element={<ChildCoursesPage />} />
        <Route path="courses/:courseId/learn" element={<CourseLearner />} />
        <Route path="courses/:courseId/units/:unitId" element={<UnitViewer />} />
        <Route path="courses/:courseId/units/:unitId/quiz" element={<QuizPage />} />
        <Route path="flashcards" element={<ChildFlashcardsPage />} />
        <Route path="achievements" element={<ChildAchievementsPage />} />
        <Route path="maktab" element={<GradeDashboard />} />
        <Route path="duas" element={<ChildDuaProgressPage />} />
        <Route path="99-names" element={<ChildNamesProgressPage />} />
        <Route path="games" element={<GamesHub />} />
        <Route path="games/:gameSlug/launch" element={<GameLauncher />} />
        <Route path="games/:gameSlug/play" element={<GamePlay />} />
        <Route path="games/scores" element={<ScoreHistory />} />
        <Route path="games/achievements" element={<AchievementGallery />} />
        <Route path="games/leaderboard" element={<LeaderboardPage />} />
      </Route>

      {/* Protected Routes (parent/admin) */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard */}
        <Route path="dashboard" element={<FamilyDashboard />} />
        <Route path="dashboard/child/:memberId" element={<ChildDashboard />} />
        <Route path="dashboard/member/:memberId" element={<MemberProgress />} />
        <Route path="dashboard/parent" element={<ParentDashboard />} />
        <Route path="dashboard/parent/child/:memberId" element={<ChildDetailView />} />

        {/* Courses */}
        <Route path="courses" element={<CoursesPage />} />
        <Route path="courses/:courseId" element={<CourseDetail />} />
        <Route path="courses/:courseId/learn" element={<CourseLearner />} />
        <Route path="courses/:courseId/units/:unitId" element={<UnitViewer />} />
        <Route path="courses/:courseId/units/:unitId/quiz" element={<QuizPage />} />

        {/* Flashcards */}
        <Route path="courses/:courseId/flashcards" element={<CourseFlashCardsPage />} />
        <Route path="courses/:courseId/flashcards/study" element={<StudySessionPage />} />
        <Route path="courses/:courseId/flashcards/review" element={<StudySessionPage />} />
        <Route path="courses/:courseId/units/:unitId/flashcards" element={<UnitFlashCardsPage />} />
        <Route path="courses/:courseId/units/:unitId/flashcards/study" element={<StudySessionPage />} />
        <Route path="courses/:courseId/units/:unitId/flashcards/review" element={<StudySessionPage />} />

        {/* Reviews */}
        <Route path="reviews" element={<ReviewSessionPage />} />

        {/* Games */}
        <Route path="games" element={<GamesHub />} />
        <Route path="games/:gameSlug/launch" element={<GameLauncher />} />
        <Route path="games/:gameSlug/play" element={<GamePlay />} />
        <Route path="games/scores" element={<ScoreHistory />} />
        <Route path="games/achievements" element={<AchievementGallery />} />
        <Route path="games/leaderboard" element={<LeaderboardPage />} />

        {/* Settings */}
        <Route path="settings" element={<FamilySettings />} />
        <Route path="settings/pin" element={<ParentPinSetup />} />

        {/* Programs */}
        <Route path="programs" element={<ProgramCatalog />} />
        <Route path="program/:slug" element={<ProgramCatalog />} />
      </Route>

      {/* Catch all - 404 */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
    </Suspense>
  );
}

export default App;
