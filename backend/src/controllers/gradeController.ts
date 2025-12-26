import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Op, col, fn, where } from 'sequelize';
import Grade from '../models/Grade';
import Student from '../models/Student';
import Course from '../models/Course';

export const getAllGrades = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      student_id,
      course_id,
      status,
      min_score,
      max_score,
      grade_level,
      semester
    } = req.query;

    const whereClause: any = {};
    if (student_id) whereClause.student_id = student_id;
    if (course_id) whereClause.course_id = course_id;
    if (status) whereClause.submission_status = status;
    if (grade_level) whereClause.grade_level = grade_level;
    if (min_score !== undefined || max_score !== undefined) {
      whereClause.score = {};
      if (min_score !== undefined) whereClause.score[Op.gte] = Number(min_score);
      if (max_score !== undefined) whereClause.score[Op.lte] = Number(max_score);
    }

    let courseWhereClause: any = {};
    if (semester) courseWhereClause.semester = semester;

    const offset = (Number(page) - 1) * Number(limit);

    const grades = await Grade.findAndCountAll({
      where: whereClause,
      limit: Number(limit),
      offset,
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'student_id', 'name', 'college', 'major']
        },
        {
          model: Course,
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
  } catch (error) {
    console.error('Get all grades error:', error);
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to retrieve grades'
    });
  }
};

export const getGradeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const grade = await Grade.findByPk(id, {
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'student_id', 'name', 'college', 'major']
        },
        {
          model: Course,
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
  } catch (error) {
    console.error('Get grade by ID error:', error);
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to retrieve grade'
    });
  }
};

export const getGradesByStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const { semester } = req.query;

    const student = await Student.findByPk(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: 'Student not found'
      });
    }

    const whereClause: any = { student_id: studentId };
    if (semester) {
      const courses = await Course.findAll({
        where: { semester: semester as string },
        attributes: ['id']
      });
      const courseIds = courses.map(c => c.id);
      whereClause.course_id = { [Op.in]: courseIds };
    }

    const grades = await Grade.findAll({
      where: whereClause,
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'student_id', 'name']
        },
        {
          model: Course,
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
  } catch (error) {
    console.error('Get grades by student error:', error);
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to retrieve student grades'
    });
  }
};

export const getGradesByCourse = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: 'Course not found'
      });
    }

    const offset = (Number(page) - 1) * Number(limit);

    const grades = await Grade.findAndCountAll({
      where: { course_id: courseId },
      limit: Number(limit),
      offset,
      include: [
        {
          model: Student,
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
  } catch (error) {
    console.error('Get grades by course error:', error);
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to retrieve course grades'
    });
  }
};

export const getStudentGrades = async (req: Request, res: Response) => {
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
    const whereClause: any = { student_id: student.id };

    if (semester) {
      const courses = await Course.findAll({
        where: { semester: semester as string },
        attributes: ['id']
      });
      const courseIds = courses.map(c => c.id);
      whereClause.course_id = { [Op.in]: courseIds };
    }

    const grades = await Grade.findAll({
      where: whereClause,
      include: [
        {
          model: Course,
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
  } catch (error) {
    console.error('Get student grades error:', error);
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to retrieve your grades'
    });
  }
};

export const getTeacherCourseGrades = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    if (!user || user.role !== 'teacher') {
      return res.status(403).json({
        success: false,
        error: 'AUTHORIZATION_FAILED',
        message: 'Not authorized to access this resource'
      });
    }

    const { courseId } = req.params;

    const course = await Course.findOne({
      where: { id: courseId, teacher_id: (await import('../models/Teacher')).default.findOne({ where: { user_id: user.id } })?.id }
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: 'Course not found or you are not the instructor'
      });
    }

    const grades = await Grade.findAll({
      where: { course_id: courseId },
      include: [
        {
          model: Student,
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
  } catch (error) {
    console.error('Get teacher course grades error:', error);
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to retrieve course grades'
    });
  }
};

export const createGrade = async (req: Request, res: Response) => {
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

    const { student_id, course_id, score, feedback, submission_status } = req.body;

    const student = await Student.findByPk(student_id);
    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: 'Student not found'
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

    const existingGrade = await Grade.findOne({
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

    const grade = await Grade.create({
      student_id,
      course_id,
      score,
      grade_level,
      feedback,
      submission_status: submission_status || 'graded',
      submitted_at: new Date()
    });

    const createdGrade = await Grade.findByPk(grade.id, {
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'student_id', 'name']
        },
        {
          model: Course,
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
  } catch (error) {
    console.error('Create grade error:', error);
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to create grade'
    });
  }
};

export const updateGrade = async (req: Request, res: Response) => {
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
    const { score, feedback, submission_status } = req.body;

    const grade = await Grade.findByPk(id);
    if (!grade) {
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: 'Grade not found'
      });
    }

    const updateData: any = {};
    if (score !== undefined) {
      updateData.score = score;
      updateData.grade_level = calculateGradeLevel(score);
    }
    if (feedback !== undefined) updateData.feedback = feedback;
    if (submission_status !== undefined) updateData.submission_status = submission_status;

    await Grade.update(updateData, {
      where: { id }
    });

    const updatedGrade = await Grade.findByPk(id, {
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'student_id', 'name']
        },
        {
          model: Course,
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
  } catch (error) {
    console.error('Update grade error:', error);
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to update grade'
    });
  }
};

export const batchUpdateGrades = async (req: Request, res: Response) => {
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

      const grade = await Grade.findByPk(id);
      if (!grade) {
        results.push({ id, success: false, message: 'Grade not found' });
        continue;
      }

      const updateData: any = {};
      if (score !== undefined) {
        updateData.score = score;
        updateData.grade_level = calculateGradeLevel(score);
      }
      if (feedback !== undefined) updateData.feedback = feedback;
      if (submission_status !== undefined) updateData.submission_status = submission_status;

      await Grade.update(updateData, { where: { id } });
      results.push({ id, success: true });
    }

    return res.status(200).json({
      success: true,
      data: results,
      message: 'Batch update completed'
    });
  } catch (error) {
    console.error('Batch update grades error:', error);
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to batch update grades'
    });
  }
};

export const deleteGrade = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const grade = await Grade.findByPk(id);
    if (!grade) {
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: 'Grade not found'
      });
    }

    await Grade.destroy({
      where: { id }
    });

    return res.status(200).json({
      success: true,
      message: 'Grade deleted successfully'
    });
  } catch (error) {
    console.error('Delete grade error:', error);
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to delete grade'
    });
  }
};

export const getGradeStatistics = async (req: Request, res: Response) => {
  try {
    const { course_id, semester } = req.query;

    let courseWhereClause: any = {};
    if (course_id) courseWhereClause.id = course_id;
    if (semester) courseWhereClause.semester = semester;

    const courses = await Course.findAll({
      where: courseWhereClause,
      attributes: ['id', 'course_id', 'course_name', 'credits']
    });
    const courseIds = courses.map(c => c.id);

    const gradeWhereClause: any = {
      course_id: { [Op.in]: courseIds },
      score: { [Op.ne]: null }
    };

    const stats = await Grade.findOne({
      where: gradeWhereClause,
      attributes: [
        [fn('COUNT', col('id')), 'total_count'],
        [fn('AVG', col('score')), 'avg_score'],
        [fn('MIN', col('score')), 'min_score'],
        [fn('MAX', col('score')), 'max_score'],
        [fn('SUM', col('score')), 'total_score']
      ],
      raw: true
    });

    const gradeDistribution = await Grade.findAll({
      where: gradeWhereClause,
      attributes: [
        'grade_level',
        [fn('COUNT', col('id')), 'count']
      ],
      group: ['grade_level'],
      raw: true
    });

    const scoreRanges = await Grade.findAll({
      where: gradeWhereClause,
      attributes: [],
      raw: true
    });

    let excellent = 0, good = 0, medium = 0, pass = 0, fail = 0;
    scoreRanges.forEach((g: any) => {
      const score = parseFloat(g.score);
      if (score >= 90) excellent++;
      else if (score >= 80) good++;
      else if (score >= 70) medium++;
      else if (score >= 60) pass++;
      else fail++;
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
          A: gradeDistribution.find((g: any) => g.grade_level === 'A')?.count || 0,
          B: gradeDistribution.find((g: any) => g.grade_level === 'B')?.count || 0,
          C: gradeDistribution.find((g: any) => g.grade_level === 'C')?.count || 0,
          D: gradeDistribution.find((g: any) => g.grade_level === 'D')?.count || 0,
          E: gradeDistribution.find((g: any) => g.grade_level === 'E')?.count || 0,
          F: gradeDistribution.find((g: any) => g.grade_level === 'F')?.count || 0
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
  } catch (error) {
    console.error('Get grade statistics error:', error);
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to retrieve grade statistics'
    });
  }
};

export const getCourseStatistics = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: 'Course not found'
      });
    }

    const grades = await Grade.findAll({
      where: { course_id: courseId }
    });

    const scoreGrades = grades.filter(g => g.score !== null);
    const totalStudents = scoreGrades.length;
    const averageScore = totalStudents > 0
      ? scoreGrades.reduce((sum, g) => sum + (g.score as number), 0) / totalStudents
      : 0;

    let excellent = 0, good = 0, medium = 0, pass = 0, fail = 0;
    scoreGrades.forEach(g => {
      const score = g.score as number;
      if (score >= 90) excellent++;
      else if (score >= 80) good++;
      else if (score >= 70) medium++;
      else if (score >= 60) pass++;
      else fail++;
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
  } catch (error) {
    console.error('Get course statistics error:', error);
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to retrieve course statistics'
    });
  }
};

export const getStudentRankings = async (req: Request, res: Response) => {
  try {
    const { course_id, semester, limit = 10 } = req.query;

    let courseWhereClause: any = {};
    if (course_id) courseWhereClause.id = course_id;
    if (semester) courseWhereClause.semester = semester;

    const courses = await Course.findAll({
      where: courseWhereClause,
      attributes: ['id']
    });
    const courseIds = courses.map(c => c.id);

    const studentScores = await Grade.findAll({
      where: {
        course_id: { [Op.in]: courseIds },
        score: { [Op.ne]: null }
      },
      attributes: [
        'student_id',
        [fn('AVG', col('score')), 'avg_score'],
        [fn('COUNT', col('id')), 'course_count']
      ],
      group: ['student_id'],
      having: fn('COUNT', col('id')) >= 1,
      order: [[fn('AVG', col('score')), 'DESC']],
      limit: Number(limit),
      raw: true
    });

    const rankings = [];
    for (let i = 0; i < studentScores.length; i++) {
      const ss = studentScores[i] as any;
      const student = await Student.findByPk(ss.student_id, {
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
  } catch (error) {
    console.error('Get student rankings error:', error);
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to retrieve student rankings'
    });
  }
};

function calculateGradeLevel(score: number): string {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'E';
}

export default {
  getAllGrades,
  getGradeById,
  getGradesByStudent,
  getGradesByCourse,
  getStudentGrades,
  getTeacherCourseGrades,
  createGrade,
  updateGrade,
  batchUpdateGrades,
  deleteGrade,
  getGradeStatistics,
  getCourseStatistics,
  getStudentRankings
};
