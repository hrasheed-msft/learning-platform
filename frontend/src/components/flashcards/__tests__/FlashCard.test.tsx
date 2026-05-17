/**
 * FlashCard Component Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FlashCard } from '../FlashCard';
import { FlashCardDifficulty } from '@/types';
import type { FlashCard as FlashCardType } from '@/types';

const mockCard: FlashCardType = {
  id: '1',
  unitId: 'unit-1',
  courseId: 'course-1',
  front: 'What is Salah?',
  back: 'Prayer - one of the five pillars of Islam',
  frontArabic: 'ما هي الصلاة؟',
  backArabic: 'الصلاة هي ركن من أركان الإسلام الخمسة',
  category: 'Basics',
  tags: ['prayer', 'pillars', 'fardh'],
  difficulty: FlashCardDifficulty.EASY,
  orderIndex: 0,
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
};

describe('FlashCard', () => {
  it('renders front of card by default', () => {
    render(<FlashCard card={mockCard} />);
    
    expect(screen.getByText('What is Salah?')).toBeInTheDocument();
    expect(screen.getByText('ما هي الصلاة؟')).toBeInTheDocument();
    expect(screen.getByText('EASY')).toBeInTheDocument();
    expect(screen.getByText('Basics')).toBeInTheDocument();
  });

  it('shows back when showAnswer is true', () => {
    render(<FlashCard card={mockCard} showAnswer={true} />);
    
    expect(screen.getByText('Prayer - one of the five pillars of Islam')).toBeInTheDocument();
    expect(screen.getByText('الصلاة هي ركن من أركان الإسلام الخمسة')).toBeInTheDocument();
  });

  it('flips card on click', () => {
    render(<FlashCard card={mockCard} />);
    
    const card = screen.getByRole('button');
    fireEvent.click(card);
    
    expect(screen.getByText('Prayer - one of the five pillars of Islam')).toBeInTheDocument();
  });

  it('flips card on space key press', () => {
    render(<FlashCard card={mockCard} />);
    
    const card = screen.getByRole('button');
    fireEvent.keyDown(card, { key: ' ' });
    
    expect(screen.getByText('Prayer - one of the five pillars of Islam')).toBeInTheDocument();
  });

  it('flips card on enter key press', () => {
    render(<FlashCard card={mockCard} />);
    
    const card = screen.getByRole('button');
    fireEvent.keyDown(card, { key: 'Enter' });
    
    expect(screen.getByText('Prayer - one of the five pillars of Islam')).toBeInTheDocument();
  });

  it('calls onFlip callback when provided', () => {
    const onFlip = vi.fn();
    render(<FlashCard card={mockCard} onFlip={onFlip} />);
    
    const card = screen.getByRole('button');
    fireEvent.click(card);
    
    expect(onFlip).toHaveBeenCalledTimes(1);
  });

  it('renders tags on back of card', () => {
    render(<FlashCard card={mockCard} showAnswer={true} />);
    
    expect(screen.getByText('prayer')).toBeInTheDocument();
    expect(screen.getByText('pillars')).toBeInTheDocument();
    expect(screen.getByText('fardh')).toBeInTheDocument();
  });

  it('shows +N indicator for extra tags', () => {
    const cardWithManyTags = {
      ...mockCard,
      tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'],
    };
    
    render(<FlashCard card={cardWithManyTags} showAnswer={true} />);
    
    expect(screen.getByText('+2')).toBeInTheDocument();
  });

  it('renders correctly without Arabic text', () => {
    const cardWithoutArabic = {
      ...mockCard,
      frontArabic: null,
      backArabic: null,
    };
    
    render(<FlashCard card={cardWithoutArabic} />);
    
    expect(screen.getByText('What is Salah?')).toBeInTheDocument();
    expect(screen.queryByText('ما هي الصلاة؟')).not.toBeInTheDocument();
  });

  it('applies correct difficulty color classes', () => {
    const { rerender } = render(<FlashCard card={{ ...mockCard, difficulty: FlashCardDifficulty.EASY }} />);
    expect(screen.getByText('EASY')).toHaveClass('bg-green-100', 'text-green-800');
    
    rerender(<FlashCard card={{ ...mockCard, difficulty: FlashCardDifficulty.MEDIUM }} />);
    expect(screen.getByText('MEDIUM')).toHaveClass('bg-yellow-100', 'text-yellow-800');
    
    rerender(<FlashCard card={{ ...mockCard, difficulty: FlashCardDifficulty.HARD }} />);
    expect(screen.getByText('HARD')).toHaveClass('bg-red-100', 'text-red-800');
  });
});
