import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useFamilyStore } from '@/stores/familyStore';
import ParentPinModal from '@/components/auth/ParentPinModal';
import { authService } from '@/services/authService';
import {
  Home,
  BookOpen,
  Settings,
  LogOut,
  Menu,
  X,
  Users,
  Brain,
  BarChart3,
  Gamepad2,
  ArrowLeftRight,
  GraduationCap,
} from 'lucide-react';
import clsx from 'clsx';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Parent Dashboard', href: '/dashboard/parent', icon: BarChart3, parentOnly: true },
  { name: 'Courses', href: '/courses', icon: BookOpen },
  { name: 'Maktab 🕌', href: '/programs', icon: GraduationCap },
  { name: 'Reviews', href: '/reviews', icon: Brain },
  { name: 'Games 🎮', href: '/games', icon: Gamepad2 },
  { name: 'Settings', href: '/settings', icon: Settings, parentOnly: true },
];

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSwitchPin, setShowSwitchPin] = useState(false);
  const [hasPinCache, setHasPinCache] = useState<boolean | null>(null);
  const [pinToast, setPinToast] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, family, logout } = useAuthStore();
  const { selectedMember, members, setParentInStudentMode } = useFamilyStore();

  // Pre-fetch PIN status
  useEffect(() => {
    authService
      .getParentPinStatus()
      .then(({ hasPin }) => setHasPinCache(hasPin))
      .catch(() => setHasPinCache(false));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const showNoPinToast = (msg: string) => {
    setPinToast(msg);
    setTimeout(() => setPinToast(null), 5000);
  };

  const doSwitchLearner = () => {
    setParentInStudentMode(false);
    navigate('/select-learner');
  };

  const handleSwitchLearner = () => {
    setSidebarOpen(false);
    if (hasPinCache === true) {
      setShowSwitchPin(true);
    } else {
      showNoPinToast('Set a parent PIN in Settings to secure account switching.');
      doSwitchLearner();
    }
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
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-xl text-white font-arabic">ع</span>
            </div>
            <span className="font-heading font-semibold text-gray-800">
              Islamic Studies
            </span>
          </Link>
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Family info */}
        <div className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-secondary-600" />
            </div>
            <div>
              <p className="font-medium text-gray-800">{family?.name || 'My Family'}</p>
              <p className="text-sm text-gray-500">{user?.name}</p>
            </div>
          </div>
        </div>

        {/* Switch Learner button — always visible for parent */}
        <div className="px-4 py-3 border-b">
          <button
            onClick={handleSwitchLearner}
            className="flex items-center gap-2 w-full px-4 py-2.5 bg-primary-50 border border-primary-200 text-primary-800 font-semibold rounded-xl hover:bg-primary-100 transition text-sm min-h-[44px]"
          >
            <Users className="w-4 h-4 flex-shrink-0" />
            <span>Switch Learner</span>
          </button>
          {selectedMember && (
            <p className="text-xs text-gray-400 text-center mt-1">
              Learning as {selectedMember.name}
            </p>
          )}
          {!selectedMember && members.length === 0 && (
            <p className="text-xs text-gray-400 text-center mt-1">
              No learners yet —{' '}
              <Link to="/settings" className="underline text-primary-600" onClick={() => setSidebarOpen(false)}>
                add one
              </Link>
            </p>
          )}
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navigation
            .filter((item) => {
              if (item.parentOnly && selectedMember?.isAccountOwner === false) return false;
              return true;
            })
            .map((item) => {
            const isActive = location.pathname.startsWith(item.href);
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

          {/* Active Learner Switcher (top bar) */}
          {selectedMember && (
            <button
              onClick={handleSwitchLearner}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-50 hover:bg-primary-100 border border-primary-200 transition-colors mr-2"
              title="Switch learner"
            >
              <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {selectedMember.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm font-medium text-primary-800 hidden sm:inline max-w-[100px] truncate">
                {selectedMember.name}
              </span>
              <ArrowLeftRight className="w-3.5 h-3.5 text-primary-500" />
            </button>
          )}

          {/* User menu */}
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="font-medium text-gray-800">{user?.name}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-700 font-semibold">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Parent PIN modal for Switch Learner */}
      {showSwitchPin && selectedMember && (
        <ParentPinModal
          memberId={selectedMember.id}
          title="Parent PIN Required"
          description="Enter your PIN to switch learner"
          onVerified={() => {
            setShowSwitchPin(false);
            doSwitchLearner();
          }}
          onCancel={() => setShowSwitchPin(false)}
        />
      )}

      {/* No-PIN toast */}
      {pinToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 bg-gray-800 text-white text-sm rounded-xl shadow-lg max-w-sm text-center">
          {pinToast}
        </div>
      )}
    </div>
  );
}
