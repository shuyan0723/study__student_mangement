"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const authMiddleware_1 = require("../middleware/authMiddleware");
const studentController_1 = require("../controllers/studentController");
const router = (0, express_1.Router)();
// Get all students (admin/teacher only)
router.get('/', authMiddleware_1.authMiddleware, (0, authMiddleware_1.authorizeRole)('admin', 'teacher'), studentController_1.getAllStudents);
// Get student by ID (admin/teacher/student)
router.get('/:id', authMiddleware_1.authMiddleware, [
    (0, express_validator_1.param)('id').notEmpty().withMessage('Student ID is required')
], studentController_1.getStudentById);
// Get current student information (student only)
router.get('/me', authMiddleware_1.authMiddleware, (0, authMiddleware_1.authorizeRole)('student'), studentController_1.getCurrentStudent);
// Create student (admin only)
router.post('/', authMiddleware_1.authMiddleware, (0, authMiddleware_1.authorizeRole)('admin'), [
    (0, express_validator_1.body)('student_id').notEmpty().withMessage('Student ID is required'),
    (0, express_validator_1.body)('name').notEmpty().withMessage('Name is required'),
    (0, express_validator_1.body)('username').notEmpty().withMessage('Username is required'),
    (0, express_validator_1.body)('email').notEmpty().isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('password').notEmpty().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    (0, express_validator_1.body)('gender').optional().isIn(['male', 'female', 'other']).withMessage('Invalid gender'),
    (0, express_validator_1.body)('status').optional().isIn(['active', 'inactive']).withMessage('Invalid status')
], studentController_1.createStudent);
// Update student (admin/teacher/student)
router.put('/:id', authMiddleware_1.authMiddleware, [
    (0, express_validator_1.param)('id').notEmpty().withMessage('Student ID is required'),
    (0, express_validator_1.body)('gender').optional().isIn(['male', 'female', 'other']).withMessage('Invalid gender'),
    (0, express_validator_1.body)('status').optional().isIn(['active', 'inactive']).withMessage('Invalid status'),
    (0, express_validator_1.body)('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], studentController_1.updateStudent);
// Delete student (admin only)
router.delete('/:id', authMiddleware_1.authMiddleware, (0, authMiddleware_1.authorizeRole)('admin'), [
    (0, express_validator_1.param)('id').notEmpty().withMessage('Student ID is required')
], studentController_1.deleteStudent);
exports.default = router;
