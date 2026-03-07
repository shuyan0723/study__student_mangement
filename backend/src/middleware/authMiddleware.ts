import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, extractTokenFromHeader } from '../utils/jwt';
import User from '../models/User';

// Authentication middleware
export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Extract token from header
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'AUTHENTICATION_FAILED',
        message: 'Access token not provided'
      });
      return;
    }

    // Verify token
    const decoded = verifyAccessToken(token);

    if (!decoded) {
      res.status(401).json({
        success: false,
        error: 'AUTHENTICATION_FAILED',
        message: 'Invalid or expired access token'
      });
      return;
    }

    // Find user
    const user = await User.findByPk(decoded.userId, {
      attributes: ['id', 'username', 'email', 'avatar_url', 'role', 'status']
    });

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'AUTHENTICATION_FAILED',
        message: 'User not found'
      });
      return;
    }

    if (user.status !== 'active') {
      res.status(403).json({
        success: false,
        error: 'ACCOUNT_INACTIVE',
        message: 'Account is inactive or locked'
      });
      return;
    }

    // Attach user to request
    (req as any).user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Authentication failed due to server error'
    });
  }
};

// Role-based authorization middleware
export const authorizeRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user;

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'AUTHENTICATION_FAILED',
        message: 'User not authenticated'
      });
      return;
    }

    if (!roles.includes(user.role)) {
      res.status(403).json({
        success: false,
        error: 'AUTHORIZATION_FAILED',
        message: 'Insufficient permissions'
      });
      return;
    }

    next();
  };
};
