import { Router } from 'express';
import { param, query, body } from 'express-validator';
import { CourseController } from '../controllers/course.controller';
import { validate } from '../middleware/validate.middleware';
import { authenticate, optionalAuth, requireParentRole } from '../middleware/auth.middleware';
import { requireActiveMember } from '../middleware/requireActiveMember.middleware';

const router = Router();

// Validation schemas
const courseIdValidation = [
  param('courseId').isUUID().withMessage('Valid course ID is required'),
];

const unitIdValidation = [
  param('courseId').isUUID().withMessage('Valid course ID is required'),
  param('unitId').isUUID().withMessage('Valid unit ID is required'),
];

const enrollmentValidation = [
  body('memberId').isUUID().withMessage('Valid member ID is required'),
  body('courseId').isUUID().withMessage('Valid course ID is required'),
];

const progressUpdateValidation = [
  body('memberId').isUUID().withMessage('Valid member ID is required'),
  body('unitId').isUUID().withMessage('Valid unit ID is required'),
  body('videoCompleted').optional().isBoolean(),
  body('readingCompleted').optional().isBoolean(),
  body('quizCompleted').optional().isBoolean(),
];

// Public routes (with optional auth for personalization)
router.get('/', optionalAuth, CourseController.getCourses);
router.get('/:courseId', validate(courseIdValidation), optionalAuth, CourseController.getCourse);

// Protected routes
router.use(authenticate);

// Course units (browsing doesn't require active member)
router.get('/:courseId/units', validate(courseIdValidation), CourseController.getUnits);
router.get('/:courseId/units/:unitId', validate(unitIdValidation), CourseController.getUnit);

// Enrollments (require active member)
router.post('/enrollments', requireActiveMember, requireParentRole, validate(enrollmentValidation), CourseController.enrollMember);
router.post('/:courseId/enroll', validate(courseIdValidation), requireActiveMember, CourseController.enrollActiveMember);
router.get('/enrollments/member/:memberId', requireActiveMember, CourseController.getMemberEnrollments);
router.delete('/enrollments/:enrollmentId', requireActiveMember, requireParentRole, CourseController.unenrollMember);

// Progress tracking (require active member)
router.post('/progress', requireActiveMember, validate(progressUpdateValidation), CourseController.updateProgress);
router.get('/progress/member/:memberId', requireActiveMember, CourseController.getMemberProgress);

export default router;
