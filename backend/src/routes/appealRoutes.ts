import { Router } from 'express';
import { body, param, query } from 'express-validator';
import authMiddleware from '../middleware/authMiddleware';
import {
  getAllAppeals,
  getAppealById,
  getMyAppeals,
  createAppeal,
  updateAppealStatus,
  deleteAppeal,
  getAppealStatistics,
  getCourseAppeals
} from '../controllers/appealController';

const router = Router();

router.get(
  '/',
  authMiddleware,
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('status').optional().isIn(['pending', 'reviewing', 'approved', 'rejected', 'closed']).withMessage('Invalid status'),
    query('course_id').optional().isUUID().withMessage('Invalid course ID'),
    query('student_id').optional().isUUID().withMessage('Invalid student ID'),
    query('start_date').optional().isDate().withMessage('Invalid start date'),
    query('end_date').optional().isDate().withMessage('Invalid end date')
  ],
  getAllAppeals
);

router.get(
  '/statistics',
  authMiddleware,
  [
    query('course_id').optional().isUUID().withMessage('Invalid course ID'),
    query('start_date').optional().isDate().withMessage('Invalid start date'),
    query('end_date').optional().isDate().withMessage('Invalid end date')
  ],
  getAppealStatistics
);

router.get(
  '/my-appeals',
  authMiddleware,
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('status').optional().isIn(['pending', 'reviewing', 'approved', 'rejected', 'closed']).withMessage('Invalid status')
  ],
  getMyAppeals
);

router.get(
  '/course/:courseId',
  authMiddleware,
  [
    param('courseId').notEmpty().withMessage('Course ID is required'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('status').optional().isIn(['pending', 'reviewing', 'approved', 'rejected', 'closed']).withMessage('Invalid status')
  ],
  getCourseAppeals
);

router.get(
  '/:id',
  authMiddleware,
  [
    param('id').notEmpty().withMessage('Appeal ID is required')
  ],
  getAppealById
);

router.post(
  '/',
  authMiddleware,
  [
    body('course_id').notEmpty().withMessage('Course ID is required').isUUID().withMessage('Invalid course ID'),
    body('original_score').optional().isFloat({ min: 0, max: 100 }).withMessage('Original score must be between 0 and 100'),
    body('appeal_reason').notEmpty().withMessage('Appeal reason is required').isLength({ min: 10, max: 2000 }).withMessage('Appeal reason must be between 10 and 2000 characters'),
    body('attachments').optional().isArray().withMessage('Attachments must be an array')
  ],
  createAppeal
);

router.put(
  '/:id/status',
  authMiddleware,
  [
    param('id').notEmpty().withMessage('Appeal ID is required'),
    body('status').notEmpty().withMessage('Status is required').isIn(['reviewing', 'approved', 'rejected', 'closed']).withMessage('Invalid status'),
    body('new_score').optional().isFloat({ min: 0, max: 100 }).withMessage('New score must be between 0 and 100'),
    body('review_feedback').optional().isLength({ max: 2000 }).withMessage('Feedback cannot exceed 2000 characters')
  ],
  updateAppealStatus
);

router.delete(
  '/:id',
  authMiddleware,
  [
    param('id').notEmpty().withMessage('Appeal ID is required')
  ],
  deleteAppeal
);

export default router;
