import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

interface GameTimerProps {
  durationMs: number;
  warningAtMs?: number;
  criticalAtMs?: number;
  type?: 'circular' | 'linear';
  onTimeUp?: () => void;
  onTick?: (remainingMs: number) => void;
  isPaused?: boolean;
  className?: string;
}

export const GameTimer: React.FC<GameTimerProps> = ({
  durationMs,
  warningAtMs = 30000,
  criticalAtMs = 10000,
  type = 'circular',
  onTimeUp,
  onTick,
  isPaused = false,
  className = '',
}) => {
  const [remainingMs, setRemainingMs] = useState(durationMs);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  const onTimeUpRef = useRef(onTimeUp);
  const onTickRef = useRef(onTick);
  onTimeUpRef.current = onTimeUp;
  onTickRef.current = onTick;

  useEffect(() => {
    setRemainingMs(durationMs);
  }, [durationMs]);

  useEffect(() => {
    if (isPaused) {
      clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setRemainingMs((prev) => {
        const next = Math.max(0, prev - 100);
        if (next === 0) {
          clearInterval(intervalRef.current);
          // Defer onTimeUp to avoid setState-in-render
          setTimeout(() => onTimeUpRef.current?.(), 0);
        }
        return next;
      });
    }, 100);

    return () => clearInterval(intervalRef.current);
  }, [isPaused]);

  const percentage = (remainingMs / durationMs) * 100;
  const seconds = Math.ceil(remainingMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const timeStr = minutes > 0 ? `${minutes}:${secs.toString().padStart(2, '0')}` : `${secs}s`;

  const isWarning = remainingMs <= warningAtMs && remainingMs > criticalAtMs;
  const isCritical = remainingMs <= criticalAtMs;

  const colorClass = isCritical
    ? 'text-red-500'
    : isWarning
    ? 'text-amber-500'
    : 'text-primary-600';

  if (type === 'circular') {
    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div className={clsx('relative inline-flex items-center justify-center', className)}>
        <svg className="w-14 h-14 -rotate-90" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="3" />
          <circle
            cx="24" cy="24" r={radius}
            fill="none"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={clsx(
              'transition-all duration-100',
              isCritical ? 'stroke-red-500' : isWarning ? 'stroke-amber-500' : 'stroke-primary-500'
            )}
          />
        </svg>
        <span className={clsx('absolute text-sm font-bold', colorClass, isCritical && 'animate-pulse')}>
          {timeStr}
        </span>
      </div>
    );
  }

  return (
    <div className={clsx('w-full', className)}>
      <div className="flex justify-between items-center mb-1">
        <span className={clsx('text-sm font-bold', colorClass, isCritical && 'animate-pulse')}>
          {timeStr}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className={clsx(
            'h-full rounded-full transition-all duration-100',
            isCritical ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-primary-500'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default GameTimer;
