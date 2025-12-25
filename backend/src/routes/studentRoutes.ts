import { Router } from 'express';
import { body, param } from 'express-validator';
import { authMiddleware, authorizeRole } from '../middleware/authMiddleware';
import {
  getAllStudents,
  getStudentById,
  getCurrentStudent,
  createStudent,
  updateStudent,
  deleteStudent
} from '../controllers/studentController';

const router = Router();

// Get all students (admin/teacher only)
router.get(
  '/',
  authMiddleware,
  authorizeRole('admin', 'teacher'),
  getAllStudents
);

// Get student by ID (admin/teacher/student)
router.get(
  '/:id',
  authMiddleware,
  [
    param('id').notEmpty().withMessage('Student ID is required')
  ],
  getStudentById
);

// Get current student information (student only)
router.get(
  '/me',
  authMiddleware,
  authorizeRole('student'),
  getCurrentStudent
);

// Create student (admin only)
router.post(
  '/',
  authMiddleware,
  authorizeRole('admin'),
  [
    body('student_id').notEmpty().withMessage('Student ID is required'),
    body('name').notEmpty().withMessage('Name is required'),
    body('username').notEmpty().withMessage('Username is required'),
    body('email').notEmpty().isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('gender').optional().isIn(['male', 'female', 'other']).withMessage('Invalid gender'),
    body('status').optional().isIn(['active', 'inactive']).withMessage('Invalid status')
  ],
  createStudent
);

// Update student (admin/teacher/student)
router.put(
  '/:id',
  authMiddleware,
  [
    param('id').notEmpty().withMessage('Student ID is required'),
    body('gender').optional().isIn(['male', 'female', 'other']).withMessage('Invalid gender'),
    body('status').optional().isIn(['active', 'inactive']).withMessage('Invalid status'),
    body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
  ],
  updateStudent
);

// Delete student (admin only)
router.delete(
  '/:id',
  authMiddleware,
  authorizeRole('admin'),
  [
    param('id').notEmpty().withMessage('Student ID is required')
  ],
  deleteStudent
);

export default router;
