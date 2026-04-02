"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStudentRankings = exports.getCourseStatistics = exports.getGradeStatistics = exports.deleteGrade = exports.batchUpdateGrades = exports.updateGrade = exports.createGrade = exports.getTeacherCourseGrades = exports.getStudentGrades = exports.getGradesByCourse = exports.getGradesByStudent = exports.getGradeById = exports.getAllGrades = void 0;
const express_validator_1 = require("express-validator");
const sequelize_1 = require("sequelize");
const Grade_1 = __importDefault(require("../models/Grade"));
const Student_1 = __importDefault(require("../models/Student"));
const Teacher_1 = __importDefault(require("../models/Teacher"));
const Course_1 = __importDefault(require("../models/Course"));
const getAllGrades = async (req, res) => {
    try {
        const { page = 1, limit = 10, student_id, course_id, status, min_score, max_score, grade_level, semester } = req.query;
        const whereClause = {};
        if (student_id)
            whereClause.student_id = student_id;
        if (course_id)
            whereClause.course_id = course_id;
        if (status)
            whereClause.submission_status = status;
        if (grade_level)
            whereClause.grade_level = grade_level;
        if (min_score !== undefined || max_score !== undefined) {
            whereClause.score = {};
            if (min_score !== undefined)
                whereClause.score[sequelize_1.Op.gte] = Number(min_score);
            if (max_score !== undefined)
                whereClause.score[sequelize_1.Op.lte] = Number(max_score);
        }
        let courseWhereClause = {};
        if (semester)
            courseWhereClause.semester = semester;
        const offset = (Number(page) - 1) * Number(limit);
        const grades = await Grade_1.default.findAndCountAll({
            where: whereClause,
            limit: Number(limit),
            offset,
            include: [
                {
                    model: Student_1.default,
                    as: 'student',
                    attributes: ['id', 'student_id', 'name', 'college', 'major']
                },
                {
                    model: Course_1.default,
                    as: 'course',
                    where: courseWhereClause,
                    attributes: ['id', 'course_id', 'course_name', 'credits', 'semester']
                }
            ],
            order: [['created_at', 'DESC']]
        });
        return res.status(200).json({
            success: true,
            data: {
                grades: grades.rows,
                total: grades.count,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(grades.count / Number(limit))
            },
            message: 'Grades retrieved successfully'
        });
    }
    catch (error) {
        console.error('Get all grades error:', error);
        return res.status(500).json({
            success: false,
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to retrieve grades'
        });
    }
};
exports.getAllGrades = getAllGrades;
const getGradeById = async (req, res) => {
    try {
        const { id } = req.params;
        const grade = await Grade_1.default.findByPk(id, {
            include: [
                {
                    model: Student_1.default,
                    as: 'student',
                    attributes: ['id', 'student_id', 'name', 'college', 'major']
                },
                {
                    model: Course_1.default,
                    as: 'course',
                    attributes: ['id', 'course_id', 'course_name', 'credits', 'semester']
                }
            ]
        });
        if (!grade) {
            return res.status(404).json({
                success: false,
                error: 'NOT_FOUND',
                message: 'Grade not found'
            });
        }
        return res.status(200).json({
            success: true,
            data: grade,
            message: 'Grade retrieved successfully'
        });
    }
    catch (error) {
        console.error('Get grade by ID error:', error);
        return res.status(500).json({
            success: false,
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to retrieve grade'
        });
    }
};
exports.getGradeById = getGradeById;
const getGradesByStudent = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { semester } = req.query;
        const student = await Student_1.default.findByPk(studentId);
        if (!student) {
            return res.status(404).json({
                success: false,
                error: 'NOT_FOUND',
                message: 'Student not found'
            });
        }
        const whereClause = { student_id: studentId };
        if (semester) {
            const courses = await Course_1.default.findAll({
                where: { semester: semester },
                attributes: ['id']
            });
            const courseIds = courses.map(c => c.id);
            whereClause.course_id = { [sequelize_1.Op.in]: courseIds };
        }
        const grades = await Grade_1.default.findAll({
            where: whereClause,
            include: [
                {
                    model: Student_1.default,
                    as: 'student',
                    attributes: ['id', 'student_id', 'name']
                },
                {
                    model: Course_1.default,
                    as: 'course',
                    attributes: ['id', 'course_id', 'course_name', 'credits', 'semester']
                }
            ],
            order: [['created_at', 'DESC']]
        });
        return res.status(200).json({
            success: true,
            data: grades,
            message: 'Student grades retrieved successfully'
        });
    }
    catch (error) {
        console.error('Get grades by student error:', error);
        return res.status(500).json({
            success: false,
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to retrieve student grades'
        });
    }
};
exports.getGradesByStudent = getGradesByStudent;
const getGradesByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { page = 1, limit = 20 } = req.query;
        const course = await Course_1.default.findByPk(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                error: 'NOT_FOUND',
                message: 'Course not found'
            });
        }
        const offset = (Number(page) - 1) * Number(limit);
        const grades = await Grade_1.default.findAndCountAll({
            where: { course_id: courseId },
            limit: Number(limit),
            offset,
            include: [
                {
                    model: Student_1.default,
                    as: 'student',
                    attributes: ['id', 'student_id', 'name', 'college', 'major']
                }
            ],
            order: [['created_at', 'DESC']]
        });
        return res.status(200).json({
            success: true,
            data: {
                grades: grades.rows,
                total: grades.count,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(grades.count / Number(limit))
            },
            message: 'Course grades retrieved successfully'
        });
    }
    catch (error) {
        console.error('Get grades by course error:', error);
        return res.status(500).json({
            success: false,
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to retrieve course grades'
        });
    }
};
exports.getGradesByCourse = getGradesByCourse;
const getStudentGrades = async (req, res) => {
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
            where: { user_id: user.id }
        });
        if (!student) {
            return res.status(404).json({
                success: false,
                error: 'NOT_FOUND',
                message: 'Student information not found'
            });
        }
        const { semester } = req.query;
        const whereClause = { student_id: student.id };
        if (semester) {
            const courses = await Course_1.default.findAll({
                where: { semester: semester },
                attributes: ['id']
            });
            const courseIds = courses.map(c => c.id);
            whereClause.course_id = { [sequelize_1.Op.in]: courseIds };
        }
        const grades = await Grade_1.default.findAll({
            where: whereClause,
            include: [
                {
                    model: Course_1.default,
                    as: 'course',
                    attributes: ['id', 'course_id', 'course_name', 'credits', 'semester']
                }
            ],
            order: [['created_at', 'DESC']]
        });
        return res.status(200).json({
            success: true,
            data: {
                student: {
                    id: student.id,
                    student_id: student.student_id,
                    name: student.name
                },
                grades
            },
            message: 'Your grades retrieved successfully'
        });
    }
    catch (error) {
        console.error('Get student grades error:', error);
        return res.status(500).json({
            success: false,
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to retrieve your grades'
        });
    }
};
exports.getStudentGrades = getStudentGrades;
const getTeacherCourseGrades = async (req, res) => {
    try {
        const user = req.user;
        if (!user || user.role !== 'teacher') {
            return res.status(403).json({
                success: false,
                error: 'AUTHORIZATION_FAILED',
                message: 'Not authorized to access this resource'
            });
        }
        const { courseId } = req.params;
        const teacher = await Teacher_1.default.findOne({ where: { user_id: user.id } });
        const course = await Course_1.default.findOne({
            where: { id: courseId, teacher_id: teacher?.id }
        });
        if (!course) {
            return res.status(404).json({
                success: false,
                error: 'NOT_FOUND',
                message: 'Course not found or you are not the instructor'
            });
        }
        const grades = await Grade_1.default.findAll({
            where: { course_id: courseId },
            include: [
                {
                    model: Student_1.default,
                    as: 'student',
                    attributes: ['id', 'student_id', 'name', 'college', 'major']
                }
            ],
            order: [['created_at', 'DESC']]
        });
        return res.status(200).json({
            success: true,
            data: {
                course: {
                    id: course.id,
                    course_id: course.course_id,
                    course_name: course.course_name
                },
                grades
            },
            message: 'Course grades retrieved successfully'
        });
    }
    catch (error) {
        console.error('Get teacher course grades error:', error);
        return res.status(500).json({
            success: false,
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to retrieve course grades'
        });
    }
};
exports.getTeacherCourseGrades = getTeacherCourseGrades;
const createGrade = async (req, res) => {
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
        const { student_id, course_id, score, feedback, submission_status } = req.body;
        const student = await Student_1.default.findByPk(student_id);
        if (!student) {
            return res.status(404).json({
                success: false,
                error: 'NOT_FOUND',
                message: 'Student not found'
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
        const existingGrade = await Grade_1.default.findOne({
            where: { student_id, course_id }
        });
        if (existingGrade) {
            return res.status(400).json({
                success: false,
                error: 'DUPLICATE_ENTRY',
                message: 'Grade for this student and course already exists'
            });
        }
        const grade_level = score !== undefined ? calculateGradeLevel(score) : undefined;
        const grade = await Grade_1.default.create({
            student_id,
            course_id,
            score,
            grade_level,
            feedback,
            submission_status: submission_status || 'graded',
            submitted_at: new Date()
        });
        const createdGrade = await Grade_1.default.findByPk(grade.id, {
            include: [
                {
                    model: Student_1.default,
                    as: 'student',
                    attributes: ['id', 'student_id', 'name']
                },
                {
                    model: Course_1.default,
                    as: 'course',
                    attributes: ['id', 'course_id', 'course_name']
                }
            ]
        });
        return res.status(201).json({
            success: true,
            data: createdGrade,
            message: 'Grade created successfully'
        });
    }
    catch (error) {
        console.error('Create grade error:', error);
        return res.status(500).json({
            success: false,
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to create grade'
        });
    }
};
exports.createGrade = createGrade;
const updateGrade = async (req, res) => {
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
        const { score, feedback, submission_status } = req.body;
        const grade = await Grade_1.default.findByPk(id);
        if (!grade) {
            return res.status(404).json({
                success: false,
                error: 'NOT_FOUND',
                message: 'Grade not found'
            });
        }
        const updateData = {};
        if (score !== undefined) {
            updateData.score = score;
            updateData.grade_level = calculateGradeLevel(score);
        }
        if (feedback !== undefined)
            updateData.feedback = feedback;
        if (submission_status !== undefined)
            updateData.submission_status = submission_status;
        await Grade_1.default.update(updateData, {
            where: { id }
        });
        const updatedGrade = await Grade_1.default.findByPk(id, {
            include: [
                {
                    model: Student_1.default,
                    as: 'student',
                    attributes: ['id', 'student_id', 'name']
                },
                {
                    model: Course_1.default,
                    as: 'course',
                    attributes: ['id', 'course_id', 'course_name']
                }
            ]
        });
        return res.status(200).json({
            success: true,
            data: updatedGrade,
            message: 'Grade updated successfully'
        });
    }
    catch (error) {
        console.error('Update grade error:', error);
        return res.status(500).json({
            success: false,
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to update grade'
        });
    }
};
exports.updateGrade = updateGrade;
const batchUpdateGrades = async (req, res) => {
    try {
        const { grades } = req.body;
        if (!Array.isArray(grades) || grades.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'VALIDATION_ERROR',
                message: 'Grades array is required'
            });
        }
        const results = [];
        for (const gradeData of grades) {
            const { id, score, feedback, submission_status } = gradeData;
            const grade = await Grade_1.default.findByPk(id);
            if (!grade) {
                results.push({ id, success: false, message: 'Grade not found' });
                continue;
            }
            const updateData = {};
            if (score !== undefined) {
                updateData.score = score;
                updateData.grade_level = calculateGradeLevel(score);
            }
            if (feedback !== undefined)
                updateData.feedback = feedback;
            if (submission_status !== undefined)
                updateData.submission_status = submission_status;
            await Grade_1.default.update(updateData, { where: { id } });
            results.push({ id, success: true });
        }
        return res.status(200).json({
            success: true,
            data: results,
            message: 'Batch update completed'
        });
    }
    catch (error) {
        console.error('Batch update grades error:', error);
        return res.status(500).json({
            success: false,
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to batch update grades'
        });
    }
};
exports.batchUpdateGrades = batchUpdateGrades;
const deleteGrade = async (req, res) => {
    try {
        const { id } = req.params;
        const grade = await Grade_1.default.findByPk(id);
        if (!grade) {
            return res.status(404).json({
                success: false,
                error: 'NOT_FOUND',
                message: 'Grade not found'
            });
        }
        await Grade_1.default.destroy({
            where: { id }
        });
        return res.status(200).json({
            success: true,
            message: 'Grade deleted successfully'
        });
    }
    catch (error) {
        console.error('Delete grade error:', error);
        return res.status(500).json({
            success: false,
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to delete grade'
        });
    }
};
exports.deleteGrade = deleteGrade;
const getGradeStatistics = async (req, res) => {
    try {
        const { course_id, semester } = req.query;
        let courseWhereClause = {};
        if (course_id)
            courseWhereClause.id = course_id;
        if (semester)
            courseWhereClause.semester = semester;
        const courses = await Course_1.default.findAll({
            where: courseWhereClause,
            attributes: ['id', 'course_id', 'course_name', 'credits']
        });
        const courseIds = courses.map(c => c.id);
        const gradeWhereClause = {
            course_id: { [sequelize_1.Op.in]: courseIds },
            score: { [sequelize_1.Op.ne]: null }
        };
        const stats = await Grade_1.default.findOne({
            where: gradeWhereClause,
            attributes: [
                [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('id')), 'total_count'],
                [(0, sequelize_1.fn)('AVG', (0, sequelize_1.col)('score')), 'avg_score'],
                [(0, sequelize_1.fn)('MIN', (0, sequelize_1.col)('score')), 'min_score'],
                [(0, sequelize_1.fn)('MAX', (0, sequelize_1.col)('score')), 'max_score'],
                [(0, sequelize_1.fn)('SUM', (0, sequelize_1.col)('score')), 'total_score']
            ],
            raw: true
        });
        const gradeDistribution = await Grade_1.default.findAll({
            where: gradeWhereClause,
            attributes: [
                'grade_level',
                [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('id')), 'count']
            ],
            group: ['grade_level'],
            raw: true
        });
        const scoreRanges = await Grade_1.default.findAll({
            where: gradeWhereClause,
            attributes: [],
            raw: true
        });
        let excellent = 0, good = 0, medium = 0, pass = 0, fail = 0;
        scoreRanges.forEach((g) => {
            const score = parseFloat(g.score);
            if (score >= 90)
                excellent++;
            else if (score >= 80)
                good++;
            else if (score >= 70)
                medium++;
            else if (score >= 60)
                pass++;
            else
                fail++;
        });
        return res.status(200).json({
            success: true,
            data: {
                overview: {
                    totalGrades: stats.total_count || 0,
                    averageScore: stats.avg_score ? parseFloat(stats.avg_score).toFixed(2) : 0,
                    highestScore: stats.max_score || 0,
                    lowestScore: stats.min_score || 0
                },
                gradeDistribution: {
                    A: gradeDistribution.find((g) => g.grade_level === 'A')?.count || 0,
                    B: gradeDistribution.find((g) => g.grade_level === 'B')?.count || 0,
                    C: gradeDistribution.find((g) => g.grade_level === 'C')?.count || 0,
                    D: gradeDistribution.find((g) => g.grade_level === 'D')?.count || 0,
                    E: gradeDistribution.find((g) => g.grade_level === 'E')?.count || 0,
                    F: gradeDistribution.find((g) => g.grade_level === 'F')?.count || 0
                },
                scoreRanges: {
                    excellent,
                    good,
                    medium,
                    pass,
                    fail
                }
            },
            message: 'Grade statistics retrieved successfully'
        });
    }
    catch (error) {
        console.error('Get grade statistics error:', error);
        return res.status(500).json({
            success: false,
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to retrieve grade statistics'
        });
    }
};
exports.getGradeStatistics = getGradeStatistics;
const getCourseStatistics = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course_1.default.findByPk(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                error: 'NOT_FOUND',
                message: 'Course not found'
            });
        }
        const grades = await Grade_1.default.findAll({
            where: { course_id: courseId }
        });
        const scoreGrades = grades.filter(g => g.score !== null);
        const totalStudents = scoreGrades.length;
        const averageScore = totalStudents > 0
            ? scoreGrades.reduce((sum, g) => sum + g.score, 0) / totalStudents
            : 0;
        let excellent = 0, good = 0, medium = 0, pass = 0, fail = 0;
        scoreGrades.forEach(g => {
            const score = g.score;
            if (score >= 90)
                excellent++;
            else if (score >= 80)
                good++;
            else if (score >= 70)
                medium++;
            else if (score >= 60)
                pass++;
            else
                fail++;
        });
        const gradeDistribution = {
            A: grades.filter(g => g.grade_level === 'A').length,
            B: grades.filter(g => g.grade_level === 'B').length,
            C: grades.filter(g => g.grade_level === 'C').length,
            D: grades.filter(g => g.grade_level === 'D').length,
            E: grades.filter(g => g.grade_level === 'E').length,
            F: grades.filter(g => g.grade_level === 'F').length,
            P: grades.filter(g => g.grade_level === 'P').length,
            NP: grades.filter(g => g.grade_level === 'NP').length
        };
        return res.status(200).json({
            success: true,
            data: {
                course: {
                    id: course.id,
                    course_id: course.course_id,
                    course_name: course.course_name
                },
                statistics: {
                    totalStudents,
                    averageScore: parseFloat(averageScore.toFixed(2)),
                    excellentRate: totalStudents > 0 ? parseFloat(((excellent / totalStudents) * 100).toFixed(2)) : 0,
                    passRate: totalStudents > 0 ? parseFloat((((pass + medium + good + excellent) / totalStudents) * 100).toFixed(2)) : 0
                },
                gradeDistribution,
                scoreRanges: { excellent, good, medium, pass, fail }
            },
            message: 'Course statistics retrieved successfully'
        });
    }
    catch (error) {
        console.error('Get course statistics error:', error);
        return res.status(500).json({
            success: false,
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to retrieve course statistics'
        });
    }
};
exports.getCourseStatistics = getCourseStatistics;
const getStudentRankings = async (req, res) => {
    try {
        const { course_id, semester, limit = 10 } = req.query;
        let courseWhereClause = {};
        if (course_id)
            courseWhereClause.id = course_id;
        if (semester)
            courseWhereClause.semester = semester;
        const courses = await Course_1.default.findAll({
            where: courseWhereClause,
            attributes: ['id']
        });
        const courseIds = courses.map(c => c.id);
        const studentScores = await Grade_1.default.findAll({
            where: {
                course_id: { [sequelize_1.Op.in]: courseIds },
                score: { [sequelize_1.Op.ne]: null }
            },
            attributes: [
                'student_id',
                [(0, sequelize_1.fn)('AVG', (0, sequelize_1.col)('score')), 'avg_score'],
                [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('id')), 'course_count']
            ],
            group: ['student_id'],
            having: (0, sequelize_1.where)((0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('id')), { [sequelize_1.Op.gte]: 1 }),
            order: [[(0, sequelize_1.fn)('AVG', (0, sequelize_1.col)('score')), 'DESC']],
            limit: Number(limit),
            raw: true
        });
        const rankings = [];
        for (let i = 0; i < studentScores.length; i++) {
            const ss = studentScores[i];
            const student = await Student_1.default.findByPk(ss.student_id, {
                attributes: ['id', 'student_id', 'name', 'college', 'major']
            });
            if (student) {
                rankings.push({
                    rank: i + 1,
                    student: {
                        id: student.id,
                        student_id: student.student_id,
                        name: student.name,
                        college: student.college,
                        major: student.major
                    },
                    averageScore: parseFloat(ss.avg_score).toFixed(2),
                    courseCount: ss.course_count
                });
            }
        }
        return res.status(200).json({
            success: true,
            data: rankings,
            message: 'Student rankings retrieved successfully'
        });
    }
    catch (error) {
        console.error('Get student rankings error:', error);
        return res.status(500).json({
            success: false,
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to retrieve student rankings'
        });
    }
};
exports.getStudentRankings = getStudentRankings;
function calculateGradeLevel(score) {
    if (score >= 90)
        return 'A';
    if (score >= 80)
        return 'B';
    if (score >= 70)
        return 'C';
    if (score >= 60)
        return 'D';
    return 'E';
}
exports.default = {
    getAllGrades: exports.getAllGrades,
    getGradeById: exports.getGradeById,
    getGradesByStudent: exports.getGradesByStudent,
    getGradesByCourse: exports.getGradesByCourse,
    getStudentGrades: exports.getStudentGrades,
    getTeacherCourseGrades: exports.getTeacherCourseGrades,
    createGrade: exports.createGrade,
    updateGrade: exports.updateGrade,
    batchUpdateGrades: exports.batchUpdateGrades,
    deleteGrade: exports.deleteGrade,
    getGradeStatistics: exports.getGradeStatistics,
    getCourseStatistics: exports.getCourseStatistics,
    getStudentRankings: exports.getStudentRankings
};
