import { Router } from 'express';
import { body, param } from 'express-validator';
import { FamilyController } from '../controllers/family.controller';
import { validate } from '../middleware/validate.middleware';
import { authenticate, requireParentRole } from '../middleware/auth.middleware';

const router = Router();

// All family routes require authentication
router.use(authenticate);

// Validation schemas
const addMemberValidation = [
  body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Name is required'),
  body('age').isInt({ min: 1, max: 99 }).withMessage('Age must be between 1 and 99'),
  body('pin')
    .optional()
    .isLength({ min: 4, max: 6 })
    .isNumeric()
    .withMessage('PIN must be 4-6 digits'),
];

const updateMemberValidation = [
  param('memberId').isUUID().withMessage('Valid member ID is required'),
  body('name').optional().trim().isLength({ min: 1, max: 100 }),
  body('age').optional().isInt({ min: 1, max: 99 }),
  body('avatarUrl').optional().isURL(),
];

const memberIdValidation = [
  param('memberId').isUUID().withMessage('Valid member ID is required'),
];

// Routes

// Get family info
router.get('/', FamilyController.getFamily);

// Get all family members
router.get('/members', FamilyController.getMembers);

// Get single member
router.get('/members/:memberId', validate(memberIdValidation), FamilyController.getMember);

// Add family member (parent only)
router.post('/members', requireParentRole, validate(addMemberValidation), FamilyController.addMember);

// Update family member (parent only)
router.put('/members/:memberId', requireParentRole, validate(updateMemberValidation), FamilyController.updateMember);

// Delete family member (parent only)
router.delete('/members/:memberId', requireParentRole, validate(memberIdValidation), FamilyController.deleteMember);

// Switch active member (for child login)
router.post('/members/:memberId/switch', validate(memberIdValidation), FamilyController.switchMember);

// Get member progress
router.get('/members/:memberId/progress', validate(memberIdValidation), FamilyController.getMemberProgress);

export default router;
