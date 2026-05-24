import { NextFunction, Request, Response, Router } from 'express';
import { body, param } from 'express-validator';
import { AudioController } from '../controllers/audio.controller';
import { validate } from '../middleware/validate.middleware';
import { authenticate, requireParent } from '../middleware/auth.middleware';

const router = Router();

const getCachedAudio = (req: Request, res: Response, next: NextFunction): void => {
  void AudioController.getCachedAudio(req, res, next);
};

const generateAudio = (req: Request, res: Response, next: NextFunction): void => {
  void AudioController.generateAudio(req, res, next);
};

const getTimestamps = (req: Request, res: Response, next: NextFunction): void => {
  void AudioController.getTimestamps(req, res, next);
};

const invalidateCachedAudio = (req: Request, res: Response, next: NextFunction): void => {
  void AudioController.invalidateCachedAudio(req, res, next);
};

const preGenerateAudio = (req: Request, res: Response, next: NextFunction): void => {
  void AudioController.preGenerateAudio(req, res, next);
};

const unitIdValidation = [
  param('unitId').isUUID().withMessage('Valid unit ID is required'),
];

const audioLanguageValidation = [
  body('language').optional().isIn(['ar', 'en']).withMessage('language must be "ar" or "en"'),
  body('unitIds').optional().isArray().withMessage('unitIds must be an array of unit IDs'),
  body('unitIds.*').optional().isUUID().withMessage('Each unitId must be a valid UUID'),
];

// GET /api/v1/units/:unitId/audio — retrieve cached TTS audio + timestamps (read-only)
router.get(
  '/:unitId/audio',
  authenticate,
  validate(unitIdValidation),
  getCachedAudio
);

// POST /api/v1/units/:unitId/audio — generate or retrieve cached TTS audio + timestamps
router.post(
  '/:unitId/audio',
  authenticate,
  validate(unitIdValidation),
  generateAudio
);

// GET /api/v1/units/:unitId/audio/timestamps — get word-level timestamps only
router.get(
  '/:unitId/audio/timestamps',
  authenticate,
  validate(unitIdValidation),
  getTimestamps
);

// POST /api/v1/units/admin/audio-cache/invalidate — clear cached audio so it regenerates on demand
router.post(
  '/admin/audio-cache/invalidate',
  authenticate,
  requireParent,
  validate(audioLanguageValidation),
  invalidateCachedAudio
);

// POST /api/v1/units/admin/pre-generate-audio — batch pre-generate audio for all units
router.post(
  '/admin/pre-generate-audio',
  authenticate,
  requireParent,
  validate(audioLanguageValidation),
  preGenerateAudio
);

export default router;
