"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMessage = exports.markAllAsRead = exports.markAsRead = exports.sendMessage = exports.getUnreadCount = exports.getContacts = exports.getConversation = exports.getMessageById = exports.getAllMessages = void 0;
const express_validator_1 = require("express-validator");
const sequelize_1 = require("sequelize");
const Message_1 = __importDefault(require("../models/Message"));
const User_1 = __importDefault(require("../models/User"));
const getAllMessages = async (req, res) => {
    try {
        const user = req.user;
        const { page = 1, limit = 20, is_read } = req.query;
        const whereClause = {
            [sequelize_1.Op.or]: [
                { sender_id: user.id },
                { receiver_id: user.id }
            ]
        };
        if (is_read !== undefined) {
            whereClause.is_read = is_read === 'true';
        }
        const offset = (Number(page) - 1) * Number(limit);
        const messages = await Message_1.default.findAndCountAll({
            where: whereClause,
            limit: Number(limit),
            offset,
            include: [
                {
                    model: User_1.default,
                    as: 'sender',
                    attributes: ['id', 'username', 'avatar_url']
                },
                {
                    model: User_1.default,
                    as: 'receiver',
                    attributes: ['id', 'username', 'avatar_url']
                }
            ],
            order: [['created_at', 'DESC']]
        });
        return res.status(200).json({
            success: true,
            data: {
                messages: messages.rows,
                total: messages.count,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(messages.count / Number(limit))
            },
            message: 'Messages retrieved successfully'
        });
    }
    catch (error) {
        console.error('Get all messages error:', error);
        return res.status(500).json({
            success: false,
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to retrieve messages'
        });
    }
};
exports.getAllMessages = getAllMessages;
const getMessageById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;
        const message = await Message_1.default.findByPk(id, {
            include: [
                {
                    model: User_1.default,
                    as: 'sender',
                    attributes: ['id', 'username', 'avatar_url']
                },
                {
                    model: User_1.default,
                    as: 'receiver',
                    attributes: ['id', 'username', 'avatar_url']
                }
            ]
        });
        if (!message) {
            return res.status(404).json({
                success: false,
                error: 'NOT_FOUND',
                message: 'Message not found'
            });
        }
        if (message.sender_id !== user.id && message.receiver_id !== user.id) {
            return res.status(403).json({
                success: false,
                error: 'AUTHORIZATION_FAILED',
                message: 'Not authorized to view this message'
            });
        }
        return res.status(200).json({
            success: true,
            data: message,
            message: 'Message retrieved successfully'
        });
    }
    catch (error) {
        console.error('Get message by ID error:', error);
        return res.status(500).json({
            success: false,
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to retrieve message'
        });
    }
};
exports.getMessageById = getMessageById;
const getConversation = async (req, res) => {
    try {
        const user = req.user;
        const { otherUserId } = req.params;
        const { page = 1, limit = 50 } = req.query;
        const offset = (Number(page) - 1) * Number(limit);
        const messages = await Message_1.default.findAndCountAll({
            where: {
                [sequelize_1.Op.or]: [
                    { sender_id: user.id, receiver_id: otherUserId },
                    { sender_id: otherUserId, receiver_id: user.id }
                ]
            },
            limit: Number(limit),
            offset,
            include: [
                {
                    model: User_1.default,
                    as: 'sender',
                    attributes: ['id', 'username', 'avatar_url']
                },
                {
                    model: User_1.default,
                    as: 'receiver',
                    attributes: ['id', 'username', 'avatar_url']
                }
            ],
            order: [['created_at', 'ASC']]
        });
        const otherUser = await User_1.default.findByPk(otherUserId, {
            attributes: ['id', 'username', 'avatar_url']
        });
        return res.status(200).json({
            success: true,
            data: {
                conversationWith: otherUser,
                messages: messages.rows,
                total: messages.count,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(messages.count / Number(limit))
            },
            message: 'Conversation retrieved successfully'
        });
    }
    catch (error) {
        console.error('Get conversation error:', error);
        return res.status(500).json({
            success: false,
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to retrieve conversation'
        });
    }
};
exports.getConversation = getConversation;
const getContacts = async (req, res) => {
    try {
        const user = req.user;
        const sentMessages = await Message_1.default.findAll({
            where: { sender_id: user.id },
            attributes: ['receiver_id', 'created_at'],
            order: [['created_at', 'DESC']]
        });
        const receivedMessages = await Message_1.default.findAll({
            where: { receiver_id: user.id },
            attributes: ['sender_id', 'created_at'],
            order: [['created_at', 'DESC']]
        });
        const contactIds = new Set();
        sentMessages.forEach(m => contactIds.add(m.receiver_id));
        receivedMessages.forEach(m => contactIds.add(m.sender_id));
        const contacts = [];
        for (const contactId of contactIds) {
            const contact = await User_1.default.findByPk(contactId, {
                attributes: ['id', 'username', 'avatar_url', 'role']
            });
            if (contact) {
                const lastMessage = await Message_1.default.findOne({
                    where: {
                        [sequelize_1.Op.or]: [
                            { sender_id: user.id, receiver_id: contactId },
                            { sender_id: contactId, receiver_id: user.id }
                        ]
                    },
                    order: [['created_at', 'DESC']]
                });
                const unreadCount = await Message_1.default.count({
                    where: {
                        sender_id: contactId,
                        receiver_id: user.id,
                        is_read: false
                    }
                });
                contacts.push({
                    user: contact,
                    lastMessage: lastMessage ? {
                        content: lastMessage.content.length > 50
                            ? lastMessage.content.substring(0, 50) + '...'
                            : lastMessage.content,
                        created_at: lastMessage.created_at
                    } : null,
                    unreadCount
                });
            }
        }
        contacts.sort((a, b) => {
            const dateA = a.lastMessage?.created_at || new Date(0);
            const dateB = b.lastMessage?.created_at || new Date(0);
            return dateB.getTime() - dateA.getTime();
        });
        return res.status(200).json({
            success: true,
            data: contacts,
            message: 'Contacts retrieved successfully'
        });
    }
    catch (error) {
        console.error('Get contacts error:', error);
        return res.status(500).json({
            success: false,
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to retrieve contacts'
        });
    }
};
exports.getContacts = getContacts;
const getUnreadCount = async (req, res) => {
    try {
        const user = req.user;
        const unreadCount = await Message_1.default.count({
            where: {
                receiver_id: user.id,
                is_read: false
            }
        });
        return res.status(200).json({
            success: true,
            data: { unreadCount },
            message: 'Unread count retrieved successfully'
        });
    }
    catch (error) {
        console.error('Get unread count error:', error);
        return res.status(500).json({
            success: false,
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to retrieve unread count'
        });
    }
};
exports.getUnreadCount = getUnreadCount;
const sendMessage = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'VALIDATION_ERROR',
                message: 'Validation failed',
                details: errors.array()
            });
        }
        const user = req.user;
        const { receiver_id, content } = req.body;
        if (receiver_id === user.id) {
            return res.status(400).json({
                success: false,
                error: 'VALIDATION_ERROR',
                message: 'Cannot send message to yourself'
            });
        }
        const receiver = await User_1.default.findByPk(receiver_id);
        if (!receiver) {
            return res.status(404).json({
                success: false,
                error: 'NOT_FOUND',
                message: 'Receiver not found'
            });
        }
        const message = await Message_1.default.create({
            sender_id: user.id,
            receiver_id,
            content,
            is_read: false
        });
        const createdMessage = await Message_1.default.findByPk(message.id, {
            include: [
                {
                    model: User_1.default,
                    as: 'sender',
                    attributes: ['id', 'username', 'avatar_url']
                },
                {
                    model: User_1.default,
                    as: 'receiver',
                    attributes: ['id', 'username', 'avatar_url']
                }
            ]
        });
        return res.status(201).json({
            success: true,
            data: createdMessage,
            message: 'Message sent successfully'
        });
    }
    catch (error) {
        console.error('Send message error:', error);
        return res.status(500).json({
            success: false,
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to send message'
        });
    }
};
exports.sendMessage = sendMessage;
const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;
        const message = await Message_1.default.findByPk(id);
        if (!message) {
            return res.status(404).json({
                success: false,
                error: 'NOT_FOUND',
                message: 'Message not found'
            });
        }
        if (message.receiver_id !== user.id) {
            return res.status(403).json({
                success: false,
                error: 'AUTHORIZATION_FAILED',
                message: 'Not authorized to mark this message as read'
            });
        }
        await Message_1.default.update({
            is_read: true,
            read_at: new Date()
        }, {
            where: { id }
        });
        const updatedMessage = await Message_1.default.findByPk(id, {
            include: [
                {
                    model: User_1.default,
                    as: 'sender',
                    attributes: ['id', 'username', 'avatar_url']
                },
                {
                    model: User_1.default,
                    as: 'receiver',
                    attributes: ['id', 'username', 'avatar_url']
                }
            ]
        });
        return res.status(200).json({
            success: true,
            data: updatedMessage,
            message: 'Message marked as read'
        });
    }
    catch (error) {
        console.error('Mark as read error:', error);
        return res.status(500).json({
            success: false,
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to mark message as read'
        });
    }
};
exports.markAsRead = markAsRead;
const markAllAsRead = async (req, res) => {
    try {
        const user = req.user;
        await Message_1.default.update({
            is_read: true,
            read_at: new Date()
        }, {
            where: {
                receiver_id: user.id,
                is_read: false
            }
        });
        return res.status(200).json({
            success: true,
            message: 'All messages marked as read'
        });
    }
    catch (error) {
        console.error('Mark all as read error:', error);
        return res.status(500).json({
            success: false,
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to mark all messages as read'
        });
    }
};
exports.markAllAsRead = markAllAsRead;
const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;
        const message = await Message_1.default.findByPk(id);
        if (!message) {
            return res.status(404).json({
                success: false,
                error: 'NOT_FOUND',
                message: 'Message not found'
            });
        }
        if (message.sender_id !== user.id && message.receiver_id !== user.id) {
            return res.status(403).json({
                success: false,
                error: 'AUTHORIZATION_FAILED',
                message: 'Not authorized to delete this message'
            });
        }
        await Message_1.default.destroy({
            where: { id }
        });
        return res.status(200).json({
            success: true,
            message: 'Message deleted successfully'
        });
    }
    catch (error) {
        console.error('Delete message error:', error);
        return res.status(500).json({
            success: false,
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to delete message'
        });
    }
};
exports.deleteMessage = deleteMessage;
exports.default = {
    getAllMessages: exports.getAllMessages,
    getMessageById: exports.getMessageById,
    getConversation: exports.getConversation,
    getContacts: exports.getContacts,
    getUnreadCount: exports.getUnreadCount,
    sendMessage: exports.sendMessage,
    markAsRead: exports.markAsRead,
    markAllAsRead: exports.markAllAsRead,
    deleteMessage: exports.deleteMessage
};
