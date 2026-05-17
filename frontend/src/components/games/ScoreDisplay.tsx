import React, { useEffect, useState } from 'react';
import clsx from 'clsx';

interface ScoreDisplayProps {
  score: number;
  label?: string;
  multiplier?: number;
  className?: string;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  score,
  label = 'Score',
  multiplier,
  className = '',
}) => {
  const [displayScore, setDisplayScore] = useState(score);
  const [showBurst, setShowBurst] = useState(false);
  const [burstAmount, setBurstAmount] = useState(0);

  useEffect(() => {
    if (score > displayScore) {
      const diff = score - displayScore;
      setBurstAmount(diff);
      setShowBurst(true);
      setTimeout(() => setShowBurst(false), 600);

      // Animate counter
      const steps = 10;
      const increment = diff / steps;
      let current = displayScore;
      const interval = setInterval(() => {
        current += increment;
        if (current >= score) {
          setDisplayScore(score);
          clearInterval(interval);
        } else {
          setDisplayScore(Math.round(current));
        }
      }, 30);
      return () => clearInterval(interval);
    }
    setDisplayScore(score);
  }, [score]);

  return (
    <div className={clsx('relative flex items-center gap-2', className)}>
      <div className="text-center">
        <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-gray-900 tabular-nums">
          {displayScore.toLocaleString()}
        </p>
      </div>
      {multiplier && multiplier > 1 && (
        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-full animate-pulse">
          ×{multiplier}
        </span>
      )}
      {showBurst && (
        <span className="absolute -top-4 right-0 text-sm font-bold text-primary-500 animate-bounce">
          +{burstAmount}
        </span>
      )}
    </div>
  );
};

export default ScoreDisplay;
