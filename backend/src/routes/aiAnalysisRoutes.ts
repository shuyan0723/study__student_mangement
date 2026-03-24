import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import {
  getApiConfig,
  upsertApiConfig,
  testApiConnection,
  getAnalysisStats,
  createAnalysis,
  getAnalysisRecords,
  getAnalysisRecord,
  deleteAnalysisRecord,
  batchDeleteAnalysisRecords,
  getAnalysisTemplates,
  createAnalysisTemplate,
  updateAnalysisTemplate,
  deleteAnalysisTemplate
} from '../controllers/aiAnalysisController';

const router = Router();

// ========== API配置管理（仅管理员）==========

// 获取API配置
router.get('/config', authMiddleware, getApiConfig);

// 创建/更新API配置
router.post('/config', authMiddleware, upsertApiConfig);

// 测试API连通性
router.post('/config/test', authMiddleware, testApiConnection);

// ========== AI分析接口 ==========

// 获取分析统计
router.get('/stats', authMiddleware, getAnalysisStats);

// 发起AI分析
router.post('/analyze', authMiddleware, createAnalysis);

// 获取分析记录列表
router.get('/records', authMiddleware, getAnalysisRecords);

// 获取分析记录详情
router.get('/records/:id', authMiddleware, getAnalysisRecord);

// 删除分析记录
router.delete('/records/:id', authMiddleware, deleteAnalysisRecord);

// 批量删除分析记录
router.post('/records/batch-delete', authMiddleware, batchDeleteAnalysisRecords);

// ========== 分析模板管理 ==========

// 获取分析模板列表
router.get('/templates', authMiddleware, getAnalysisTemplates);

// 创建分析模板
router.post('/templates', authMiddleware, createAnalysisTemplate);

// 更新分析模板
router.put('/templates/:id', authMiddleware, updateAnalysisTemplate);

// 删除分析模板
router.delete('/templates/:id', authMiddleware, deleteAnalysisTemplate);

export default router;
