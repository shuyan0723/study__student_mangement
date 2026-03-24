"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const authMiddleware_1 = require("../middleware/authMiddleware");
const teacherController_1 = require("../controllers/teacherController");
const router = (0, express_1.Router)();
router.get('/', authMiddleware_1.authMiddleware, (0, authMiddleware_1.authorizeRole)('admin'), teacherController_1.getAllTeachers);
router.get('/me', authMiddleware_1.authMiddleware, (0, authMiddleware_1.authorizeRole)('teacher'), teacherController_1.getCurrentTeacher);
router.get('/:id', authMiddleware_1.authMiddleware, [
    (0, express_validator_1.param)('id').notEmpty().withMessage('Teacher ID is required')
], teacherController_1.getTeacherById);
router.get('/:id/courses', authMiddleware_1.authMiddleware, (0, authMiddleware_1.authorizeRole)('admin', 'teacher'), [
    (0, express_validator_1.param)('id').notEmpty().withMessage('Teacher ID is required')
], teacherController_1.getTeacherWithCourses);
router.get('/:id/statistics', authMiddleware_1.authMiddleware, (0, authMiddleware_1.authorizeRole)('admin', 'teacher'), [
    (0, express_validator_1.param)('id').notEmpty().withMessage('Teacher ID is required')
], teacherController_1.getTeacherStatistics);
router.put('/me', authMiddleware_1.authMiddleware, (0, authMiddleware_1.authorizeRole)('teacher'), teacherController_1.updateTeacherProfile);
router.post('/', authMiddleware_1.authMiddleware, (0, authMiddleware_1.authorizeRole)('admin'), [
    (0, express_validator_1.body)('teacher_id').notEmpty().withMessage('Teacher ID is required'),
    (0, express_validator_1.body)('name').notEmpty().withMessage('Name is required'),
    (0, express_validator_1.body)('username').notEmpty().withMessage('Username is required'),
    (0, express_validator_1.body)('email').notEmpty().isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('password').notEmpty().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    (0, express_validator_1.body)('gender').optional().isIn(['male', 'female', 'other']).withMessage('Invalid gender'),
    (0, express_validator_1.body)('title').optional().isString().withMessage('Title must be a string')
], teacherController_1.createTeacher);
router.put('/:id', authMiddleware_1.authMiddleware, (0, authMiddleware_1.authorizeRole)('admin'), [
    (0, express_validator_1.param)('id').notEmpty().withMessage('Teacher ID is required'),
    (0, express_validator_1.body)('gender').optional().isIn(['male', 'female', 'other']).withMessage('Invalid gender'),
    (0, express_validator_1.body)('title').optional().isString().withMessage('Title must be a string')
], teacherController_1.updateTeacher);
router.delete('/:id', authMiddleware_1.authMiddleware, (0, authMiddleware_1.authorizeRole)('admin'), [
    (0, express_validator_1.param)('id').notEmpty().withMessage('Teacher ID is required')
], teacherController_1.deleteTeacher);
exports.default = router;
