/**
 * FlashCardList Component Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FlashCardList } from '../FlashCardList';
import { FlashCardDifficulty } from '@/types';
import type { FlashCard } from '@/types';

const mockCards: FlashCard[] = [
  {
    id: '1',
    unitId: 'unit-1',
    courseId: 'course-1',
    front: 'What is Salah?',
    back: 'Prayer',
    frontArabic: 'ما هي الصلاة؟',
    backArabic: 'الصلاة',
    category: 'Basics',
    tags: ['prayer', 'pillars'],
    difficulty: FlashCardDifficulty.EASY,
    orderIndex: 0,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: '2',
    unitId: 'unit-1',
    courseId: 'course-1',
    front: 'What is Zakat?',
    back: 'Charity',
    frontArabic: null,
    backArabic: null,
    category: 'Basics',
    tags: ['charity', 'pillars'],
    difficulty: FlashCardDifficulty.MEDIUM,
    orderIndex: 1,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
];

describe('FlashCardList', () => {
  it('renders all flashcards', () => {
    render(<FlashCardList cards={mockCards} />);
    
    expect(screen.getByText('What is Salah?')).toBeInTheDocument();
    expect(screen.getByText('What is Zakat?')).toBeInTheDocument();
  });

  it('shows loading spinner when isLoading is true', () => {
    render(<FlashCardList cards={[]} isLoading={true} />);
    
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows empty message when no cards', () => {
    render(<FlashCardList cards={[]} emptyMessage="No cards available" />);
    
    expect(screen.getByText('No cards available')).toBeInTheDocument();
  });

  it('displays default empty message', () => {
    render(<FlashCardList cards={[]} />);
    
    expect(screen.getByText('No flashcards found')).toBeInTheDocument();
  });

  it('calls onView when view button is clicked', () => {
    const onView = vi.fn();
    render(<FlashCardList cards={mockCards} onView={onView} />);
    
    const viewButtons = screen.getAllByLabelText('View flashcard');
    fireEvent.click(viewButtons[0]);
    
    expect(onView).toHaveBeenCalledWith(mockCards[0]);
  });

  it('calls onEdit when edit button is clicked', () => {
    const onEdit = vi.fn();
    render(<FlashCardList cards={mockCards} onEdit={onEdit} />);
    
    const editButtons = screen.getAllByLabelText('Edit flashcard');
    fireEvent.click(editButtons[0]);
    
    expect(onEdit).toHaveBeenCalledWith(mockCards[0]);
  });

  it('calls onDelete when delete button is clicked', () => {
    const onDelete = vi.fn();
    render(<FlashCardList cards={mockCards} onDelete={onDelete} />);
    
    const deleteButtons = screen.getAllByLabelText('Delete flashcard');
    fireEvent.click(deleteButtons[0]);
    
    expect(onDelete).toHaveBeenCalledWith(mockCards[0]);
  });

  it('renders category and difficulty badges', () => {
    render(<FlashCardList cards={mockCards} />);
    
    const easyBadges = screen.getAllByText('EASY');
    const basicsBadges = screen.getAllByText('Basics');
    
    expect(easyBadges.length).toBeGreaterThan(0);
    expect(basicsBadges.length).toBeGreaterThan(0);
  });

  it('renders tags', () => {
    render(<FlashCardList cards={mockCards} />);
    
    expect(screen.getAllByText('prayer')).toHaveLength(1);
    expect(screen.getAllByText('pillars')).toHaveLength(2);
  });

  it('shows truncated tags with +N indicator', () => {
    const cardWithManyTags = {
      ...mockCards[0],
      tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'],
    };
    
    render(<FlashCardList cards={[cardWithManyTags]} />);
    
    expect(screen.getByText('tag1')).toBeInTheDocument();
    expect(screen.getByText('tag2')).toBeInTheDocument();
    expect(screen.getByText('tag3')).toBeInTheDocument();
    expect(screen.getByText('+2')).toBeInTheDocument();
  });

  it('renders Arabic text when available', () => {
    render(<FlashCardList cards={mockCards} />);
    
    expect(screen.getByText('ما هي الصلاة؟')).toBeInTheDocument();
  });

  it('applies grid layout classes', () => {
    const { container } = render(<FlashCardList cards={mockCards} />);
    
    const grid = container.querySelector('.grid');
    expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3');
  });

  it('does not render action buttons when callbacks not provided', () => {
    render(<FlashCardList cards={mockCards} />);
    
    expect(screen.queryByLabelText('View flashcard')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Edit flashcard')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Delete flashcard')).not.toBeInTheDocument();
  });
});
