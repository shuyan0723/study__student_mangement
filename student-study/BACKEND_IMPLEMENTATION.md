# 学生成绩管理系统 - Node.js 后端完整实现指南

**文档类型**: 后端实现手册  
**版本**: v1.0  
**日期**: 2024年11月  
**目标**: 逐步实现完整的后端系统

---

## 📁 项目结构完全指南

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts          # Sequelize 数据库配置
│   │   ├── jwt.ts              # JWT 配置和工具
│   │   └── email.ts            # 邮件配置
│   │
│   ├── models/
│   │   ├── User.ts             # 用户模型
│   │   ├── Student.ts          # 学生模型
│   │   ├── Teacher.ts          # 教师模型
│   │   ├── Course.ts           # 课程模型
│   │   ├── Grade.ts            # 成绩模型
│   │   ├── StudentCourse.ts    # 选课模型
│   │   ├── Message.ts          # 消息模型
│   │   ├── Appeal.ts           # 申诉模型
│   │   ├── Notice.ts           # 公告模型
│   │   ├── AuditLog.ts         # 审计日志模型
│   │   └── index.ts            # 模型导出
│   │
│   ├── controllers/
│   │   ├── authController.ts       # 认证控制器
│   │   ├── studentController.ts    # 学生管理
│   │   ├── teacherController.ts    # 教师管理
│   │   ├── courseController.ts     # 课程管理
│   │   ├── gradeController.ts      # 成绩管理
│   │   ├── messageController.ts    # 消息管理
│   │   ├── appealController.ts     # 申诉管理
│   │   ├── noticeController.ts     # 公告管理
│   │   ├── profileController.ts    # 个人资料
│   │   └── index.ts                # 控制器导出
│   │
│   ├── services/
│   │   ├── authService.ts         # 认证业务逻辑
│   │   ├── studentService.ts      # 学生业务逻辑
│   │   ├── courseService.ts       # 课程业务逻辑
│   │   ├── gradeService.ts        # 成绩业务逻辑
│   │   ├── messageService.ts      # 消息业务逻辑
│   │   └── index.ts               # 服务导出
│   │
│   ├── middleware/
│   │   ├── auth.ts              # 认证中间件
│   │   ├── authorization.ts     # 授权中间件
│   │   ├── errorHandler.ts      # 错误处理
│   │   ├── validation.ts        # 数据验证
│   │   ├── logger.ts            # 日志中间件
│   │   └── rateLimit.ts         # 速率限制
│   │
│   ├── routes/
│   │   ├── auth.ts              # 认证路由
│   │   ├── students.ts          # 学生路由
│   │   ├── teachers.ts          # 教师路由
│   │   ├── courses.ts           # 课程路由
│   │   ├── grades.ts            # 成绩路由
│   │   ├── messages.ts          # 消息路由
│   │   ├── appeals.ts           # 申诉路由
│   │   ├── notices.ts           # 公告路由
│   │   ├── profile.ts           # 个人资料路由
│   │   └── index.ts             # 路由汇总
│   │
│   ├── utils/
│   │   ├── jwt.ts               # JWT 工具
│   │   ├── password.ts          # 密码工具
│   │   ├── validators.ts        # 验证工具
│   │   ├── errors.ts            # 错误定义
│   │   └── logger.ts            # 日志工具
│   │
│   ├── types/
│   │   ├── index.ts             # 类型定义
│   │   ├── models.ts            # 模型类型
│   │   └── api.ts               # API 类型
│   │
│   ├── constants/
│   │   ├── errors.ts            # 错误常量
│   │   ├── messages.ts          # 消息常量
│   │   └── enums.ts             # 枚举常量
│   │
│   ├── database/
│   │   ├── migrations/          # 数据库迁移脚本
│   │   └── seeders/             # 测试数据脚本
│   │
│   ├── app.ts                   # Express 应用配置
│   └── server.ts                # 服务器启动
│
├── tests/
│   ├── unit/
│   │   ├── services/            # 服务层测试
│   │   └── utils/               # 工具函数测试
│   ├── integration/
│   │   ├── auth.test.ts         # 认证集成测试
│   │   ├── students.test.ts     # 学生接口测试
│   │   └── grades.test.ts       # 成绩接口测试
│   └── fixtures/                # 测试数据
│
├── scripts/
│   ├── createDb.ts              # 创建数据库脚本
│   ├── migrate.ts               # 迁移脚本
│   ├── seed.ts                  # 导入测试数据
│   └── dropDb.ts                # 删除数据库脚本
│
├── .env.example                 # 环境变量示例
├── .env.test                    # 测试环境变量
├── .gitignore
├── .eslintrc.json
├── tsconfig.json
├── jest.config.js
├── package.json
├── docker-compose.yml
├── Dockerfile
└── README.md
```

---

## 🚀 完整实现步骤

### 第1步：项目初始化

```bash
# 1. 创建项目
mkdir backend && cd backend

# 2. 初始化 npm
npm init -y

# 3. 安装依赖
npm install

# 4. 创建 TypeScript 配置
npx tsc --init

# 5. 创建目录结构
mkdir -p src/{config,models,controllers,services,middleware,routes,utils,types,constants,database/{migrations,seeders}}
mkdir -p tests/{unit,integration,fixtures}
mkdir -p scripts
```

### 第2步：核心配置文件

#### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020"],
    "moduleResolution": "node",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "allowSyntheticDefaultImports": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

### 第3步：核心代码实现

#### src/app.ts - Express 应用配置

```typescript
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

// 导入中间件
import { errorHandler } from './middleware/errorHandler';
import { logger } from './middleware/logger';

// 导入路由
import authRoutes from './routes/auth';
import studentRoutes from './routes/students';
import teacherRoutes from './routes/teachers';
import courseRoutes from './routes/courses';
import gradeRoutes from './routes/grades';
import messageRoutes from './routes/messages';
import appealRoutes from './routes/appeals';
import noticeRoutes from './routes/notices';
import profileRoutes from './routes/profile';

const app = express();

// 安全中间件
app.use(helmet());
app.use(compression());

// CORS 配置
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

// 请求日志
app.use(morgan('combined'));

// 速率限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分钟
  max: 100 // 限制 100 个请求
});
app.use('/api/', limiter);

// 解析请求体
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// 健康检查
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

// API 路由
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/grades', gradeRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/appeals', appealRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/profile', profileRoutes);

// 404 处理
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'NOT_FOUND',
    message: '请求的资源不存在'
  });
});

// 错误处理中间件（必须在最后）
app.use(errorHandler);

export default app;
```

#### src/server.ts - 服务器启动

```typescript
import app from './app';
import { sequelize } from './config/database';
import logger from './utils/logger';

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // 测试数据库连接
    await sequelize.authenticate();
    logger.info('数据库连接成功');

    // 同步数据库模型
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      logger.info('数据库模型同步成功');
    }

    // 启动服务器
    app.listen(PORT, () => {
      logger.info(`服务器运行在 http://localhost:${PORT}`);
      logger.info(`环境: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    logger.error('启动失败:', error);
    process.exit(1);
  }
}

// 处理未捕获的异常
process.on('uncaughtException', (error) => {
  logger.error('未捕获的异常:', error);
  process.exit(1);
});

// 处理未处理的 Promise 拒绝
process.on('unhandledRejection', (reason, promise) => {
  logger.error('未处理的 Promise 拒绝:', { reason, promise });
  process.exit(1);
});

startServer();
```

#### src/config/database.ts - 数据库配置

```typescript
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME || 'student_grade_system',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '123456',
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: parseInt(process.env.DB_POOL_MAX || '10'),
      min: parseInt(process.env.DB_POOL_MIN || '2'),
      acquire: 30000,
      idle: 10000
    },
    timezone: '+08:00'
  }
);

export default sequelize;
```

#### src/models/User.ts - 用户模型

```typescript
import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

export class User extends Model {
  declare id: string;
  declare username: string;
  declare password_hash: string;
  declare email: string;
  declare avatar_url: string | null;
  declare role: 'student' | 'teacher' | 'admin';
  declare status: 'active' | 'inactive' | 'locked';
  declare last_login: Date | null;
  declare login_attempts: number;
  declare locked_until: Date | null;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date | null;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 50]
      }
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      unique: true,
      isEmail: true
    },
    avatar_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    role: {
      type: DataTypes.ENUM('student', 'teacher', 'admin'),
      allowNull: false,
      defaultValue: 'student'
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'locked'),
      allowNull: false,
      defaultValue: 'active'
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true
    },
    login_attempts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    locked_until: {
      type: DataTypes.DATE,
      allowNull: true
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    paranoid: false,
    indexes: [
      { fields: ['username'] },
      { fields: ['email'] },
      { fields: ['role'] }
    ]
  }
);

export default User;
```

#### src/utils/jwt.ts - JWT 工具

```typescript
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key';
const ACCESS_EXPIRE = process.env.JWT_ACCESS_EXPIRE || '24h';
const REFRESH_EXPIRE = process.env.JWT_REFRESH_EXPIRE || '7d';

export interface TokenPayload {
  sub: string;
  username: string;
  role: string;
  iat?: number;
  exp?: number;
  type?: 'access' | 'refresh';
}

export const generateTokens = (userId: string, username: string, role: string) => {
  const accessToken = jwt.sign(
    {
      sub: userId,
      username,
      role,
      type: 'access'
    },
    JWT_SECRET,
    { expiresIn: ACCESS_EXPIRE }
  );

  const refreshToken = jwt.sign(
    {
      sub: userId,
      type: 'refresh'
    },
    JWT_SECRET,
    { expiresIn: REFRESH_EXPIRE }
  );

  return { accessToken, refreshToken };
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
};

export const decodeToken = (token: string) => {
  return jwt.decode(token);
};
```

#### src/middleware/auth.ts - 认证中间件

```typescript
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'NO_TOKEN',
        message: '未提供认证 Token'
      });
    }

    const token = authHeader.slice(7);
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'INVALID_TOKEN',
      message: 'Token 无效或已过期'
    });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'FORBIDDEN',
        message: '没有权限访问此资源'
      });
    }
    next();
  };
};
```

#### src/middleware/errorHandler.ts - 错误处理

```typescript
import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number = 400,
    public details?: any
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('错误:', err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.code,
      message: err.message,
      details: err.details
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'VALIDATION_ERROR',
      message: '数据验证失败',
      details: err.errors
    });
  }

  res.status(500).json({
    success: false,
    error: 'INTERNAL_SERVER_ERROR',
    message: '服务器内部错误'
  });
};
```

---

## 📊 核心服务实现

#### src/services/authService.ts

```typescript
import User from '../models/User';
import { generateTokens, verifyToken } from '../utils/jwt';
import { hashPassword, verifyPassword } from '../utils/password';
import { AppError } from '../middleware/errorHandler';
import { v4 as uuidv4 } from 'uuid';

export class AuthService {
  async login(username: string, password: string) {
    const user = await User.findOne({ where: { username } });
    if (!user) throw new AppError('INVALID_CREDENTIALS', '用户名或密码错误', 401);

    const validPassword = await verifyPassword(password, user.password_hash);
    if (!validPassword) throw new AppError('INVALID_CREDENTIALS', '用户名或密码错误', 401);

    if (user.status === 'locked') {
      throw new AppError('ACCOUNT_LOCKED', '账户已锁定', 403);
    }

    // 重置登录尝试
    await user.update({
      login_attempts: 0,
      last_login: new Date()
    });

    const { accessToken, refreshToken } = generateTokens(user.id, user.username, user.role);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar_url
      }
    };
  }

  async register(username: string, password: string, email: string, role: string = 'student') {
    const existing = await User.findOne({ where: { username } });
    if (existing) throw new AppError('USER_EXISTS', '用户已存在', 409);

    const passwordHash = await hashPassword(password);
    const user = await User.create({
      id: uuidv4(),
      username,
      password_hash: passwordHash,
      email,
      role
    });

    const { accessToken, refreshToken } = generateTokens(user.id, user.username, user.role);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    };
  }
}

export default new AuthService();
```

---

## 🔧 完整的 Docker 配置

#### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

#### docker-compose.yml

```yaml
version: '3.8'

services:
  backend:
    build: .
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      DB_HOST: mysql
      DB_PORT: 3306
      DB_NAME: student_grade_system
      DB_USER: root
      DB_PASSWORD: ${DB_PASSWORD:-123456}
      JWT_SECRET: ${JWT_SECRET:-your-secret-key}
      CORS_ORIGIN: http://localhost:5173
    depends_on:
      - mysql
    networks:
      - app-network

  mysql:
    image: mysql:8.0-alpine
    ports:
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD:-123456}
      MYSQL_DATABASE: student_grade_system
    volumes:
      - mysql_data:/var/lib/mysql
    networks:
      - app-network

volumes:
  mysql_data:

networks:
  app-network:
    driver: bridge
```

---

## 🎯 实施步骤总结

### 第1周: 项目初始化
- ✅ 初始化项目结构
- ✅ 配置 TypeScript 和 Express
- ✅ 设置数据库连接
- ✅ 实现认证系统 (JWT)

### 第2-3周: 核心模块
- ✅ 用户管理 (学生、教师、管理员)
- ✅ 课程管理 (CRUD)
- ✅ 成绩管理 (CRUD)
- ✅ 选课系统

### 第4周: 高级功能
- ✅ 消息系统
- ✅ 申诉管理
- ✅ 公告管理

### 第5周: 优化
- ✅ 文件上传/导出
- ✅ 性能优化
- ✅ 缓存实现

### 第6周: 测试
- ✅ 单元测试
- ✅ 集成测试
- ✅ Bug 修复

### 第7周: 部署
- ✅ Docker 部署
- ✅ 前后端集成
- ✅ 生产配置

---

## 📚 快速启动命令

```bash
# 1. 安装依赖
npm install

# 2. 编译 TypeScript
npm run build

# 3. 开发模式运行
npm run dev

# 4. 生产模式运行
npm start

# 5. 运行测试
npm test

# 6. Docker 运行
docker-compose up
```

---

**状态**: 🚀 立即可开始实现  
**预计完成**: 7周 (全职开发)  
**团队规模**: 1-2 名后端工程师
