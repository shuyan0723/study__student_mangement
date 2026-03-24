import { Response } from 'express';
import { Op } from 'sequelize';
import ApiConfig from '../models/ApiConfig';
import AnalysisRecord from '../models/AnalysisRecord';
import AnalysisTemplate from '../models/AnalysisTemplate';
import { performAIAnalysis, getTeacherAnalysisStats } from '../services/aiAnalysisService';
import { AuthRequest } from '../middleware/authMiddleware';
import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'your-32-character-encryption-key';
const ALGORITHM = 'aes-256-cbc';

// 加密函数
function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY.slice(0, 32)), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

// 解密函数
function decrypt(text: string): string {
  const parts = text.split(':');
  const iv = Buffer.from(parts.shift()!, 'hex');
  const encryptedText = parts.join(':');
  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY.slice(0, 32)), iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// ========== API配置管理 ==========

// 获取API配置
export const getApiConfig = async (req: AuthRequest, res: Response) => {
  try {
    const config = await ApiConfig.findOne({
      where: { isActive: true },
      attributes: { exclude: ['apiKey'] }
    });

    if (!config) {
      return res.json({
        success: true,
        data: null
      });
    }

    res.json({
      success: true,
      data: {
        ...config.toJSON(),
        hasKey: true // 只告知是否有密钥，不返回密钥本身
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: error.message
    });
  }
};

// 创建/更新API配置
export const upsertApiConfig = async (req: AuthRequest, res: Response) => {
  try {
    const { apiEndpoint, apiKey, model, dailyLimitPerTeacher, monthlyLimitPerTeacher } = req.body;

    // 验证必填字段
    if (!apiEndpoint || !apiKey || !model) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'API地址、密钥和模型为必填项'
      });
    }

    // 加密API密钥
    const encryptedKey = encrypt(apiKey);

    // 查找现有配置
    const existingConfig = await ApiConfig.findOne({ where: { isActive: true } });

    if (existingConfig) {
      // 更新现有配置
      await existingConfig.update({
        apiEndpoint,
        apiKey: encryptedKey,
        model,
        dailyLimitPerTeacher: dailyLimitPerTeacher || 10,
        monthlyLimitPerTeacher: monthlyLimitPerTeacher || 100
      });

      res.json({
        success: true,
        message: 'API配置更新成功'
      });
    } else {
      // 创建新配置
      await ApiConfig.create({
        apiEndpoint,
        apiKey: encryptedKey,
        model,
        dailyLimitPerTeacher: dailyLimitPerTeacher || 10,
        monthlyLimitPerTeacher: monthlyLimitPerTeacher || 100,
        isActive: true,
        createdBy: req.user?.id
      });

      res.json({
        success: true,
        message: 'API配置创建成功'
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: error.message
    });
  }
};

// 测试API连通性
export const testApiConnection = async (req: AuthRequest, res: Response) => {
  try {
    const { apiEndpoint, apiKey, model } = req.body;

    const axios = require('axios');

    const response = await axios.post(
      apiEndpoint,
      {
        model,
        messages: [
          {
            role: 'user',
            content: '测试连接'
          }
        ],
        max_tokens: 10
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        timeout: 10000
      }
    );

    res.json({
      success: true,
      message: 'API连接测试成功',
      data: {
        model: response.data.model || model
      }
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: 'CONNECTION_FAILED',
      message: error.response?.data?.error?.message || error.message
    });
  }
};

// ========== AI分析接口 ==========

// 获取教师分析统计
export const getAnalysisStats = async (req: AuthRequest, res: Response) => {
  try {
    const teacherId = req.user?.id;
    if (!teacherId) {
      return res.status(401).json({
        success: false,
        error: 'UNAUTHORIZED',
        message: '未授权'
      });
    }

    const stats = await getTeacherAnalysisStats(teacherId);

    res.json({
      success: true,
      data: stats
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: error.message
    });
  }
};

// 发起AI分析
export const createAnalysis = async (req: AuthRequest, res: Response) => {
  try {
    const { courseIds, courseNames, examType, analysisDimensions, customInstruction } = req.body;
    const teacherId = req.user?.id;
    const teacherName = req.user?.username;

    if (!teacherId) {
      return res.status(401).json({
        success: false,
        error: 'UNAUTHORIZED',
        message: '未授权'
      });
    }

    // 验证必填字段
    if (!courseIds || !courseNames || !analysisDimensions || analysisDimensions.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: '请选择课程和分析维度'
      });
    }

    // 检查调用限额
    const stats = await getTeacherAnalysisStats(teacherId);
    if (stats.remainingToday <= 0) {
      return res.status(429).json({
        success: false,
        error: 'QUOTA_EXCEEDED',
        message: '今日API调用次数已达上限'
      });
    }

    // 创建分析记录
    const analysis = await AnalysisRecord.create({
      teacherId,
      teacherName,
      courseIds: JSON.stringify(courseIds),
      courseNames: JSON.stringify(courseNames),
      examType,
      analysisDimensions: JSON.stringify(analysisDimensions),
      customInstruction,
      status: 'pending'
    });

    // 异步执行AI分析
    performAIAnalysis(analysis.id).catch(error => {
      console.error('AI分析执行失败:', error);
    });

    res.json({
      success: true,
      message: 'AI分析已发起',
      data: {
        analysisId: analysis.id,
        status: 'pending'
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: error.message
    });
  }
};

// 获取分析记录列表
export const getAnalysisRecords = async (req: AuthRequest, res: Response) => {
  try {
    const teacherId = req.user?.id;
    const userRole = req.user?.role;
    const { page = 1, limit = 10, status } = req.query;

    const whereClause: any = {
      deletedAt: null
    };

    // 管理员可以查看所有记录，教师只能查看自己的记录
    if (userRole !== 'admin') {
      whereClause.teacherId = teacherId;
    }

    if (status) {
      whereClause.status = status;
    }

    const { count, rows } = await AnalysisRecord.findAndCountAll({
      where: whereClause,
      limit: Number(limit),
      offset: (Number(page) - 1) * Number(limit),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        records: rows,
        total: count,
        page: Number(page),
        limit: Number(limit)
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: error.message
    });
  }
};

// 获取分析记录详情
export const getAnalysisRecord = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const teacherId = req.user?.id;
    const userRole = req.user?.role;

    const whereClause: any = {
      id,
      deletedAt: null
    };

    // 管理员可以查看所有记录，教师只能查看自己的记录
    if (userRole !== 'admin') {
      whereClause.teacherId = teacherId;
    }

    const record = await AnalysisRecord.findOne({
      where: whereClause
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: '分析记录不存在'
      });
    }

    // 解析分析结果
    let analysisResult = null;
    if (record.analysisResult) {
      try {
        analysisResult = JSON.parse(record.analysisResult);
      } catch (error) {
        console.error('解析分析结果失败:', error);
      }
    }

    res.json({
      success: true,
      data: {
        ...record.toJSON(),
        analysisResult
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: error.message
    });
  }
};

// 删除分析记录
export const deleteAnalysisRecord = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const teacherId = req.user?.id;
    const userRole = req.user?.role;

    const whereClause: any = {
      id,
      deletedAt: null
    };

    // 管理员可以删除所有记录，教师只能删除自己的记录
    if (userRole !== 'admin') {
      whereClause.teacherId = teacherId;
    }

    const record = await AnalysisRecord.findOne({
      where: whereClause
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: '分析记录不存在'
      });
    }

    // 软删除
    await record.update({
      status: 'deleted',
      deletedAt: new Date()
    });

    res.json({
      success: true,
      message: '分析记录已删除'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: error.message
    });
  }
};

// 批量删除分析记录
export const batchDeleteAnalysisRecords = async (req: AuthRequest, res: Response) => {
  try {
    const { ids } = req.body;
    const teacherId = req.user?.id;
    const userRole = req.user?.role;

    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: '请提供要删除的记录ID数组'
      });
    }

    const whereClause: any = {
      id: ids,
      deletedAt: null
    };

    // 管理员可以删除所有记录，教师只能删除自己的记录
    if (userRole !== 'admin') {
      whereClause.teacherId = teacherId;
    }

    await AnalysisRecord.update(
      {
        status: 'deleted',
        deletedAt: new Date()
      },
      {
        where: whereClause
      }
    );

    res.json({
      success: true,
      message: `成功删除${ids.length}条记录`
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: error.message
    });
  }
};

// ========== 分析模板管理 ==========

// 获取分析模板列表
export const getAnalysisTemplates = async (req: AuthRequest, res: Response) => {
  try {
    const teacherId = req.user?.id;

    const templates = await AnalysisTemplate.findAll({
      where: {
        [Op.or]: [
          { isGlobal: true },
          { createdBy: teacherId }
        ]
      },
      order: [['isGlobal', 'DESC'], ['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: templates
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: error.message
    });
  }
};

// 创建分析模板
export const createAnalysisTemplate = async (req: AuthRequest, res: Response) => {
  try {
    const { templateName, description, analysisDimensions, defaultPrompt, isGlobal } = req.body;
    const teacherId = req.user?.id;

    if (!templateName || !analysisDimensions || analysisDimensions.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: '模板名称和分析维度为必填项'
      });
    }

    // 检查权限：只有管理员可以创建全局模板
    if (isGlobal && req.user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'FORBIDDEN',
        message: '只有管理员可以创建全局模板'
      });
    }

    await AnalysisTemplate.create({
      templateName,
      description,
      analysisDimensions: JSON.stringify(analysisDimensions),
      defaultPrompt,
      isGlobal: isGlobal || false,
      createdBy: teacherId
    });

    res.json({
      success: true,
      message: '模板创建成功'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: error.message
    });
  }
};

// 更新分析模板
export const updateAnalysisTemplate = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { templateName, description, analysisDimensions, defaultPrompt } = req.body;
    const teacherId = req.user?.id;

    const template = await AnalysisTemplate.findByPk(id);

    if (!template) {
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: '模板不存在'
      });
    }

    // 检查权限：只能修改自己创建的模板或管理员可以修改全局模板
    if (template.isGlobal && req.user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'FORBIDDEN',
        message: '只有管理员可以修改全局模板'
      });
    }

    if (!template.isGlobal && template.createdBy !== teacherId) {
      return res.status(403).json({
        success: false,
        error: 'FORBIDDEN',
        message: '只能修改自己创建的模板'
      });
    }

    await template.update({
      templateName,
      description,
      analysisDimensions: JSON.stringify(analysisDimensions),
      defaultPrompt
    });

    res.json({
      success: true,
      message: '模板更新成功'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: error.message
    });
  }
};

// 删除分析模板
export const deleteAnalysisTemplate = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const teacherId = req.user?.id;

    const template = await AnalysisTemplate.findByPk(id);

    if (!template) {
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: '模板不存在'
      });
    }

    // 检查权限
    if (template.isGlobal && req.user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'FORBIDDEN',
        message: '只有管理员可以删除全局模板'
      });
    }

    if (!template.isGlobal && template.createdBy !== teacherId) {
      return res.status(403).json({
        success: false,
        error: 'FORBIDDEN',
        message: '只能删除自己创建的模板'
      });
    }

    await template.destroy();

    res.json({
      success: true,
      message: '模板删除成功'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: error.message
    });
  }
};
