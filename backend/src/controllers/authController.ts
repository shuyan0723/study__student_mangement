import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import User from '../models/User';
import Student from '../models/Student';
import Teacher from '../models/Teacher';
import { comparePassword } from '../utils/password';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { LoginRequest } from '../types';

// Login controller
export const login = async (req: Request, res: Response) => {
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
    
    const { username, password } = req.body as LoginRequest;
    
    // Find user by username
    const user = await User.findOne({
      where: { username },
      attributes: ['id', 'username', 'password_hash', 'email', 'avatar_url', 'role', 'status', 'login_attempts', 'locked_until']
    });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'AUTHENTICATION_FAILED',
        message: 'Invalid username or password'
      });
    }
    
    // Check if user is locked
    if (user.status === 'locked' || (user.locked_until && user.locked_until > new Date())) {
      return res.status(403).json({
        success: false,
        error: 'ACCOUNT_LOCKED',
        message: 'Account is locked. Please try again later.'
      });
    }
    
    // Check if user is inactive
    if (user.status === 'inactive') {
      return res.status(403).json({
        success: false,
        error: 'ACCOUNT_INACTIVE',
        message: 'Account is inactive'
      });
    }
    
    // Verify password
    const isPasswordValid = await comparePassword(password, user.password_hash);
    
    if (!isPasswordValid) {
      // Increment login attempts
      const updatedAttempts = user.login_attempts + 1;
      
      // Lock account if attempts exceed limit
      let updateData: any = { login_attempts: updatedAttempts };
      
      if (updatedAttempts >= 5) {
        updateData.status = 'locked';
        updateData.locked_until = new Date(Date.now() + 30 * 60 * 1000); // Lock for 30 minutes
      }
      
      await user.update(updateData);
      
      return res.status(401).json({
        success: false,
        error: 'AUTHENTICATION_FAILED',
        message: 'Invalid username or password'
      });
    }
    
    // Reset login attempts on successful login
    await user.update({ login_attempts: 0, last_login: new Date() });
    
    // Generate tokens
    const tokenPayload = {
      userId: user.id,
      username: user.username,
      role: user.role,
      email: user.email
    };
    
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);
    
    // Get additional user information based on role
    let additionalInfo: any = {};
    
    if (user.role === 'student') {
      const student = await Student.findOne({
        where: { user_id: user.id },
        attributes: ['id', 'student_id', 'name']
      });
      
      if (student) {
        additionalInfo.studentId = student.id;
        additionalInfo.studentNumber = student.student_id;
        additionalInfo.name = student.name;
      }
    } else if (user.role === 'teacher') {
      const teacher = await Teacher.findOne({
        where: { user_id: user.id },
        attributes: ['id', 'teacher_id', 'name']
      });
      
      if (teacher) {
        additionalInfo.teacherId = teacher.id;
        additionalInfo.teacherNumber = teacher.teacher_id;
        additionalInfo.name = teacher.name;
      }
    }
    
    // Return response
    return res.status(200).json({
      success: true,
      data: {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          avatar_url: user.avatar_url,
          ...additionalInfo
        },
        expiresIn: 15 * 60 * 1000 // 15 minutes
      },
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Login failed due to server error'
    });
  }
};

// Refresh token controller
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Refresh token is required'
      });
    }
    
    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    
    if (!decoded) {
      return res.status(401).json({
        success: false,
        error: 'AUTHENTICATION_FAILED',
        message: 'Invalid or expired refresh token'
      });
    }
    
    // Find user
    const user = await User.findByPk(decoded.userId, {
      attributes: ['id', 'username', 'email', 'avatar_url', 'role', 'status']
    });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'AUTHENTICATION_FAILED',
        message: 'User not found'
      });
    }
    
    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        error: 'ACCOUNT_INACTIVE',
        message: 'Account is inactive or locked'
      });
    }
    
    // Generate new tokens
    const tokenPayload = {
      userId: user.id,
      username: user.username,
      role: user.role,
      email: user.email
    };
    
    const newAccessToken = generateAccessToken(tokenPayload);
    const newRefreshToken = generateRefreshToken(tokenPayload);
    
    // Return new tokens
    return res.status(200).json({
      success: true,
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        expiresIn: 15 * 60 * 1000 // 15 minutes
      },
      message: 'Tokens refreshed successfully'
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Refresh token failed due to server error'
    });
  }
};

// Logout controller
export const logout = async (req: Request, res: Response) => {
  try {
    // Implementation would go here
    // For now, return a placeholder response
    return res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Logout failed due to server error'
    });
  }
};
