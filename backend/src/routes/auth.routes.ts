import { Router } from 'express';
import { body, param } from 'express-validator';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { ParentPinService } from '../services/parent-pin.service';

const router = Router();

// Validation schemas
const registerValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain an uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain a lowercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain a number'),
  body('familyName').trim().isLength({ min: 1 }).withMessage('Family name is required'),
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const forgotPasswordValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
];

const resetPasswordValidation = [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
];

// Routes
router.post('/register', validate(registerValidation), AuthController.register);
router.post('/login', validate(loginValidation), AuthController.login);
router.post('/refresh', AuthController.refreshToken);
router.post('/logout', authenticate, AuthController.logout);
router.post('/forgot-password', validate(forgotPasswordValidation), AuthController.forgotPassword);
router.post('/reset-password', validate(resetPasswordValidation), AuthController.resetPassword);
router.post('/verify-email', AuthController.verifyEmail);
router.post('/resend-verification', authenticate, AuthController.resendVerification);

// ─── Parent PIN Gate ──────────────────────────────────────────────────────────

const setPinValidation = [
  body('pin')
    .isString()
    .matches(/^\d{4}$/)
    .withMessage('PIN must be exactly 4 digits'),
];

const verifyPinValidation = [
  body('memberId').isUUID().withMessage('Valid memberId is required'),
  body('pin')
    .isString()
    .matches(/^\d{4}$/)
    .withMessage('PIN must be exactly 4 digits'),
];

// POST /auth/parent-pin — set or update the parent's PIN
router.post(
  '/parent-pin',
  authenticate,
  validate(setPinValidation),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }
      await ParentPinService.setPin(req.user.id, req.body.pin);
      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  }
);

// POST /auth/parent-pin/verify — verify a PIN for a given account-owner memberId
router.post(
  '/parent-pin/verify',
  authenticate,
  validate(verifyPinValidation),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const result = await ParentPinService.verifyPin(req.body.memberId, req.body.pin);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }
);

// GET /auth/parent-pin/status — returns { hasPin: boolean }
router.get(
  '/parent-pin/status',
  authenticate,
  async (req: AuthenticatedRequest, res, next) => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }
      const status = await ParentPinService.getPinStatus(req.user.id);
      res.json({ success: true, ...status });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
