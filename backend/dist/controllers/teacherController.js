"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTeacherProfile = exports.deleteTeacher = exports.updateTeacher = exports.createTeacher = exports.getTeacherStatistics = exports.getTeacherWithCourses = exports.getCurrentTeacher = exports.getTeacherById = exports.getAllTeachers = void 0;
const express_validator_1 = require("express-validator");
const sequelize_1 = require("sequelize");
const Teacher_1 = __importDefault(require("../models/Teacher"));
const Course_1 = __importDefault(require("../models/Course"));
const User_1 = __importDefault(require("../models/User"));
const password_1 = require("../utils/password");
const getAllTeachers = async (req, res) => {
    try {
        const { page = 1, limit = 10, department, title, status } = req.query;
        const whereClause = {};
        if (department)
            whereClause.department = department;
        if (title)
            whereClause.title = title;
        const offset = (Number(page) - 1) * Number(limit);
        const teachers = await Teacher_1.default.findAndCountAll({
            where: whereClause,
            limit: Number(limit),
            offset,
            include: [{
                    model: User_1.default,
                    as: 'user',
                    attributes: ['username', 'email', 'avatar_url', 'status']
                }],
            order: [['created_at', 'DESC']]
        });
        return res.status(200).json({
            success: true,
            data: {
                teachers: teachers.rows,
                total: teachers.count,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(teachers.count / Number(limit))
            },
            message: 'Teachers retrieved successfully'
        });
    }
    catch (error) {
        console.error('Get all teachers error:', error);
        return res.status(500).json({
            success: false,
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to retrieve teachers'
        });
    }
};
exports.getAllTeachers = getAllTeachers;
const getTeacherById = async (req, res) => {
    try {
        const { id } = req.params;
        const teacher = await Teacher_1.default.findByPk(id, {
            include: [{
                    model: User_1.default,
                    as: 'user',
                    attributes: ['username', 'email', 'avatar_url', 'status']
                }]
        });
        if (!teacher) {
            return res.status(404).json({
                success: false,
                error: 'NOT_FOUND',
                message: 'Teacher not found'
            });
        }
        return res.status(200).json({
            success: true,
            data: teacher,
            message: 'Teacher retrieved successfully'
        });
    }
    catch (error) {
        console.error('Get teacher by ID error:', error);
        return res.status(500).json({
            success: false,
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to retrieve teacher'
        });
    }
};
exports.getTeacherById = getTeacherById;
const getCurrentTeacher = async (req, res) => {
    try {
        const user = req.user;
        if (!user || user.role !== 'teacher') {
            return res.status(403).json({
                success: false,
                error: 'AUTHORIZATION_FAILED',
                message: 'Not authorized to access this resource'
            });
        }
        const teacher = await Teacher_1.default.findOne({
            where: { user_id: user.id },
            include: [{
                    model: User_1.default,
                    as: 'user',
                    attributes: ['username', 'email', 'avatar_url', 'status']
                }]
        });
        if (!teacher) {
            return res.status(404).json({
                success: false,
                error: 'NOT_FOUND',
                message: 'Teacher information not found'
            });
        }
        return res.status(200).json({
            success: true,
            data: teacher,
            message: 'Teacher information retrieved successfully'
        });
    }
    catch (error) {
        console.error('Get current teacher error:', error);
        return res.status(500).json({
            success: false,
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to retrieve teacher information'
        });
    }
};
exports.getCurrentTeacher = getCurrentTeacher;
const getTeacherWithCourses = async (req, res) => {
    try {
        const { id } = req.params;
        const { semester } = req.query;
        const teacher = await Teacher_1.default.findByPk(id, {
            include: [{
                    model: User_1.default,
                    as: 'user',
                    attributes: ['username', 'email']
                }]
        });
        if (!teacher) {
            return res.status(404).json({
                success: false,
                error: 'NOT_FOUND',
                message: 'Teacher not found'
            });
        }
        const courseWhereClause = { teacher_id: id };
        if (semester)
            courseWhereClause.semester = semester;
        const courses = await Course_1.default.findAll({
            where: courseWhereClause,
            order: [['created_at', 'DESC']]
        });
        return res.status(200).json({
            success: true,
            data: {
                teacher,
                courses
            },
            message: 'Teacher and courses retrieved successfully'
        });
    }
    catch (error) {
        console.error('Get teacher with courses error:', error);
        return res.status(500).json({
            success: false,
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to retrieve teacher courses'
        });
    }
};
exports.getTeacherWithCourses = getTeacherWithCourses;
const getTeacherStatistics = async (req, res) => {
    try {
        const { id } = req.params;
        const teacher = await Teacher_1.default.findByPk(id);
        if (!teacher) {
            return res.status(404).json({
                success: false,
                error: 'NOT_FOUND',
                message: 'Teacher not found'
            });
        }
        const courses = await Course_1.default.findAll({
            where: { teacher_id: id }
        });
        const totalCourses = courses.length;
        const totalStudents = courses.reduce((sum, course) => sum + course.enrolled_count, 0);
        const courseIds = courses.map(c => c.id);
        return res.status(200).json({
            success: true,
            data: {
                teacher: {
                    id: teacher.id,
                    teacher_id: teacher.teacher_id,
                    name: teacher.name,
                    department: teacher.department,
                    title: teacher.title
                },
                statistics: {
                    totalCourses,
                    totalStudents,
                    averageStudentsPerCourse: totalCourses > 0 ? Math.round(totalStudents / totalCourses) : 0
                }
            },
            message: 'Teacher statistics retrieved successfully'
        });
    }
    catch (error) {
        console.error('Get teacher statistics error:', error);
        return res.status(500).json({
            success: false,
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to retrieve teacher statistics'
        });
    }
};
exports.getTeacherStatistics = getTeacherStatistics;
const createTeacher = async (req, res) => {
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
        const { teacher_id, name, username, email, password, gender, department, title, phone, research_area, education, years_of_service } = req.body;
        const existingUser = await User_1.default.findOne({
            where: {
                [sequelize_1.Op.or]: [{ username }, { email }]
            }
        });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: 'DUPLICATE_ENTRY',
                message: 'Username or email already exists'
            });
        }
        const hashedPassword = await (0, password_1.hashPassword)(password);
        const user = await User_1.default.create({
            username,
            email,
            password_hash: hashedPassword,
            role: 'teacher',
            status: 'active'
        });
        const teacher = await Teacher_1.default.create({
            user_id: user.id,
            teacher_id,
            name,
            gender,
            department,
            title,
            phone,
            research_area,
            education,
            years_of_service
        });
        const createdTeacher = await Teacher_1.default.findByPk(teacher.id, {
            include: [{
                    model: User_1.default,
                    as: 'user',
                    attributes: ['username', 'email']
                }]
        });
        return res.status(201).json({
            success: true,
            data: createdTeacher,
            message: 'Teacher created successfully'
        });
    }
    catch (error) {
        console.error('Create teacher error:', error);
        return res.status(500).json({
            success: false,
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to create teacher'
        });
    }
};
exports.createTeacher = createTeacher;
const updateTeacher = async (req, res) => {
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
        const updateData = req.body;
        const teacher = await Teacher_1.default.findByPk(id);
        if (!teacher) {
            return res.status(404).json({
                success: false,
                error: 'NOT_FOUND',
                message: 'Teacher not found'
            });
        }
        await Teacher_1.default.update(updateData, {
            where: { id }
        });
        const updatedTeacher = await Teacher_1.default.findByPk(id, {
            include: [{
                    model: User_1.default,
                    as: 'user',
                    attributes: ['username', 'email', 'avatar_url']
                }]
        });
        return res.status(200).json({
            success: true,
            data: updatedTeacher,
            message: 'Teacher updated successfully'
        });
    }
    catch (error) {
        console.error('Update teacher error:', error);
        return res.status(500).json({
            success: false,
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to update teacher'
        });
    }
};
exports.updateTeacher = updateTeacher;
const deleteTeacher = async (req, res) => {
    try {
        const { id } = req.params;
        const teacher = await Teacher_1.default.findByPk(id);
        if (!teacher) {
            return res.status(404).json({
                success: false,
                error: 'NOT_FOUND',
                message: 'Teacher not found'
            });
        }
        const activeCourses = await Course_1.default.count({
            where: { teacher_id: id, status: 'active' }
        });
        if (activeCourses > 0) {
            return res.status(400).json({
                success: false,
                error: 'CONSTRAINT_VIOLATION',
                message: 'Cannot delete teacher with active courses. Please reassign or deactivate courses first.'
            });
        }
        await Teacher_1.default.destroy({
            where: { id }
        });
        return res.status(200).json({
            success: true,
            message: 'Teacher deleted successfully'
        });
    }
    catch (error) {
        console.error('Delete teacher error:', error);
        return res.status(500).json({
            success: false,
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to delete teacher'
        });
    }
};
exports.deleteTeacher = deleteTeacher;
const updateTeacherProfile = async (req, res) => {
    try {
        const user = req.user;
        if (!user || user.role !== 'teacher') {
            return res.status(403).json({
                success: false,
                error: 'AUTHORIZATION_FAILED',
                message: 'Not authorized to access this resource'
            });
        }
        const teacher = await Teacher_1.default.findOne({
            where: { user_id: user.id }
        });
        if (!teacher) {
            return res.status(404).json({
                success: false,
                error: 'NOT_FOUND',
                message: 'Teacher information not found'
            });
        }
        const { phone, research_area, education } = req.body;
        await Teacher_1.default.update({
            phone,
            research_area,
            education
        }, {
            where: { id: teacher.id }
        });
        const updatedTeacher = await Teacher_1.default.findByPk(teacher.id, {
            include: [{
                    model: User_1.default,
                    as: 'user',
                    attributes: ['username', 'email', 'avatar_url']
                }]
        });
        return res.status(200).json({
            success: true,
            data: updatedTeacher,
            message: 'Profile updated successfully'
        });
    }
    catch (error) {
        console.error('Update teacher profile error:', error);
        return res.status(500).json({
            success: false,
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to update profile'
        });
    }
};
exports.updateTeacherProfile = updateTeacherProfile;
exports.default = {
    getAllTeachers: exports.getAllTeachers,
    getTeacherById: exports.getTeacherById,
    getCurrentTeacher: exports.getCurrentTeacher,
    getTeacherWithCourses: exports.getTeacherWithCourses,
    getTeacherStatistics: exports.getTeacherStatistics,
    createTeacher: exports.createTeacher,
    updateTeacher: exports.updateTeacher,
    deleteTeacher: exports.deleteTeacher,
    updateTeacherProfile: exports.updateTeacherProfile
};
