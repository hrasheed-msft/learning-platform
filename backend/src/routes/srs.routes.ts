import { Router } from 'express';
import { param, body } from 'express-validator';
import { SRSController } from '../controllers/srs.controller';
import { validate } from '../middleware/validate.middleware';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All SRS routes require authentication
router.use(authenticate);

// Validation schemas
const memberIdValidation = [
  param('memberId').isUUID().withMessage('Valid member ID is required'),
];

const reviewSubmitValidation = [
  body('itemId').isUUID().withMessage('Valid item ID is required'),
  body('memberId').isUUID().withMessage('Valid member ID is required'),
  body('rating').isInt({ min: 1, max: 4 }).withMessage('Rating must be between 1 and 4'),
];

const addItemValidation = [
  body('memberId').isUUID().withMessage('Valid member ID is required'),
  body('type').isIn(['AYAH', 'HADITH', 'DUA', 'TERM']).withMessage('Valid type is required'),
  body('front').notEmpty().withMessage('Front content is required'),
  body('back').notEmpty().withMessage('Back content is required'),
  body('arabicText').optional().isString(),
  body('transliteration').optional().isString(),
  body('sourceUnitId').optional().isUUID(),
];

// Routes

// Get items due for review
router.get('/due/:memberId', validate(memberIdValidation), SRSController.getDueItems);

// Get all memorization items for a member
router.get('/items/:memberId', validate(memberIdValidation), SRSController.getItems);

// Add new memorization item
router.post('/items', validate(addItemValidation), SRSController.addItem);

// Submit review rating
router.post('/review', validate(reviewSubmitValidation), SRSController.submitReview);

// Get review history for a member
router.get('/history/:memberId', validate(memberIdValidation), SRSController.getReviewHistory);

// Get SRS statistics for a member
router.get('/stats/:memberId', validate(memberIdValidation), SRSController.getStats);

export default router;
