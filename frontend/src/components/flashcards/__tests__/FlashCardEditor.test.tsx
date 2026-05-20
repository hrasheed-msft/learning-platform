/**
 * FlashCardEditor Component Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FlashCardEditor } from '../FlashCardEditor';
import { FlashCardDifficulty } from '@/types';
import type { FlashCard } from '@/types';

describe('FlashCardEditor', () => {
  const mockOnSave = vi.fn().mockResolvedValue(undefined);
  const mockOnUpdate = vi.fn().mockResolvedValue(undefined);
  const mockOnCancel = vi.fn();

  const mockCard: FlashCard = {
    id: '1',
    unitId: 'unit-1',
    courseId: 'course-1',
    front: 'What is Salah?',
    back: 'Prayer - one of the five pillars of Islam',
    frontArabic: 'ما هي الصلاة؟',
    backArabic: 'الصلاة',
    category: 'Basics',
    tags: ['prayer', 'pillars'],
    difficulty: FlashCardDifficulty.EASY,
    orderIndex: 0,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders empty form for create mode', () => {
    render(
      <FlashCardEditor
        courseId="course-1"
        unitId="unit-1"
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByLabelText(/front \(english\)/i)).toHaveValue('');
    expect(screen.getByLabelText(/back \(english\)/i)).toHaveValue('');
    expect(screen.getByLabelText(/category/i)).toHaveValue('');
  });

  it('renders populated form for edit mode', () => {
    render(
      <FlashCardEditor
        card={mockCard}
        courseId="course-1"
        unitId="unit-1"
        onSave={mockOnSave}
        onUpdate={mockOnUpdate}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByDisplayValue('What is Salah?')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Prayer - one of the five pillars of Islam')).toBeInTheDocument();
    expect(screen.getByDisplayValue('ما هي الصلاة؟')).toBeInTheDocument();
    expect(screen.getByDisplayValue('الصلاة')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Basics')).toBeInTheDocument();
    expect(screen.getByDisplayValue('prayer, pillars')).toBeInTheDocument();
  });

  it('shows validation errors for required fields', async () => {
    render(
      <FlashCardEditor
        courseId="course-1"
        unitId="unit-1"
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    const submitButton = screen.getByRole('button', { name: /create flashcard/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/front text is required/i)).toBeInTheDocument();
      expect(screen.getByText(/back text is required/i)).toBeInTheDocument();
      expect(screen.getByText(/category is required/i)).toBeInTheDocument();
    });

    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('clears error when field is edited', async () => {
    render(
      <FlashCardEditor
        courseId="course-1"
        unitId="unit-1"
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    // Submit to trigger errors
    const submitButton = screen.getByRole('button', { name: /create flashcard/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/front text is required/i)).toBeInTheDocument();
    });

    // Edit field
    const frontInput = screen.getByLabelText(/front \(english\)/i);
    fireEvent.change(frontInput, { target: { value: 'Test question' } });

    await waitFor(() => {
      expect(screen.queryByText(/front text is required/i)).not.toBeInTheDocument();
    });
  });

  it('calls onSave with correct data on create', async () => {
    render(
      <FlashCardEditor
        courseId="course-1"
        unitId="unit-1"
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    // Fill form
    fireEvent.change(screen.getByLabelText(/front \(english\)/i), {
      target: { value: 'What is Salah?' },
    });
    fireEvent.change(screen.getByLabelText(/back \(english\)/i), {
      target: { value: 'Prayer' },
    });
    fireEvent.change(screen.getByLabelText(/^front.*arabic/i), {
      target: { value: 'ما هي الصلاة؟' },
    });
    fireEvent.change(screen.getByLabelText(/^back.*arabic/i), {
      target: { value: 'الصلاة' },
    });
    fireEvent.change(screen.getByLabelText(/category/i), {
      target: { value: 'Basics' },
    });
    fireEvent.change(screen.getByLabelText(/difficulty/i), {
      target: { value: 'EASY' },
    });
    fireEvent.change(screen.getByLabelText(/tags/i), {
      target: { value: 'prayer, pillars' },
    });

    // Submit
    const submitButton = screen.getByRole('button', { name: /create flashcard/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith({
        front: 'What is Salah?',
        back: 'Prayer',
        frontArabic: 'ما هي الصلاة؟',
        backArabic: 'الصلاة',
        category: 'Basics',
        difficulty: 'EASY',
        tags: ['prayer', 'pillars'],
      });
    });
  });

  it('calls onUpdate with correct data on edit', async () => {
    render(
      <FlashCardEditor
        card={mockCard}
        courseId="course-1"
        unitId="unit-1"
        onSave={mockOnSave}
        onUpdate={mockOnUpdate}
        onCancel={mockOnCancel}
      />
    );

    // Edit a field
    const frontInput = screen.getByDisplayValue('What is Salah?');
    fireEvent.change(frontInput, {
      target: { value: 'What is Salah (Prayer)?' },
    });

    // Submit
    const submitButton = screen.getByRole('button', { name: /update flashcard/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalledWith(
        '1',
        expect.objectContaining({
          front: 'What is Salah (Prayer)?',
          back: 'Prayer - one of the five pillars of Islam',
          category: 'Basics',
          difficulty: 'EASY',
          tags: ['prayer', 'pillars'],
        })
      );
    });
  });

  it('parses tags correctly', async () => {
    render(
      <FlashCardEditor
        courseId="course-1"
        unitId="unit-1"
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.change(screen.getByLabelText(/front \(english\)/i), {
      target: { value: 'Test' },
    });
    fireEvent.change(screen.getByLabelText(/back \(english\)/i), {
      target: { value: 'Test' },
    });
    fireEvent.change(screen.getByLabelText(/category/i), {
      target: { value: 'Test' },
    });

    // Test various tag formats
    fireEvent.change(screen.getByLabelText(/tags/i), {
      target: { value: 'tag1, tag2,tag3 ,  tag4' },
    });

    const submitButton = screen.getByRole('button', { name: /create flashcard/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({
          tags: ['tag1', 'tag2', 'tag3', 'tag4'],
        })
      );
    });
  });

  it('handles empty optional fields correctly', async () => {
    render(
      <FlashCardEditor
        courseId="course-1"
        unitId="unit-1"
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    // Fill only required fields
    fireEvent.change(screen.getByLabelText(/front \(english\)/i), {
      target: { value: 'Test Question' },
    });
    fireEvent.change(screen.getByLabelText(/back \(english\)/i), {
      target: { value: 'Test Answer' },
    });
    fireEvent.change(screen.getByLabelText(/category/i), {
      target: { value: 'Test' },
    });

    const submitButton = screen.getByRole('button', { name: /create flashcard/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith({
        front: 'Test Question',
        back: 'Test Answer',
        frontArabic: undefined,
        backArabic: undefined,
        category: 'Test',
        difficulty: 'MEDIUM',
        tags: [],
      });
    });
  });

  it('calls onCancel when cancel button clicked', () => {
    render(
      <FlashCardEditor
        courseId="course-1"
        unitId="unit-1"
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    // There are two cancel buttons (header icon + footer); use the footer one
    const cancelButtons = screen.getAllByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButtons[cancelButtons.length - 1]);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('disables submit button when isSubmitting is true', () => {
    render(
      <FlashCardEditor
        courseId="course-1"
        unitId="unit-1"
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        isSubmitting={true}
      />
    );

    const submitButton = screen.getByRole('button', { name: /create flashcard/i });
    expect(submitButton).toBeDisabled();
  });

  it('trims whitespace from inputs', async () => {
    render(
      <FlashCardEditor
        courseId="course-1"
        unitId="unit-1"
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.change(screen.getByLabelText(/front \(english\)/i), {
      target: { value: '  Test Question  ' },
    });
    fireEvent.change(screen.getByLabelText(/back \(english\)/i), {
      target: { value: '  Test Answer  ' },
    });
    fireEvent.change(screen.getByLabelText(/category/i), {
      target: { value: '  Test Category  ' },
    });

    const submitButton = screen.getByRole('button', { name: /create flashcard/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({
          front: 'Test Question',
          back: 'Test Answer',
          category: 'Test Category',
        })
      );
    });
  });

  it('sets Arabic fields to undefined when empty', async () => {
    render(
      <FlashCardEditor
        courseId="course-1"
        unitId="unit-1"
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.change(screen.getByLabelText(/front \(english\)/i), {
      target: { value: 'Test' },
    });
    fireEvent.change(screen.getByLabelText(/back \(english\)/i), {
      target: { value: 'Test' },
    });
    fireEvent.change(screen.getByLabelText(/category/i), {
      target: { value: 'Test' },
    });

    // Leave Arabic fields empty
    fireEvent.change(screen.getByLabelText(/^front.*arabic/i), {
      target: { value: '   ' },
    });

    const submitButton = screen.getByRole('button', { name: /create flashcard/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({
          frontArabic: undefined,
          backArabic: undefined,
        })
      );
    });
  });
});
