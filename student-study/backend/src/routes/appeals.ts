import { Router, Request, Response } from 'express';
import { authenticate, authorize } from '../middleware/auth';
const router = Router();
router.get('/', authenticate, (req: Request, res: Response) => res.json({ success: true, data: [] }));
router.post('/', authenticate, authorize('student'), (req: Request, res: Response) => res.json({ success: true }));
export default router;
