import { Router } from 'express';
import { body, param } from 'express-validator';
import { ChildAuthController } from '../controllers/child-auth.controller';
import { validate } from '../middleware/validate.middleware';
import { authenticate, requireParent, requireChild } from '../middleware/auth.middleware';

const router = Router();

// Child login validation
const childLoginValidation = [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Create credentials validation
const createCredentialsValidation = [
  param('memberId').isUUID().withMessage('Valid member ID is required'),
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username can only contain letters, numbers, hyphens, and underscores'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

// Public: Child login
router.post('/auth/child-login', validate(childLoginValidation), ChildAuthController.childLogin);

// Parent: Create child credentials
router.post(
  '/family/members/:memberId/credentials',
  authenticate,
  requireParent,
  validate(createCredentialsValidation),
  ChildAuthController.createCredentials
);

// Child: Get own profile
router.get('/child/me', authenticate, requireChild, ChildAuthController.getProfile);

// Child: Update own profile (limited fields)
router.put('/child/me', authenticate, requireChild, ChildAuthController.updateProfile);

export default router;
