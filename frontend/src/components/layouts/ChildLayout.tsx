import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useChildAuthStore } from '@/stores/childAuthStore';
import { useAuthStore } from '@/stores/authStore';
import {
  Home,
  BookOpen,
  Brain,
  Trophy,
  LogOut,
  Menu,
  X,
  GraduationCap,
  Gamepad2,
} from 'lucide-react';
import clsx from 'clsx';

const childNavigation = [
  { name: 'My Dashboard', href: '/child/dashboard', icon: Home },
  { name: 'My Courses', href: '/child/courses', icon: BookOpen },
  { name: 'My Maktab 🕌', href: '/child/maktab', icon: GraduationCap },
  { name: 'My Flashcards', href: '/child/flashcards', icon: Brain },
  { name: 'Games 🎮', href: '/child/games', icon: Gamepad2 },
  { name: 'Achievements', href: '/child/achievements', icon: Trophy },
];

export default function ChildLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { member, logout } = useChildAuthStore();
  const { isAuthenticated: isParentAuth } = useAuthStore();
  const { isChildSession } = useChildAuthStore();
  // Parent is previewing when they arrived via SelectLearner (not child direct login)
  const isParentViewing = isParentAuth && !isChildSession;

  const handleLogout = () => {
    logout();
    navigate('/child-login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <Link to="/child/dashboard" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading font-semibold text-gray-800">
              My Learning
            </span>
          </Link>
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Student info */}
        <div className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center">
              <span className="text-lg font-semibold text-secondary-600">
                {member?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-800">{member?.name || 'Student'}</p>
              <p className="text-sm text-gray-500 capitalize">
                {member?.ageCategory?.replace('_', ' ') || 'Student'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {childNavigation.map((item) => {
            const isActive = location.pathname === item.href ||
              (item.href !== '/child/dashboard' && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                to={item.href}
                className={clsx(
                  'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100'
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 w-full rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-white shadow-sm flex items-center justify-between px-4 lg:px-8">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex-1 lg:flex-none" />

          {/* Student badge */}
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="font-medium text-gray-800">{member?.name}</p>
            </div>
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-700 font-semibold">
                {member?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          {isParentViewing && (
            <div className="mb-4 flex items-center justify-between gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm">
              <div className="flex items-center gap-2 text-amber-800">
                <span>👁️</span>
                <span className="font-medium">
                  Parent preview — you're viewing {member?.name}'s dashboard
                </span>
              </div>
              <Link
                to="/dashboard"
                className="shrink-0 px-3 py-1.5 bg-white border border-amber-300 text-amber-800 font-semibold rounded-lg hover:bg-amber-50 transition text-xs"
              >
                ← Parent View
              </Link>
            </div>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
