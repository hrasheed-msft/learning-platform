/**
 * FlashCardEditor Component
 * 
 * Form for creating and editing flashcards with validation.
 * Supports both English and Arabic text input.
 */

import React, { useState } from 'react';
import { Card, Button, Input } from '@/components/ui';
import { Save, X } from 'lucide-react';
import type { FlashCard, CreateFlashCardInput, UpdateFlashCardInput, FlashCardDifficulty } from '@/types';

interface FlashCardEditorProps {
  card?: FlashCard;
  courseId: string;
  unitId: string;
  onSave: (data: Omit<CreateFlashCardInput, 'courseId' | 'unitId'>) => Promise<void>;
  onUpdate?: (id: string, data: UpdateFlashCardInput) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const FlashCardEditor: React.FC<FlashCardEditorProps> = ({
  card,
  onSave,
  onUpdate,
  onCancel,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState({
    front: card?.front || '',
    back: card?.back || '',
    frontArabic: card?.frontArabic || '',
    backArabic: card?.backArabic || '',
    category: card?.category || '',
    tags: card?.tags.join(', ') || '',
    difficulty: card?.difficulty || 'MEDIUM' as FlashCardDifficulty,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.front.trim()) {
      newErrors.front = 'Front text is required';
    }
    if (!formData.back.trim()) {
      newErrors.back = 'Back text is required';
    }
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const data = {
      front: formData.front.trim(),
      back: formData.back.trim(),
      frontArabic: formData.frontArabic.trim() || undefined,
      backArabic: formData.backArabic.trim() || undefined,
      category: formData.category.trim(),
      tags: formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0),
      difficulty: formData.difficulty,
    };

    try {
      if (card && onUpdate) {
        await onUpdate(card.id, data);
      } else {
        await onSave(data);
      }
    } catch (error) {
      console.error('Failed to save flashcard:', error);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {card ? 'Edit Flashcard' : 'Create Flashcard'}
        </h2>
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<X className="w-4 h-4" />}
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Front (English) */}
        <div>
          <label htmlFor="front" className="block text-sm font-medium text-gray-700 mb-2">
            Front (English) *
          </label>
          <textarea
            id="front"
            value={formData.front}
            onChange={(e) => handleChange('front', e.target.value)}
            className={`
              w-full px-4 py-3 rounded-lg border
              ${errors.front ? 'border-red-500' : 'border-gray-300'}
              focus:outline-none focus:ring-2 focus:ring-primary-500
              resize-none
            `}
            rows={3}
            placeholder="Enter the question or term"
            disabled={isSubmitting}
          />
          {errors.front && (
            <p className="mt-1 text-sm text-red-600">{errors.front}</p>
          )}
        </div>

        {/* Front (Arabic) */}
        <div>
          <label htmlFor="frontArabic" className="block text-sm font-medium text-gray-700 mb-2">
            Front (Arabic - Optional)
          </label>
          <textarea
            id="frontArabic"
            value={formData.frontArabic}
            onChange={(e) => handleChange('frontArabic', e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none font-arabic"
            rows={3}
            placeholder="أدخل السؤال أو المصطلح بالعربية"
            dir="rtl"
            lang="ar"
            disabled={isSubmitting}
          />
        </div>

        {/* Back (English) */}
        <div>
          <label htmlFor="back" className="block text-sm font-medium text-gray-700 mb-2">
            Back (English) *
          </label>
          <textarea
            id="back"
            value={formData.back}
            onChange={(e) => handleChange('back', e.target.value)}
            className={`
              w-full px-4 py-3 rounded-lg border
              ${errors.back ? 'border-red-500' : 'border-gray-300'}
              focus:outline-none focus:ring-2 focus:ring-primary-500
              resize-none
            `}
            rows={3}
            placeholder="Enter the answer or definition"
            disabled={isSubmitting}
          />
          {errors.back && (
            <p className="mt-1 text-sm text-red-600">{errors.back}</p>
          )}
        </div>

        {/* Back (Arabic) */}
        <div>
          <label htmlFor="backArabic" className="block text-sm font-medium text-gray-700 mb-2">
            Back (Arabic - Optional)
          </label>
          <textarea
            id="backArabic"
            value={formData.backArabic}
            onChange={(e) => handleChange('backArabic', e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none font-arabic"
            rows={3}
            placeholder="أدخل الإجابة أو التعريف بالعربية"
            dir="rtl"
            lang="ar"
            disabled={isSubmitting}
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <Input
            id="category"
            type="text"
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
            placeholder="e.g., Grammar, Vocabulary, Hadith"
            error={errors.category}
            disabled={isSubmitting}
          />
        </div>

        {/* Difficulty */}
        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
            Difficulty Level
          </label>
          <select
            id="difficulty"
            value={formData.difficulty}
            onChange={(e) => handleChange('difficulty', e.target.value as FlashCardDifficulty)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            disabled={isSubmitting}
          >
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
            Tags (comma-separated)
          </label>
          <Input
            id="tags"
            type="text"
            value={formData.tags}
            onChange={(e) => handleChange('tags', e.target.value)}
            placeholder="e.g., verb conjugation, past tense, arabic"
            disabled={isSubmitting}
          />
          <p className="mt-1 text-sm text-gray-500">
            Separate tags with commas
          </p>
        </div>

        {/* Submit buttons */}
        <div className="flex gap-3 pt-6 border-t border-gray-200">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            leftIcon={<Save className="w-4 h-4" />}
            isLoading={isSubmitting}
            fullWidth
          >
            {card ? 'Update Flashcard' : 'Create Flashcard'}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default FlashCardEditor;
