import React from 'react';
import clsx from 'clsx';
import { Clock, AlertTriangle } from 'lucide-react';

interface TimeRemainingBarProps {
  minutesRemaining: number | null;
  dailyLimitMinutes: number | null;
  className?: string;
}

export const TimeRemainingBar: React.FC<TimeRemainingBarProps> = ({
  minutesRemaining,
  dailyLimitMinutes,
  className = '',
}) => {
  if (minutesRemaining === null || dailyLimitMinutes === null) return null;

  const percentage = Math.max(0, Math.min(100, (minutesRemaining / dailyLimitMinutes) * 100));
  const isLow = percentage <= 25;
  const isWarning = percentage <= 50 && !isLow;

  return (
    <div className={clsx(
      'flex items-center gap-2 px-3 py-2 rounded-lg text-sm',
      isLow ? 'bg-red-50 text-red-700' : isWarning ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700',
      className
    )}>
      {isLow ? (
        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
      ) : (
        <Clock className="w-4 h-4 flex-shrink-0" />
      )}
      <div className="flex-1">
        <div className="flex justify-between mb-1">
          <span className="font-medium">
            {minutesRemaining} min remaining
          </span>
          <span className="text-xs opacity-75">{dailyLimitMinutes} min limit</span>
        </div>
        <div className="w-full bg-white/50 rounded-full h-1.5 overflow-hidden">
          <div
            className={clsx(
              'h-full rounded-full transition-all duration-300',
              isLow ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-blue-500'
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default TimeRemainingBar;
