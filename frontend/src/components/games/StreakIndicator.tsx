import React from 'react';
import clsx from 'clsx';
import { Flame } from 'lucide-react';

interface StreakIndicatorProps {
  streak: number;
  className?: string;
}

export const StreakIndicator: React.FC<StreakIndicatorProps> = ({
  streak,
  className = '',
}) => {
  if (streak < 1) return null;

  const multiplier = streak >= 10 ? 3 : streak >= 5 ? 2 : streak >= 3 ? 1.5 : 1;
  const isHot = streak >= 5;
  const isOnFire = streak >= 10;

  return (
    <div
      className={clsx(
        'inline-flex items-center gap-1 px-2 py-1 rounded-full font-bold text-sm transition-all',
        isOnFire
          ? 'bg-red-100 text-red-700'
          : isHot
          ? 'bg-orange-100 text-orange-700'
          : 'bg-amber-50 text-amber-700',
        className
      )}
    >
      <Flame
        className={clsx(
          'w-4 h-4',
          isOnFire ? 'text-red-500 animate-pulse' : isHot ? 'text-orange-500' : 'text-amber-500'
        )}
      />
      <span>{streak}</span>
      {multiplier > 1 && (
        <span className="text-xs opacity-75">×{multiplier}</span>
      )}
    </div>
  );
};

export default StreakIndicator;
