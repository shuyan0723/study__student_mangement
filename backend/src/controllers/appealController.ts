import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { body, param, query } from 'express-validator';
import { Op } from 'sequelize';
import sequelize from '../config/database';
import Appeal from '../models/Appeal';
import Student from '../models/Student';
import Course from '../models/Course';
import User from '../models/User';
import Grade from '../models/Grade';

export const getAllAppeals = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['pending', 'reviewing', 'approved', 'rejected', 'closed']).withMessage('Invalid status'),
  query('course_id').optional().isUUID().withMessage('Invalid course ID'),
  query('student_id').optional().isUUID().withMessage('Invalid student ID'),
  query('start_date').optional().isDate().withMessage('Invalid start date'),
  query('end_date').optional().isDate().withMessage('Invalid end date'),
  
  async (req: Request, res: Response) => {
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

      const user = (req as any).user;
      const { 
        page = 1, 
        limit = 10, 
        status, 
        course_id, 
        student_id,
        start_date,
        end_date,
        sort_by = 'created_at',
        sort_order = 'DESC'
      } = req.query;

      const whereClause: any = {};

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
      } else if (user.role === 'teacher') {
        const teacherCourses = await Course.findAll({
          where: { teacher_id: user.id },
          attributes: ['id']
        });
        const courseIds = teacherCourses.map(c => c.id);
        whereClause.course_id = { [Op.in]: courseIds };
      }

      if (start_date || end_date) {
        whereClause.appeal_time = {};
        if (start_date) (whereClause.appeal_time as any)[Op.gte] = new Date(start_date as string);
        if (end_date) (whereClause.appeal_time as any)[Op.lte] = new Date(end_date as string);
      }

      const offset = (Number(page) - 1) * Number(limit);
      const order: [string, string][] = [[sort_by as string, sort_order as string]];

      const { count, rows: appeals } = await Appeal.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Student,
            as: 'student',
            include: [{
              model: User,
              as: 'user',
              attributes: ['id', 'username', 'email', 'full_name']
            }]
          },
          {
            model: Course,
            as: 'course',
            attributes: ['id', 'course_name', 'course_code']
          },
          {
            model: User,
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
    } catch (error) {
      console.error('Get all appeals error:', error);
      return res.status(500).json({
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to retrieve appeals'
      });
    }
  }
];

export const getAppealById = [
  param('id').notEmpty().withMessage('Appeal ID is required'),
  
  async (req: Request, res: Response) => {
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
      const user = (req as any).user;

      const appeal = await Appeal.findByPk(id, {
        include: [
          {
            model: Student,
            as: 'student',
            include: [{
              model: User,
              as: 'user',
              attributes: ['id', 'username', 'email', 'full_name', 'avatar_url']
            }]
          },
          {
            model: Course,
            as: 'course'
          },
          {
            model: User,
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
        const isTeachingCourse = await Course.findOne({
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
    } catch (error) {
      console.error('Get appeal by ID error:', error);
      return res.status(500).json({
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to retrieve appeal'
      });
    }
  }
];

export const getMyAppeals = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['pending', 'reviewing', 'approved', 'rejected', 'closed']).withMessage('Invalid status'),
  
  async (req: Request, res: Response) => {
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

      const user = (req as any).user;
      const { page = 1, limit = 10, status } = req.query;

      const whereClause: any = { student_id: user.id };
      if (status) whereClause.status = status;

      const offset = (Number(page) - 1) * Number(limit);

      const { count, rows: appeals } = await Appeal.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Course,
            as: 'course',
            attributes: ['id', 'course_name', 'course_code']
          },
          {
            model: User,
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
    } catch (error) {
      console.error('Get my appeals error:', error);
      return res.status(500).json({
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to retrieve appeals'
      });
    }
  }
];

export const createAppeal = [
  body('course_id').notEmpty().withMessage('Course ID is required').isUUID().withMessage('Invalid course ID'),
  body('original_score').optional().isFloat({ min: 0, max: 100 }).withMessage('Original score must be between 0 and 100'),
  body('appeal_reason').notEmpty().withMessage('Appeal reason is required').isLength({ min: 10, max: 2000 }).withMessage('Appeal reason must be between 10 and 2000 characters'),
  body('attachments').optional().isArray().withMessage('Attachments must be an array'),
  
  async (req: Request, res: Response) => {
    const transaction = await sequelize.transaction();
    
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

      const user = (req as any).user;
      const { course_id, original_score, appeal_reason, attachments } = req.body;

      if (user.role !== 'student') {
        return res.status(403).json({
          success: false,
          error: 'FORBIDDEN',
          message: 'Only students can create appeals'
        });
      }

      const course = await Course.findByPk(course_id);
      if (!course) {
        return res.status(404).json({
          success: false,
          error: 'NOT_FOUND',
          message: 'Course not found'
        });
      }

      const existingAppeal = await Appeal.findOne({
        where: {
          student_id: user.id,
          course_id,
          status: { [Op.in]: ['pending', 'reviewing'] }
        }
      });

      if (existingAppeal) {
        return res.status(400).json({
          success: false,
          error: 'DUPLICATE_APPEAL',
          message: 'You already have an active appeal for this course'
        });
      }

      const grade = await Grade.findOne({
        where: {
          student_id: user.id,
          course_id
        }
      });

      const appeal = await Appeal.create({
        student_id: user.id,
        course_id,
        original_score: original_score || grade?.score || null,
        appeal_reason,
        attachments: attachments || null,
        status: 'pending',
        appeal_time: new Date()
      }, { transaction });

      await transaction.commit();

      const createdAppeal = await Appeal.findByPk(appeal.id, {
        include: [
          {
            model: Student,
            as: 'student',
            include: [{
              model: User,
              as: 'user',
              attributes: ['id', 'username', 'full_name']
            }]
          },
          {
            model: Course,
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
    } catch (error) {
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

export const updateAppealStatus = [
  param('id').notEmpty().withMessage('Appeal ID is required'),
  body('status').notEmpty().withMessage('Status is required').isIn(['reviewing', 'approved', 'rejected', 'closed']).withMessage('Invalid status'),
  body('new_score').optional().isFloat({ min: 0, max: 100 }).withMessage('New score must be between 0 and 100'),
  body('review_feedback').optional().isLength({ max: 2000 }).withMessage('Feedback cannot exceed 2000 characters'),
  
  async (req: Request, res: Response) => {
    const transaction = await sequelize.transaction();
    
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

      const user = (req as any).user;
      const { id } = req.params;
      const { status, new_score, review_feedback } = req.body;

      if (user.role === 'student') {
        return res.status(403).json({
          success: false,
          error: 'FORBIDDEN',
          message: 'Students cannot update appeal status'
        });
      }

      const appeal = await Appeal.findByPk(id);
      if (!appeal) {
        return res.status(404).json({
          success: false,
          error: 'NOT_FOUND',
          message: 'Appeal not found'
        });
      }

      if (user.role === 'teacher') {
        const course = await Course.findOne({
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

      const updateData: any = {
        status,
        reviewed_by: user.id,
        reviewed_time: new Date()
      };

      if (review_feedback) {
        updateData.review_feedback = review_feedback;
      }

      if (status === 'approved' && new_score !== undefined) {
        updateData.new_score = new_score;
        
        await Grade.update(
          { 
            score: new_score,
            feedback: review_feedback || `Appeal approved. ${appeal.appeal_reason}`,
            updated_at: new Date()
          },
          { 
            where: { 
              student_id: appeal.student_id,
              course_id: appeal.course_id
            },
            transaction 
          }
        );
      } else if (status === 'rejected' && review_feedback) {
        updateData.review_feedback = review_feedback;
      }

      await appeal.update(updateData, { transaction });
      await transaction.commit();

      const updatedAppeal = await Appeal.findByPk(id, {
        include: [
          {
            model: Student,
            as: 'student',
            include: [{
              model: User,
              as: 'user',
              attributes: ['id', 'username', 'full_name']
            }]
          },
          {
            model: Course,
            as: 'course'
          },
          {
            model: User,
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
    } catch (error) {
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

export const deleteAppeal = [
  param('id').notEmpty().withMessage('Appeal ID is required'),
  
  async (req: Request, res: Response) => {
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
      const user = (req as any).user;

      const appeal = await Appeal.findByPk(id);
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
    } catch (error) {
      console.error('Delete appeal error:', error);
      return res.status(500).json({
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to delete appeal'
      });
    }
  }
];

export const getAppealStatistics = [
  query('course_id').optional().isUUID().withMessage('Invalid course ID'),
  query('start_date').optional().isDate().withMessage('Invalid start date'),
  query('end_date').optional().isDate().withMessage('Invalid end date'),
  
  async (req: Request, res: Response) => {
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

      const user = (req as any).user;
      const { course_id, start_date, end_date } = req.query;

      const whereClause: any = {};
      
      if (course_id) whereClause.course_id = course_id;
      
      if (start_date || end_date) {
        whereClause.created_at = {};
        if (start_date) (whereClause.created_at as any)[Op.gte] = new Date(start_date as string);
        if (end_date) (whereClause.created_at as any)[Op.lte] = new Date(end_date as string);
      }

      if (user.role === 'teacher') {
        const teacherCourses = await Course.findAll({
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
        } else {
          whereClause.course_id = { [Op.in]: courseIds };
        }
      }

      const totalAppeals = await Appeal.count({ where: whereClause });
      
      const statusCounts = await Appeal.findAll({
        where: whereClause,
        attributes: [
          'status',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['status'],
        raw: true
      }) as any[];

      const pendingAppeals = await Appeal.count({
        where: { 
          ...whereClause,
          status: 'pending'
        }
      });

      const resolvedAppeals = await Appeal.count({
        where: {
          ...whereClause,
          status: { [Op.in]: ['approved', 'rejected', 'closed'] }
        }
      });

      const avgResolutionTime = await Appeal.findAll({
        where: {
          ...whereClause,
          status: { [Op.in]: ['approved', 'rejected', 'closed'] },
          reviewed_time: { [Op.ne]: null }
        },
        attributes: [
          [
            sequelize.fn(
              'AVG',
              sequelize.fn(
                'DATEDIFF',
                sequelize.col('reviewed_time'),
                sequelize.col('appeal_time')
              )
            ),
            'avg_days'
          ]
        ],
        raw: true
      }) as any[];

      const recentAppeals = await Appeal.findAll({
        where: whereClause,
        include: [
          {
            model: Course,
            as: 'course',
            attributes: ['id', 'course_name']
          },
          {
            model: Student,
            as: 'student',
            include: [{
              model: User,
              as: 'user',
              attributes: ['id', 'username', 'full_name']
            }]
          }
        ],
        order: [['created_at', 'DESC']],
        limit: 5
      });

      const statusDistribution = statusCounts.reduce((acc: any, item: any) => {
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
    } catch (error) {
      console.error('Get appeal statistics error:', error);
      return res.status(500).json({
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to retrieve appeal statistics'
      });
    }
  }
];

export const getCourseAppeals = [
  param('courseId').notEmpty().withMessage('Course ID is required'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['pending', 'reviewing', 'approved', 'rejected', 'closed']).withMessage('Invalid status'),
  
  async (req: Request, res: Response) => {
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

      const { courseId } = req.params;
      const user = (req as any).user;
      const { page = 1, limit = 10, status } = req.query;

      if (user.role === 'teacher') {
        const course = await Course.findOne({
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

      const whereClause: any = { course_id: courseId };
      if (status) whereClause.status = status;

      const offset = (Number(page) - 1) * Number(limit);

      const { count, rows: appeals } = await Appeal.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Student,
            as: 'student',
            include: [{
              model: User,
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
    } catch (error) {
      console.error('Get course appeals error:', error);
      return res.status(500).json({
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to retrieve course appeals'
      });
    }
  }
];
