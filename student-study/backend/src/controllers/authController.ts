import { Request, Response, NextFunction } from 'express';
import authService from '../services/authService.js';
import type { ApiResponse, LoginRequest } from '../types/index.js';
import { CustomError } from '../middleware/errorHandler.js';

export class AuthController {
  // 登录
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = req.body as LoginRequest;

      if (!username || !password) {
        throw new CustomError(
          'MISSING_FIELDS',
          'Username and password are required',
          400
        );
      }

      const result = await authService.login({ username, password });

      res.json({
        success: true,
        message: 'Login successful',
        data: result
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }

  // 注册
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password, email, role } = req.body;

      if (!username || !password) {
        throw new CustomError(
          'MISSING_FIELDS',
          'Username and password are required',
          400
        );
      }

      const result = await authService.register(
        username,
        password,
        email,
        role || 'student'
      );

      res.json({
        success: true,
        message: 'Registration successful',
        data: result
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }

  // 刷新 Token
  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        throw new CustomError(
          'MISSING_FIELDS',
          'Refresh token is required',
          400
        );
      }

      const result = await authService.refreshToken(refreshToken);

      res.json({
        success: true,
        message: 'Token refreshed',
        data: result
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }

  // 登出
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      // 登出逻辑可以在前端处理（清除 token）
      // 或者在后端维护 token 黑名单
      res.json({
        success: true,
        message: 'Logout successful'
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }

  // 忘记密码
  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { username } = req.body;

      if (!username) {
        throw new CustomError(
          'MISSING_FIELDS',
          'Username is required',
          400
        );
      }

      const result = await authService.forgotPassword(username);

      res.json({
        success: true,
        message: result.message,
        data: result
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }

  // 重置密码
  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { oldPassword, newPassword } = req.body;

      if (!oldPassword || !newPassword) {
        throw new CustomError(
          'MISSING_FIELDS',
          'Old password and new password are required',
          400
        );
      }

      if (!req.user) {
        throw new CustomError(
          'NO_USER',
          'User not authenticated',
          401
        );
      }

      const result = await authService.resetPassword(
        req.user.id,
        oldPassword,
        newPassword
      );

      res.json({
        success: true,
        message: result.message
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
