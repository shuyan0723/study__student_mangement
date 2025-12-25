# 学生成绩管理系统 - Node.js + Express 后端需求文档

**文档名称**: Node.js + Express 后端实现规范  
**版本**: v1.0  
**更新日期**: 2024年11月  
**技术栈**: Node.js 18+ / Express 4.18+ / TypeScript 5.8+ / MySQL 8.0+ / JWT  

---

## 📋 目录

1. [项目概述](#项目概述)
2. [技术栈](#技术栈)
3. [项目结构](#项目结构)
4. [开发环境搭建](#开发环境搭建)
5. [数据库设计](#数据库设计)
6. [认证和授权](#认证和授权)
7. [API 接口规范](#api-接口规范)
8. [业务逻辑实现](#业务逻辑实现)
9. [错误处理](#错误处理)
10. [代码规范](#代码规范)
11. [安全需求](#安全需求)
12. [测试计划](#测试计划)
13. [部署和运维](#部署和运维)

---

## 🎯 项目概述

### 项目目标

使用 Node.js + Express 框架实现学生成绩管理系统的完整后端，支持：
- ✅ 三角色 (学生、教师、管理员) 完整功能
- ✅ 32+ 个核心功能的 API 接口
- ✅ JWT Token 认证和授权
- ✅ 完整的数据库设计和管理
- ✅ RESTful API 设计规范
- ✅ 完整的错误处理和日志记录
- ✅ 高性能和可扩展性

### 系统约束

```
- 并发用户: 1000+
- QPS: 10,000+
- 响应时间: < 1 秒
- 可用性: > 99.5%
- 数据库: MySQL 8.0+
```

---

## 🏗️ 技术栈

### 核心框架

```json
{
  "nodejs": "18.0.0 或更高版本",
  "express": "^4.18.0",
  "typescript": "~5.8.3",
  "mysql2": "^3.6.0",
  "sequelize": "^6.35.0"
}
```

### 认证和安全

```json
{
  "jsonwebtoken": "^9.1.0",
  "bcryptjs": "^2.4.3",
  "express-validator": "^7.0.0",
  "helmet": "^7.0.0",
  "cors": "^2.8.5"
}
```

### 工具和中间件

```json
{
  "dotenv": "^16.3.1",
  "morgan": "^1.10.0",
  "multer": "^1.4.5",
  "nodemailer": "^6.9.4",
  "redis": "^4.6.8",
  "joi": "^17.10.0"
}
```

### 开发工具

```json
{
  "nodemon": "^3.0.1",
  "jest": "^29.7.0",
  "supertest": "^6.3.3",
  "eslint": "^8.50.0",
  "prettier": "^3.0.3"
}
```

---

## 📁 项目结构

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts          # 数据库配置
│   │   ├── jwt.ts              # JWT 配置
│   │   ├── email.ts            # 邮件配置
│   │   └── redis.ts            # Redis 配置
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
│   │   └── AuditLog.ts         # 审计日志模型
│   │
│   ├── controllers/
│   │   ├── authController.ts       # 认证控制器
│   │   ├── studentController.ts    # 学生管理控制器
│   │   ├── teacherController.ts    # 教师管理控制器
│   │   ├── courseController.ts     # 课程管理控制器
│   │   ├── gradeController.ts      # 成绩管理控制器
│   │   ├── messageController.ts    # 消息控制器
│   │   ├── appealController.ts     # 申诉控制器
│   │   ├── noticeController.ts     # 公告控制器
│   │   ├── profileController.ts    # 个人资料控制器
│   │   ├── settingsController.ts   # 系统设置控制器
│   │   ├── logController.ts        # 日志控制器
│   │   └── reportController.ts     # 报告控制器
│   │
│   ├── services/
│   │   ├── authService.ts         # 认证业务逻辑
│   │   ├── studentService.ts      # 学生业务逻辑
│   │   ├── teacherService.ts      # 教师业务逻辑
│   │   ├── courseService.ts       # 课程业务逻辑
│   │   ├── gradeService.ts        # 成绩业务逻辑
│   │   ├── messageService.ts      # 消息业务逻辑
│   │   ├── appealService.ts       # 申诉业务逻辑
│   │   ├── noticeService.ts       # 公告业务逻辑
│   │   ├── emailService.ts        # 邮件业务逻辑
│   │   ├── fileService.ts         # 文件业务逻辑
│   │   └── reportService.ts       # 报告业务逻辑
│   │
│   ├── middleware/
│   │   ├── auth.ts              # 认证中间件
│   │   ├── authorization.ts     # 授权中间件
│   │   ├── errorHandler.ts      # 错误处理中间件
│   │   ├── validation.ts        # 数据验证中间件
│   │   ├── logger.ts            # 日志中间件
│   │   └── rateLimit.ts         # 速率限制中间件
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
│   │   ├── settings.ts          # 系统设置路由
│   │   ├── logs.ts              # 日志路由
│   │   └── reports.ts           # 报告路由
│   │
│   ├── utils/
│   │   ├── validators.ts        # 数据验证工具
│   │   ├── dateUtils.ts         # 日期工具
│   │   ├── fileUtils.ts         # 文件工具
│   │   ├── csvUtils.ts          # CSV 工具
│   │   └── pdfUtils.ts          # PDF 工具
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
│   │   ├── migrations/          # 数据库迁移
│   │   └── seeders/             # 数据库种子
│   │
│   ├── app.ts                   # Express 应用配置
│   └── server.ts                # 服务器启动文件
│
├── tests/
│   ├── unit/                    # 单元测试
│   ├── integration/             # 集成测试
│   └── fixtures/                # 测试数据
│
├── .env.example                 # 环境变量示例
├── .env.test                    # 测试环境变量
├── .gitignore
├── tsconfig.json
├── package.json
├── jest.config.js
├── docker-compose.yml           # Docker 编排
├── Dockerfile
└── README.md
```

---

## 🛠️ 开发环境搭建

### 前置要求

```bash
# 系统要求
- Node.js 18+
- MySQL 8.0+
- Redis 6.0+ (可选)
- npm 或 yarn
```

### 初始化项目

```bash
# 1. 克隆项目
git clone <repository-url>
cd backend

# 2. 安装依赖
npm install

# 3. 复制环境配置
cp .env.example .env

# 4. 配置数据库
# 编辑 .env 文件，设置数据库连接参数

# 5. 创建数据库
npm run db:create

# 6. 运行迁移
npm run db:migrate

# 7. 导入初始数据
npm run db:seed

# 8. 启动开发服务器
npm run dev
```

### 环境变量配置 (.env)

```env
# 服务器配置
NODE_ENV=development
PORT=3000
HOST=localhost

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_NAME=student_grade_system
DB_USER=root
DB_PASSWORD=123456
DB_DIALECT=mysql
DB_POOL_MAX=10
DB_POOL_MIN=2

# JWT 配置
JWT_SECRET=your-secret-key-change-this
JWT_ACCESS_EXPIRE=24h
JWT_REFRESH_EXPIRE=7d

# 邮件配置
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-app-password
MAIL_FROM_NAME=Student Grade System

# Redis 配置 (可选)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0

# 文件上传配置
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=104857600  # 100MB

# CORS 配置
CORS_ORIGIN=http://localhost:5173

# 日志配置
LOG_LEVEL=debug
LOG_DIR=./logs
```

---

## 🗄️ 数据库设计

### SQL 脚本

#### 1. 用户表 (users)

```sql
CREATE TABLE users (
  id CHAR(36) NOT NULL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(100),
  avatar_url VARCHAR(255),
  role ENUM('student', 'teacher', 'admin') NOT NULL,
  status ENUM('active', 'inactive', 'locked') DEFAULT 'active',
  last_login TIMESTAMP,
  login_attempts INT DEFAULT 0,
  locked_until TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  
  INDEX idx_username (username),
  INDEX idx_email (email),
  INDEX idx_role (role)
);
```

#### 2. 学生表 (students)

```sql
CREATE TABLE students (
  id CHAR(36) NOT NULL PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  student_id VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  gender ENUM('male', 'female', 'other'),
  date_of_birth DATE,
  college VARCHAR(100),
  major VARCHAR(100),
  phone VARCHAR(20),
  home_address VARCHAR(255),
  admission_date DATE,
  status ENUM('active', 'inactive', 'graduated', 'suspended') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_student_id (student_id),
  INDEX idx_name (name)
);
```

#### 3. 教师表 (teachers)

```sql
CREATE TABLE teachers (
  id CHAR(36) NOT NULL PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  teacher_id VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  gender ENUM('male', 'female', 'other'),
  department VARCHAR(100),
  title ENUM('professor', 'associate_professor', 'lecturer', 'assistant'),
  phone VARCHAR(20),
  research_area VARCHAR(255),
  education ENUM('bachelor', 'master', 'phd'),
  years_of_service INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_teacher_id (teacher_id),
  INDEX idx_name (name)
);
```

#### 4. 课程表 (courses)

```sql
CREATE TABLE courses (
  id CHAR(36) NOT NULL PRIMARY KEY,
  course_id VARCHAR(20) NOT NULL UNIQUE,
  course_name VARCHAR(100) NOT NULL,
  credits INT NOT NULL,
  hours INT NOT NULL,
  semester VARCHAR(20),
  category VARCHAR(50),
  teacher_id CHAR(36),
  description TEXT,
  capacity INT NOT NULL,
  enrolled_count INT DEFAULT 0,
  assessment_method VARCHAR(100),
  status ENUM('active', 'inactive', 'frozen') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  
  FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE SET NULL,
  INDEX idx_course_id (course_id),
  INDEX idx_teacher_id (teacher_id),
  INDEX idx_status (status)
);
```

#### 5. 成绩表 (grades)

```sql
CREATE TABLE grades (
  id CHAR(36) NOT NULL PRIMARY KEY,
  student_id CHAR(36) NOT NULL,
  course_id CHAR(36) NOT NULL,
  score DECIMAL(5, 2),
  grade_level ENUM('A', 'B', 'C', 'D', 'F'),
  feedback TEXT,
  submission_status ENUM('draft', 'submitted') DEFAULT 'draft',
  submitted_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  UNIQUE KEY unique_student_course (student_id, course_id),
  INDEX idx_student_id (student_id),
  INDEX idx_course_id (course_id)
);
```

#### 6. 选课表 (student_courses)

```sql
CREATE TABLE student_courses (
  id CHAR(36) NOT NULL PRIMARY KEY,
  student_id CHAR(36) NOT NULL,
  course_id CHAR(36) NOT NULL,
  enrollment_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('enrolled', 'dropped', 'completed') DEFAULT 'enrolled',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  UNIQUE KEY unique_student_course (student_id, course_id),
  INDEX idx_student_id (student_id),
  INDEX idx_course_id (course_id)
);
```

#### 7. 消息表 (messages)

```sql
CREATE TABLE messages (
  id CHAR(36) NOT NULL PRIMARY KEY,
  sender_id CHAR(36) NOT NULL,
  receiver_id CHAR(36) NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_sender_id (sender_id),
  INDEX idx_receiver_id (receiver_id),
  INDEX idx_is_read (is_read),
  INDEX idx_created_at (created_at)
);
```

#### 8. 申诉表 (appeals)

```sql
CREATE TABLE appeals (
  id CHAR(36) NOT NULL PRIMARY KEY,
  student_id CHAR(36) NOT NULL,
  course_id CHAR(36) NOT NULL,
  original_score DECIMAL(5, 2),
  appeal_reason TEXT NOT NULL,
  attachments JSON,
  status ENUM('pending', 'reviewing', 'approved', 'rejected') DEFAULT 'pending',
  reviewed_by CHAR(36),
  review_feedback TEXT,
  new_score DECIMAL(5, 2),
  appeal_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_time TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewed_by) REFERENCES teachers(id) ON DELETE SET NULL,
  INDEX idx_student_id (student_id),
  INDEX idx_status (status)
);
```

#### 9. 公告表 (notices)

```sql
CREATE TABLE notices (
  id CHAR(36) NOT NULL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  type ENUM('info', 'warning', 'success', 'error') DEFAULT 'info',
  publish_by CHAR(36),
  target_role ENUM('all', 'student', 'teacher', 'admin') DEFAULT 'all',
  is_pinned BOOLEAN DEFAULT FALSE,
  publish_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expire_time TIMESTAMP,
  views INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  
  FOREIGN KEY (publish_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_publish_time (publish_time),
  INDEX idx_target_role (target_role)
);
```

#### 10. 审计日志表 (audit_logs)

```sql
CREATE TABLE audit_logs (
  id CHAR(36) NOT NULL PRIMARY KEY,
  user_id CHAR(36),
  operation VARCHAR(50) NOT NULL,
  object_type VARCHAR(50) NOT NULL,
  object_id VARCHAR(100),
  before_value JSON,
  after_value JSON,
  ip_address VARCHAR(50),
  user_agent VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_operation (operation),
  INDEX idx_created_at (created_at)
);
```

#### 11. 系统设置表 (settings)

```sql
CREATE TABLE settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  key VARCHAR(100) NOT NULL UNIQUE,
  value LONGTEXT,
  description VARCHAR(255),
  type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_key (key)
);
```

---

## 🔐 认证和授权

### 认证流程

#### 登录 API

```javascript
// POST /api/auth/login
{
  "username": "student01",
  "password": "Password123"
}

// 响应
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "username": "student01",
      "email": "student01@example.com",
      "role": "student",
      "avatar": "url"
    },
    "expiresIn": 86400
  }
}
```

### JWT Token 结构

```javascript
// Access Token (24小时)
{
  "iss": "student-grade-system",
  "sub": "user-id",
  "role": "student",
  "iat": 1234567890,
  "exp": 1234654290,
  "type": "access"
}

// Refresh Token (7天)
{
  "iss": "student-grade-system",
  "sub": "user-id",
  "iat": 1234567890,
  "exp": 1235172690,
  "type": "refresh"
}
```

### 认证中间件

```typescript
// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token required' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
```

### 授权中间件

```typescript
// src/middleware/authorization.ts
export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
};
```

### 权限检查

```typescript
// 路由示例
router.post(
  '/students',
  authenticate,
  authorize('admin'),
  studentController.createStudent
);

router.get(
  '/my-grades',
  authenticate,
  authorize('student'),
  gradeController.getMyGrades
);
```

---

## 📡 API 接口规范

### 响应格式统一

```typescript
// 成功响应
{
  "success": true,
  "data": {
    // 响应数据
  },
  "message": "操作成功"
}

// 失败响应
{
  "success": false,
  "error": "ERROR_CODE",
  "message": "错误消息",
  "details": {}
}

// 分页响应
{
  "success": true,
  "data": {
    "items": [...],
    "total": 100,
    "page": 1,
    "limit": 10,
    "pages": 10
  }
}
```

### 核心 API 端点

#### 认证模块 (Authentication)

```
POST   /api/auth/login              # 登录
POST   /api/auth/logout             # 登出
POST   /api/auth/refresh            # 刷新 Token
POST   /api/auth/register           # 注册
POST   /api/auth/forgot-password    # 忘记密码
POST   /api/auth/reset-password     # 重置密码
```

#### 学生管理 (Students)

```
GET    /api/students                     # 获取学生列表 (分页)
GET    /api/students/:id                 # 获取学生详情
POST   /api/students                     # 创建学生
PUT    /api/students/:id                 # 更新学生信息
DELETE /api/students/:id                 # 删除学生
POST   /api/students/batch-import        # 批量导入学生
GET    /api/students/export              # 导出学生
POST   /api/students/:id/reset-password  # 重置密码
PUT    /api/students/:id/status          # 更改学生状态
```

#### 教师管理 (Teachers)

```
GET    /api/teachers                     # 获取教师列表
GET    /api/teachers/:id                 # 获取教师详情
POST   /api/teachers                     # 创建教师
PUT    /api/teachers/:id                 # 更新教师信息
DELETE /api/teachers/:id                 # 删除教师
POST   /api/teachers/batch-import        # 批量导入教师
PUT    /api/teachers/:id/assign-course   # 分配课程
```

#### 课程管理 (Courses)

```
GET    /api/courses                      # 获取课程列表
GET    /api/courses/:id                  # 获取课程详情
POST   /api/courses                      # 创建课程
PUT    /api/courses/:id                  # 更新课程
DELETE /api/courses/:id                  # 删除课程
POST   /api/courses/batch-import         # 批量导入课程
PUT    /api/courses/:id/assign-teacher   # 分配教师
GET    /api/courses/:id/students         # 获取课程选课学生
GET    /api/courses/:id/statistics       # 获取课程统计
```

#### 成绩管理 (Grades)

```
GET    /api/grades                       # 获取成绩列表
GET    /api/grades/:id                   # 获取成绩详情
POST   /api/grades                       # 创建成绩
PUT    /api/grades/:id                   # 更新成绩
DELETE /api/grades/:id                   # 删除成绩
POST   /api/grades/batch-import          # 批量导入成绩
POST   /api/grades/submit                # 提交成绩
GET    /api/grades/my-grades             # 获取我的成绩 (学生)
GET    /api/grades/statistics            # 获取成绩统计
POST   /api/grades/:id/audit             # 审核成绩修改
```

#### 选课管理 (Student Courses)

```
GET    /api/student-courses              # 获取选课列表
POST   /api/student-courses/enroll       # 选课
POST   /api/student-courses/drop         # 退课
GET    /api/student-courses/check-conflict  # 检查课程冲突
```

#### 消息系统 (Messages)

```
GET    /api/messages                     # 获取消息列表
POST   /api/messages                     # 发送消息
PUT    /api/messages/:id/read            # 标记消息已读
DELETE /api/messages/:id                 # 删除消息
GET    /api/messages/unread-count        # 获取未读消息数
GET    /api/messages/conversations       # 获取消息会话列表
```

#### 申诉管理 (Appeals)

```
GET    /api/appeals                      # 获取申诉列表
POST   /api/appeals                      # 提交申诉
GET    /api/appeals/:id                  # 获取申诉详情
DELETE /api/appeals/:id                  # 撤销申诉
PUT    /api/appeals/:id/review           # 审核申诉 (教师)
```

#### 公告管理 (Notices)

```
GET    /api/notices                      # 获取公告列表
GET    /api/notices/:id                  # 获取公告详情
POST   /api/notices                      # 发布公告 (管理员)
PUT    /api/notices/:id                  # 编辑公告 (管理员)
DELETE /api/notices/:id                  # 删除公告 (管理员)
PUT    /api/notices/:id/mark-read        # 标记公告已读
PUT    /api/notices/:id/pin              # 置顶公告
GET    /api/notices/unread-count         # 获取未读公告数
```

#### 个人资料 (Profile)

```
GET    /api/profile                      # 获取个人资料
PUT    /api/profile                      # 更新个人资料
POST   /api/profile/avatar               # 上传头像
PUT    /api/profile/password             # 修改密码
GET    /api/profile/login-records        # 获取登录记录
```

#### 系统设置 (Settings)

```
GET    /api/settings                     # 获取系统设置
PUT    /api/settings                     # 更新系统设置
POST   /api/settings/test-email          # 测试邮件
POST   /api/settings/backup              # 创建备份
GET    /api/settings/backups             # 获取备份列表
POST   /api/settings/restore             # 恢复备份
```

#### 日志 (Logs)

```
GET    /api/logs                         # 获取日志
GET    /api/logs/:id                     # 获取日志详情
DELETE /api/logs/:id                     # 删除日志
POST   /api/logs/export                  # 导出日志
```

#### 报告 (Reports)

```
GET    /api/reports/grades               # 成绩分析报告
GET    /api/reports/enrollment           # 选课分析报告
GET    /api/reports/users                # 用户分析报告
GET    /api/reports/system               # 系统状态报告
POST   /api/reports/:id/export           # 导出报告
```

---

## 🏢 业务逻辑实现

### 示例: 学生成绩查询服务

```typescript
// src/services/gradeService.ts
import { Grade, Student, Course } from '../models';
import { Op } from 'sequelize';

export class GradeService {
  // 获取学生成绩列表
  async getStudentGrades(studentId: string, options: any = {}) {
    const { page = 1, limit = 10, sortBy = 'createdAt', order = 'DESC' } = options;
    const offset = (page - 1) * limit;
    
    const { rows, count } = await Grade.findAndCountAll({
      where: { student_id: studentId },
      include: [
        {
          model: Course,
          attributes: ['id', 'course_id', 'course_name', 'credits']
        }
      ],
      order: [[sortBy, order]],
      limit,
      offset
    });
    
    return {
      items: rows,
      total: count,
      page,
      limit,
      pages: Math.ceil(count / limit)
    };
  }
  
  // 计算成绩统计
  async getGradeStatistics(studentId: string) {
    const grades = await Grade.findAll({
      where: { student_id: studentId }
    });
    
    if (grades.length === 0) {
      return {
        avgScore: 0,
        maxScore: 0,
        minScore: 0,
        passCount: 0,
        excellentCount: 0,
        failCount: 0
      };
    }
    
    const scores = grades.map(g => g.score).filter(s => s !== null);
    const passGrades = grades.filter(g => g.score >= 60);
    const excellentGrades = grades.filter(g => g.score >= 85);
    const failGrades = grades.filter(g => g.score < 60);
    
    return {
      avgScore: scores.reduce((a, b) => a + b, 0) / scores.length,
      maxScore: Math.max(...scores),
      minScore: Math.min(...scores),
      passCount: passGrades.length,
      excellentCount: excellentGrades.length,
      failCount: failGrades.length
    };
  }
  
  // 成绩等级计算
  calculateGradeLevel(score: number): string {
    if (score >= 85) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    return 'F';
  }
}
```

### 示例: 选课业务逻辑

```typescript
// src/services/courseService.ts
export class CourseService {
  // 选课
  async enrollCourse(studentId: string, courseId: string) {
    // 1. 检查课程是否存在
    const course = await Course.findByPk(courseId);
    if (!course) throw new Error('Course not found');
    
    // 2. 检查课程容量
    if (course.enrolled_count >= course.capacity) {
      throw new Error('Course is full');
    }
    
    // 3. 检查是否已选
    const existing = await StudentCourse.findOne({
      where: { student_id: studentId, course_id: courseId }
    });
    if (existing) throw new Error('Already enrolled');
    
    // 4. 检查学分上限
    const enrolledCourses = await StudentCourse.findAll({
      where: { student_id: studentId },
      include: [Course]
    });
    const totalCredits = enrolledCourses.reduce((sum, ec) => sum + ec.course.credits, 0);
    if (totalCredits + course.credits > 30) {
      throw new Error('Credit limit exceeded');
    }
    
    // 5. 检查课程时间冲突
    const conflict = await this.checkTimeConflict(studentId, courseId);
    if (conflict) throw new Error('Time conflict');
    
    // 6. 创建选课记录
    const enrollment = await StudentCourse.create({
      student_id: studentId,
      course_id: courseId
    });
    
    // 7. 更新课程已选人数
    course.enrolled_count += 1;
    await course.save();
    
    return enrollment;
  }
  
  // 检查课程时间冲突
  async checkTimeConflict(studentId: string, courseId: string): Promise<boolean> {
    // 实现课程时间冲突检查逻辑
    return false;
  }
}
```

---

## ⚠️ 错误处理

### 错误类型定义

```typescript
// src/constants/errors.ts
export const ErrorCodes = {
  // 认证错误
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_INVALID: 'TOKEN_INVALID',
  
  // 权限错误
  FORBIDDEN: 'FORBIDDEN',
  UNAUTHORIZED: 'UNAUTHORIZED',
  
  // 资源错误
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  
  // 业务错误
  INVALID_INPUT: 'INVALID_INPUT',
  OPERATION_FAILED: 'OPERATION_FAILED',
  
  // 系统错误
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR'
};
```

### 自定义错误类

```typescript
// src/utils/AppError.ts
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
```

### 错误处理中间件

```typescript
// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.code,
      message: err.message,
      details: err.details
    });
  }
  
  console.error('Unexpected error:', err);
  
  return res.status(500).json({
    success: false,
    error: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred'
  });
};
```

---

## 📋 代码规范

### TypeScript 配置

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
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
    "strictFunctionTypes": true
  }
}
```

### 命名规范

```typescript
// 类名: PascalCase
class UserService {}

// 函数名: camelCase
function getUserById() {}

// 常量: UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3;

// 接口名: PascalCase with I prefix (可选)
interface IUser {
  id: string;
  name: string;
}

// 文件名: kebab-case
// user.controller.ts
// grade.service.ts
```

### 代码示例

```typescript
// src/controllers/studentController.ts
import { Request, Response } from 'express';
import { StudentService } from '../services/studentService';
import { AppError } from '../utils/AppError';

export class StudentController {
  private studentService = new StudentService();
  
  // 获取学生列表
  async getStudents(req: Request, res: Response) {
    try {
      const { page, limit, search } = req.query;
      
      const result = await this.studentService.getStudents({
        page: Number(page) || 1,
        limit: Number(limit) || 10,
        search: String(search) || ''
      });
      
      return res.json({
        success: true,
        data: result
      });
    } catch (error) {
      throw new AppError(
        'OPERATION_FAILED',
        'Failed to fetch students',
        400
      );
    }
  }
}
```

---

## 🔒 安全需求

### 密码安全

```typescript
import bcryptjs from 'bcryptjs';

// 密码哈希
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcryptjs.genSalt(10);
  return bcryptjs.hash(password, salt);
}

// 密码验证
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcryptjs.compare(password, hash);
}

// 密码强度检查
export function validatePasswordStrength(password: string): boolean {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  
  return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers;
}
```

### SQL 注入防护

```typescript
// 使用参数化查询 (Sequelize 默认)
const user = await User.findOne({
  where: { username: username }  // 自动参数化
});

// 避免直接字符串拼接
// ❌ 错误: 容易 SQL 注入
const query = `SELECT * FROM users WHERE username = '${username}'`;

// ✅ 正确: 使用参数化
const query = 'SELECT * FROM users WHERE username = ?';
```

### XSS 防护

```typescript
import xss from 'xss';

// 清理输入
function sanitizeInput(input: string): string {
  return xss(input, {
    whiteList: {},
    stripIgnoredTag: true
  });
}
```

### CORS 配置

```typescript
import cors from 'cors';

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

## 🧪 测试计划

### 单元测试

```typescript
// tests/unit/services/gradeService.test.ts
import { GradeService } from '../../../src/services/gradeService';

describe('GradeService', () => {
  let gradeService: GradeService;
  
  beforeEach(() => {
    gradeService = new GradeService();
  });
  
  describe('calculateGradeLevel', () => {
    it('should return A for score >= 85', () => {
      expect(gradeService.calculateGradeLevel(85)).toBe('A');
      expect(gradeService.calculateGradeLevel(95)).toBe('A');
    });
    
    it('should return F for score < 50', () => {
      expect(gradeService.calculateGradeLevel(40)).toBe('F');
      expect(gradeService.calculateGradeLevel(0)).toBe('F');
    });
  });
});
```

### 集成测试

```typescript
// tests/integration/auth.test.ts
import request from 'supertest';
import app from '../src/app';

describe('Authentication', () => {
  it('should login successfully with valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'student01',
        password: 'Password123'
      });
    
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('accessToken');
    expect(response.body.data).toHaveProperty('refreshToken');
  });
  
  it('should fail with invalid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'student01',
        password: 'wrongpassword'
      });
    
    expect(response.status).toBe(401);
  });
});
```

### 测试命令

```bash
# 运行所有测试
npm test

# 运行单元测试
npm run test:unit

# 运行集成测试
npm run test:integration

# 生成覆盖率报告
npm run test:coverage

# 监视模式
npm run test:watch
```

---

## 🚀 部署和运维

### Docker 部署

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist
COPY src ./src

EXPOSE 3000

CMD ["node", "dist/server.js"]
```

### Docker Compose

```yaml
# docker-compose.yml
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
      DB_PASSWORD: ${DB_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      - mysql
      - redis
    networks:
      - app-network

  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD}
      MYSQL_DATABASE: student_grade_system
    volumes:
      - mysql_data:/var/lib/mysql
    networks:
      - app-network

  redis:
    image: redis:7-alpine
    networks:
      - app-network

volumes:
  mysql_data:

networks:
  app-network:
    driver: bridge
```

### 构建和部署

```bash
# 开发环境
npm install
npm run dev

# 生产构建
npm run build

# 启动生产服务器
npm start

# Docker 部署
docker build -t student-grade-backend:latest .
docker run -d --name backend -p 3000:3000 student-grade-backend:latest
```

### Nginx 反向代理配置

```nginx
upstream backend {
  server localhost:3000;
  server localhost:3001;
  server localhost:3002;
}

server {
  listen 80;
  server_name api.example.com;
  
  location / {
    proxy_pass http://backend;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    
    # CORS headers
    add_header 'Access-Control-Allow-Origin' '*';
    add_header 'Access-Control-Allow-Credentials' 'true';
  }
}
```

### 监控和告警

```bash
# 使用 PM2 管理进程
npm install -g pm2

# 启动应用
pm2 start dist/server.js --name "backend"

# 监控
pm2 monit

# 日志
pm2 logs
```

---

## 📅 开发时间估算

```
第 1 周: 项目初始化和数据库设计
  - 环境搭建: 1 天
  - 数据库设计: 2 天
  - 项目结构和基础配置: 2 天

第 2-3 周: 核心模块开发
  - 认证系统: 3 天
  - 学生/教师/课程管理: 4 天
  - 选课和成绩管理: 3 天

第 4 周: 高级功能
  - 消息系统: 2 天
  - 申诉系统: 2 天
  - 公告管理: 1 天

第 5 周: 系统功能和优化
  - 文件上传和导出: 2 天
  - 报告生成: 2 天
  - 性能优化: 1 天

第 6 周: 测试和修复
  - 单元测试: 2 天
  - 集成测试: 2 天
  - Bug 修复: 1 天

第 7 周: 部署和文档
  - Docker 部署: 1 天
  - 文档编写: 2 天
  - 前后端集成: 2 天
```

---

## 📞 开发支持

### 常见问题

**Q: 如何处理大数据量查询?**
A: 使用分页、缓存(Redis)、数据库索引优化

**Q: 如何实现 WebSocket 实时消息?**
A: 集成 Socket.io，创建独立的 WebSocket 服务器

**Q: 如何处理并发请求?**
A: 使用数据库连接池、队列系统(Bull)、缓存

**Q: 密码重置邮件如何发送?**
A: 使用 Nodemailer，发送重置链接，验证后更新密码

---

## 📚 参考资源

- Express.js 官方文档: https://expressjs.com
- Sequelize ORM: https://sequelize.org
- JWT 认证: https://jwt.io
- MySQL 最佳实践: https://dev.mysql.com
- Docker 部署: https://www.docker.com
- TypeScript 文档: https://www.typescriptlang.org

---

**文档版本**: v1.0  
**最后更新**: 2024年11月  
**状态**: 就绪，可开始开发
