import React from 'react';
import clsx from 'clsx';
import type { GameDifficulty } from '@/types/game';

interface DifficultySelectorProps {
  selected: GameDifficulty;
  onChange: (difficulty: GameDifficulty) => void;
  maxDifficulty?: GameDifficulty;
  className?: string;
}

const DIFFICULTIES: { value: GameDifficulty; label: string; color: string; disabledColor: string }[] = [
  { value: 'EASY', label: 'Easy', color: 'bg-green-500 text-white', disabledColor: 'bg-gray-200 text-gray-400' },
  { value: 'MEDIUM', label: 'Medium', color: 'bg-amber-500 text-white', disabledColor: 'bg-gray-200 text-gray-400' },
  { value: 'HARD', label: 'Hard', color: 'bg-red-500 text-white', disabledColor: 'bg-gray-200 text-gray-400' },
];

const DIFFICULTY_ORDER: Record<GameDifficulty, number> = { EASY: 0, MEDIUM: 1, HARD: 2 };

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  selected,
  onChange,
  maxDifficulty,
  className = '',
}) => {
  return (
    <div className={clsx('flex gap-2', className)}>
      {DIFFICULTIES.map((d) => {
        const isDisabled = maxDifficulty && DIFFICULTY_ORDER[d.value] > DIFFICULTY_ORDER[maxDifficulty];
        const isSelected = d.value === selected;
        return (
          <button
            key={d.value}
            onClick={() => !isDisabled && onChange(d.value)}
            disabled={!!isDisabled}
            className={clsx(
              'px-4 py-2 rounded-full text-sm font-bold transition-all duration-200',
              isSelected ? d.color + ' shadow-md scale-105' : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
              isDisabled && d.disabledColor + ' cursor-not-allowed opacity-50'
            )}
          >
            {d.label}
          </button>
        );
      })}
    </div>
  );
};

export default DifficultySelector;
