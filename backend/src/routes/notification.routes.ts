import { Router } from 'express';
import { param } from 'express-validator';
import { NotificationController } from '../controllers/notification.controller';
import { validate } from '../middleware/validate.middleware';
import { authenticate, requireParent } from '../middleware/auth.middleware';

const router = Router();

// All notification routes require parent authentication
router.use(authenticate);
router.use(requireParent);

const notificationIdValidation = [
  param('id').isUUID().withMessage('Valid notification ID is required'),
];

// Get notifications (paginated)
router.get('/', NotificationController.getNotifications);

// Mark notification as read
router.put('/:id/read', validate(notificationIdValidation), NotificationController.markAsRead);

export default router;
