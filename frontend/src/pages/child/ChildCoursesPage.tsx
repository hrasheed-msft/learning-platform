import { BookOpen } from 'lucide-react';

export default function ChildCoursesPage() {
  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="text-2xl font-heading font-bold text-gray-800">My Courses</h1>
        <p className="text-gray-600 mt-1">Your enrolled courses and available courses</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p className="text-gray-500">Your courses will appear here once enrolled.</p>
      </div>
    </div>
  );
}
