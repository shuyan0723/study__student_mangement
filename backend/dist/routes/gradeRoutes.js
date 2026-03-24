"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const authMiddleware_1 = require("../middleware/authMiddleware");
const gradeController_1 = require("../controllers/gradeController");
const router = (0, express_1.Router)();
router.get('/', authMiddleware_1.authMiddleware, gradeController_1.getAllGrades);
router.get('/statistics', authMiddleware_1.authMiddleware, (0, authMiddleware_1.authorizeRole)('admin', 'teacher'), gradeController_1.getGradeStatistics);
router.get('/rankings', authMiddleware_1.authMiddleware, (0, authMiddleware_1.authorizeRole)('admin', 'teacher'), [
    (0, express_validator_1.query)('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
], gradeController_1.getStudentRankings);
router.get('/:id', authMiddleware_1.authMiddleware, [
    (0, express_validator_1.param)('id').notEmpty().withMessage('Grade ID is required')
], gradeController_1.getGradeById);
router.get('/student/:studentId', authMiddleware_1.authMiddleware, (0, authMiddleware_1.authorizeRole)('admin', 'teacher', 'student'), [
    (0, express_validator_1.param)('studentId').notEmpty().withMessage('Student ID is required')
], gradeController_1.getGradesByStudent);
router.get('/student/me', authMiddleware_1.authMiddleware, (0, authMiddleware_1.authorizeRole)('student'), gradeController_1.getStudentGrades);
router.get('/course/:courseId', authMiddleware_1.authMiddleware, (0, authMiddleware_1.authorizeRole)('admin', 'teacher'), [
    (0, express_validator_1.param)('courseId').notEmpty().withMessage('Course ID is required'),
    (0, express_validator_1.query)('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    (0, express_validator_1.query)('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
], gradeController_1.getGradesByCourse);
router.get('/course/:courseId/statistics', authMiddleware_1.authMiddleware, (0, authMiddleware_1.authorizeRole)('admin', 'teacher'), [
    (0, express_validator_1.param)('courseId').notEmpty().withMessage('Course ID is required')
], gradeController_1.getCourseStatistics);
router.get('/course/:courseId/teacher', authMiddleware_1.authMiddleware, (0, authMiddleware_1.authorizeRole)('teacher'), [
    (0, express_validator_1.param)('courseId').notEmpty().withMessage('Course ID is required')
], gradeController_1.getTeacherCourseGrades);
router.post('/', authMiddleware_1.authMiddleware, (0, authMiddleware_1.authorizeRole)('admin', 'teacher'), [
    (0, express_validator_1.body)('student_id').notEmpty().withMessage('Student ID is required'),
    (0, express_validator_1.body)('course_id').notEmpty().withMessage('Course ID is required'),
    (0, express_validator_1.body)('score').optional().isFloat({ min: 0, max: 100 }).withMessage('Score must be between 0 and 100'),
    (0, express_validator_1.body)('feedback').optional().isString().withMessage('Feedback must be a string'),
    (0, express_validator_1.body)('submission_status').optional().isIn(['pending', 'submitted', 'graded', 'revised']).withMessage('Invalid submission status')
], gradeController_1.createGrade);
router.post('/batch', authMiddleware_1.authMiddleware, (0, authMiddleware_1.authorizeRole)('admin', 'teacher'), [
    (0, express_validator_1.body)('grades').isArray({ min: 1 }).withMessage('Grades must be a non-empty array')
], gradeController_1.batchUpdateGrades);
router.put('/:id', authMiddleware_1.authMiddleware, (0, authMiddleware_1.authorizeRole)('admin', 'teacher'), [
    (0, express_validator_1.param)('id').notEmpty().withMessage('Grade ID is required'),
    (0, express_validator_1.body)('score').optional().isFloat({ min: 0, max: 100 }).withMessage('Score must be between 0 and 100'),
    (0, express_validator_1.body)('feedback').optional().isString().withMessage('Feedback must be a string'),
    (0, express_validator_1.body)('submission_status').optional().isIn(['pending', 'submitted', 'graded', 'revised']).withMessage('Invalid submission status')
], gradeController_1.updateGrade);
router.delete('/:id', authMiddleware_1.authMiddleware, (0, authMiddleware_1.authorizeRole)('admin'), [
    (0, express_validator_1.param)('id').notEmpty().withMessage('Grade ID is required')
], gradeController_1.deleteGrade);
exports.default = router;
