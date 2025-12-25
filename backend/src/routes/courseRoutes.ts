import { Router } from 'express';
import { body, param } from 'express-validator';
import { authMiddleware, authorizeRole } from '../middleware/authMiddleware';
import {
  getAllCourses,
  getCourseById,
  getCoursesByTeacher,
  createCourse,
  updateCourse,
  deleteCourse
} from '../controllers/courseController';

const router = Router();

// Get all courses (all authenticated users)
router.get(
  '/',
  authMiddleware,
  getAllCourses
);

// Get course by ID (all authenticated users)
router.get(
  '/:id',
  authMiddleware,
  [
    param('id').notEmpty().withMessage('Course ID is required')
  ],
  getCourseById
);

// Get courses taught by current teacher (teacher only)
router.get(
  '/teacher/me',
  authMiddleware,
  authorizeRole('teacher'),
  getCoursesByTeacher
);

// Create course (admin/teacher)
router.post(
  '/',
  authMiddleware,
  authorizeRole('admin', 'teacher'),
  [
    body('course_id').notEmpty().withMessage('Course ID is required'),
    body('course_name').notEmpty().withMessage('Course name is required'),
    body('credits').notEmpty().isNumeric().withMessage('Credits must be a number'),
    body('hours').notEmpty().isInt().withMessage('Hours must be an integer'),
    body('capacity').notEmpty().isInt({ min: 10 }).withMessage('Capacity must be at least 10'),
    body('status').optional().isIn(['active', 'inactive']).withMessage('Invalid status')
  ],
  createCourse
);

// Update course (admin/teacher)
router.put(
  '/:id',
  authMiddleware,
  authorizeRole('admin', 'teacher'),
  [
    param('id').notEmpty().withMessage('Course ID is required'),
    body('credits').optional().isNumeric().withMessage('Credits must be a number'),
    body('hours').optional().isInt().withMessage('Hours must be an integer'),
    body('capacity').optional().isInt({ min: 10 }).withMessage('Capacity must be at least 10'),
    body('status').optional().isIn(['active', 'inactive']).withMessage('Invalid status')
  ],
  updateCourse
);

// Delete course (admin only)
router.delete(
  '/:id',
  authMiddleware,
  authorizeRole('admin'),
  [
    param('id').notEmpty().withMessage('Course ID is required')
  ],
  deleteCourse
);

export default router;
