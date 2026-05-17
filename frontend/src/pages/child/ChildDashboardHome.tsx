import { useChildAuthStore } from '@/stores/childAuthStore';
import { BookOpen, Brain, Trophy, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ChildDashboardHome() {
  const { member } = useChildAuthStore();

  return (
    <div className="space-y-8 animate-in">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-gray-800">
          Assalamu Alaikum, {member?.name}! 🌟
        </h1>
        <p className="text-gray-600 mt-1">Keep up the great work on your learning journey!</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/child/courses"
          className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition"
        >
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mb-3">
            <BookOpen className="w-5 h-5 text-primary-600" />
          </div>
          <p className="text-sm text-gray-500">My Courses</p>
          <p className="text-xl font-bold text-gray-800 mt-1">—</p>
        </Link>

        <Link
          to="/child/flashcards"
          className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition"
        >
          <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center mb-3">
            <Brain className="w-5 h-5 text-accent-600" />
          </div>
          <p className="text-sm text-gray-500">Flashcards Due</p>
          <p className="text-xl font-bold text-gray-800 mt-1">—</p>
        </Link>

        <Link
          to="/child/achievements"
          className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition"
        >
          <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center mb-3">
            <Trophy className="w-5 h-5 text-secondary-600" />
          </div>
          <p className="text-sm text-gray-500">Achievements</p>
          <p className="text-xl font-bold text-gray-800 mt-1">—</p>
        </Link>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
            <Flame className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-sm text-gray-500">My Streak</p>
          <p className="text-xl font-bold text-gray-800 mt-1 flex items-center">
            0 <Flame className="w-4 h-4 text-orange-500 ml-1" />
          </p>
        </div>
      </div>

      {/* Continue Learning */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-heading font-semibold text-gray-800 mb-4">
          Continue Learning
        </h2>
        <div className="text-center py-8 text-gray-500">
          <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>Your enrolled courses will appear here.</p>
          <Link
            to="/child/courses"
            className="inline-block mt-4 px-4 py-2 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition"
          >
            Browse Courses
          </Link>
        </div>
      </div>
    </div>
  );
}
