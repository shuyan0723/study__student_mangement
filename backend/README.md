# 学生成绩管理系统 - 后端 API

基于 Node.js + Express + TypeScript + MySQL 的学生成绩管理系统后端服务。

## 功能特性

- 🔐 **用户认证** - JWT 身份验证，支持管理员、教师、学生三种角色
- 👥 **用户管理** - 学生、教师信息的CRUD操作
- 📚 **课程管理** - 课程的创建、更新、删除和查询
- 📊 **成绩管理** - 成绩录入、更新、批量更新、统计查询
- 💬 **消息系统** - 用户间的消息通信功能
- 📝 **申诉系统** - 学生成绩申诉流程管理
- 🔒 **权限控制** - 基于角色的访问控制 (RBAC)
- ✅ **数据验证** - 请求数据验证和错误处理

## 技术栈

- **运行时**: Node.js >= 16.0.0
- **框架**: Express.js 4.18.2
- **语言**: TypeScript 5.0.2
- **数据库**: MySQL 8.0+
- **ORM**: Sequelize 6.28.0
- **认证**: JWT (jsonwebtoken 9.0.0)
- **密码加密**: bcryptjs 2.4.3
- **验证**: express-validator 7.0.0
- **安全**: helmet, cors, express-rate-limit

## 项目结构

```
backend/
├── src/
│   ├── config/          # 配置文件
│   │   └── database.ts  # 数据库配置
│   ├── controllers/     # 控制器
│   │   ├── authController.ts
│   │   ├── studentController.ts
│   │   ├── teacherController.ts
│   │   ├── courseController.ts
│   │   ├── gradeController.ts
│   │   ├── messageController.ts
│   │   └── appealController.ts
│   ├── middleware/      # 中间件
│   │   └── authMiddleware.ts
│   ├── models/          # 数据模型
│   │   ├── User.ts
│   │   ├── Student.ts
│   │   ├── Teacher.ts
│   │   ├── Course.ts
│   │   ├── Grade.ts
│   │   ├── Message.ts
│   │   ├── Appeal.ts
│   │   └── index.ts
│   ├── routes/          # 路由定义
│   │   ├── authRoutes.ts
│   │   ├── studentRoutes.ts
│   │   ├── teacherRoutes.ts
│   │   ├── courseRoutes.ts
│   │   ├── gradeRoutes.ts
│   │   ├── messageRoutes.ts
│   │   └── appealRoutes.ts
│   ├── utils/           # 工具函数
│   │   ├── jwt.ts
│   │   └── password.ts
│   ├── types/           # TypeScript 类型定义
│   │   └── index.ts
│   ├── app.ts           # Express 应用配置
│   └── server.ts        # 服务器入口
├── scripts/             # 数据库脚本
│   ├── setupDatabase.js # 数据库初始化
│   └── seedData.js      # 种子数据
├── .env                 # 环境变量
├── package.json
├── tsconfig.json
└── README.md
```

## 快速开始

### 1. 环境准备

确保已安装以下软件：
- Node.js >= 16.0.0
- MySQL >= 8.0
- npm 或 yarn

### 2. 安装依赖

```bash
cd backend
npm install
```

### 3. 配置环境变量

复制 `.env` 文件并根据需要修改配置：

```env
# 服务器配置
NODE_ENV=development
PORT=3000

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_NAME=student_grade_system
DB_USER=root
DB_PASSWORD=123456

# JWT配置
JWT_ACCESS_SECRET=your-access-secret-key
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_REFRESH_EXPIRES_IN=7d

# CORS配置
CORS_ORIGIN=http://localhost:5173
```

### 4. 初始化数据库

首先创建数据库和表结构：

```bash
node scripts/setupDatabase.js
```

然后插入种子数据（可选）：

```bash
node scripts/seedData.js
```

### 5. 启动开发服务器

```bash
npm run dev
```

服务器将在 http://localhost:3000 启动

### 6. 构建生产版本

```bash
npm run build
npm start
```

## API 文档

### 认证相关

#### 登录
```
POST /api/auth/login
Body: {
  "username": "string",
  "password": "string"
}
```

#### 刷新令牌
```
POST /api/auth/refresh-token
Body: {
  "refreshToken": "string"
}
```

#### 登出
```
POST /api/auth/logout
```

### 学生管理

#### 获取所有学生
```
GET /api/students?page=1&limit=10&college=计算机学院&major=计算机科学与技术
Headers: Authorization: Bearer {token}
```

#### 获取学生详情
```
GET /api/students/:id
Headers: Authorization: Bearer {token}
```

#### 创建学生
```
POST /api/students
Body: {
  "student_id": "S001",
  "name": "张三",
  "username": "student01",
  "email": "student01@example.com",
  "password": "123456",
  "gender": "male",
  "college": "计算机学院",
  "major": "计算机科学与技术"
}
Headers: Authorization: Bearer {token}
```

### 教师管理

#### 获取所有教师
```
GET /api/teachers?page=1&limit=10&department=计算机学院
Headers: Authorization: Bearer {token}
```

#### 获取教师详情
```
GET /api/teachers/:id
Headers: Authorization: Bearer {token}
```

### 课程管理

#### 获取所有课程
```
GET /api/courses?page=1&limit=10&semester=2024-1&category=必修
Headers: Authorization: Bearer {token}
```

#### 创建课程
```
POST /api/courses
Body: {
  "course_id": "CS101",
  "course_name": "数据结构",
  "credits": 4.0,
  "hours": 64,
  "semester": "2024-1",
  "teacher_id": "teacher-uuid",
  "capacity": 100
}
Headers: Authorization: Bearer {token}
```

### 成绩管理

#### 获取成绩列表
```
GET /api/grades?page=1&limit=10&student_id=xxx&course_id=xxx
Headers: Authorization: Bearer {token}
```

#### 创建成绩
```
POST /api/grades
Body: {
  "student_id": "student-uuid",
  "course_id": "course-uuid",
  "score": 85.5,
  "feedback": "表现良好"
}
Headers: Authorization: Bearer {token}
```

#### 批量更新成绩
```
POST /api/grades/batch
Body: {
  "grades": [
    { "id": "grade-uuid-1", "score": 90 },
    { "id": "grade-uuid-2", "score": 85 }
  ]
}
Headers: Authorization: Bearer {token}
```

#### 获取成绩统计
```
GET /api/grades/statistics?course_id=xxx&semester=2024-1
Headers: Authorization: Bearer {token}
```

### 消息管理

#### 获取消息列表
```
GET /api/messages?page=1&limit=20&is_read=false
Headers: Authorization: Bearer {token}
```

#### 发送消息
```
POST /api/messages
Body: {
  "receiver_id": "user-uuid",
  "content": "消息内容"
}
Headers: Authorization: Bearer {token}
```

#### 获取对话历史
```
GET /api/messages/conversation/:otherUserId?page=1&limit=50
Headers: Authorization: Bearer {token}
```

#### 标记消息已读
```
PUT /api/messages/:id/read
Headers: Authorization: Bearer {token}
```

### 申诉管理

#### 获取申诉列表
```
GET /api/appeals?page=1&limit=10&status=pending
Headers: Authorization: Bearer {token}
```

#### 创建申诉
```
POST /api/appeals
Body: {
  "course_id": "course-uuid",
  "original_score": 85,
  "appeal_reason": "我认为我的答案应该得到更高的分数...",
  "attachments": []
}
Headers: Authorization: Bearer {token}
```

#### 更新申诉状态
```
PUT /api/appeals/:id/status
Body: {
  "status": "approved",
  "new_score": 90,
  "review_feedback": "经复核，同意提高成绩"
}
Headers: Authorization: Bearer {token}
```

## 测试账号

系统初始化后包含以下测试账号（密码均为 `123456`）：

### 管理员
- 用户名: `admin`
- 密码: `123456`
- 权限: 所有功能的完全访问权限

### 教师
- 用户名: `teacher01`
- 密码: `123456`
- 权限: 课程管理、成绩录入、查看学生信息

### 学生
- 用户名: `student01`
- 密码: `123456`
- 权限: 查看个人成绩、提交申诉、发送消息

## 数据模型

### 用户 (User)
- id: UUID
- username: 唯一用户名
- password_hash: 密码哈希
- email: 邮箱
- role: 角色 (student/teacher/admin)
- status: 状态 (active/inactive/locked)

### 学生 (Student)
- id: UUID
- user_id: 关联用户ID
- student_id: 学号
- name: 姓名
- gender: 性别
- college: 学院
- major: 专业

### 教师 (Teacher)
- id: UUID
- user_id: 关联用户ID
- teacher_id: 教师编号
- name: 姓名
- department: 部门
- title: 职称

### 课程 (Course)
- id: UUID
- course_id: 课程编号
- course_name: 课程名称
- credits: 学分
- hours: 学时
- semester: 学期
- teacher_id: 授课教师

### 成绩 (Grade)
- id: UUID
- student_id: 学生ID
- course_id: 课程ID
- score: 分数
- grade_level: 等级 (A/B/C/D/E/F)
- feedback: 评语

## 开发指南

### 添加新的API端点

1. 在 `controllers/` 中创建控制器函数
2. 在 `routes/` 中定义路由
3. 在 `app.ts` 中注册路由
4. 更新本文档

### 修改数据模型

1. 修改 `models/` 中的模型文件
2. 更新数据库迁移脚本
3. 更新相关控制器和类型定义

## 错误处理

API使用统一的错误响应格式：

```json
{
  "success": false,
  "error": "ERROR_CODE",
  "message": "错误描述",
  "details": {}
}
```

常见错误代码：
- `VALIDATION_ERROR`: 请求验证失败
- `AUTHENTICATION_FAILED`: 认证失败
- `AUTHORIZATION_FAILED`: 授权失败
- `NOT_FOUND`: 资源不存在
- `INTERNAL_SERVER_ERROR`: 服务器内部错误

## 许可证

MIT License

## 联系方式

如有问题或建议，请联系开发团队。
