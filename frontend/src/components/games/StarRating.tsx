import React from 'react';
import clsx from 'clsx';
import { Star } from 'lucide-react';

interface StarRatingProps {
  stars: number; // 0-3
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  stars,
  maxStars = 3,
  size = 'md',
  className = '',
}) => {
  const sizeMap = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };

  return (
    <div className={clsx('flex items-center gap-1', className)}>
      {Array.from({ length: maxStars }, (_, i) => {
        const filled = i < stars;
        return (
          <Star
            key={i}
            className={clsx(
              sizeMap[size],
              'transition-all duration-300',
              filled
                ? 'text-yellow-400 fill-yellow-400 drop-shadow-sm'
                : 'text-gray-300'
            )}
            style={filled ? { animationDelay: `${i * 150}ms` } : undefined}
          />
        );
      })}
    </div>
  );
};

export default StarRating;
