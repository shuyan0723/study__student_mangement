# 学生成绩管理系统 - 快速开始指南 🚀

## ⚡ 5分钟快速开始

### 1️⃣ 安装依赖 (1分钟)
```bash
cd student-study
npm install
```

### 2️⃣ 启动开发服务器 (30秒)
```bash
npm run dev
```
> 自动打开 http://localhost:5173

### 3️⃣ 选择演示账号登录 (1分钟)
| 角色 | 用户名 | 密码 |
|-----|--------|------|
| 👨‍🎓 学生 | student01 | password |
| 👨‍🏫 教师 | teacher01 | password |
| 👨‍💼 管理员 | admin01 | password |

### 4️⃣ 浏览系统功能 (2分钟)
- 登录后自动进入首页仪表板
- 左侧菜单根据角色显示不同功能
- 点击菜单项即可进入各功能模块

---

## 📚 各角色功能一览

### 学生 👨‍🎓
```
首页仪表板
├─ 平均成绩统计
├─ 课程统计信息
├─ 最近成绩记录
└─ 选修课程列表

成绩查询 ✓
├─ 查看所有成绩
├─ 统计平均分
├─ 按成绩排序
└─ 导出成绩单

选课管理 ✓
├─ 浏览可选课程
├─ 选择课程
├─ 查看已选课程
└─ 退课

在线交流 ✓
├─ 选择教师
├─ 发送消息
└─ 查看对话历史
```

### 教师 👨‍🏫
```
首页仪表板
├─ 教授课程统计
├─ 教学学生数
└─ 课程列表

成绩管理 ✓
├─ 按课程查看成绩
├─ 编辑学生成绩
└─ 添加评语

班级管理 ◇
└─ 占位功能（可扩展）

在线交流 ✓
└─ 与学生交互
```

### 管理员 👨‍💼
```
首页仪表板
├─ 系统统计信息
└─ 快速访问按钮

学生管理 ✓
├─ 查看学生列表
├─ 添加新学生
├─ 编辑学生信息
└─ 删除学生

教师管理 ✓
├─ 查看教师列表
├─ 添加新教师
├─ 编辑教师信息
└─ 删除教师

课程管理 ✓
├─ 查看课程列表
├─ 创建新课程
├─ 编辑课程
└─ 删除课程

成绩管理 ✓
├─ 查看所有成绩
├─ 添加成绩
├─ 编辑成绩
└─ 删除成绩

系统设置 ✓
├─ 基本设置
├─ 功能设置
├─ 安全设置
└─ 数据管理
```

---

## 🎯 常用操作

### 查看成绩 (学生)
1. 登录 → student01
2. 左菜单 → 成绩查询
3. 查看表格中的成绩和统计数据

### 管理学生 (管理员)
1. 登录 → admin01
2. 左菜单 → 学生管理
3. 点击 "添加学生" 按钮
4. 填写学生信息表单
5. 点击 "添加" 提交

### 选课 (学生)
1. 登录 → student01
2. 左菜单 → 选课管理
3. 点击 "选择课程" 按钮
4. 在弹框中选择课程
5. 点击 "选择" 完成选课

### 管理课程成绩 (教师)
1. 登录 → teacher01
2. 左菜单 → 成绩管理
3. 从下拉框选择课程
4. 查看该课程的学生成绩

---

## 🔧 开发命令

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 运行 ESLint 检查
npm run lint

# 类型检查
tsc -b
```

---

## 📂 项目结构速查

```
src/
├── pages/           # 所有页面组件
│   ├── student/    # 学生功能
│   ├── teacher/    # 教师功能
│   └── admin/      # 管理员功能
├── store/          # 状态管理
│   ├── authStore.ts    # 认证状态
│   └── dataStore.ts    # 业务数据
├── types/          # TypeScript 类型
└── App.tsx         # 路由配置

说明文档/
├── README.md           # 项目说明
├── FEATURES.md         # 功能详解
├── DEPLOYMENT.md       # 部署指南
└── PROJECT_SUMMARY.md  # 项目总结
```

---

## ❓ 常见问题

### Q: 如何修改演示数据?
A: 编辑 `src/store/dataStore.ts` 中的 `mockCourses` 和 `mockGrades`

### Q: 如何连接真实后端?
A: 修改 `src/store/authStore.ts` 和 `src/store/dataStore.ts` 中的 API 调用
   详见 `DEPLOYMENT.md`

### Q: 如何添加新功能?
A: 
1. 在 `src/pages/` 中创建新组件
2. 在 `src/App.tsx` 中添加路由
3. 在 `src/pages/DashboardLayout.tsx` 中添加菜单项

### Q: 支持什么浏览器?
A: Chrome, Firefox, Safari, Edge (最新版本)

### Q: 如何修改系统名称?
A: 编辑 `src/pages/admin/SettingsPage.tsx` 中的初始值

### Q: 数据会保存吗?
A: 前端演示中数据只在当前会话保存，刷新后重置
   生产环境需要连接后端数据库

---

## 🎓 学习资源

### 项目涉及的技术
- [React 官网](https://react.dev)
- [TypeScript 文档](https://www.typescriptlang.org)
- [Ant Design 组件](https://ant.design)
- [Zustand 状态管理](https://github.com/pmndrs/zustand)
- [React Router 路由](https://reactrouter.com)

### 详细文档
- 功能详解 → `FEATURES.md`
- 部署指南 → `DEPLOYMENT.md`
- 项目总结 → `PROJECT_SUMMARY.md`

---

## 💡 提示

- 💡 **第一次使用？** 使用 student01 账号快速体验学生功能
- 💡 **想看管理功能？** 使用 admin01 账号登录
- 💡 **需要修改代码？** 修改后保存会自动热更新
- 💡 **遇到错误？** 打开浏览器控制台查看详细信息
- 💡 **想要部署？** 参考 `DEPLOYMENT.md`

---

## ✅ 下一步

1. ✓ 安装项目
2. ✓ 启动开发服务器
3. ✓ 使用演示账号登录
4. ✓ 探索各项功能
5. ✓ 阅读详细文档
6. ✓ 根据需要定制功能

---

## 📞 需要帮助?

- 📖 查看 README.md
- 🚀 查看 DEPLOYMENT.md  
- 📚 查看 FEATURES.md
- 💻 查看源代码和注释

---

**祝你使用愉快！** 🎉

*项目完成时间: 2024年11月2日*
