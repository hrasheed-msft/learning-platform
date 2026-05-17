/**
 * FlashCardList Component
 * 
 * Displays a grid of flashcards with filtering, sorting, and pagination.
 * Used for managing and browsing flashcards in a unit or course.
 */

import React from 'react';
import { Card, Button, Badge, Spinner } from '@/components/ui';
import { Edit2, Trash2, Eye } from 'lucide-react';
import type { FlashCard, FlashCardDifficulty } from '@/types';

interface FlashCardListProps {
  cards: FlashCard[];
  isLoading?: boolean;
  onEdit?: (card: FlashCard) => void;
  onDelete?: (card: FlashCard) => void;
  onView?: (card: FlashCard) => void;
  emptyMessage?: string;
  className?: string;
}

export const FlashCardList: React.FC<FlashCardListProps> = ({
  cards,
  isLoading = false,
  onEdit,
  onDelete,
  onView,
  emptyMessage = 'No flashcards found',
  className = '',
}) => {
  const difficultyColors: Record<FlashCardDifficulty, { bg: string; text: string }> = {
    EASY: { bg: 'bg-green-100', text: 'text-green-800' },
    MEDIUM: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    HARD: { bg: 'bg-red-100', text: 'text-red-800' },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12" role="status" aria-label="Loading flashcards">
        <Spinner size="lg" />
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <Card className="text-center py-12">
        <p className="text-gray-500 text-lg">{emptyMessage}</p>
      </Card>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {cards.map((card) => (
        <Card
          key={card.id}
          className="relative group"
          hover
        >
          {/* Header with badges */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex flex-wrap gap-1">
              <Badge
                variant="secondary"
                className={`${difficultyColors[card.difficulty].bg} ${difficultyColors[card.difficulty].text}`}
              >
                {card.difficulty}
              </Badge>
              <Badge variant="primary">
                {card.category}
              </Badge>
            </div>
          </div>

          {/* Card content preview */}
          <div className="mb-4">
            {card.frontArabic && (
              <p
                className="text-lg font-arabic mb-2 text-gray-700 truncate"
                dir="rtl"
                lang="ar"
              >
                {card.frontArabic}
              </p>
            )}
            <p className="font-semibold text-gray-900 mb-2 line-clamp-2">
              {card.front}
            </p>
            <p className="text-sm text-gray-600 line-clamp-2">
              {card.back}
            </p>
          </div>

          {/* Tags */}
          {card.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {card.tags.slice(0, 3).map((tag, idx) => (
                <Badge key={idx} variant="outline" size="sm">
                  {tag}
                </Badge>
              ))}
              {card.tags.length > 3 && (
                <Badge variant="outline" size="sm">
                  +{card.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {onView && (
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Eye className="w-4 h-4" />}
                onClick={() => onView(card)}
                aria-label="View flashcard"
              >
                View
              </Button>
            )}
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Edit2 className="w-4 h-4" />}
                onClick={() => onEdit(card)}
                aria-label="Edit flashcard"
              >
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Trash2 className="w-4 h-4" />}
                onClick={() => onDelete(card)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                aria-label="Delete flashcard"
              >
                Delete
              </Button>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default FlashCardList;
