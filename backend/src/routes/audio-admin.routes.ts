import { NextFunction, Request, Response, Router } from 'express';
import { body } from 'express-validator';
import { AudioController } from '../controllers/audio.controller';
import { authenticate, requireParent } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';

const router = Router();

const invalidateCachedAudio = (req: Request, res: Response, next: NextFunction): void => {
  void AudioController.invalidateCachedAudio(req, res, next);
};

const preGenerateAudio = (req: Request, res: Response, next: NextFunction): void => {
  void AudioController.preGenerateAudio(req, res, next);
};

const normalizeArabicTerms = (req: Request, res: Response, next: NextFunction): void => {
  void AudioController.normalizeArabicTerms(req, res, next);
};

const audioAdminValidation = [
  body('language').optional().isIn(['ar', 'en']).withMessage('language must be "ar" or "en"'),
  body('unitIds').optional().isArray().withMessage('unitIds must be an array of unit IDs'),
  body('unitIds.*').optional().isUUID().withMessage('Each unitId must be a valid UUID'),
];

router.post(
  '/admin/invalidate-audio-cache',
  authenticate,
  requireParent,
  validate(audioAdminValidation),
  invalidateCachedAudio
);

router.post(
  '/admin/pre-generate-audio',
  authenticate,
  requireParent,
  validate(audioAdminValidation),
  preGenerateAudio
);

router.post(
  '/admin/normalize-arabic-terms',
  authenticate,
  requireParent,
  validate(audioAdminValidation),
  normalizeArabicTerms
);

export default router;
