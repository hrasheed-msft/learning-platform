/**
 * ProgressStats Component
 * 
 * Displays flashcard learning statistics and progress visualization.
 * Shows mastery percentage, due cards, and status breakdown.
 */

import React from 'react';
import { Card, CardHeader, CardTitle, ProgressBar, Badge } from '@/components/ui';
import { TrendingUp, Target, Calendar, Award } from 'lucide-react';
import type { FlashCardStatistics } from '@/types';

interface ProgressStatsProps {
  statistics: FlashCardStatistics;
  className?: string;
}

export const ProgressStats: React.FC<ProgressStatsProps> = ({
  statistics,
  className = '',
}) => {
  // Calculate mastery percentage
  const masteryPercentage = statistics.totalCards > 0
    ? Math.round((statistics.masteredCards / statistics.totalCards) * 100)
    : 0;

  const stats = [
    {
      label: 'Mastery Rate',
      value: `${masteryPercentage}%`,
      icon: Target,
      color: 'text-primary-600',
      bgColor: 'bg-primary-100',
    },
    {
      label: 'Due Today',
      value: statistics.dueToday,
      icon: Calendar,
      color: 'text-accent-600',
      bgColor: 'bg-accent-100',
    },
    {
      label: 'Total Cards',
      value: statistics.totalCards,
      icon: TrendingUp,
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-100',
    },
    {
      label: 'Review Streak',
      value: `${statistics.reviewStreak || 0} day${statistics.reviewStreak === 1 ? '' : 's'}`,
      icon: Award,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
  ];

  const statusBreakdown = [
    {
      status: 'New',
      count: statistics.newCards,
      percentage: statistics.totalCards > 0 
        ? (statistics.newCards / statistics.totalCards) * 100 
        : 0,
      color: 'bg-blue-500',
    },
    {
      status: 'Learning',
      count: statistics.learningCards,
      percentage: statistics.totalCards > 0 
        ? (statistics.learningCards / statistics.totalCards) * 100 
        : 0,
      color: 'bg-yellow-500',
    },
    {
      status: 'Reviewing',
      count: statistics.reviewingCards,
      percentage: statistics.totalCards > 0 
        ? (statistics.reviewingCards / statistics.totalCards) * 100 
        : 0,
      color: 'bg-orange-500',
    },
    {
      status: 'Mastered',
      count: statistics.masteredCards,
      percentage: statistics.totalCards > 0 
        ? (statistics.masteredCards / statistics.totalCards) * 100 
        : 0,
      color: 'bg-green-500',
    },
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bgColor }) => (
          <Card key={label} hover className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${bgColor}`}>
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
            <p className="text-sm text-gray-600">{label}</p>
          </Card>
        ))}
      </div>

      {/* Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Learning Progress</CardTitle>
        </CardHeader>

        <div className="space-y-4">
          {statusBreakdown.map(({ status, count, percentage, color }) => (
            <div key={status}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${color}`} />
                  <span className="text-sm font-medium text-gray-700">{status}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{count} cards</span>
                  <Badge variant="secondary" size="sm">
                    {Math.round(percentage)}%
                  </Badge>
                </div>
              </div>
              <ProgressBar value={percentage} className="h-2" />
            </div>
          ))}
        </div>

        {statistics.averageEaseFactor && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Average Ease Factor</span>
              <span className="text-sm text-gray-900 font-semibold">
                {statistics.averageEaseFactor.toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Higher values indicate better retention
            </p>
          </div>
        )}
      </Card>

      {/* Mastery Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Mastery</CardTitle>
        </CardHeader>

        <div className="space-y-4">
          <div className="relative">
            <ProgressBar value={statistics.masteryPercentage} size="lg" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-white drop-shadow-md">
                {Math.round(statistics.masteryPercentage)}%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-600">
                {statistics.masteredCards + statistics.reviewingCards}
              </p>
              <p className="text-sm text-gray-600">Cards Learned</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {statistics.newCards + statistics.learningCards}
              </p>
              <p className="text-sm text-gray-600">Cards to Learn</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Recommendations */}
      {statistics.dueToday > 0 && (
        <Card className="bg-accent-50 border-accent-200">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-accent-600 rounded-lg">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 mb-1">
                {statistics.dueToday} cards ready for review
              </p>
              <p className="text-sm text-gray-600">
                Review now to maintain your learning progress and strengthen memory retention.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ProgressStats;
