# 学生成绩管理系统 - Node.js 后端

**项目版本**: 1.0.0  
**状态**: 开发中  

## 🚀 快速开始

### 前置要求

```bash
- Node.js 18+
- npm 9+
- MySQL 8.0+
```

### 安装步骤

```bash
# 1. 进入项目目录
cd backend

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env
# 编辑 .env 文件，配置数据库参数

# 4. 创建数据库
npm run db:create

# 5. 运行迁移
npm run db:migrate

# 6. 导入初始数据
npm run db:seed

# 7. 启动开发服务器
npm run dev
```

服务器将在 `http://localhost:3000` 启动

## 📁 项目结构

```
src/
├── app.ts                    # Express 应用主文件
├── server.ts                 # 服务器启动文件
├── config/                   # 配置文件
│   ├── database.ts          # 数据库配置
│   └── jwt.ts               # JWT 配置
├── models/                   # Sequelize 模型
│   ├── User.ts
│   ├── Student.ts
│   ├── Course.ts
│   ├── Grade.ts
│   └── ...
├── controllers/              # 控制器层
├── services/                 # 业务逻辑层
├── routes/                   # 路由定义
├── middleware/               # 中间件
│   ├── auth.ts              # 认证中间件
│   └── errorHandler.ts      # 错误处理
├── utils/                    # 工具函数
├── types/                    # TypeScript 类型定义
└── constants/                # 常量定义
```

## 🔑 核心模块

### 认证 (Authentication)
- JWT Token 认证 (24小时有效期)
- 密码加密存储 (bcryptjs)
- 刷新 Token 机制 (7天有效期)

### 用户管理 (Users)
- 学生管理
- 教师管理
- 管理员管理

### 课程管理 (Courses)
- 课程 CRUD
- 选课管理
- 课程统计

### 成绩管理 (Grades)
- 成绩录入
- 成绩查询
- 成绩统计
- 成绩申诉

## 📡 API 端点

### 认证
```
POST   /api/auth/login           # 登录
POST   /api/auth/logout          # 登出
POST   /api/auth/refresh         # 刷新 Token
```

### 学生管理
```
GET    /api/students             # 获取学生列表
GET    /api/students/:id         # 获取学生详情
POST   /api/students             # 创建学生
PUT    /api/students/:id         # 更新学生
DELETE /api/students/:id         # 删除学生
```

### 成绩管理
```
GET    /api/grades               # 获取成绩列表
POST   /api/grades               # 创建成绩
PUT    /api/grades/:id           # 更新成绩
DELETE /api/grades/:id           # 删除成绩
```

## 🧪 测试

```bash
# 运行所有测试
npm test

# 运行单元测试
npm run test:unit

# 运行集成测试
npm run test:integration

# 查看覆盖率
npm run test:coverage
```

## 🐛 开发

### 启动开发服务器
```bash
npm run dev
```

### 编译 TypeScript
```bash
npm run build
```

### 代码检查
```bash
npm run lint
npm run lint:fix
```

## 📦 部署

### Docker 部署

```bash
# 构建镜像
docker build -t student-grade-backend:latest .

# 运行容器
docker run -p 3000:3000 student-grade-backend:latest
```

### Docker Compose

```bash
docker-compose up -d
```

## 🔐 安全特性

- ✅ JWT Token 认证
- ✅ 密码加密 (bcryptjs)
- ✅ SQL 注入防护 (Sequelize ORM)
- ✅ XSS 防护 (Helmet.js)
- ✅ CORS 配置
- ✅ 速率限制
- ✅ 请求验证

## 📝 环境变量

请参考 `.env.example` 文件配置以下环境变量：

```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=student_grade_system
DB_USER=root
DB_PASSWORD=123456
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:5173
```

## 📚 文档

- [完整需求文档](../student-study/BACKEND_REQUIREMENTS.md)
- [快速开始指南](../student-study/BACKEND_QUICKSTART.md)
- [API 接口规范](../student-study/PROJECT_REQUIREMENTS.md)

## 🤝 开发流程

1. 创建新分支: `git checkout -b feature/your-feature`
2. 编写代码并测试
3. 提交变更: `git commit -am 'Add new feature'`
4. 推送分支: `git push origin feature/your-feature`
5. 提交 Pull Request

## 📞 技术支持

如有问题或建议，请提交 Issue 或联系开发团队。

## 📄 许可证

MIT License

---

**最后更新**: 2024年11月  
**版本**: 1.0.0
