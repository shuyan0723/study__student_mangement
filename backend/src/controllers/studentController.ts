import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Student from '../models/Student';
import User from '../models/User';
import { hashPassword } from '../utils/password';

// Get all students
export const getAllStudents = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, college, major, status } = req.query;
    
    const where: any = {};
    if (college) where.college = college;
    if (major) where.major = major;
    if (status) where.status = status;
    
    const offset = (Number(page) - 1) * Number(limit);
    
    const students = await Student.findAndCountAll({
      where,
      limit: Number(limit),
      offset,
      include: [{
        model: User,
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
  } catch (error) {
    console.error('Get all students error:', error);
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to retrieve students'
    });
  }
};

// Get student by ID
export const getStudentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const student = await Student.findByPk(id, {
      include: [{
        model: User,
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
  } catch (error) {
    console.error('Get student by ID error:', error);
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to retrieve student'
    });
  }
};

// Get current student information (for logged in student)
export const getCurrentStudent = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    
    if (!user || user.role !== 'student') {
      return res.status(403).json({
        success: false,
        error: 'AUTHORIZATION_FAILED',
        message: 'Not authorized to access this resource'
      });
    }
    
    const student = await Student.findOne({
      where: { user_id: user.id },
      include: [{
        model: User,
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
  } catch (error) {
    console.error('Get current student error:', error);
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to retrieve student information'
    });
  }
};

// Create student
export const createStudent = async (req: Request, res: Response) => {
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
      student_id, 
      name, 
      username, 
      email, 
      password, 
      gender, 
      date_of_birth, 
      college, 
      major, 
      phone, 
      home_address, 
      admission_date
    } = req.body;
    
    // Create user first
    const hashedPassword = await hashPassword(password);
    
    const user = await User.create({
      username,
      email,
      password_hash: hashedPassword,
      role: 'student',
      status: 'active'
    });
    
    // Create student
    const student = await Student.create({
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
  } catch (error) {
    console.error('Create student error:', error);
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to create student'
    });
  }
};

// Update student
export const updateStudent = async (req: Request, res: Response) => {
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
    
    // Remove user-related fields from update data
    const { username, email, password, ...studentUpdateData } = updateData;
    
    // Update student
    const [updated] = await Student.update(studentUpdateData, {
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
      const student = await Student.findByPk(id);
      if (student) {
        const userUpdateData: any = {};
        if (username) userUpdateData.username = username;
        if (email) userUpdateData.email = email;
        if (password) userUpdateData.password_hash = await hashPassword(password);
        
        await User.update(userUpdateData, {
          where: { id: student.user_id }
        });
      }
    }
    
    // Get updated student
    const updatedStudent = await Student.findByPk(id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['username', 'email', 'avatar_url']
      }]
    });
    
    return res.status(200).json({
      success: true,
      data: updatedStudent,
      message: 'Student updated successfully'
    });
  } catch (error) {
    console.error('Update student error:', error);
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to update student'
    });
  }
};

// Delete student
export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Find student first to get user_id
    const student = await Student.findByPk(id);
    
    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: 'Student not found'
      });
    }
    
    // Delete student (will cascade to user due to onDelete: 'CASCADE' in model)
    await Student.destroy({
      where: { id }
    });
    
    return res.status(200).json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    console.error('Delete student error:', error);
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to delete student'
    });
  }
};
