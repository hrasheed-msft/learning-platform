import { Router } from 'express';
import { param, body } from 'express-validator';
import { LearningPath } from '@prisma/client';
import { validate } from '../middleware/validate.middleware';
import { authenticate, requireParentRole } from '../middleware/auth.middleware';
import { requireActiveMember } from '../middleware/requireActiveMember.middleware';
import { ProgramService } from '../services/program.service';

const router = Router();

// ─── Validation ───────────────────────────────────────────────────────────────

const slugParam = [
  param('slug').isString().trim().notEmpty().withMessage('Valid slug is required'),
];

const programIdParam = [
  param('programId').isUUID().withMessage('Valid program ID is required'),
];

const memberIdParam = [
  param('memberId').isUUID().withMessage('Valid member ID is required'),
];

const enrollValidation = [
  body('familyMemberId').isUUID().withMessage('Valid familyMemberId is required'),
  body('path')
    .isIn(Object.values(LearningPath))
    .withMessage(`path must be one of: ${Object.values(LearningPath).join(', ')}`),
  body('stageNumber')
    .optional()
    .isInt({ min: 1 })
    .withMessage('stageNumber must be a positive integer'),
];

// ─── Public routes ────────────────────────────────────────────────────────────

// GET /api/v1/programs — list published programs
router.get('/', async (_req, res, next) => {
  try {
    const programs = await ProgramService.listPrograms();
    res.json({ success: true, data: programs });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/programs/:slug — get program with stages and course summaries
// Must be declared before /:programId routes to avoid conflict
router.get('/slug/:slug', validate(slugParam), async (req, res, next) => {
  try {
    const program = await ProgramService.getProgramBySlug(req.params.slug);
    res.json({ success: true, data: program });
  } catch (err) {
    next(err);
  }
});

// ─── Protected routes ─────────────────────────────────────────────────────────

router.use(authenticate);

// POST /api/v1/programs/:programId/enroll — enroll a family member
router.post(
  '/:programId/enroll',
  requireActiveMember,
  requireParentRole,
  validate([...programIdParam, ...enrollValidation]),
  async (req, res, next) => {
    try {
      const enrollment = await ProgramService.enrollMember({
        programId: req.params.programId,
        familyMemberId: req.body.familyMemberId,
        path: req.body.path,
        stageNumber: req.body.stageNumber,
      });
      res.status(201).json({ success: true, data: enrollment });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/v1/programs/enrollment/:memberId — member's program enrollments
router.get(
  '/enrollment/:memberId',
  requireActiveMember,
  validate(memberIdParam),
  async (req, res, next) => {
    try {
      const enrollments = await ProgramService.getMemberEnrollments(
        req.params.memberId
      );
      res.json({ success: true, data: enrollments });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/v1/programs/enrollment/:memberId/stage-summary — grade-level progress
router.get(
  '/enrollment/:memberId/stage-summary',
  requireActiveMember,
  validate(memberIdParam),
  async (req, res, next) => {
    try {
      const summary = await ProgramService.getStageSummary(req.params.memberId);
      res.json({ success: true, data: summary });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
