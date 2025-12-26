import { Router } from 'express';
import { body, param } from 'express-validator';
import { authMiddleware, authorizeRole } from '../middleware/authMiddleware';
import {
  getAllTeachers,
  getTeacherById,
  getCurrentTeacher,
  getTeacherWithCourses,
  getTeacherStatistics,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  updateTeacherProfile
} from '../controllers/teacherController';

const router = Router();

router.get(
  '/',
  authMiddleware,
  authorizeRole('admin'),
  getAllTeachers
);

router.get(
  '/me',
  authMiddleware,
  authorizeRole('teacher'),
  getCurrentTeacher
);

router.get(
  '/:id',
  authMiddleware,
  [
    param('id').notEmpty().withMessage('Teacher ID is required')
  ],
  getTeacherById
);

router.get(
  '/:id/courses',
  authMiddleware,
  authorizeRole('admin', 'teacher'),
  [
    param('id').notEmpty().withMessage('Teacher ID is required')
  ],
  getTeacherWithCourses
);

router.get(
  '/:id/statistics',
  authMiddleware,
  authorizeRole('admin', 'teacher'),
  [
    param('id').notEmpty().withMessage('Teacher ID is required')
  ],
  getTeacherStatistics
);

router.put(
  '/me',
  authMiddleware,
  authorizeRole('teacher'),
  updateTeacherProfile
);

router.post(
  '/',
  authMiddleware,
  authorizeRole('admin'),
  [
    body('teacher_id').notEmpty().withMessage('Teacher ID is required'),
    body('name').notEmpty().withMessage('Name is required'),
    body('username').notEmpty().withMessage('Username is required'),
    body('email').notEmpty().isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('gender').optional().isIn(['male', 'female', 'other']).withMessage('Invalid gender'),
    body('title').optional().isString().withMessage('Title must be a string')
  ],
  createTeacher
);

router.put(
  '/:id',
  authMiddleware,
  authorizeRole('admin'),
  [
    param('id').notEmpty().withMessage('Teacher ID is required'),
    body('gender').optional().isIn(['male', 'female', 'other']).withMessage('Invalid gender'),
    body('title').optional().isString().withMessage('Title must be a string')
  ],
  updateTeacher
);

router.delete(
  '/:id',
  authMiddleware,
  authorizeRole('admin'),
  [
    param('id').notEmpty().withMessage('Teacher ID is required')
  ],
  deleteTeacher
);

export default router;
