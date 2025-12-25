import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Course from '../models/Course';
import Teacher from '../models/Teacher';
import User from '../models/User';

// Get all courses
export const getAllCourses = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, semester, category, status, teacher_id } = req.query;
    
    const where: any = {};
    if (semester) where.semester = semester;
    if (category) where.category = category;
    if (status) where.status = status;
    if (teacher_id) where.teacher_id = teacher_id;
    
    const offset = (Number(page) - 1) * Number(limit);
    
    const courses = await Course.findAndCountAll({
      where,
      limit: Number(limit),
      offset,
      include: [{
        model: Teacher,
        as: 'teacher',
        include: [{
          model: User,
          as: 'user',
          attributes: ['username', 'email']
        }],
        attributes: ['id', 'teacher_id', 'name']
      }],
      order: [['created_at', 'DESC']]
    });
    
    return res.status(200).json({
      success: true,
      data: {
        courses: courses.rows,
        total: courses.count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(courses.count / Number(limit))
      },
      message: 'Courses retrieved successfully'
    });
  } catch (error) {
    console.error('Get all courses error:', error);
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to retrieve courses'
    });
  }
};

// Get course by ID
export const getCourseById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const course = await Course.findByPk(id, {
      include: [{
        model: Teacher,
        as: 'teacher',
        include: [{
          model: User,
          as: 'user',
          attributes: ['username', 'email']
        }],
        attributes: ['id', 'teacher_id', 'name']
      }]
    });
    
    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: 'Course not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: course,
      message: 'Course retrieved successfully'
    });
  } catch (error) {
    console.error('Get course by ID error:', error);
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to retrieve course'
    });
  }
};

// Get courses by teacher (teacher only)
export const getCoursesByTeacher = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    
    if (!user || user.role !== 'teacher') {
      return res.status(403).json({
        success: false,
        error: 'AUTHORIZATION_FAILED',
        message: 'Not authorized to access this resource'
      });
    }
    
    const teacher = await Teacher.findOne({ where: { user_id: user.id } });
    if (!teacher) {
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: 'Teacher information not found'
      });
    }
    
    const courses = await Course.findAll({
      where: { teacher_id: teacher.id },
      include: [{
        model: Teacher,
        as: 'teacher',
        include: [{
          model: User,
          as: 'user',
          attributes: ['username', 'email']
        }],
        attributes: ['id', 'teacher_id', 'name']
      }],
      order: [['created_at', 'DESC']]
    });
    
    return res.status(200).json({
      success: true,
      data: courses,
      message: 'Courses retrieved successfully'
    });
  } catch (error) {
    console.error('Get courses by teacher error:', error);
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to retrieve courses'
    });
  }
};

// Create course (admin/teacher)
export const createCourse = async (req: Request, res: Response) => {
  try {
    // Validate request
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
      course_id, 
      course_name, 
      credits, 
      hours, 
      semester, 
      category, 
      teacher_id, 
      description, 
      capacity, 
      assessment_method
    } = req.body;
    
    // Check if teacher exists
    if (teacher_id) {
      const teacher = await Teacher.findByPk(teacher_id);
      if (!teacher) {
        return res.status(404).json({
          success: false,
          error: 'NOT_FOUND',
          message: 'Teacher not found'
        });
      }
    }
    
    // Create course
    const course = await Course.create({
      course_id,
      course_name,
      credits,
      hours,
      semester,
      category,
      teacher_id,
      description,
      capacity,
      assessment_method,
      status: 'active',
      enrolled_count: 0
    });
    
    // Get created course with teacher information
    const createdCourse = await Course.findByPk(course.id, {
      include: [{
        model: Teacher,
        as: 'teacher',
        include: [{
          model: User,
          as: 'user',
          attributes: ['username', 'email']
        }],
        attributes: ['id', 'teacher_id', 'name']
      }]
    });
    
    return res.status(201).json({
      success: true,
      data: createdCourse,
      message: 'Course created successfully'
    });
  } catch (error) {
    console.error('Create course error:', error);
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to create course'
    });
  }
};

// Update course (admin/teacher)
export const updateCourse = async (req: Request, res: Response) => {
  try {
    // Validate request
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
    
    // Check if teacher exists if updating teacher_id
    if (updateData.teacher_id) {
      const teacher = await Teacher.findByPk(updateData.teacher_id);
      if (!teacher) {
        return res.status(404).json({
          success: false,
          error: 'NOT_FOUND',
          message: 'Teacher not found'
        });
      }
    }
    
    // Update course
    const [updated] = await Course.update(updateData, {
      where: { id }
    });
    
    if (!updated) {
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: 'Course not found'
      });
    }
    
    // Get updated course
    const updatedCourse = await Course.findByPk(id, {
      include: [{
        model: Teacher,
        as: 'teacher',
        include: [{
          model: User,
          as: 'user',
          attributes: ['username', 'email']
        }],
        attributes: ['id', 'teacher_id', 'name']
      }]
    });
    
    return res.status(200).json({
      success: true,
      data: updatedCourse,
      message: 'Course updated successfully'
    });
  } catch (error) {
    console.error('Update course error:', error);
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to update course'
    });
  }
};

// Delete course (admin only)
export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Find course first to check if it exists
    const course = await Course.findByPk(id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: 'Course not found'
      });
    }
    
    // Delete course
    await Course.destroy({
      where: { id }
    });
    
    return res.status(200).json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error('Delete course error:', error);
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to delete course'
    });
  }
};
