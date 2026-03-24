"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCourseAppeals = exports.getAppealStatistics = exports.deleteAppeal = exports.updateAppealStatus = exports.createAppeal = exports.getMyAppeals = exports.getAppealById = exports.getAllAppeals = void 0;
const express_validator_1 = require("express-validator");
const express_validator_2 = require("express-validator");
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const Appeal_1 = __importDefault(require("../models/Appeal"));
const Student_1 = __importDefault(require("../models/Student"));
const Course_1 = __importDefault(require("../models/Course"));
const User_1 = __importDefault(require("../models/User"));
const Grade_1 = __importDefault(require("../models/Grade"));
exports.getAllAppeals = [
    (0, express_validator_2.query)('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    (0, express_validator_2.query)('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    (0, express_validator_2.query)('status').optional().isIn(['pending', 'reviewing', 'approved', 'rejected', 'closed']).withMessage('Invalid status'),
    (0, express_validator_2.query)('course_id').optional().isUUID().withMessage('Invalid course ID'),
    (0, express_validator_2.query)('student_id').optional().isUUID().withMessage('Invalid student ID'),
    (0, express_validator_2.query)('start_date').optional().isDate().withMessage('Invalid start date'),
    (0, express_validator_2.query)('end_date').optional().isDate().withMessage('Invalid end date'),
    async (req, res) => {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    error: 'VALIDATION_ERROR',
                    message: 'Validation failed',
                    details: errors.array()
                });
            }
            const user = req.user;
            const { page = 1, limit = 10, status, course_id, student_id, start_date, end_date, sort_by = 'created_at', sort_order = 'DESC' } = req.query;
            const whereClause = {};
            if (status) {
                whereClause.status = status;
            }
            if (course_id) {
                whereClause.course_id = course_id;
            }
            if (student_id) {
                whereClause.student_id = student_id;
            }
            if (user.role === 'student') {
                whereClause.student_id = user.id;
            }
            else if (user.role === 'teacher') {
                const teacherCourses = await Course_1.default.findAll({
                    where: { teacher_id: user.id },
                    attributes: ['id']
                });
                const courseIds = teacherCourses.map(c => c.id);
                whereClause.course_id = { [sequelize_1.Op.in]: courseIds };
            }
            if (start_date || end_date) {
                whereClause.appeal_time = {};
                if (start_date)
                    whereClause.appeal_time[sequelize_1.Op.gte] = new Date(start_date);
                if (end_date)
                    whereClause.appeal_time[sequelize_1.Op.lte] = new Date(end_date);
            }
            const offset = (Number(page) - 1) * Number(limit);
            const order = [[sort_by, sort_order]];
            const { count, rows: appeals } = await Appeal_1.default.findAndCountAll({
                where: whereClause,
                include: [
                    {
                        model: Student_1.default,
                        as: 'student',
                        include: [{
                                model: User_1.default,
                                as: 'user',
                                attributes: ['id', 'username', 'email', 'full_name']
                            }]
                    },
                    {
                        model: Course_1.default,
                        as: 'course',
                        attributes: ['id', 'course_name', 'course_code']
                    },
                    {
                        model: User_1.default,
                        as: 'reviewer',
                        attributes: ['id', 'username', 'full_name']
                    }
                ],
                order,
                limit: Number(limit),
                offset
            });
            return res.status(200).json({
                success: true,
                data: {
                    appeals,
                    pagination: {
                        page: Number(page),
                        limit: Number(limit),
                        total: count,
                        total_pages: Math.ceil(count / Number(limit))
                    }
                },
                message: 'Appeals retrieved successfully'
            });
        }
        catch (error) {
            console.error('Get all appeals error:', error);
            return res.status(500).json({
                success: false,
                error: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to retrieve appeals'
            });
        }
    }
];
exports.getAppealById = [
    (0, express_validator_2.param)('id').notEmpty().withMessage('Appeal ID is required'),
    async (req, res) => {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    error: 'VALIDATION_ERROR',
                    message: 'Validation failed',
                    details: errors.array()
                });
            }
            const { id } = req.params;
            const user = req.user;
            const appeal = await Appeal_1.default.findByPk(id, {
                include: [
                    {
                        model: Student_1.default,
                        as: 'student',
                        include: [{
                                model: User_1.default,
                                as: 'user',
                                attributes: ['id', 'username', 'email', 'full_name', 'avatar_url']
                            }]
                    },
                    {
                        model: Course_1.default,
                        as: 'course'
                    },
                    {
                        model: User_1.default,
                        as: 'reviewer',
                        attributes: ['id', 'username', 'full_name']
                    }
                ]
            });
            if (!appeal) {
                return res.status(404).json({
                    success: false,
                    error: 'NOT_FOUND',
                    message: 'Appeal not found'
                });
            }
            if (user.role === 'student' && appeal.student_id !== user.id) {
                return res.status(403).json({
                    success: false,
                    error: 'FORBIDDEN',
                    message: 'Access denied'
                });
            }
            if (user.role === 'teacher') {
                const isTeachingCourse = await Course_1.default.findOne({
                    where: { id: appeal.course_id, teacher_id: user.id }
                });
                if (!isTeachingCourse && user.role !== 'admin') {
                    return res.status(403).json({
                        success: false,
                        error: 'FORBIDDEN',
                        message: 'Access denied'
                    });
                }
            }
            return res.status(200).json({
                success: true,
                data: appeal,
                message: 'Appeal retrieved successfully'
            });
        }
        catch (error) {
            console.error('Get appeal by ID error:', error);
            return res.status(500).json({
                success: false,
                error: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to retrieve appeal'
            });
        }
    }
];
exports.getMyAppeals = [
    (0, express_validator_2.query)('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    (0, express_validator_2.query)('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    (0, express_validator_2.query)('status').optional().isIn(['pending', 'reviewing', 'approved', 'rejected', 'closed']).withMessage('Invalid status'),
    async (req, res) => {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    error: 'VALIDATION_ERROR',
                    message: 'Validation failed',
                    details: errors.array()
                });
            }
            const user = req.user;
            const { page = 1, limit = 10, status } = req.query;
            const whereClause = { student_id: user.id };
            if (status)
                whereClause.status = status;
            const offset = (Number(page) - 1) * Number(limit);
            const { count, rows: appeals } = await Appeal_1.default.findAndCountAll({
                where: whereClause,
                include: [
                    {
                        model: Course_1.default,
                        as: 'course',
                        attributes: ['id', 'course_name', 'course_code']
                    },
                    {
                        model: User_1.default,
                        as: 'reviewer',
                        attributes: ['id', 'username', 'full_name']
                    }
                ],
                order: [['created_at', 'DESC']],
                limit: Number(limit),
                offset
            });
            return res.status(200).json({
                success: true,
                data: {
                    appeals,
                    pagination: {
                        page: Number(page),
                        limit: Number(limit),
                        total: count,
                        total_pages: Math.ceil(count / Number(limit))
                    }
                },
                message: 'Student appeals retrieved successfully'
            });
        }
        catch (error) {
            console.error('Get my appeals error:', error);
            return res.status(500).json({
                success: false,
                error: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to retrieve appeals'
            });
        }
    }
];
exports.createAppeal = [
    (0, express_validator_2.body)('course_id').notEmpty().withMessage('Course ID is required').isUUID().withMessage('Invalid course ID'),
    (0, express_validator_2.body)('original_score').optional().isFloat({ min: 0, max: 100 }).withMessage('Original score must be between 0 and 100'),
    (0, express_validator_2.body)('appeal_reason').notEmpty().withMessage('Appeal reason is required').isLength({ min: 10, max: 2000 }).withMessage('Appeal reason must be between 10 and 2000 characters'),
    (0, express_validator_2.body)('attachments').optional().isArray().withMessage('Attachments must be an array'),
    async (req, res) => {
        const transaction = await database_1.default.transaction();
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    error: 'VALIDATION_ERROR',
                    message: 'Validation failed',
                    details: errors.array()
                });
            }
            const user = req.user;
            const { course_id, original_score, appeal_reason, attachments } = req.body;
            if (user.role !== 'student') {
                return res.status(403).json({
                    success: false,
                    error: 'FORBIDDEN',
                    message: 'Only students can create appeals'
                });
            }
            const course = await Course_1.default.findByPk(course_id);
            if (!course) {
                return res.status(404).json({
                    success: false,
                    error: 'NOT_FOUND',
                    message: 'Course not found'
                });
            }
            const existingAppeal = await Appeal_1.default.findOne({
                where: {
                    student_id: user.id,
                    course_id,
                    status: { [sequelize_1.Op.in]: ['pending', 'reviewing'] }
                }
            });
            if (existingAppeal) {
                return res.status(400).json({
                    success: false,
                    error: 'DUPLICATE_APPEAL',
                    message: 'You already have an active appeal for this course'
                });
            }
            const grade = await Grade_1.default.findOne({
                where: {
                    student_id: user.id,
                    course_id
                }
            });
            const appeal = await Appeal_1.default.create({
                student_id: user.id,
                course_id,
                original_score: original_score || grade?.score || null,
                appeal_reason,
                attachments: attachments || null,
                status: 'pending',
                appeal_time: new Date()
            }, { transaction });
            await transaction.commit();
            const createdAppeal = await Appeal_1.default.findByPk(appeal.id, {
                include: [
                    {
                        model: Student_1.default,
                        as: 'student',
                        include: [{
                                model: User_1.default,
                                as: 'user',
                                attributes: ['id', 'username', 'full_name']
                            }]
                    },
                    {
                        model: Course_1.default,
                        as: 'course',
                        attributes: ['id', 'course_name', 'course_code']
                    }
                ]
            });
            return res.status(201).json({
                success: true,
                data: createdAppeal,
                message: 'Appeal created successfully'
            });
        }
        catch (error) {
            await transaction.rollback();
            console.error('Create appeal error:', error);
            return res.status(500).json({
                success: false,
                error: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to create appeal'
            });
        }
    }
];
exports.updateAppealStatus = [
    (0, express_validator_2.param)('id').notEmpty().withMessage('Appeal ID is required'),
    (0, express_validator_2.body)('status').notEmpty().withMessage('Status is required').isIn(['reviewing', 'approved', 'rejected', 'closed']).withMessage('Invalid status'),
    (0, express_validator_2.body)('new_score').optional().isFloat({ min: 0, max: 100 }).withMessage('New score must be between 0 and 100'),
    (0, express_validator_2.body)('review_feedback').optional().isLength({ max: 2000 }).withMessage('Feedback cannot exceed 2000 characters'),
    async (req, res) => {
        const transaction = await database_1.default.transaction();
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    error: 'VALIDATION_ERROR',
                    message: 'Validation failed',
                    details: errors.array()
                });
            }
            const user = req.user;
            const { id } = req.params;
            const { status, new_score, review_feedback } = req.body;
            if (user.role === 'student') {
                return res.status(403).json({
                    success: false,
                    error: 'FORBIDDEN',
                    message: 'Students cannot update appeal status'
                });
            }
            const appeal = await Appeal_1.default.findByPk(id);
            if (!appeal) {
                return res.status(404).json({
                    success: false,
                    error: 'NOT_FOUND',
                    message: 'Appeal not found'
                });
            }
            if (user.role === 'teacher') {
                const course = await Course_1.default.findOne({
                    where: { id: appeal.course_id, teacher_id: user.id }
                });
                if (!course) {
                    return res.status(403).json({
                        success: false,
                        error: 'FORBIDDEN',
                        message: 'You can only review appeals for your own courses'
                    });
                }
            }
            if (appeal.status === 'closed' || appeal.status === 'approved' || appeal.status === 'rejected') {
                return res.status(400).json({
                    success: false,
                    error: 'INVALID_STATUS',
                    message: 'Cannot update a closed or finalized appeal'
                });
            }
            const updateData = {
                status,
                reviewed_by: user.id,
                reviewed_time: new Date()
            };
            if (review_feedback) {
                updateData.review_feedback = review_feedback;
            }
            if (status === 'approved' && new_score !== undefined) {
                updateData.new_score = new_score;
                await Grade_1.default.update({
                    score: new_score,
                    feedback: review_feedback || `Appeal approved. ${appeal.appeal_reason}`,
                    updated_at: new Date()
                }, {
                    where: {
                        student_id: appeal.student_id,
                        course_id: appeal.course_id
                    },
                    transaction
                });
            }
            else if (status === 'rejected' && review_feedback) {
                updateData.review_feedback = review_feedback;
            }
            await appeal.update(updateData, { transaction });
            await transaction.commit();
            const updatedAppeal = await Appeal_1.default.findByPk(id, {
                include: [
                    {
                        model: Student_1.default,
                        as: 'student',
                        include: [{
                                model: User_1.default,
                                as: 'user',
                                attributes: ['id', 'username', 'full_name']
                            }]
                    },
                    {
                        model: Course_1.default,
                        as: 'course'
                    },
                    {
                        model: User_1.default,
                        as: 'reviewer',
                        attributes: ['id', 'username', 'full_name']
                    }
                ]
            });
            return res.status(200).json({
                success: true,
                data: updatedAppeal,
                message: 'Appeal status updated successfully'
            });
        }
        catch (error) {
            await transaction.rollback();
            console.error('Update appeal status error:', error);
            return res.status(500).json({
                success: false,
                error: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to update appeal status'
            });
        }
    }
];
exports.deleteAppeal = [
    (0, express_validator_2.param)('id').notEmpty().withMessage('Appeal ID is required'),
    async (req, res) => {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    error: 'VALIDATION_ERROR',
                    message: 'Validation failed',
                    details: errors.array()
                });
            }
            const { id } = req.params;
            const user = req.user;
            const appeal = await Appeal_1.default.findByPk(id);
            if (!appeal) {
                return res.status(404).json({
                    success: false,
                    error: 'NOT_FOUND',
                    message: 'Appeal not found'
                });
            }
            if (user.role === 'student') {
                if (appeal.student_id !== user.id) {
                    return res.status(403).json({
                        success: false,
                        error: 'FORBIDDEN',
                        message: 'Access denied'
                    });
                }
                if (appeal.status !== 'pending') {
                    return res.status(400).json({
                        success: false,
                        error: 'INVALID_STATUS',
                        message: 'Can only delete pending appeals'
                    });
                }
            }
            await appeal.destroy();
            return res.status(200).json({
                success: true,
                message: 'Appeal deleted successfully'
            });
        }
        catch (error) {
            console.error('Delete appeal error:', error);
            return res.status(500).json({
                success: false,
                error: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to delete appeal'
            });
        }
    }
];
exports.getAppealStatistics = [
    (0, express_validator_2.query)('course_id').optional().isUUID().withMessage('Invalid course ID'),
    (0, express_validator_2.query)('start_date').optional().isDate().withMessage('Invalid start date'),
    (0, express_validator_2.query)('end_date').optional().isDate().withMessage('Invalid end date'),
    async (req, res) => {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    error: 'VALIDATION_ERROR',
                    message: 'Validation failed',
                    details: errors.array()
                });
            }
            const user = req.user;
            const { course_id, start_date, end_date } = req.query;
            const whereClause = {};
            if (course_id)
                whereClause.course_id = course_id;
            if (start_date || end_date) {
                whereClause.created_at = {};
                if (start_date)
                    whereClause.created_at[sequelize_1.Op.gte] = new Date(start_date);
                if (end_date)
                    whereClause.created_at[sequelize_1.Op.lte] = new Date(end_date);
            }
            if (user.role === 'teacher') {
                const teacherCourses = await Course_1.default.findAll({
                    where: { teacher_id: user.id },
                    attributes: ['id']
                });
                const courseIds = teacherCourses.map(c => c.id);
                if (whereClause.course_id) {
                    if (!courseIds.includes(whereClause.course_id)) {
                        return res.status(403).json({
                            success: false,
                            error: 'FORBIDDEN',
                            message: 'Access denied to this course'
                        });
                    }
                }
                else {
                    whereClause.course_id = { [sequelize_1.Op.in]: courseIds };
                }
            }
            const totalAppeals = await Appeal_1.default.count({ where: whereClause });
            const statusCounts = await Appeal_1.default.findAll({
                where: whereClause,
                attributes: [
                    'status',
                    [database_1.default.fn('COUNT', database_1.default.col('id')), 'count']
                ],
                group: ['status'],
                raw: true
            });
            const pendingAppeals = await Appeal_1.default.count({
                where: {
                    ...whereClause,
                    status: 'pending'
                }
            });
            const resolvedAppeals = await Appeal_1.default.count({
                where: {
                    ...whereClause,
                    status: { [sequelize_1.Op.in]: ['approved', 'rejected', 'closed'] }
                }
            });
            const avgResolutionTime = await Appeal_1.default.findAll({
                where: {
                    ...whereClause,
                    status: { [sequelize_1.Op.in]: ['approved', 'rejected', 'closed'] },
                    reviewed_time: { [sequelize_1.Op.ne]: null }
                },
                attributes: [
                    [
                        database_1.default.fn('AVG', database_1.default.fn('DATEDIFF', database_1.default.col('reviewed_time'), database_1.default.col('appeal_time'))),
                        'avg_days'
                    ]
                ],
                raw: true
            });
            const recentAppeals = await Appeal_1.default.findAll({
                where: whereClause,
                include: [
                    {
                        model: Course_1.default,
                        as: 'course',
                        attributes: ['id', 'course_name']
                    },
                    {
                        model: Student_1.default,
                        as: 'student',
                        include: [{
                                model: User_1.default,
                                as: 'user',
                                attributes: ['id', 'username', 'full_name']
                            }]
                    }
                ],
                order: [['created_at', 'DESC']],
                limit: 5
            });
            const statusDistribution = statusCounts.reduce((acc, item) => {
                acc[item.status] = parseInt(item.count);
                return acc;
            }, {});
            return res.status(200).json({
                success: true,
                data: {
                    overview: {
                        total_appeals: totalAppeals,
                        pending_appeals: pendingAppeals,
                        resolved_appeals: resolvedAppeals,
                        resolution_rate: totalAppeals > 0 ? (resolvedAppeals / totalAppeals * 100).toFixed(2) : 0,
                        avg_resolution_days: avgResolutionTime[0]?.avg_days || 0
                    },
                    status_distribution: statusDistribution,
                    recent_appeals: recentAppeals
                },
                message: 'Appeal statistics retrieved successfully'
            });
        }
        catch (error) {
            console.error('Get appeal statistics error:', error);
            return res.status(500).json({
                success: false,
                error: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to retrieve appeal statistics'
            });
        }
    }
];
exports.getCourseAppeals = [
    (0, express_validator_2.param)('courseId').notEmpty().withMessage('Course ID is required'),
    (0, express_validator_2.query)('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    (0, express_validator_2.query)('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    (0, express_validator_2.query)('status').optional().isIn(['pending', 'reviewing', 'approved', 'rejected', 'closed']).withMessage('Invalid status'),
    async (req, res) => {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    error: 'VALIDATION_ERROR',
                    message: 'Validation failed',
                    details: errors.array()
                });
            }
            const { courseId } = req.params;
            const user = req.user;
            const { page = 1, limit = 10, status } = req.query;
            if (user.role === 'teacher') {
                const course = await Course_1.default.findOne({
                    where: { id: courseId, teacher_id: user.id }
                });
                if (!course) {
                    return res.status(403).json({
                        success: false,
                        error: 'FORBIDDEN',
                        message: 'You can only view appeals for your own courses'
                    });
                }
            }
            const whereClause = { course_id: courseId };
            if (status)
                whereClause.status = status;
            const offset = (Number(page) - 1) * Number(limit);
            const { count, rows: appeals } = await Appeal_1.default.findAndCountAll({
                where: whereClause,
                include: [
                    {
                        model: Student_1.default,
                        as: 'student',
                        include: [{
                                model: User_1.default,
                                as: 'user',
                                attributes: ['id', 'username', 'full_name', 'email']
                            }]
                    }
                ],
                order: [['created_at', 'DESC']],
                limit: Number(limit),
                offset
            });
            return res.status(200).json({
                success: true,
                data: {
                    appeals,
                    pagination: {
                        page: Number(page),
                        limit: Number(limit),
                        total: count,
                        total_pages: Math.ceil(count / Number(limit))
                    }
                },
                message: 'Course appeals retrieved successfully'
            });
        }
        catch (error) {
            console.error('Get course appeals error:', error);
            return res.status(500).json({
                success: false,
                error: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to retrieve course appeals'
            });
        }
    }
];
