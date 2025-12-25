import { Router, Request, Response } from 'express';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// 获取学生列表
router.get('/', authenticate, authorize('admin', 'teacher'), (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Get students list',
    data: { items: [], total: 0, page: 1, limit: 10, pages: 0 }
  });
});

// 获取学生详情
router.get('/:id', authenticate, (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Get student detail',
    data: {}
  });
});

// 创建学生
router.post('/', authenticate, authorize('admin'), (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Student created',
    data: {}
  });
});

// 更新学生
router.put('/:id', authenticate, authorize('admin'), (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Student updated',
    data: {}
  });
});

// 删除学生
router.delete('/:id', authenticate, authorize('admin'), (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Student deleted'
  });
});

export default router;
