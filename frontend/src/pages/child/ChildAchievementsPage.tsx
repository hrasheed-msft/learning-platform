import { Trophy } from 'lucide-react';

export default function ChildAchievementsPage() {
  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="text-2xl font-heading font-bold text-gray-800">Achievements</h1>
        <p className="text-gray-600 mt-1">Badges and streaks you've earned</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        <Trophy className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p className="text-gray-500">Complete lessons and quizzes to earn achievements!</p>
      </div>
    </div>
  );
}
