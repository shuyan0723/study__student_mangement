"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const authMiddleware_1 = require("../middleware/authMiddleware");
const courseController_1 = require("../controllers/courseController");
const router = (0, express_1.Router)();
// Get all courses (all authenticated users)
router.get('/', authMiddleware_1.authMiddleware, courseController_1.getAllCourses);
// Get course by ID (all authenticated users)
router.get('/:id', authMiddleware_1.authMiddleware, [
    (0, express_validator_1.param)('id').notEmpty().withMessage('Course ID is required')
], courseController_1.getCourseById);
// Get courses taught by current teacher (teacher only)
router.get('/teacher/me', authMiddleware_1.authMiddleware, (0, authMiddleware_1.authorizeRole)('teacher'), courseController_1.getCoursesByTeacher);
// Create course (admin/teacher)
router.post('/', authMiddleware_1.authMiddleware, (0, authMiddleware_1.authorizeRole)('admin', 'teacher'), [
    (0, express_validator_1.body)('course_id').notEmpty().withMessage('Course ID is required'),
    (0, express_validator_1.body)('course_name').notEmpty().withMessage('Course name is required'),
    (0, express_validator_1.body)('credits').notEmpty().isNumeric().withMessage('Credits must be a number'),
    (0, express_validator_1.body)('hours').notEmpty().isInt().withMessage('Hours must be an integer'),
    (0, express_validator_1.body)('capacity').notEmpty().isInt({ min: 10 }).withMessage('Capacity must be at least 10'),
    (0, express_validator_1.body)('status').optional().isIn(['active', 'inactive']).withMessage('Invalid status')
], courseController_1.createCourse);
// Update course (admin/teacher)
router.put('/:id', authMiddleware_1.authMiddleware, (0, authMiddleware_1.authorizeRole)('admin', 'teacher'), [
    (0, express_validator_1.param)('id').notEmpty().withMessage('Course ID is required'),
    (0, express_validator_1.body)('credits').optional().isNumeric().withMessage('Credits must be a number'),
    (0, express_validator_1.body)('hours').optional().isInt().withMessage('Hours must be an integer'),
    (0, express_validator_1.body)('capacity').optional().isInt({ min: 10 }).withMessage('Capacity must be at least 10'),
    (0, express_validator_1.body)('status').optional().isIn(['active', 'inactive']).withMessage('Invalid status')
], courseController_1.updateCourse);
// Delete course (admin only)
router.delete('/:id', authMiddleware_1.authMiddleware, (0, authMiddleware_1.authorizeRole)('admin'), [
    (0, express_validator_1.param)('id').notEmpty().withMessage('Course ID is required')
], courseController_1.deleteCourse);
exports.default = router;
