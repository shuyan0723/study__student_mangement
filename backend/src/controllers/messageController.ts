import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Op } from 'sequelize';
import Message from '../models/Message';
import User from '../models/User';

export const getAllMessages = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { page = 1, limit = 20, is_read } = req.query;

    const whereClause: any = {
      [Op.or]: [
        { sender_id: user.id },
        { receiver_id: user.id }
      ]
    };

    if (is_read !== undefined) {
      whereClause.is_read = is_read === 'true';
    }

    const offset = (Number(page) - 1) * Number(limit);

    const messages = await Message.findAndCountAll({
      where: whereClause,
      limit: Number(limit),
      offset,
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'username', 'avatar_url']
        },
        {
          model: User,
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
  } catch (error) {
    console.error('Get all messages error:', error);
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to retrieve messages'
    });
  }
};

export const getMessageById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = (req as any).user;

    const message = await Message.findByPk(id, {
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'username', 'avatar_url']
        },
        {
          model: User,
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
  } catch (error) {
    console.error('Get message by ID error:', error);
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to retrieve message'
    });
  }
};

export const getConversation = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { otherUserId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const offset = (Number(page) - 1) * Number(limit);

    const messages = await Message.findAndCountAll({
      where: {
        [Op.or]: [
          { sender_id: user.id, receiver_id: otherUserId },
          { sender_id: otherUserId, receiver_id: user.id }
        ]
      },
      limit: Number(limit),
      offset,
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'username', 'avatar_url']
        },
        {
          model: User,
          as: 'receiver',
          attributes: ['id', 'username', 'avatar_url']
        }
      ],
      order: [['created_at', 'ASC']]
    });

    const otherUser = await User.findByPk(otherUserId, {
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
  } catch (error) {
    console.error('Get conversation error:', error);
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to retrieve conversation'
    });
  }
};

export const getContacts = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const sentMessages = await Message.findAll({
      where: { sender_id: user.id },
      attributes: ['receiver_id', 'created_at'],
      order: [['created_at', 'DESC']]
    });

    const receivedMessages = await Message.findAll({
      where: { receiver_id: user.id },
      attributes: ['sender_id', 'created_at'],
      order: [['created_at', 'DESC']]
    });

    const contactIds = new Set<string>();
    sentMessages.forEach(m => contactIds.add(m.receiver_id));
    receivedMessages.forEach(m => contactIds.add(m.sender_id));

    const contacts = [];
    for (const contactId of contactIds) {
      const contact = await User.findByPk(contactId, {
        attributes: ['id', 'username', 'avatar_url', 'role']
      });

      if (contact) {
        const lastMessage = await Message.findOne({
          where: {
            [Op.or]: [
              { sender_id: user.id, receiver_id: contactId },
              { sender_id: contactId, receiver_id: user.id }
            ]
          },
          order: [['created_at', 'DESC']]
        });

        const unreadCount = await Message.count({
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
  } catch (error) {
    console.error('Get contacts error:', error);
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to retrieve contacts'
    });
  }
};

export const getUnreadCount = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const unreadCount = await Message.count({
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
  } catch (error) {
    console.error('Get unread count error:', error);
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to retrieve unread count'
    });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: errors.array()
      });
    }

    const user = (req as any).user;
    const { receiver_id, content } = req.body;

    if (receiver_id === user.id) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Cannot send message to yourself'
      });
    }

    const receiver = await User.findByPk(receiver_id);
    if (!receiver) {
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: 'Receiver not found'
      });
    }

    const message = await Message.create({
      sender_id: user.id,
      receiver_id,
      content,
      is_read: false
    });

    const createdMessage = await Message.findByPk(message.id, {
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'username', 'avatar_url']
        },
        {
          model: User,
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
  } catch (error) {
    console.error('Send message error:', error);
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to send message'
    });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = (req as any).user;

    const message = await Message.findByPk(id);
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

    await Message.update({
      is_read: true,
      read_at: new Date()
    }, {
      where: { id }
    });

    const updatedMessage = await Message.findByPk(id, {
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'username', 'avatar_url']
        },
        {
          model: User,
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
  } catch (error) {
    console.error('Mark as read error:', error);
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to mark message as read'
    });
  }
};

export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    await Message.update({
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
  } catch (error) {
    console.error('Mark all as read error:', error);
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to mark all messages as read'
    });
  }
};

export const deleteMessage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = (req as any).user;

    const message = await Message.findByPk(id);
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

    await Message.destroy({
      where: { id }
    });

    return res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Delete message error:', error);
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to delete message'
    });
  }
};

export default {
  getAllMessages,
  getMessageById,
  getConversation,
  getContacts,
  getUnreadCount,
  sendMessage,
  markAsRead,
  markAllAsRead,
  deleteMessage
};
