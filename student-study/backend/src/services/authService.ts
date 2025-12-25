import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/User';
import type { LoginRequest, LoginResponse, IUser } from '../types/index';
import { CustomError } from '../middleware/errorHandler';

export class AuthService {
  // 生成 JWT Token
  generateTokens(userId: string, role: string) {
    const accessToken = jwt.sign(
      {
        sub: userId,
        role,
        type: 'access'
      },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_ACCESS_EXPIRE || '24h' }
    );

    const refreshToken = jwt.sign(
      {
        sub: userId,
        type: 'refresh'
      },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
    );

    return { accessToken, refreshToken };
  }

  // 登录
  async login(loginRequest: LoginRequest): Promise<LoginResponse> {
    const { username, password } = loginRequest;

    // 查找用户
    const user = await User.findOne({ where: { username } });

    if (!user) {
      throw new CustomError(
        'INVALID_CREDENTIALS',
        'Invalid username or password',
        401
      );
    }

    // 检查用户状态
    if (user.status === 'locked') {
      throw new CustomError(
        'ACCOUNT_LOCKED',
        'Account is locked',
        403
      );
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      // 增加登录失败次数
      user.login_attempts = (user.login_attempts || 0) + 1;
      if (user.login_attempts >= 5) {
        user.status = 'locked';
        user.locked_until = new Date(Date.now() + 30 * 60 * 1000); // 锁定30分钟
      }
      await user.save();

      throw new CustomError(
        'INVALID_CREDENTIALS',
        'Invalid username or password',
        401
      );
    }

    // 登录成功，重置失败次数
    user.login_attempts = 0;
    user.last_login = new Date();
    await user.save();

    // 生成 Token
    const { accessToken, refreshToken } = this.generateTokens(user.id, user.role);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role as 'student' | 'teacher' | 'admin',
        avatar_url: user.avatar_url
      },
      expiresIn: 86400 // 24小时
    };
  }

  // 刷新 Token
  async refreshToken(token: string) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

      if (decoded.type !== 'refresh') {
        throw new CustomError(
          'INVALID_TOKEN_TYPE',
          'Invalid token type',
          401
        );
      }

      const user = await User.findByPk(decoded.sub);

      if (!user) {
        throw new CustomError(
          'USER_NOT_FOUND',
          'User not found',
          404
        );
      }

      const { accessToken, refreshToken } = this.generateTokens(user.id, user.role);

      return {
        accessToken,
        refreshToken,
        expiresIn: 86400
      };
    } catch (error) {
      throw new CustomError(
        'INVALID_TOKEN',
        'Invalid refresh token',
        401
      );
    }
  }

  // 注册用户
  async register(
    username: string,
    password: string,
    email: string,
    role: 'student' | 'teacher' | 'admin' = 'student'
  ) {
    // 检查用户名是否存在
    const existingUser = await User.findOne({ where: { username } });

    if (existingUser) {
      throw new CustomError(
        'USERNAME_EXISTS',
        'Username already exists',
        400
      );
    }

    // 检查邮箱是否存在
    if (email) {
      const existingEmail = await User.findOne({ where: { email } });
      if (existingEmail) {
        throw new CustomError(
          'EMAIL_EXISTS',
          'Email already exists',
          400
        );
      }
    }

    // 密码加密
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const user = await User.create({
      id: uuidv4(),
      username,
      password_hash: hashedPassword,
      email,
      role,
      status: 'active',
      login_attempts: 0
    });

    // 生成 Token
    const { accessToken, refreshToken } = this.generateTokens(user.id, user.role);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role as 'student' | 'teacher' | 'admin',
        avatar_url: user.avatar_url
      },
      expiresIn: 86400
    };
  }

  // 忘记密码
  async forgotPassword(username: string) {
    const user = await User.findOne({ where: { username } });

    if (!user) {
      throw new CustomError(
        'USER_NOT_FOUND',
        'User not found',
        404
      );
    }

    // 这里应该发送重置链接到邮箱
    // 返回成功消息
    return {
      message: 'Password reset email has been sent',
      email: user.email
    };
  }

  // 重置密码
  async resetPassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new CustomError(
        'USER_NOT_FOUND',
        'User not found',
        404
      );
    }

    // 验证旧密码
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password_hash);

    if (!isPasswordValid) {
      throw new CustomError(
        'INVALID_PASSWORD',
        'Old password is incorrect',
        401
      );
    }

    // 更新密码
    user.password_hash = await bcrypt.hash(newPassword, 10);
    await user.save();

    return { message: 'Password reset successfully' };
  }
}

export default new AuthService();
