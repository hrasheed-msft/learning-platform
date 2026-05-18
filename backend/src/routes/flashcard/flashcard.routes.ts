/**
 * Flash Card Routes
 * 
 * Defines all API endpoints for flash card and progress management.
 */

import { Router } from 'express';
import * as flashCardController from '../../controllers/flashcard/flashcard.controller';
import * as progressController from '../../controllers/flashcard/progress.controller';
import { requireAuth } from '../../middleware/auth.middleware';

const router = Router();

// ==================== Flash Card CRUD Routes ====================

/**
 * @route   POST /api/v1/courses/:courseId/units/:unitId/flashcards
 * @desc    Create a flash card for a unit
 * @access  Private (Instructors, Admins)
 */
router.post(
  '/courses/:courseId/units/:unitId/flashcards',
  requireAuth,
  flashCardController.createFlashCard
);

/**
 * @route   POST /api/v1/courses/:courseId/units/:unitId/flashcards/batch
 * @desc    Create multiple flash cards in batch
 * @access  Private (Instructors, Admins)
 */
router.post(
  '/courses/:courseId/units/:unitId/flashcards/batch',
  requireAuth,
  flashCardController.createFlashCardBatch
);

/**
 * @route   GET /api/v1/courses/:courseId/units/:unitId/flashcards
 * @desc    Get all flash cards for a unit
 * @access  Public
 */
router.get(
  '/courses/:courseId/units/:unitId/flashcards',
  flashCardController.getFlashCards
);

/**
 * @route   GET /api/v1/courses/:courseId/flashcards
 * @desc    Get all flash cards for a course
 * @access  Public
 */
router.get(
  '/courses/:courseId/flashcards',
  flashCardController.getFlashCards
);

/**
 * @route   GET /api/v1/flashcards/:id
 * @desc    Get a single flash card by ID
 * @access  Public
 */
router.get(
  '/flashcards/:id',
  flashCardController.getFlashCardById
);

/**
 * @route   PUT /api/v1/flashcards/:id
 * @desc    Update a flash card
 * @access  Private (Instructors, Admins)
 */
router.put(
  '/flashcards/:id',
  requireAuth,
  flashCardController.updateFlashCard
);

/**
 * @route   DELETE /api/v1/flashcards/:id
 * @desc    Delete a flash card
 * @access  Private (Instructors, Admins)
 */
router.delete(
  '/flashcards/:id',
  requireAuth,
  flashCardController.deleteFlashCard
);

/**
 * @route   PUT /api/v1/units/:unitId/flashcards/reorder
 * @desc    Reorder flash cards in a unit
 * @access  Private (Instructors, Admins)
 */
router.put(
  '/units/:unitId/flashcards/reorder',
  requireAuth,
  flashCardController.reorderFlashCards
);

// ==================== Utility Routes ====================

/**
 * @route   GET /api/v1/flashcards/metadata/categories
 * @desc    Get distinct categories
 * @access  Public
 */
router.get(
  '/flashcards/metadata/categories',
  flashCardController.getCategories
);

/**
 * @route   GET /api/v1/flashcards/metadata/tags
 * @desc    Get distinct tags
 * @access  Public
 */
router.get(
  '/flashcards/metadata/tags',
  flashCardController.getTags
);

/**
 * @route   GET /api/v1/flashcards/count
 * @desc    Get flash card count with filters
 * @access  Public
 */
router.get(
  '/flashcards/count',
  flashCardController.getFlashCardCount
);

// ==================== Progress & Review Routes ====================

/**
 * @route   POST /api/v1/flashcards/:flashCardId/initialize
 * @desc    Initialize progress for a flash card
 * @access  Private
 */
router.post(
  '/flashcards/:flashCardId/initialize',
  requireAuth,
  progressController.initializeProgress
);

/**
 * @route   POST /api/v1/flashcards/:flashCardId/review
 * @desc    Submit a review (rating) for a flash card
 * @access  Private
 */
router.post(
  '/flashcards/:flashCardId/review',
  requireAuth,
  progressController.submitReview
);

/**
 * @route   GET /api/v1/members/me/flashcards/due
 * @desc    Get flash cards due for review
 * @access  Private
 */
router.get(
  '/members/me/flashcards/due',
  requireAuth,
  progressController.getDueCards
);

/**
 * @route   GET /api/v1/members/me/flashcards/stats
 * @desc    Get flash card progress statistics
 * @access  Private
 */
router.get(
  '/members/me/flashcards/stats',
  requireAuth,
  progressController.getStatistics
);

/**
 * @route   GET /api/v1/members/me/units/:unitId/flashcards/progress
 * @desc    Get progress for all flash cards in a unit
 * @access  Private
 */
router.get(
  '/members/me/units/:unitId/flashcards/progress',
  requireAuth,
  progressController.getUnitProgress
);

/**
 * @route   GET /api/v1/members/me/courses/:courseId/flashcards/progress
 * @desc    Get progress for all flash cards in a course
 * @access  Private
 */
router.get(
  '/members/me/courses/:courseId/flashcards/progress',
  requireAuth,
  progressController.getCourseProgress
);

/**
 * @route   GET /api/v1/members/me/flashcards/recent
 * @desc    Get recent reviews
 * @access  Private
 */
router.get(
  '/members/me/flashcards/recent',
  requireAuth,
  progressController.getRecentReviews
);

/**
 * @route   DELETE /api/v1/flashcards/:flashCardId/progress
 * @desc    Reset progress for a single flash card
 * @access  Private
 */
router.delete(
  '/flashcards/:flashCardId/progress',
  requireAuth,
  progressController.resetProgress
);

/**
 * @route   DELETE /api/v1/units/:unitId/flashcards/progress
 * @desc    Reset progress for all flash cards in a unit
 * @access  Private
 */
router.delete(
  '/units/:unitId/flashcards/progress',
  requireAuth,
  progressController.resetUnitProgress
);

export default router;
