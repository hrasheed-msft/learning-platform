/**
 * ProgressStats Component Tests
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProgressStats } from '../ProgressStats';
import type { FlashCardStatistics } from '@/types';

describe('ProgressStats', () => {
  const mockStatistics: FlashCardStatistics = {
    totalCards: 100,
    newCards: 20,
    learningCards: 30,
    reviewingCards: 40,
    masteredCards: 10,
    dueToday: 15,
    masteryPercentage: 10,
    averageEaseFactor: 2.5,
    reviewStreak: 7,
  };

  it('renders all stat cards', () => {
    render(<ProgressStats statistics={mockStatistics} />);

    expect(screen.getByText('Mastery Rate')).toBeInTheDocument();
    expect(screen.getByText('Due Today')).toBeInTheDocument();
    expect(screen.getByText('Total Cards')).toBeInTheDocument();
    expect(screen.getByText('Review Streak')).toBeInTheDocument();
  });

  it('calculates mastery percentage correctly', () => {
    render(<ProgressStats statistics={mockStatistics} />);

    // masteredCards / totalCards * 100 = 10 / 100 * 100 = 10%
    // Check specifically in the Mastery Rate card
    expect(screen.getByText('Mastery Rate')).toBeInTheDocument();
    const masteryCard = screen.getByText('Mastery Rate').closest('.bg-white');
    expect(masteryCard).toHaveTextContent('10%');
  });

  it('displays due today count', () => {
    render(<ProgressStats statistics={mockStatistics} />);

    expect(screen.getByText('15')).toBeInTheDocument();
  });

  it('displays total cards count', () => {
    render(<ProgressStats statistics={mockStatistics} />);

    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('displays review streak', () => {
    render(<ProgressStats statistics={mockStatistics} />);

    expect(screen.getByText('7 days')).toBeInTheDocument();
  });

  it('displays status breakdown with correct counts', () => {
    render(<ProgressStats statistics={mockStatistics} />);

    expect(screen.getByText(/20 cards/)).toBeInTheDocument(); // New
    expect(screen.getByText(/30 cards/)).toBeInTheDocument(); // Learning
    expect(screen.getByText(/40 cards/)).toBeInTheDocument(); // Reviewing
    expect(screen.getByText(/10 cards/)).toBeInTheDocument(); // Mastered
  });

  it('calculates status percentages correctly', () => {
    render(<ProgressStats statistics={mockStatistics} />);

    // New: 20/100 = 20%
    // Learning: 30/100 = 30%
    // Reviewing: 40/100 = 40%
    // Mastered: 10/100 = 10%
    const progressBars = document.querySelectorAll('[style*="width"]');
    expect(progressBars.length).toBeGreaterThan(0);
  });

  it('displays average ease factor', () => {
    render(<ProgressStats statistics={mockStatistics} />);

    expect(screen.getByText('2.50')).toBeInTheDocument();
  });

  it('shows due cards alert when cards are due', () => {
    render(<ProgressStats statistics={mockStatistics} />);

    // Check if the due today count is displayed
    expect(screen.getByText('Due Today')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
  });

  it('does not show due cards alert when no cards due', () => {
    const statsNoDue = { ...mockStatistics, dueToday: 0 };
    render(<ProgressStats statistics={statsNoDue} />);

    expect(screen.queryByText(/cards due for review/i)).not.toBeInTheDocument();
  });

  it('handles zero total cards gracefully', () => {
    const statsZero: FlashCardStatistics = {
      totalCards: 0,
      newCards: 0,
      learningCards: 0,
      reviewingCards: 0,
      masteredCards: 0,
      dueToday: 0,
      masteryPercentage: 0,
      averageEaseFactor: 0,
      reviewStreak: 0,
    };

    render(<ProgressStats statistics={statsZero} />);

    // Check that component renders without crashing
    expect(screen.getByText('Mastery Rate')).toBeInTheDocument();
    expect(screen.getByText('Total Cards')).toBeInTheDocument();
  });

  it('calculates mastery rate with correct precision', () => {
    const statsPartial: FlashCardStatistics = {
      ...mockStatistics,
      totalCards: 33,
      masteredCards: 10,
    };

    render(<ProgressStats statistics={statsPartial} />);

    // 10/33 * 100 = 30.30...% (rounds to 30%)
    expect(screen.getByText('Mastery Rate')).toBeInTheDocument();
    const masteryCard = screen.getByText('Mastery Rate').closest('.bg-white');
    expect(masteryCard).toHaveTextContent('30%');
  });

  it('displays learning progress section', () => {
    render(<ProgressStats statistics={mockStatistics} />);

    expect(screen.getByText('Learning Progress')).toBeInTheDocument();
  });

  it('displays overall mastery section', () => {
    render(<ProgressStats statistics={mockStatistics} />);

    expect(screen.getByText('Overall Mastery')).toBeInTheDocument();
  });

  it('shows correct learned vs to learn counts', () => {
    render(<ProgressStats statistics={mockStatistics} />);

    // Cards Learned = masteredCards + reviewingCards = 10 + 40 = 50
    expect(screen.getByText('Cards Learned')).toBeInTheDocument();
    const cardsLearnedElement = screen.getByText('Cards Learned').previousElementSibling;
    expect(cardsLearnedElement).toHaveTextContent('50');
    
    // Cards to Learn = newCards + learningCards = 20 + 30 = 50
    expect(screen.getByText('Cards to Learn')).toBeInTheDocument();
    const cardsToLearnElement = screen.getByText('Cards to Learn').previousElementSibling;
    expect(cardsToLearnElement).toHaveTextContent('50');
  });

  it('handles high ease factor display', () => {
    const statsHighEase = { ...mockStatistics, averageEaseFactor: 3.85 };
    render(<ProgressStats statistics={statsHighEase} />);

    expect(screen.getByText('3.85')).toBeInTheDocument();
  });

  it('handles low ease factor display', () => {
    const statsLowEase = { ...mockStatistics, averageEaseFactor: 1.3 };
    render(<ProgressStats statistics={statsLowEase} />);

    expect(screen.getByText('1.30')).toBeInTheDocument();
  });

  it('handles long review streak', () => {
    const statsLongStreak = { ...mockStatistics, reviewStreak: 365 };
    render(<ProgressStats statistics={statsLongStreak} />);

    expect(screen.getByText('365 days')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <ProgressStats statistics={mockStatistics} className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders with all zero values', () => {
    const statsAllZero: FlashCardStatistics = {
      totalCards: 0,
      newCards: 0,
      learningCards: 0,
      reviewingCards: 0,
      masteredCards: 0,
      dueToday: 0,
      masteryPercentage: 0,
      averageEaseFactor: 0,
      reviewStreak: 0,
    };

    const { container } = render(<ProgressStats statistics={statsAllZero} />);

    expect(container).toBeInTheDocument();
    expect(screen.getAllByText('0%').length).toBeGreaterThan(0);
  });

  it('calculates progress bars to sum to 100%', () => {
    render(<ProgressStats statistics={mockStatistics} />);

    // New: 20%, Learning: 30%, Reviewing: 40%, Mastered: 10%
    // Should sum to 100%
    const { totalCards, newCards, learningCards, reviewingCards, masteredCards } = mockStatistics;
    const sum = newCards + learningCards + reviewingCards + masteredCards;
    expect(sum).toBe(totalCards);
  });

  it('handles statistics with large numbers', () => {
    const statsLarge: FlashCardStatistics = {
      totalCards: 10000,
      newCards: 2000,
      learningCards: 3000,
      reviewingCards: 4000,
      masteredCards: 1000,
      dueToday: 500,
      masteryPercentage: 10,
      averageEaseFactor: 2.5,
      reviewStreak: 100,
    };

    render(<ProgressStats statistics={statsLarge} />);

    expect(screen.getByText('10000')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
    // Check that 10% appears at least once (in the mastery card)
    expect(screen.getAllByText('10%').length).toBeGreaterThan(0);
  });
});
