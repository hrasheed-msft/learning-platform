import { Brain } from 'lucide-react';

export default function ChildFlashcardsPage() {
  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="text-2xl font-heading font-bold text-gray-800">My Flashcards</h1>
        <p className="text-gray-600 mt-1">Review and practice your flashcards</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        <Brain className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p className="text-gray-500">Your flashcard reviews will appear here.</p>
      </div>
    </div>
  );
}
