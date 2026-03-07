# 后端项目快速启动指南

## 🚀 快速开始

### 1. 环境要求

确保你的开发环境满足以下要求：
- Node.js >= 16.0.0
- MySQL >= 8.0
- npm >= 8.0.0

### 2. 安装依赖

```bash
cd backend
npm install
```

### 3. 配置数据库

#### 启动MySQL服务

确保MySQL服务正在运行：

```bash
# Windows
net start mysql

# Linux/Mac
sudo systemctl start mysql
# 或
brew services start mysql
```

#### 创建数据库和表结构

```bash
npm run db:setup
```

这个命令会：
- 创建名为 `student_grade_system` 的数据库
- 创建所有必要的表（users, students, teachers, courses, grades, messages, appeals）
- 设置表的索引和外键约束

#### 插入测试数据

```bash
npm run db:seed
```

这个命令会：
- 创建测试用户（管理员、教师、学生）
- 创建测试课程和成绩数据
- 创建测试消息和申诉数据

#### 测试账号

系统初始化后，可以使用以下账号登录（所有账号密码均为 `123456`）：

**管理员**
- 用户名: `admin`
- 密码: `123456`

**教师**
- 用户名: `teacher01`
- 密码: `123456`
- 姓名: 张老师
- 部门: 计算机学院

- 用户名: `teacher02`
- 密码: `123456`
- 姓名: 李老师
- 部门: 数学学院

**学生**
- 用户名: `student01`
- 密码: `123456`
- 姓名: 张三
- 专业: 计算机科学与技术

- 用户名: `student02`
- 密码: `123456`
- 姓名: 李四
- 专业: 软件工程

- 用户名: `student03`
- 密码: `123456`
- 姓名: 王五
- 专业: 应用数学

### 4. 配置环境变量

`.env` 文件已经配置好默认值，通常不需要修改。但如果需要自定义配置，可以编辑 `.env` 文件：

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

### 5. 启动开发服务器

```bash
npm run dev
```

服务器将在 http://localhost:3000 启动

### 6. 测试API

#### 健康检查
```bash
curl http://localhost:3000/api/health
```

#### API信息
```bash
curl http://localhost:3000/api
```

#### 登录测试
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"123456"}'
```

## 📚 常用命令

### 开发命令

```bash
# 启动开发服务器（支持热重载）
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 运行测试
npm test

# 运行测试并生成覆盖率报告
npm run test:coverage

# 代码检查
npm run lint

# 代码修复
npm run lint:fix
```

### 数据库命令

```bash
# 初始化数据库（创建数据库和表）
npm run db:setup

# 插入测试数据
npm run db:seed

# 完整初始化（创建数据库+插入数据）
npm run db:init
```

## 🔧 故障排除

### 问题1: 无法连接到数据库

**错误信息**: `Error: connect ECONNREFUSED 127.0.0.1:3306`

**解决方案**:
1. 确认MySQL服务正在运行
2. 检查 `.env` 文件中的数据库配置是否正确
3. 确认数据库用户名和密码正确

### 问题2: 表已存在错误

**错误信息**: `Table 'xxx' already exists`

**解决方案**:
1. 手动删除数据库并重新初始化
2. 或者直接运行 `npm run db:setup`（脚本会创建表如果不存在）

### 问题3: 端口被占用

**错误信息**: `Error: listen EADDRINUSE: address already in use :::3000`

**解决方案**:
1. 修改 `.env` 文件中的 PORT 值
2. 或者停止占用3000端口的进程

### 问题4: 依赖安装失败

**解决方案**:
1. 清除npm缓存: `npm cache clean --force`
2. 删除 node_modules 和 package-lock.json
3. 重新安装: `npm install`

## 📖 API文档

详细的API文档请参考 [README.md](./README.md)

## 🔐 安全注意事项

⚠️ **重要**: 在生产环境中，请务必：

1. 修改所有默认密码
2. 更改JWT密钥
3. 设置强密码策略
4. 启用HTTPS
5. 配置防火墙
6. 定期备份数据库
7. 更新依赖包到最新稳定版本

## 🆘 获取帮助

如果遇到问题：
1. 查看控制台输出的错误信息
2. 检查 `.env` 配置是否正确
3. 确认MySQL服务正在运行
4. 查看详细的 README.md 文档

## 📝 下一步

现在后端服务器已经运行，你可以：

1. 启动前端应用并连接到后端
2. 使用Postman或curl测试API
3. 查看API文档了解所有可用的端点
4. 根据需求修改和扩展功能

祝你开发顺利！🎉
