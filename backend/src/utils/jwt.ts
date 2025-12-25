import jwt from 'jsonwebtoken';
import { UserRole } from '../types';

interface JwtPayload {
  userId: string;
  username: string;
  role: UserRole;
  email?: string;
}

// Generate access token
export const generateAccessToken = (payload: JwtPayload): string => {
  const secret = process.env.JWT_ACCESS_SECRET || 'access_secret_key';
  const expiresIn = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
  
  return jwt.sign(payload, secret, { expiresIn });
};

// Generate refresh token
export const generateRefreshToken = (payload: JwtPayload): string => {
  const secret = process.env.JWT_REFRESH_SECRET || 'refresh_secret_key';
  const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
  
  return jwt.sign(payload, secret, { expiresIn });
};

// Verify access token
export const verifyAccessToken = (token: string): JwtPayload | null => {
  try {
    const secret = process.env.JWT_ACCESS_SECRET || 'access_secret_key';
    return jwt.verify(token, secret) as JwtPayload;
  } catch (error) {
    return null;
  }
};

// Verify refresh token
export const verifyRefreshToken = (token: string): JwtPayload | null => {
  try {
    const secret = process.env.JWT_REFRESH_SECRET || 'refresh_secret_key';
    return jwt.verify(token, secret) as JwtPayload;
  } catch (error) {
    return null;
  }
};

// Extract token from Authorization header
export const extractTokenFromHeader = (header: string | undefined): string | null => {
  if (!header) return null;
  const [type, token] = header.split(' ');
  return type === 'Bearer' ? token : null;
};
