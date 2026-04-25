# 学生成绩管理系统 - Claude Code 辅助指南

## 项目概览

这是一个全栈学生成绩管理系统，采用 **前后端分离架构**，集成了 **AI 智能分析**、**WebRTC 视频通话** 和 **3D 可视化** 等先进功能。

### 核心特性
- **多角色权限系统**：学生、教师、管理员三端独立功能
- **AI 成绩分析**：集成 Kimi AI 实现智能成绩分析和教学建议
- **实时视频通话**：师生间 1 对 1 WebRTC 视频通信
- **3D 数据可视化**：Three.js 实现成绩、教学、课堂的 3D 展示
- **实时消息系统**：Socket.IO 实现师生即时通讯
- **成绩申诉流程**：学生可对成绩提出申诉，教师审核处理

---

## 技术栈

### 前端 (student-study/)
```json
{
  "框架": "React 19 + TypeScript",
  "路由": "React Router v6",
  "UI库": "Ant Design v5 + Ant Design Icons",
  "状态管理": "Zustand (轻量级状态管理)",
  "3D可视化": "Three.js",
  "实时通信": "Socket.IO Client",
  "构建工具": "Vite",
  "样式": "Less + Tailwind CSS",
  "图表": "ECharts"
}
```

### 后端 (backend/)
```json
{
  "运行时": "Node.js >= 16.0.0",
  "框架": "Express + TypeScript",
  "数据库": "MySQL + Sequelize ORM",
  "缓存": "Redis (可选)",
  "实时通信": "Socket.IO",
  "认证": "JWT (Access Token + Refresh Token)",
  "安全": "Helmet + CORS + bcrypt",
  "文件上传": "Multer",
  "AI集成": "axios (调用 Kimi API)"
}
```

### 数据库
- **主数据库**: MySQL 8.0+
- **ORM**: Sequelize 6.28.0
- **核心表**: users, students, teachers, courses, grades, messages, appeals, call_history, api_config, analysis_record, analysis_template

---

## 项目结构

### 前端目录结构
```
student-study/src/
├── pages/                  # 页面组件
│   ├── admin/             # 管理员页面
│   ├── student/           # 学生页面
│   ├── teacher/           # 教师页面
│   ├── login/             # 登录页面
│   └── DashboardLayout.tsx # 主布局
├── components/            # 可复用组件
│   ├── VideoCallModal.tsx # 视频通话弹窗
│   └── CourseCalendar.tsx # 课程日历
├── store/                 # Zustand 状态管理
│   ├── authStore.ts       # 认证状态
│   ├── dataStore.ts       # 全局数据状态
│   └── webrtcStore.ts     # WebRTC 状态
├── routes/                # 路由配置
│   ├── adminRoutes.tsx    # 管理员路由
│   ├── teacherRoutes.tsx  # 教师路由
│   └── studentRoutes.tsx  # 学生路由
├── types/                 # TypeScript 类型定义
│   ├── index.ts           # 导出所有类型
│   ├── webrtc.ts          # WebRTC 类型
│   └── aiAnalysis.ts      # AI 分析类型
└── utils/                 # 工具函数
```

### 后端目录结构
```
backend/src/
├── config/                # 配置文件
│   └── database.ts        # 数据库连接配置
├── controllers/           # 控制器（业务逻辑）
│   ├── authController.ts
│   ├── gradeController.ts
│   ├── aiAnalysisController.ts
│   └── ...
├── models/                # Sequelize 数据模型
│   ├── User.ts
│   ├── Student.ts
│   ├── Teacher.ts
│   ├── Grade.ts
│   ├── AnalysisRecord.ts
│   └── index.ts           # 模型注册
├── routes/                # Express 路由
│   ├── authRoutes.ts
│   ├── gradeRoutes.ts
│   └── ...
├── middleware/            # 中间件
│   └── authMiddleware.ts  # JWT 认证中间件
├── services/              # 业务服务层
│   ├── aiAnalysisService.ts  # AI 分析服务
│   └── ...
├── utils/                 # 工具函数
│   └── jwt.ts             # JWT 工具
├── websocket/             # WebSocket 服务
│   └── websocketServer.ts # Socket.IO 服务器
├── types/                 # TypeScript 类型
└── app.ts                 # Express 应用入口
```

---

## 核心功能模块

### 1. 认证与权限系统
- **JWT 双 Token 机制**: Access Token (15分钟) + Refresh Token (7天)
- **角色权限控制**:
  - 学生: 查看成绩、选课、消息交流、成绩申诉
  - 教师: 成绩管理、班级管理、AI 分析、视频通话
  - 管理员: 用户管理、系统配置、API 配置
- **路由保护**: 所有需要认证的路由都使用 `authMiddleware` 中间件

### 2. AI 成绩分析系统
**位置**: `backend/src/services/aiAnalysisService.ts`

**功能**:
- 调用 Kimi AI API 分析学生成绩数据
- 数据脱敏（移除学生姓名、学号等敏感信息）
- 多维度分析：分数分布、知识点薄弱项、学生分层、历史对比等
- 分析模板系统（全局模板 + 个人模板）
- 调用限额控制（单日/单月限额）
- 分析记录管理（查看、导出、删除）

**关键配置** (backend/.env):
```env
KIMI_API_KEY=sk-gWaHAuFhCCmZgdUeACLgLphSR7nU857CsK4m1GKcJ14Kovqk
KIMI_API_ENDPOINT=https://api.moonshot.cn/v1/chat/completions
KIMI_MODEL=moonshot-v1-8k
KIMI_DAILY_LIMIT=10
KIMI_MONTHLY_LIMIT=100
```

### 3. WebRTC 视频通话系统
**位置**: `student-study/src/store/webrtcStore.ts`

**功能**:
- 师生 1 对 1 视频通话
- Socket.IO 信令服务器（通话邀请、连接协商）
- 音视频控制（静音、关闭摄像头）
- 通话记录存储（call_history 表）
- 师生绑定验证（只能与绑定的用户通话）

**核心组件**:
- `webrtcStore.ts`: WebRTC 状态管理
- `VideoCallModal.tsx`: 视频通话 UI
- `websocketServer.ts`: Socket.IO 信令服务

### 4. 实时消息系统
**位置**: `student-study/src/pages/student/MessagesPage.tsx`

**功能**:
- 师生实时文字聊天
- 消息已读/未读状态
- 消息历史记录
- Socket.IO 实时推送

### 5. 3D 可视化
**位置**: `student-study/src/pages/teacher/`

**页面**:
- `Grade3DScene.tsx`: 成绩 3D 分布
- `Teaching3DScene.tsx`: 教学数据 3D
- `Classroom3DScene.tsx`: 课堂互动 3D

**技术**: Three.js + 自定义 3D 场景

### 6. 成绩申诉系统
**位置**: `backend/src/controllers/appealController.ts`

**功能**:
- 学生发起成绩申诉
- 教师审核申诉（批准/拒绝）
- 申诉状态跟踪
- 申诉历史记录

---

## 数据库关键表结构

### users (用户表)
- 存储所有用户的基础信息和认证数据
- 关联 students 和 teachers 表

### grades (成绩表)
- 存储学生课程成绩
- 字段: student_id, course_id, score, grade_level, feedback

### analysis_record (AI 分析记录表)
- 存储 AI 分析请求和结果
- 字段: teacherId, courseIds, analysisDimensions, status, analysisResult

### call_history (通话记录表)
- 存储 WebRTC 视频通话记录
- 字段: caller_id, callee_id, start_time, end_time, call_status

### messages (消息表)
- 存储师生消息
- 字段: sender_id, receiver_id, content, timestamp, is_read

---

## 开发指南

### 启动项目

**后端**:
```bash
cd backend
npm install              # 安装依赖
npm run build            # 构建 TypeScript
npm start                # 启动服务器 (http://localhost:3000)
# 或
npm run dev              # 开发模式 (nodemon)
```

**前端**:
```bash
cd student-study
npm install              # 安装依赖
npm run dev              # 启动开发服务器 (http://localhost:5173)
npm run build            # 构建生产版本
```

### 环境配置

**后端** (backend/.env):
```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=student_grade_system
DB_USER=root
DB_PASSWORD=123456
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
CORS_ORIGIN=http://localhost:5173
KIMI_API_KEY=your-kimi-api-key
```

**前端** (student-study/.env.local):
```env
VITE_API_URL=http://localhost:3000/api
```

### 数据库初始化
```bash
cd backend
npm run db:setup         # 创建数据库和表
npm run db:seed          # 填充测试数据
```

---

## API 端点总览

### 认证相关
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/refresh` - 刷新 Token
- `POST /api/auth/logout` - 退出登录

### 成绩管理
- `GET /api/grades` - 获取成绩列表
- `POST /api/grades` - 添加成绩
- `PUT /api/grades/:id` - 更新成绩
- `DELETE /api/grades/:id` - 删除成绩

### AI 分析
- `POST /api/ai-analysis/analyze` - 发起 AI 分析
- `GET /api/ai-analysis/records` - 获取分析记录
- `GET /api/ai-analysis/stats` - 获取分析统计
- `GET /api/ai-analysis/templates` - 获取分析模板

### 消息系统
- `GET /api/messages` - 获取消息列表
- `POST /api/messages` - 发送消息
- `PUT /api/messages/:id/read` - 标记已读

### 视频通话
- Socket.IO 事件: `call-offer`, `call-answer`, `ice-candidate`, `call-ended`

---

## 常见任务指南

### 添加新的页面
1. 在 `student-study/src/pages/{role}/` 创建组件
2. 在 `student-study/src/routes/{role}Routes.tsx` 注册路由
3. 在 `DashboardLayout.tsx` 添加菜单项

### 添加新的 API 端点
1. 在 `backend/src/controllers/` 创建或修改控制器
2. 在 `backend/src/routes/` 创建或修改路由
3. 在 `backend/src/app.ts` 注册路由
4. 如需认证，添加 `authMiddleware` 中间件

### 添加新的数据模型
1. 在 `backend/src/models/` 创建模型文件
2. 在 `backend/src/models/index.ts` 导入并注册模型
3. 数据库表会在服务器启动时自动创建（Sequelize sync）

### 修改权限控制
- 修改 `backend/src/middleware/authMiddleware.ts`
- 使用 `authorizeRole` 中间件进行角色验证

---

## 代码规范

### TypeScript
- 使用严格模式 (`strict: true` in tsconfig.json)
- 所有函数和变量必须有类型注解
- 导入类型使用 `import type { ... }`

### 前端组件
- 使用函数组件 + Hooks
- Props 定义接口
- 使用 Ant Design 组件库
- 样式使用 Less 或 Tailwind CSS

### 后端代码
- 使用 async/await 处理异步
- 统一错误处理
- API 响应格式: `{ success: boolean, data?: any, message?: string }`
- 使用 Sequelize ORM 操作数据库

---

## 调试技巧

### 查看后端日志
```bash
cd backend
npm run dev           # 开发模式会显示详细日志
```

### 查看 WebRTC 连接状态
打开浏览器控制台:
```javascript
// 查看视频通话状态
console.log(window.webrtcStore)
```

### 测试 AI 分析
1. 确保 Kimi API Key 已配置
2. 访问教师端 → AI 成绩分析页面
3. 选择课程和分析维度
4. 点击"发起AI分析"
5. 查看后端日志和前端网络请求

### 数据库调试
```bash
mysql -u root -p
USE student_grade_system;
SHOW TABLES;
SELECT * FROM grades LIMIT 10;
```

---

## 已知问题和限制

### WebRTC 限制
- 需要HTTPS 环境（localhost 除外）
- NAT 穿透可能需要 TURN 服务器
- 暂不支持多人通话
- 暂不支持通话录制

### AI 分析限制
- 单次分析最多 500 条学生记录
- API 调用有每日/每月限额
- 分析时间取决于网络和 API 响应速度（通常 10-30 秒）

### 浏览器兼容性
- 推荐 Chrome 80+ / Edge 80+
- Safari 对 WebRTC 支持有限
- 不支持微信/支付宝内置浏览器

---

## 部署指南

### 生产环境检查清单
- [ ] 修改 JWT 密钥
- [ ] 配置生产数据库
- [ ] 设置 HTTPS 证书
- [ ] 配置 CORS 允许的域名
- [ ] 设置 Kimi API 调用限额
- [ ] 配置文件上传路径
- [ ] 启用 Redis 缓存（可选）
- [ ] 设置日志级别为 `info`
- [ ] 配置 TURN 服务器（WebRTC）

### 环境变量
确保生产环境 `.env` 文件包含所有必需配置，并更改敏感密钥。

---

## 文档资源

- [功能模块结构图.md](./功能模块结构图.md) - 系统功能架构
- [数据表结构表.md](./数据表结构表.md) - 数据库设计
- [Analy-AI.md](./student-study/Analy-AI.md) - AI 分析功能需求
- [webrtc.md](./student-study/webrtc.md) - WebRTC 功能需求
- [AI_ANALYSIS_TEST_GUIDE.md](./AI_ANALYSIS_TEST_GUIDE.md) - AI 分析测试指南
- [CLASSROOM_3D_ENHANCED_GUIDE.md](./CLASSROOM_3D_ENHANCED_GUIDE.md) - 3D 课堂增强指南

---

## 给 Claude Code 的建议

### 当用户要求"完善功能"时:
1. 先查看相关需求文档（如 Analy-AI.md、webrtc.md）
2. 检查现有实现是否完整
3. 遵循项目代码规范（TypeScript + Ant Design）
4. 保持与现有架构一致
5. 更新相关类型定义

### 当用户要求"修复 bug"时:
1. 先定位问题（前端组件 / 后端控制器 / 数据库）
2. 查看错误信息和日志
3. 检查相关类型定义
4. 测试修复后的功能
5. 确保不破坏其他功能

### 当用户要求"添加新功能"时:
1. 明确功能需求和使用场景
2. 设计数据模型（如需新表）
3. 创建后端 API（Controller → Route → Register）
4. 创建前端页面和组件
5. 更新路由和菜单
6. 编写类型定义
7. 测试完整流程

### 特殊注意事项:
- **权限控制**: 所有 API 必须验证用户身份和权限
- **数据安全**: 学生姓名、学号等敏感信息需脱敏
- **错误处理**: 前后端统一错误处理和提示
- **类型安全**: TypeScript 严格模式，禁止 `any`
- **代码风格**: 遵循 ESLint 配置，使用 Prettier 格式化

---

**项目版本**: 1.0.0
**最后更新**: 2026-03-25
**维护者**: [项目团队]
