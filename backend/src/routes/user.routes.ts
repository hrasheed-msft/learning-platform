import { Router } from 'express';
import { body } from 'express-validator';
import { UserController } from '../controllers/user.controller';
import { validate } from '../middleware/validate.middleware';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All user routes require authentication
router.use(authenticate);

// Validation schemas
const updateProfileValidation = [
  body('name').optional().trim().isLength({ min: 1, max: 100 }),
  body('timezone').optional().isString(),
];

const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
];

const updateSettingsValidation = [
  body('emailNotifications').optional().isBoolean(),
  body('dailyReminders').optional().isBoolean(),
  body('reminderTime').optional().matches(/^([01]\d|2[0-3]):([0-5]\d)$/),
];

// Routes

// Get current user profile
router.get('/me', UserController.getProfile);

// Update profile
router.put('/me', validate(updateProfileValidation), UserController.updateProfile);

// Change password
router.put('/me/password', validate(changePasswordValidation), UserController.changePassword);

// Get user settings
router.get('/me/settings', UserController.getSettings);

// Update user settings
router.put('/me/settings', validate(updateSettingsValidation), UserController.updateSettings);

// Get user achievements
router.get('/me/achievements', UserController.getAchievements);

export default router;
