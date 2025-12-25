import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/auth';
const router = Router();
router.get('/', authenticate, (req: Request, res: Response) => res.json({ success: true, data: {} }));
router.put('/', authenticate, (req: Request, res: Response) => res.json({ success: true }));
export default router;
