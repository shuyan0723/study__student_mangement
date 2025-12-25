import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { CustomError } from './errorHandler';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        username: string;
        role: 'student' | 'teacher' | 'admin';
      };
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new CustomError('NO_TOKEN', 'No token provided', 401);
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    req.user = decoded as any;
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      throw new CustomError('TOKEN_EXPIRED', 'Token has expired', 401);
    }
    if (error.name === 'JsonWebTokenError') {
      throw new CustomError('INVALID_TOKEN', 'Invalid token', 401);
    }
    throw error;
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new CustomError('NO_USER', 'User not found', 401);
    }

    if (!roles.includes(req.user.role)) {
      throw new CustomError('FORBIDDEN', 'You do not have permission to access this resource', 403);
    }

    next();
  };
};

export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      req.user = decoded as any;
    }
  } catch (error) {
    // Optional auth, so we don't throw
  }

  next();
};
