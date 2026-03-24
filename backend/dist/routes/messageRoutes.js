"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const authMiddleware_1 = require("../middleware/authMiddleware");
const messageController_1 = require("../controllers/messageController");
const router = (0, express_1.Router)();
router.get('/', authMiddleware_1.authMiddleware, messageController_1.getAllMessages);
router.get('/unread-count', authMiddleware_1.authMiddleware, messageController_1.getUnreadCount);
router.get('/contacts', authMiddleware_1.authMiddleware, messageController_1.getContacts);
router.get('/:id', authMiddleware_1.authMiddleware, [
    (0, express_validator_1.param)('id').notEmpty().withMessage('Message ID is required')
], messageController_1.getMessageById);
router.get('/conversation/:otherUserId', authMiddleware_1.authMiddleware, [
    (0, express_validator_1.param)('otherUserId').notEmpty().withMessage('User ID is required')
], messageController_1.getConversation);
router.post('/', authMiddleware_1.authMiddleware, [
    (0, express_validator_1.body)('receiver_id').notEmpty().withMessage('Receiver ID is required'),
    (0, express_validator_1.body)('content').notEmpty().isLength({ min: 1, max: 1000 }).withMessage('Content must be between 1 and 1000 characters')
], messageController_1.sendMessage);
router.put('/:id/read', authMiddleware_1.authMiddleware, [
    (0, express_validator_1.param)('id').notEmpty().withMessage('Message ID is required')
], messageController_1.markAsRead);
router.put('/read-all', authMiddleware_1.authMiddleware, messageController_1.markAllAsRead);
router.delete('/:id', authMiddleware_1.authMiddleware, [
    (0, express_validator_1.param)('id').notEmpty().withMessage('Message ID is required')
], messageController_1.deleteMessage);
exports.default = router;
