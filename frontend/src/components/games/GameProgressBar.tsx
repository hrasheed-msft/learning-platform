import React from 'react';
import clsx from 'clsx';

interface GameProgressBarProps {
  current: number;
  total: number;
  results?: boolean[]; // true = correct, false = incorrect
  className?: string;
}

export const GameProgressBar: React.FC<GameProgressBarProps> = ({
  current,
  total,
  results = [],
  className = '',
}) => {
  return (
    <div className={clsx('w-full', className)}>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-500 font-medium">Progress</span>
        <span className="text-xs font-bold text-gray-700">{current}/{total}</span>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: total }, (_, i) => {
          const isCompleted = i < current;
          const isCurrent = i === current;
          const result = results[i];
          return (
            <div
              key={i}
              className={clsx(
                'h-2 rounded-full flex-1 transition-all duration-300',
                isCurrent && 'ring-2 ring-primary-300 ring-offset-1',
                isCompleted && result === true && 'bg-green-500',
                isCompleted && result === false && 'bg-red-400',
                isCompleted && result === undefined && 'bg-primary-500',
                !isCompleted && !isCurrent && 'bg-gray-200'
              )}
            />
          );
        })}
      </div>
    </div>
  );
};

export default GameProgressBar;
