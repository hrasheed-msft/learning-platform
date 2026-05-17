/**
 * FlashCard Component
 * 
 * Displays a single flashcard with flip animation and Arabic text support.
 * Used in study sessions and review modes.
 */

import React, { useState } from 'react';
import { Card } from '@/components/ui';
import type { FlashCard as FlashCardType, FlashCardDifficulty } from '@/types';

interface FlashCardProps {
  card: FlashCardType;
  showAnswer?: boolean;
  onFlip?: () => void;
  className?: string;
  isFlipped?: boolean;
}

export const FlashCard: React.FC<FlashCardProps> = ({
  card,
  showAnswer = false,
  onFlip,
  className = '',
  isFlipped = false,
}) => {
  const [internalFlipped, setInternalFlipped] = useState(isFlipped);

  const flipped = showAnswer || internalFlipped;

  const handleFlip = () => {
    if (onFlip) {
      onFlip();
    } else {
      setInternalFlipped(!internalFlipped);
    }
  };

  const difficultyColors: Record<FlashCardDifficulty, string> = {
    EASY: 'bg-green-100 text-green-800',
    MEDIUM: 'bg-yellow-100 text-yellow-800',
    HARD: 'bg-red-100 text-red-800',
  };

  return (
    <div
      className={`relative w-full h-96 perspective-1000 ${className}`}
      onClick={handleFlip}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleFlip();
        }
      }}
      aria-label={flipped ? 'Show front of card' : 'Show back of card'}
    >
      <div
        className={`
          relative w-full h-full transition-transform duration-500 transform-style-3d
          ${flipped ? 'rotate-y-180' : ''}
        `}
      >
        {/* Front of card */}
        <Card
          className={`
            absolute inset-0 backface-hidden
            flex flex-col items-center justify-center
            cursor-pointer select-none
            ${flipped ? 'pointer-events-none' : ''}
          `}
          hover
        >
          <div className="absolute top-4 right-4 flex gap-2">
            <span className={`px-2 py-1 text-xs font-medium rounded ${difficultyColors[card.difficulty]}`}>
              {card.difficulty}
            </span>
            <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800">
              {card.category}
            </span>
          </div>

          <div className="text-center px-8">
            {card.frontArabic && (
              <p
                className="text-4xl font-arabic mb-4 text-gray-800"
                dir="rtl"
                lang="ar"
              >
                {card.frontArabic}
              </p>
            )}
            <p className="text-2xl font-semibold text-gray-900">
              {card.front}
            </p>
          </div>

          <div className="absolute bottom-6 text-sm text-gray-500">
            Click or press Space to reveal answer
          </div>
        </Card>

        {/* Back of card */}
        <Card
          className={`
            absolute inset-0 backface-hidden rotate-y-180
            flex flex-col items-center justify-center
            cursor-pointer select-none bg-gradient-to-br from-primary-50 to-accent-50
            ${!flipped ? 'pointer-events-none' : ''}
          `}
          hover
        >
          <div className="absolute top-4 right-4 flex gap-2">
            {card.tags.length > 0 && (
              <div className="flex gap-1">
                {card.tags.slice(0, 3).map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 text-xs font-medium rounded bg-purple-100 text-purple-800"
                  >
                    {tag}
                  </span>
                ))}
                {card.tags.length > 3 && (
                  <span className="px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-600">
                    +{card.tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="text-center px-8">
            {card.backArabic && (
              <p
                className="text-4xl font-arabic mb-4 text-primary-700"
                dir="rtl"
                lang="ar"
              >
                {card.backArabic}
              </p>
            )}
            <p className="text-2xl font-semibold text-primary-900">
              {card.back}
            </p>
          </div>

          <div className="absolute bottom-6 text-sm text-primary-600">
            Click or press Space to flip back
          </div>
        </Card>
      </div>
    </div>
  );
};

// Add custom Tailwind styles for 3D flip effect
// Add to your tailwind.config.js if not already present:
/*
module.exports = {
  theme: {
    extend: {
      perspective: {
        '1000': '1000px',
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.transform-style-3d': {
          'transform-style': 'preserve-3d',
        },
        '.backface-hidden': {
          'backface-visibility': 'hidden',
        },
        '.rotate-y-180': {
          transform: 'rotateY(180deg)',
        },
      });
    },
  ],
}
*/

export default FlashCard;
