"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStudent = exports.updateStudent = exports.createStudent = exports.getCurrentStudent = exports.getStudentById = exports.getAllStudents = void 0;
const express_validator_1 = require("express-validator");
const Student_1 = __importDefault(require("../models/Student"));
const User_1 = __importDefault(require("../models/User"));
const password_1 = require("../utils/password");
// Get all students
const getAllStudents = async (req, res) => {
    try {
        const { page = 1, limit = 10, college, major, status } = req.query;
        const where = {};
        if (college)
            where.college = college;
        if (major)
            where.major = major;
        if (status)
            where.status = status;
        const offset = (Number(page) - 1) * Number(limit);
        const students = await Student_1.default.findAndCountAll({
            where,
            limit: Number(limit),
            offset,
            include: [{
                    model: User_1.default,
                    as: 'user',
                    attributes: ['username', 'email', 'avatar_url']
                }],
            order: [['created_at', 'DESC']]
        });
        return res.status(200).json({
            success: true,
            data: {
                students: students.rows,
                total: students.count,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(students.count / Number(limit))
            },
            message: 'Students retrieved successfully'
        });
    }
    catch (error) {
        console.error('Get all students error:', error);
        return res.status(500).json({
            success: false,
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to retrieve students'
        });
    }
};
exports.getAllStudents = getAllStudents;
// Get student by ID
const getStudentById = async (req, res) => {
    try {
        const { id } = req.params;
        const student = await Student_1.default.findByPk(id, {
            include: [{
                    model: User_1.default,
                    as: 'user',
                    attributes: ['username', 'email', 'avatar_url']
                }]
        });
        if (!student) {
            return res.status(404).json({
                success: false,
                error: 'NOT_FOUND',
                message: 'Student not found'
            });
        }
        return res.status(200).json({
            success: true,
            data: student,
            message: 'Student retrieved successfully'
        });
    }
    catch (error) {
        console.error('Get student by ID error:', error);
        return res.status(500).json({
            success: false,
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to retrieve student'
        });
    }
};
exports.getStudentById = getStudentById;
// Get current student information (for logged in student)
const getCurrentStudent = async (req, res) => {
    try {
        const user = req.user;
        if (!user || user.role !== 'student') {
            return res.status(403).json({
                success: false,
                error: 'AUTHORIZATION_FAILED',
                message: 'Not authorized to access this resource'
            });
        }
        const student = await Student_1.default.findOne({
            where: { user_id: user.id },
            include: [{
                    model: User_1.default,
                    as: 'user',
                    attributes: ['username', 'email', 'avatar_url']
                }]
        });
        if (!student) {
            return res.status(404).json({
                success: false,
                error: 'NOT_FOUND',
                message: 'Student information not found'
            });
        }
        return res.status(200).json({
            success: true,
            data: student,
            message: 'Student information retrieved successfully'
        });
    }
    catch (error) {
        console.error('Get current student error:', error);
        return res.status(500).json({
            success: false,
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to retrieve student information'
        });
    }
};
exports.getCurrentStudent = getCurrentStudent;
// Create student
const createStudent = async (req, res) => {
    try {
        // Validate request
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'VALIDATION_ERROR',
                message: 'Validation failed',
                details: errors.array()
            });
        }
        const { student_id, name, username, email, password, gender, date_of_birth, college, major, phone, home_address, admission_date } = req.body;
        // Create user first
        const hashedPassword = await (0, password_1.hashPassword)(password);
        const user = await User_1.default.create({
            username,
            email,
            password_hash: hashedPassword,
            role: 'student',
            status: 'active'
        });
        // Create student
        const student = await Student_1.default.create({
            user_id: user.id,
            student_id,
            name,
            gender,
            date_of_birth,
            college,
            major,
            phone,
            home_address,
            admission_date,
            status: 'active'
        });
        return res.status(201).json({
            success: true,
            data: {
                student,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                }
            },
            message: 'Student created successfully'
        });
    }
    catch (error) {
        console.error('Create student error:', error);
        return res.status(500).json({
            success: false,
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to create student'
        });
    }
};
exports.createStudent = createStudent;
// Update student
const updateStudent = async (req, res) => {
    try {
        // Validate request
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
        // Remove user-related fields from update data
        const { username, email, password, ...studentUpdateData } = updateData;
        // Update student
        const [updated] = await Student_1.default.update(studentUpdateData, {
            where: { id }
        });
        if (!updated) {
            return res.status(404).json({
                success: false,
                error: 'NOT_FOUND',
                message: 'Student not found'
            });
        }
        // Update user if needed
        if (username || email || password) {
            const student = await Student_1.default.findByPk(id);
            if (student) {
                const userUpdateData = {};
                if (username)
                    userUpdateData.username = username;
                if (email)
                    userUpdateData.email = email;
                if (password)
                    userUpdateData.password_hash = await (0, password_1.hashPassword)(password);
                await User_1.default.update(userUpdateData, {
                    where: { id: student.user_id }
                });
            }
        }
        // Get updated student
        const updatedStudent = await Student_1.default.findByPk(id, {
            include: [{
                    model: User_1.default,
                    as: 'user',
                    attributes: ['username', 'email', 'avatar_url']
                }]
        });
        return res.status(200).json({
            success: true,
            data: updatedStudent,
            message: 'Student updated successfully'
        });
    }
    catch (error) {
        console.error('Update student error:', error);
        return res.status(500).json({
            success: false,
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to update student'
        });
    }
};
exports.updateStudent = updateStudent;
// Delete student
const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;
        // Find student first to get user_id
        const student = await Student_1.default.findByPk(id);
        if (!student) {
            return res.status(404).json({
                success: false,
                error: 'NOT_FOUND',
                message: 'Student not found'
            });
        }
        // Delete student (will cascade to user due to onDelete: 'CASCADE' in model)
        await Student_1.default.destroy({
            where: { id }
        });
        return res.status(200).json({
            success: true,
            message: 'Student deleted successfully'
        });
    }
    catch (error) {
        console.error('Delete student error:', error);
        return res.status(500).json({
            success: false,
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to delete student'
        });
    }
};
exports.deleteStudent = deleteStudent;
