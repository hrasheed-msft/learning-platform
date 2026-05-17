import React from 'react';
import clsx from 'clsx';
import { Lightbulb } from 'lucide-react';

interface HintButtonProps {
  hintsRemaining: number;
  maxHints: number;
  onUseHint: () => void;
  disabled?: boolean;
  className?: string;
}

export const HintButton: React.FC<HintButtonProps> = ({
  hintsRemaining,
  maxHints,
  onUseHint,
  disabled = false,
  className = '',
}) => {
  const isExhausted = hintsRemaining <= 0;

  return (
    <button
      onClick={onUseHint}
      disabled={disabled || isExhausted}
      className={clsx(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
        isExhausted
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 active:scale-95',
        className
      )}
      title={isExhausted ? 'No hints remaining' : `${hintsRemaining} hints remaining`}
    >
      <Lightbulb className={clsx('w-4 h-4', isExhausted ? 'text-gray-400' : 'text-yellow-500')} />
      <span>{hintsRemaining}/{maxHints}</span>
    </button>
  );
};

export default HintButton;
