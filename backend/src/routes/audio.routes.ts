import { Router } from 'express';
import { param, query } from 'express-validator';
import { AudioController } from '../controllers/audio.controller';
import { validate } from '../middleware/validate.middleware';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

const unitIdValidation = [
  param('unitId').isUUID().withMessage('Valid unit ID is required'),
];

// GET /api/v1/units/:unitId/audio — retrieve cached TTS audio + timestamps (read-only)
router.get(
  '/:unitId/audio',
  authenticate,
  validate(unitIdValidation),
  AudioController.getCachedAudio
);

// POST /api/v1/units/:unitId/audio — generate or retrieve cached TTS audio + timestamps
router.post(
  '/:unitId/audio',
  authenticate,
  validate(unitIdValidation),
  AudioController.generateAudio
);

// GET /api/v1/units/:unitId/audio/timestamps — get word-level timestamps only
router.get(
  '/:unitId/audio/timestamps',
  authenticate,
  validate(unitIdValidation),
  AudioController.getTimestamps
);

// POST /api/v1/units/admin/pre-generate-audio — batch pre-generate audio for all units
router.post(
  '/admin/pre-generate-audio',
  authenticate,
  AudioController.preGenerateAudio
);

export default router;
