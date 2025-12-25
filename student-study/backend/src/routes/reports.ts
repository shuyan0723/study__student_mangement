import { Router, Request, Response } from 'express';
import { authenticate, authorize } from '../middleware/auth';
const router = Router();
router.get('/grades', authenticate, authorize('admin', 'teacher'), (req: Request, res: Response) => res.json({ success: true, data: {} }));
router.get('/enrollment', authenticate, authorize('admin'), (req: Request, res: Response) => res.json({ success: true, data: {} }));
export default router;
