import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Op } from 'sequelize';
import Teacher from '../models/Teacher';
import Course from '../models/Course';
import User from '../models/User';
import { hashPassword } from '../utils/password';

export const getAllTeachers = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, department, title, status } = req.query;

    const whereClause: any = {};
    if (department) whereClause.department = department;
    if (title) whereClause.title = title;

    const offset = (Number(page) - 1) * Number(limit);

    const teachers = await Teacher.findAndCountAll({
      where: whereClause,
      limit: Number(limit),
      offset,
      include: [{
        model: User,
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
  } catch (error) {
    console.error('Get all teachers error:', error);
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to retrieve teachers'
    });
  }
};

export const getTeacherById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const teacher = await Teacher.findByPk(id, {
      include: [{
        model: User,
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
  } catch (error) {
    console.error('Get teacher by ID error:', error);
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to retrieve teacher'
    });
  }
};

export const getCurrentTeacher = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    if (!user || user.role !== 'teacher') {
      return res.status(403).json({
        success: false,
        error: 'AUTHORIZATION_FAILED',
        message: 'Not authorized to access this resource'
      });
    }

    const teacher = await Teacher.findOne({
      where: { user_id: user.id },
      include: [{
        model: User,
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
  } catch (error) {
    console.error('Get current teacher error:', error);
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to retrieve teacher information'
    });
  }
};

export const getTeacherWithCourses = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { semester } = req.query;

    const teacher = await Teacher.findByPk(id, {
      include: [{
        model: User,
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

    const courseWhereClause: any = { teacher_id: id };
    if (semester) courseWhereClause.semester = semester;

    const courses = await Course.findAll({
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
  } catch (error) {
    console.error('Get teacher with courses error:', error);
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to retrieve teacher courses'
    });
  }
};

export const getTeacherStatistics = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const teacher = await Teacher.findByPk(id);
    if (!teacher) {
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: 'Teacher not found'
      });
    }

    const courses = await Course.findAll({
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
  } catch (error) {
    console.error('Get teacher statistics error:', error);
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to retrieve teacher statistics'
    });
  }
};

export const createTeacher = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: errors.array()
      });
    }

    const {
      teacher_id,
      name,
      username,
      email,
      password,
      gender,
      department,
      title,
      phone,
      research_area,
      education,
      years_of_service
    } = req.body;

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email }]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'DUPLICATE_ENTRY',
        message: 'Username or email already exists'
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      username,
      email,
      password_hash: hashedPassword,
      role: 'teacher',
      status: 'active'
    });

    const teacher = await Teacher.create({
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

    const createdTeacher = await Teacher.findByPk(teacher.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['username', 'email']
      }]
    });

    return res.status(201).json({
      success: true,
      data: createdTeacher,
      message: 'Teacher created successfully'
    });
  } catch (error) {
    console.error('Create teacher error:', error);
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to create teacher'
    });
  }
};

export const updateTeacher = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
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

    const teacher = await Teacher.findByPk(id);
    if (!teacher) {
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: 'Teacher not found'
      });
    }

    await Teacher.update(updateData, {
      where: { id }
    });

    const updatedTeacher = await Teacher.findByPk(id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['username', 'email', 'avatar_url']
      }]
    });

    return res.status(200).json({
      success: true,
      data: updatedTeacher,
      message: 'Teacher updated successfully'
    });
  } catch (error) {
    console.error('Update teacher error:', error);
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to update teacher'
    });
  }
};

export const deleteTeacher = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const teacher = await Teacher.findByPk(id);
    if (!teacher) {
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: 'Teacher not found'
      });
    }

    const activeCourses = await Course.count({
      where: { teacher_id: id, status: 'active' }
    });

    if (activeCourses > 0) {
      return res.status(400).json({
        success: false,
        error: 'CONSTRAINT_VIOLATION',
        message: 'Cannot delete teacher with active courses. Please reassign or deactivate courses first.'
      });
    }

    await Teacher.destroy({
      where: { id }
    });

    return res.status(200).json({
      success: true,
      message: 'Teacher deleted successfully'
    });
  } catch (error) {
    console.error('Delete teacher error:', error);
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to delete teacher'
    });
  }
};

export const updateTeacherProfile = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    if (!user || user.role !== 'teacher') {
      return res.status(403).json({
        success: false,
        error: 'AUTHORIZATION_FAILED',
        message: 'Not authorized to access this resource'
      });
    }

    const teacher = await Teacher.findOne({
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

    await Teacher.update({
      phone,
      research_area,
      education
    }, {
      where: { id: teacher.id }
    });

    const updatedTeacher = await Teacher.findByPk(teacher.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['username', 'email', 'avatar_url']
      }]
    });

    return res.status(200).json({
      success: true,
      data: updatedTeacher,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Update teacher profile error:', error);
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to update profile'
    });
  }
};

export default {
  getAllTeachers,
  getTeacherById,
  getCurrentTeacher,
  getTeacherWithCourses,
  getTeacherStatistics,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  updateTeacherProfile
};
