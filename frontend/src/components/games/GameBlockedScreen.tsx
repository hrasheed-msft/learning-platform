import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldOff, Clock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface GameBlockedScreenProps {
  reason: 'TIME_LIMIT' | 'NOT_ALLOWED' | 'OUTSIDE_HOURS' | 'DIFFICULTY_EXCEEDED';
  message?: string;
}

const MESSAGES: Record<string, { title: string; description: string; icon: React.ReactNode }> = {
  TIME_LIMIT: {
    title: "Time's up for today! ⏰",
    description: "You've reached your daily game time limit. Come back tomorrow for more fun!",
    icon: <Clock className="w-16 h-16 text-amber-400" />,
  },
  NOT_ALLOWED: {
    title: "This game isn't available 🔒",
    description: "This game type hasn't been enabled for your account. Ask a parent to update your game settings.",
    icon: <ShieldOff className="w-16 h-16 text-gray-400" />,
  },
  OUTSIDE_HOURS: {
    title: 'Game time is over for tonight 🌙',
    description: "It's past your game time. Get some rest and come back tomorrow!",
    icon: <Clock className="w-16 h-16 text-indigo-400" />,
  },
  DIFFICULTY_EXCEEDED: {
    title: 'Difficulty not available 📊',
    description: "This difficulty level hasn't been unlocked yet. Try an easier level!",
    icon: <ShieldOff className="w-16 h-16 text-amber-400" />,
  },
};

export const GameBlockedScreen: React.FC<GameBlockedScreenProps> = ({ reason, message }) => {
  const navigate = useNavigate();
  const info = MESSAGES[reason] || MESSAGES.NOT_ALLOWED;

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="flex justify-center mb-6">{info.icon}</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{info.title}</h2>
        <p className="text-gray-600 mb-8">{message || info.description}</p>
        <Button
          onClick={() => navigate('/games')}
          variant="outline"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Games Hub
        </Button>
      </div>
    </div>
  );
};

export default GameBlockedScreen;
