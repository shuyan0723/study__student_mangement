import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { authMiddleware, authorizeRole } from '../middleware/authMiddleware';
import {
  getAllGrades,
  getGradeById,
  getGradesByStudent,
  getGradesByCourse,
  getStudentGrades,
  getTeacherCourseGrades,
  createGrade,
  updateGrade,
  batchUpdateGrades,
  deleteGrade,
  getGradeStatistics,
  getCourseStatistics,
  getStudentRankings
} from '../controllers/gradeController';

const router = Router();

router.get(
  '/',
  authMiddleware,
  getAllGrades
);

router.get(
  '/statistics',
  authMiddleware,
  authorizeRole('admin', 'teacher'),
  getGradeStatistics
);

router.get(
  '/rankings',
  authMiddleware,
  authorizeRole('admin', 'teacher'),
  [
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
  ],
  getStudentRankings
);

router.get(
  '/:id',
  authMiddleware,
  [
    param('id').notEmpty().withMessage('Grade ID is required')
  ],
  getGradeById
);

router.get(
  '/student/:studentId',
  authMiddleware,
  authorizeRole('admin', 'teacher', 'student'),
  [
    param('studentId').notEmpty().withMessage('Student ID is required')
  ],
  getGradesByStudent
);

router.get(
  '/student/me',
  authMiddleware,
  authorizeRole('student'),
  getStudentGrades
);

router.get(
  '/course/:courseId',
  authMiddleware,
  authorizeRole('admin', 'teacher'),
  [
    param('courseId').notEmpty().withMessage('Course ID is required'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
  ],
  getGradesByCourse
);

router.get(
  '/course/:courseId/statistics',
  authMiddleware,
  authorizeRole('admin', 'teacher'),
  [
    param('courseId').notEmpty().withMessage('Course ID is required')
  ],
  getCourseStatistics
);

router.get(
  '/course/:courseId/teacher',
  authMiddleware,
  authorizeRole('teacher'),
  [
    param('courseId').notEmpty().withMessage('Course ID is required')
  ],
  getTeacherCourseGrades
);

router.post(
  '/',
  authMiddleware,
  authorizeRole('admin', 'teacher'),
  [
    body('student_id').notEmpty().withMessage('Student ID is required'),
    body('course_id').notEmpty().withMessage('Course ID is required'),
    body('score').optional().isFloat({ min: 0, max: 100 }).withMessage('Score must be between 0 and 100'),
    body('feedback').optional().isString().withMessage('Feedback must be a string'),
    body('submission_status').optional().isIn(['pending', 'submitted', 'graded', 'revised']).withMessage('Invalid submission status')
  ],
  createGrade
);

router.post(
  '/batch',
  authMiddleware,
  authorizeRole('admin', 'teacher'),
  [
    body('grades').isArray({ min: 1 }).withMessage('Grades must be a non-empty array')
  ],
  batchUpdateGrades
);

router.put(
  '/:id',
  authMiddleware,
  authorizeRole('admin', 'teacher'),
  [
    param('id').notEmpty().withMessage('Grade ID is required'),
    body('score').optional().isFloat({ min: 0, max: 100 }).withMessage('Score must be between 0 and 100'),
    body('feedback').optional().isString().withMessage('Feedback must be a string'),
    body('submission_status').optional().isIn(['pending', 'submitted', 'graded', 'revised']).withMessage('Invalid submission status')
  ],
  updateGrade
);

router.delete(
  '/:id',
  authMiddleware,
  authorizeRole('admin'),
  [
    param('id').notEmpty().withMessage('Grade ID is required')
  ],
  deleteGrade
);

export default router;
