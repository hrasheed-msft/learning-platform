import { Router } from 'express';
import { param } from 'express-validator';
import { DashboardController } from '../controllers/dashboard.controller';
import { validate } from '../middleware/validate.middleware';
import { authenticate, requireParent } from '../middleware/auth.middleware';

const router = Router();

// All dashboard routes require parent authentication
router.use(authenticate);
router.use(requireParent);

const memberIdValidation = [
  param('memberId').isUUID().withMessage('Valid member ID is required'),
];

// Get all children with stats summary
router.get('/children', DashboardController.getChildren);

// Get detailed stats for one child
router.get('/children/:memberId/stats', validate(memberIdValidation), DashboardController.getChildStats);

// Get activity feed for one child (paginated)
router.get('/children/:memberId/activity', validate(memberIdValidation), DashboardController.getChildActivity);

// Get family-level aggregates
router.get('/family/summary', DashboardController.getFamilySummary);

export default router;
