"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const aiAnalysisController_1 = require("../controllers/aiAnalysisController");
const router = (0, express_1.Router)();
// ========== API配置管理（仅管理员）==========
// 获取API配置
router.get('/config', authMiddleware_1.authMiddleware, aiAnalysisController_1.getApiConfig);
// 创建/更新API配置
router.post('/config', authMiddleware_1.authMiddleware, aiAnalysisController_1.upsertApiConfig);
// 测试API连通性
router.post('/config/test', authMiddleware_1.authMiddleware, aiAnalysisController_1.testApiConnection);
// ========== AI分析接口 ==========
// 获取分析统计
router.get('/stats', authMiddleware_1.authMiddleware, aiAnalysisController_1.getAnalysisStats);
// 发起AI分析
router.post('/analyze', authMiddleware_1.authMiddleware, aiAnalysisController_1.createAnalysis);
// 获取分析记录列表
router.get('/records', authMiddleware_1.authMiddleware, aiAnalysisController_1.getAnalysisRecords);
// 获取分析记录详情
router.get('/records/:id', authMiddleware_1.authMiddleware, aiAnalysisController_1.getAnalysisRecord);
// 删除分析记录
router.delete('/records/:id', authMiddleware_1.authMiddleware, aiAnalysisController_1.deleteAnalysisRecord);
// 批量删除分析记录
router.post('/records/batch-delete', authMiddleware_1.authMiddleware, aiAnalysisController_1.batchDeleteAnalysisRecords);
// ========== 分析模板管理 ==========
// 获取分析模板列表
router.get('/templates', authMiddleware_1.authMiddleware, aiAnalysisController_1.getAnalysisTemplates);
// 创建分析模板
router.post('/templates', authMiddleware_1.authMiddleware, aiAnalysisController_1.createAnalysisTemplate);
// 更新分析模板
router.put('/templates/:id', authMiddleware_1.authMiddleware, aiAnalysisController_1.updateAnalysisTemplate);
// 删除分析模板
router.delete('/templates/:id', authMiddleware_1.authMiddleware, aiAnalysisController_1.deleteAnalysisTemplate);
exports.default = router;
