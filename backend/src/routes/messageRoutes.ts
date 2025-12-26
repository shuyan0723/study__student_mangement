import { Router } from 'express';
import { body, param } from 'express-validator';
import { authMiddleware } from '../middleware/authMiddleware';
import {
  getAllMessages,
  getMessageById,
  getConversation,
  getContacts,
  getUnreadCount,
  sendMessage,
  markAsRead,
  markAllAsRead,
  deleteMessage
} from '../controllers/messageController';

const router = Router();

router.get(
  '/',
  authMiddleware,
  getAllMessages
);

router.get(
  '/unread-count',
  authMiddleware,
  getUnreadCount
);

router.get(
  '/contacts',
  authMiddleware,
  getContacts
);

router.get(
  '/:id',
  authMiddleware,
  [
    param('id').notEmpty().withMessage('Message ID is required')
  ],
  getMessageById
);

router.get(
  '/conversation/:otherUserId',
  authMiddleware,
  [
    param('otherUserId').notEmpty().withMessage('User ID is required')
  ],
  getConversation
);

router.post(
  '/',
  authMiddleware,
  [
    body('receiver_id').notEmpty().withMessage('Receiver ID is required'),
    body('content').notEmpty().isLength({ min: 1, max: 1000 }).withMessage('Content must be between 1 and 1000 characters')
  ],
  sendMessage
);

router.put(
  '/:id/read',
  authMiddleware,
  [
    param('id').notEmpty().withMessage('Message ID is required')
  ],
  markAsRead
);

router.put(
  '/read-all',
  authMiddleware,
  markAllAsRead
);

router.delete(
  '/:id',
  authMiddleware,
  [
    param('id').notEmpty().withMessage('Message ID is required')
  ],
  deleteMessage
);

export default router;
