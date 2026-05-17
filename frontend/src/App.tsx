import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useChildAuthStore } from '@/stores/childAuthStore';

// Layouts
import MainLayout from '@/components/layouts/MainLayout';
import AuthLayout from '@/components/layouts/AuthLayout';
import ChildLayout from '@/components/layouts/ChildLayout';

// Auth Pages
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage';
import VerifyEmailPage from '@/pages/auth/VerifyEmailPage';
import ChildLoginPage from '@/pages/auth/ChildLoginPage';

// Dashboard Pages
import FamilyDashboard from '@/pages/dashboard/FamilyDashboard';
import ChildDashboard from '@/pages/dashboard/ChildDashboard';
import MemberProgress from '@/pages/dashboard/MemberProgress';
import ParentDashboard from '@/pages/dashboard/ParentDashboard';
import ChildDetailView from '@/pages/dashboard/ChildDetailView';

// Course Pages
import CourseCatalog from '@/pages/courses/CourseCatalog';
import CourseDetail from '@/pages/courses/CourseDetail';
import CourseLearner from '@/pages/courses/CourseLearner';
import UnitViewer from '@/pages/courses/UnitViewer';
import QuizPage from '@/pages/courses/QuizPage';

// Flashcard Pages
import StudySessionPage from '@/pages/flashcards/StudySessionPage';
import ReviewSessionPage from '@/pages/flashcards/ReviewSessionPage';
import UnitFlashCardsPage from '@/pages/flashcards/UnitFlashCardsPage';
import CourseFlashCardsPage from '@/pages/flashcards/CourseFlashCardsPage';

// Games Pages
import GamesHub from '@/pages/games/GamesHub';
import GamePlay from '@/pages/games/GamePlay';
import ScoreHistory from '@/pages/games/ScoreHistory';
import AchievementGallery from '@/pages/games/AchievementGallery';
import LeaderboardPage from '@/pages/games/LeaderboardPage';

// Settings Pages
import FamilySettings from '@/pages/settings/FamilySettings';

// Child Pages
import ChildDashboardHome from '@/pages/child/ChildDashboardHome';
import ChildCoursesPage from '@/pages/child/ChildCoursesPage';
import ChildFlashcardsPage from '@/pages/child/ChildFlashcardsPage';
import ChildAchievementsPage from '@/pages/child/ChildAchievementsPage';

// Protected Route Component (parent/admin users)
function ProtectedRoute({ children }: { children: React.ReactNode }) {
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

// Child Protected Route (requires child session)
function ChildProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isChildSession } = useChildAuthStore();

  if (!isAuthenticated || !isChildSession) {
    return <Navigate to="/child-login" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <Routes>
      {/* Child Login — standalone page, not inside AuthLayout */}
      <Route path="/child-login" element={<ChildLoginPage />} />

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
        <Route path="flashcards" element={<ChildFlashcardsPage />} />
        <Route path="achievements" element={<ChildAchievementsPage />} />
        <Route path="games" element={<GamesHub />} />
        <Route path="games/play/:gameType" element={<GamePlay />} />
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
        <Route path="courses" element={<CourseCatalog />} />
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
        <Route path="games/play/:gameType" element={<GamePlay />} />
        <Route path="games/scores" element={<ScoreHistory />} />
        <Route path="games/achievements" element={<AchievementGallery />} />
        <Route path="games/leaderboard" element={<LeaderboardPage />} />

        {/* Settings */}
        <Route path="settings" element={<FamilySettings />} />
      </Route>

      {/* Catch all - 404 */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
