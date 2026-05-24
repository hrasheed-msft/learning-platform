import { Router } from 'express';
import { param, body } from 'express-validator';
import { AssessmentController } from '../controllers/assessment.controller';
import { validate } from '../middleware/validate.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { requireActiveMember } from '../middleware/requireActiveMember.middleware';

const router = Router();

// All assessment routes require authentication
router.use(authenticate);

// Require an active learner profile for assessment routes
router.use(requireActiveMember);

// Validation schemas
const unitIdValidation = [
  param('unitId').isUUID().withMessage('Valid unit ID is required'),
];

const submitQuizValidation = [
  body('unitId').isUUID().withMessage('Valid unit ID is required'),
  body('memberId').optional().isUUID().withMessage('Valid member ID is required'),
  body('answers').isArray({ min: 1 }).withMessage('Answers array is required'),
  body('answers.*.questionId').isUUID().withMessage('Valid question ID is required'),
  body('answers.*.answer').notEmpty().withMessage('Answer is required'),
  body('timeSpent').optional().isInt({ min: 0 }).withMessage('Time spent must be a positive number'),
];

const generateQuestionsValidation = [
  body('unitId').isUUID().withMessage('Valid unit ID is required'),
  body('count').optional().isInt({ min: 1, max: 20 }).withMessage('Count must be between 1 and 20'),
  body('types').optional().isArray().withMessage('Types must be an array'),
];

// Routes

// Get questions for a unit
router.get('/units/:unitId/questions', validate(unitIdValidation), AssessmentController.getQuestions);

// Submit quiz answers
router.post('/submit', validate(submitQuizValidation), AssessmentController.submitQuiz);

// Get quiz results for a member
router.get('/results/member/:memberId', AssessmentController.getMemberResults);

// Get single quiz result
router.get('/results/:resultId', AssessmentController.getQuizResult);

// Generate AI questions (admin only - to be protected further)
router.post('/generate', validate(generateQuestionsValidation), AssessmentController.generateQuestions);

export default router;
