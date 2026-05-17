import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-primary-500 rounded-xl flex items-center justify-center">
            <span className="text-3xl text-white font-arabic">ع</span>
          </div>
        </div>
        <h1 className="text-2xl font-heading font-bold text-gray-800">
          Islamic Studies Platform
        </h1>
        <p className="text-gray-600 mt-1">Learn together as a family</p>
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <Outlet />
      </div>

      {/* Footer */}
      <p className="mt-8 text-sm text-gray-500">
        © {new Date().getFullYear()} Islamic Studies Learning Platform
      </p>
    </div>
  );
}
