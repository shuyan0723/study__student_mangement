"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const authMiddleware_1 = require("../middleware/authMiddleware");
const appealController_1 = require("../controllers/appealController");
const router = (0, express_1.Router)();
router.get('/', authMiddleware_1.authMiddleware, [
    (0, express_validator_1.query)('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    (0, express_validator_1.query)('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    (0, express_validator_1.query)('status').optional().isIn(['pending', 'reviewing', 'approved', 'rejected', 'closed']).withMessage('Invalid status'),
    (0, express_validator_1.query)('course_id').optional().isUUID().withMessage('Invalid course ID'),
    (0, express_validator_1.query)('student_id').optional().isUUID().withMessage('Invalid student ID'),
    (0, express_validator_1.query)('start_date').optional().isDate().withMessage('Invalid start date'),
    (0, express_validator_1.query)('end_date').optional().isDate().withMessage('Invalid end date')
], appealController_1.getAllAppeals);
router.get('/statistics', authMiddleware_1.authMiddleware, [
    (0, express_validator_1.query)('course_id').optional().isUUID().withMessage('Invalid course ID'),
    (0, express_validator_1.query)('start_date').optional().isDate().withMessage('Invalid start date'),
    (0, express_validator_1.query)('end_date').optional().isDate().withMessage('Invalid end date')
], appealController_1.getAppealStatistics);
router.get('/my-appeals', authMiddleware_1.authMiddleware, [
    (0, express_validator_1.query)('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    (0, express_validator_1.query)('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    (0, express_validator_1.query)('status').optional().isIn(['pending', 'reviewing', 'approved', 'rejected', 'closed']).withMessage('Invalid status')
], appealController_1.getMyAppeals);
router.get('/course/:courseId', authMiddleware_1.authMiddleware, [
    (0, express_validator_1.param)('courseId').notEmpty().withMessage('Course ID is required'),
    (0, express_validator_1.query)('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    (0, express_validator_1.query)('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    (0, express_validator_1.query)('status').optional().isIn(['pending', 'reviewing', 'approved', 'rejected', 'closed']).withMessage('Invalid status')
], appealController_1.getCourseAppeals);
router.get('/:id', authMiddleware_1.authMiddleware, [
    (0, express_validator_1.param)('id').notEmpty().withMessage('Appeal ID is required')
], appealController_1.getAppealById);
router.post('/', authMiddleware_1.authMiddleware, [
    (0, express_validator_1.body)('course_id').notEmpty().withMessage('Course ID is required').isUUID().withMessage('Invalid course ID'),
    (0, express_validator_1.body)('original_score').optional().isFloat({ min: 0, max: 100 }).withMessage('Original score must be between 0 and 100'),
    (0, express_validator_1.body)('appeal_reason').notEmpty().withMessage('Appeal reason is required').isLength({ min: 10, max: 2000 }).withMessage('Appeal reason must be between 10 and 2000 characters'),
    (0, express_validator_1.body)('attachments').optional().isArray().withMessage('Attachments must be an array')
], appealController_1.createAppeal);
router.put('/:id/status', authMiddleware_1.authMiddleware, [
    (0, express_validator_1.param)('id').notEmpty().withMessage('Appeal ID is required'),
    (0, express_validator_1.body)('status').notEmpty().withMessage('Status is required').isIn(['reviewing', 'approved', 'rejected', 'closed']).withMessage('Invalid status'),
    (0, express_validator_1.body)('new_score').optional().isFloat({ min: 0, max: 100 }).withMessage('New score must be between 0 and 100'),
    (0, express_validator_1.body)('review_feedback').optional().isLength({ max: 2000 }).withMessage('Feedback cannot exceed 2000 characters')
], appealController_1.updateAppealStatus);
router.delete('/:id', authMiddleware_1.authMiddleware, [
    (0, express_validator_1.param)('id').notEmpty().withMessage('Appeal ID is required')
], appealController_1.deleteAppeal);
exports.default = router;
