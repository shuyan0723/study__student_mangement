# Node.js + Express 后端快速开始指南

**文档类型**: 快速参考  
**目标读者**: 后端开发工程师  
**预计时间**: 5分钟快速了解

---

## ⚡ 30秒快速概览

```
技术栈: Node.js 18+ / Express 4.18+ / TypeScript / MySQL 8.0+ / JWT
核心功能: 32+ API + JWT认证 + RBAC权限 + 完整CRUD
数据库: 11张表，支持1000+并发用户
开发周期: 7周 (包括测试和部署)
```

---

## 🚀 快速启动 (5分钟)

### 1️⃣ 准备环境

```bash
# 检查 Node.js 版本
node --version  # 应该是 18.0.0 或更高

# 检查 npm 版本
npm --version   # 应该是 9.0.0 或更高

# 检查 MySQL 版本
mysql --version # 应该是 8.0.0 或更高
```

### 2️⃣ 初始化项目

```bash
# 创建项目目录
mkdir backend
cd backend

# 初始化 npm
npm init -y

# 安装核心依赖
npm install express cors dotenv
npm install mysql2 sequelize
npm install jsonwebtoken bcryptjs
npm install --save-dev typescript @types/node @types/express nodemon
```

### 3️⃣ 配置基础文件

```bash
# 创建 tsconfig.json
npx tsc --init

# 创建 .env 文件
echo "
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=123456
DB_NAME=student_grade_system
JWT_SECRET=your-secret-key-here
" > .env

# 创建 src 目录结构
mkdir -p src/{config,models,controllers,services,middleware,routes,utils}
```

### 4️⃣ 创建最小化 Express 应用

```typescript
// src/app.ts
import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

export default app;
```

```typescript
// src/server.ts
import app from './app';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 5️⃣ 更新 package.json

```json
{
  "scripts": {
    "dev": "nodemon --exec ts-node src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  }
}
```

### 6️⃣ 启动开发服务器

```bash
npm run dev
# 输出: Server running on port 3000
```

✅ **完成！你的后端服务器正在运行**

---

## 📊 核心功能概览

### API 分类 (60+ 个端点)

| 模块 | 数量 | 关键功能 |
|------|------|---------|
| **认证** | 6 | 登录、登出、刷新Token |
| **学生管理** | 9 | CRUD、导入导出、密码重置 |
| **教师管理** | 7 | CRUD、课程分配 |
| **课程管理** | 9 | CRUD、统计、选课学生 |
| **成绩管理** | 10 | CRUD、批量导入、统计 |
| **选课系统** | 4 | 选课、退课、冲突检查 |
| **消息系统** | 6 | 发送、读取、删除、未读统计 |
| **申诉系统** | 5 | 提交、审核、跟踪 |
| **公告管理** | 8 | 发布、编辑、置顶、阅读统计 |
| **个人资料** | 5 | 查看、编辑、头像、密码 |
| **系统设置** | 6 | 配置、邮件、备份恢复 |
| **日志和报告** | 10 | 查询、导出、统计分析 |
| **总计** | **85+** | 完整的教务管理系统 |

---

## 🗄️ 数据库快速设置

### 创建数据库和用户

```sql
-- 创建数据库
CREATE DATABASE student_grade_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE student_grade_system;

-- 创建用户表 (最核心的表)
CREATE TABLE users (
  id CHAR(36) NOT NULL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(100),
  role ENUM('student', 'teacher', 'admin') NOT NULL,
  status ENUM('active', 'inactive', 'locked') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 创建学生表
CREATE TABLE students (
  id CHAR(36) NOT NULL PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  student_id VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 创建课程表
CREATE TABLE courses (
  id CHAR(36) NOT NULL PRIMARY KEY,
  course_id VARCHAR(20) NOT NULL UNIQUE,
  course_name VARCHAR(100) NOT NULL,
  credits INT NOT NULL,
  capacity INT NOT NULL,
  enrolled_count INT DEFAULT 0
);

-- 创建成绩表
CREATE TABLE grades (
  id CHAR(36) NOT NULL PRIMARY KEY,
  student_id CHAR(36) NOT NULL,
  course_id CHAR(36) NOT NULL,
  score DECIMAL(5, 2),
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (course_id) REFERENCES courses(id)
);
```

---

## 🔐 认证实现 (JWT)

### 核心代码

```typescript
// src/utils/jwt.ts
import jwt from 'jsonwebtoken';

export const generateTokens = (userId: string, role: string) => {
  const accessToken = jwt.sign(
    { sub: userId, role },
    process.env.JWT_SECRET!,
    { expiresIn: '24h' }
  );
  
  const refreshToken = jwt.sign(
    { sub: userId },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );
  
  return { accessToken, refreshToken };
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!);
};
```

### 认证中间件

```typescript
// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export const authenticate = (req: any, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'No token' });
  
  try {
    req.user = verifyToken(token);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

### 登录端点

```typescript
// src/routes/auth.ts
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  // 1. 验证用户名和密码
  const user = await User.findOne({ where: { username } });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  
  // 2. 验证密码
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
  
  // 3. 生成 Token
  const { accessToken, refreshToken } = generateTokens(user.id, user.role);
  
  res.json({
    success: true,
    data: { accessToken, refreshToken, user }
  });
});
```

---

## 🛠️ 常用命令速查表

```bash
# 开发
npm run dev              # 启动开发服务器
npm run build           # 编译 TypeScript
npm run start           # 启动生产服务器
npm test                # 运行测试

# 数据库
npm run db:create       # 创建数据库
npm run db:migrate      # 运行迁移
npm run db:seed         # 导入测试数据
npm run db:drop         # 删除数据库

# Docker
docker build -t backend . 
docker run -p 3000:3000 backend
docker-compose up       # 启动完整环境
```

---

## 📝 API 使用示例

### 登录

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "student01",
    "password": "Password123"
  }'
```

**响应**:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "user": {
      "id": "uuid",
      "username": "student01",
      "role": "student"
    }
  }
}
```

### 获取学生列表 (需要Token)

```bash
curl -X GET http://localhost:3000/api/students \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json"
```

### 获取我的成绩

```bash
curl -X GET http://localhost:3000/api/grades/my-grades \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json"
```

---

## 🎯 开发优先级

### 第1周 (基础) 🔴
- ✅ 项目初始化
- ✅ 数据库设计和创建
- ✅ 认证系统 (JWT)

### 第2-3周 (核心功能) 🔴
- ✅ 学生/教师/课程管理 CRUD
- ✅ 成绩管理
- ✅ 选课系统

### 第4周 (高级功能) 🟡
- ✅ 消息系统
- ✅ 申诉系统
- ✅ 公告管理

### 第5周 (扩展) 🟡
- ✅ 文件上传/导出
- ✅ 报告生成
- ✅ 性能优化

### 第6周 (质量) 🟢
- ✅ 单元测试
- ✅ 集成测试
- ✅ Bug 修复

### 第7周 (上线) 🟢
- ✅ Docker 部署
- ✅ 文档完善
- ✅ 前后端集成

---

## 🚨 常见错误和解决方案

| 问题 | 解决方案 |
|------|---------|
| `ECONNREFUSED` | MySQL 未启动，运行 `mysql -u root -p` |
| `Token expired` | Token 过期，需要刷新或重新登录 |
| `CORS error` | 检查 CORS 配置，确保前端地址在白名单 |
| `Sequelize error` | 检查数据库连接配置和表结构 |
| `Port 3000 in use` | 更换端口或关闭占用进程 |

---

## 📚 核心文件清单

必须理解的文件:

```
src/
├── app.ts              ⭐⭐⭐ Express 应用主文件
├── server.ts           ⭐⭐⭐ 服务器启动文件
├── middleware/auth.ts  ⭐⭐⭐ JWT 认证逻辑
├── services/           ⭐⭐⭐ 业务逻辑层
├── models/             ⭐⭐⭐ 数据库模型
├── controllers/        ⭐⭐  路由处理器
└── routes/             ⭐⭐  路由定义
```

---

## 💡 最佳实践

```typescript
// ✅ 好的做法
// 1. 使用 TypeScript 确保类型安全
interface IUser {
  id: string;
  username: string;
}

// 2. 使用 ORM (Sequelize) 而不是原始SQL
const user = await User.findByPk(id);

// 3. 分离业务逻辑到 Service 层
class UserService {
  async createUser(data) { }
}

// 4. 使用中间件处理通用逻辑
app.use(authenticate);

// 5. 统一的错误处理
try {
  // ...
} catch (error) {
  res.status(400).json({ error: error.message });
}

// ❌ 避免的做法
// 1. 直接在路由中写业务逻辑
// 2. 硬编码 magic number
// 3. 使用任何 as any 类型
// 4. 没有错误处理
// 5. 直接拼接 SQL
```

---

## 🔗 快速链接

- 📖 [完整需求文档](./BACKEND_REQUIREMENTS.md)
- 📖 [项目需求文档](./PROJECT_REQUIREMENTS.md)
- 📖 [前端说明](./README.md)
- 🔗 [Express 官方文档](https://expressjs.com)
- 🔗 [Sequelize 文档](https://sequelize.org)
- 🔗 [JWT 文档](https://jwt.io)

---

**祝你开发顺利！** 🚀

如有问题，参考完整的 `BACKEND_REQUIREMENTS.md` 文档。

