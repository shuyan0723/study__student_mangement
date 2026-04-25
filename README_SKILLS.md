# 项目文档索引

## 📚 核心文档

### 📖 [SKILLS.md](./SKILLS.md) - **项目概览和快速参考**
- 项目简介和核心特性
- 技术栈详解
- 目录结构说明
- 核心功能模块介绍
- API 端点总览
- 常见任务指南
- **Claude Code 首先应该阅读这个文档**

### 🛠️ [CLAUDE_GUIDE.md](./CLAUDE_GUIDE.md) - **开发规范和最佳实践**
- 5 种核心开发模式（添加页面、模型、类型等）
- 常见修复场景
- 性能优化建议
- 安全最佳实践
- 调试技巧
- Git 提交规范
- **Claude Code 开发时应该参考这个文档**

---

## 📋 功能需求文档

### AI 成绩分析
- [Analy-AI.md](./student-study/Analy-AI.md) - AI 成绩分析功能需求
  - 业务目标和场景
  - 角色权限明细
  - 功能需求详细说明
  - Kimi API 调用规范
  - 数据安全和隐私要求

### WebRTC 视频通话
- [webrtc.md](./student-study/webrtc.md) - 师生双向视频通话需求
  - 核心角色定义
  - 功能需求列表
  - 非功能需求
  - 技术实现细节

### 3D 可视化
- [CLASSROOM_3D_ENHANCED_GUIDE.md](./CLASSROOM_3D_ENHANCED_GUIDE.md) - 3D 课堂增强指南
  - 3D 场景实现
  - 交互功能说明
  - 性能优化建议

---

## 🏗️ 架构文档

### 系统架构
- [功能模块结构图.md](./功能模块结构图.md) - 功能模块架构
  - 学生/教师/管理员功能模块
  - 数据存储模块
  - 系统整体架构图

### 数据库设计
- [数据表结构表.md](./数据表结构表.md) - 数据库表结构
  - 10+ 个核心表结构
  - 字段定义和约束
  - 表关系图
  - 数据字典

---

## 🔧 技术文档

### 后端
- [backend/README.md](./backend/README.md) - 后端项目说明
- [backend/QUICK_START.md](./backend/QUICK_START.md) - 后端快速开始
- [backend/API_EXAMPLES.md](./backend/API_EXAMPLES.md) - API 使用示例
- [backend/BACKEND_SETUP_SUMMARY.md](./backend/BACKEND_SETUP_SUMMARY.md) - 后端设置总结

### 前端
- [student-study/README.md](./student-study/README.md) - 前端项目说明
- [student-study/QUICKSTART.md](./student-study/QUICKSTART.md) - 前端快速开始

---

## ✅ 测试文档

- [AI_ANALYSIS_TEST_GUIDE.md](./AI_ANALYSIS_TEST_GUIDE.md) - AI 分析测试指南
  - 功能测试步骤
  - 边界条件测试
  - 性能测试
  - 安全测试

---

## 📝 学术文档

- [项目分析报告.md](./项目分析报告.md) - 项目整体分析报告
- [开题报告.md](./开题报告.md) - 毕业设计开题报告
- [毕业设计论文任务书.md](./毕业设计论文任务书.md) - 论文任务书
- [数据表结构表说明.md](./数据表结构表说明.md) - 数据库设计说明

---

## 🚀 快速开始

### 1. 首次使用 Claude Code
```bash
# 向 Claude Code 介绍项目
"请阅读 SKILLS.md 文档，了解项目概览"
```

### 2. 修复 Bug
```bash
# 让 Claude Code 修复问题
"修复后端 API 认证问题"
"修复前端 TypeScript 类型错误"
```

### 3. 添加新功能
```bash
# 让 Claude Code 开发功能
"为教师端添加作业管理功能，参考 CLAUDE_GUIDE.md 中的模式 1"
"添加学生考勤数据模型，参考模式 2"
```

### 4. 优化代码
```bash
# 让 Claude Code 优化性能
"优化成绩查询性能"
"添加前端组件缓存"
```

---

## 🎯 Claude Code 使用建议

### 场景 1: 完善现有功能
```
1. Claude Code 阅读 SKILLS.md 了解项目
2. 查看相关功能需求文档（如 Analy-AI.md）
3. 参考 CLAUDE_GUIDE.md 中的开发模式
4. 遵循代码规范和最佳实践
```

### 场景 2: 修复 Bug
```
1. 描述具体的错误现象
2. Claude Code 定位问题（前端/后端/数据库）
3. 查看相关代码和日志
4. 应用 CLAUDE_GUIDE.md 中的修复方案
5. 测试修复结果
```

### 场景 3: 添加新功能
```
1. 明确功能需求和用户场景
2. Claude Code 设计数据模型和 API
3. 参考开发模式创建后端和前端代码
4. 更新路由、菜单和类型定义
5. 测试完整流程
```

---

## 💡 关键提醒

### ⚠️ 重要注意事项
1. **权限控制**: 所有 API 必须验证用户身份和角色
2. **数据安全**: 敏感信息（姓名、学号）需脱敏
3. **类型安全**: TypeScript 严格模式，避免使用 `any`
4. **错误处理**: 统一的错误处理和用户提示
5. **代码风格**: 遵循 ESLint 和 Prettier 配置

### 🔒 安全要求
- JWT 密钥生产环境必须更改
- API 密钥使用环境变量，不提交到 Git
- 用户密码使用 bcrypt 加密
- SQL 查询使用参数化（Sequelize 自动处理）
- 输入验证使用 express-validator

### 📊 性能要求
- API 响应时间 < 1s（简单查询）
- AI 分析响应时间 < 30s
- 数据库查询使用索引和分页
- 前端使用 React.memo 缓存组件

---

## 📞 获取帮助

### 常见问题
1. **端口被占用**: 修改 .env 文件中的 PORT
2. **数据库连接失败**: 检查 MySQL 服务是否启动
3. **API 调用失败**: 检查 CORS 配置和 Token
4. **WebRTC 不工作**: 需要 HTTPS（localhost 除外）
5. **AI 分析失败**: 检查 Kimi API Key 配置

### 调试命令
```bash
# 查看后端日志
cd backend && npm run dev

# 查看前端日志
cd student-study && npm run dev

# 检查数据库
mysql -u root -p
USE student_grade_system;
SELECT * FROM users;
```

---

## 📈 项目状态

### ✅ 已完成
- ✅ 用户认证系统（JWT）
- ✅ 成绩管理模块
- ✅ 师生消息系统
- ✅ AI 成绩分析（集成 Kimi）
- ✅ WebRTC 视频通话
- ✅ 3D 数据可视化
- ✅ 成绩申诉系统

### 🚧 进行中
- 🔄 性能优化
- 🔄 单元测试

### 📅 计划中
- 📋 作业管理模块
- 📋 考勤管理模块
- 📋 家长端功能
- 📋 移动端适配

---

**项目版本**: 1.0.0
**技术栈**: React + TypeScript + Node.js + Express + MySQL
**最后更新**: 2026-03-25
**维护团队**: [项目团队名称]

---

## 🎓 许可证

MIT License - 详见 LICENSE 文件
