import { Router } from 'express';
import { param } from 'express-validator';
import { AudioController } from '../controllers/audio.controller';
import { validate } from '../middleware/validate.middleware';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

const unitIdValidation = [
  param('unitId').isUUID().withMessage('Valid unit ID is required'),
];

// POST /api/v1/units/:unitId/audio — generate or retrieve cached TTS audio
router.post(
  '/:unitId/audio',
  authenticate,
  validate(unitIdValidation),
  AudioController.generateAudio
);

export default router;
