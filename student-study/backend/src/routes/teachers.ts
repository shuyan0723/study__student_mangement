import { Router, Request, Response } from 'express';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, authorize('admin'), (req: Request, res: Response) => {
  res.json({ success: true, message: 'Teachers list', data: [] });
});

router.post('/', authenticate, authorize('admin'), (req: Request, res: Response) => {
  res.json({ success: true, message: 'Teacher created', data: {} });
});

export default router;
