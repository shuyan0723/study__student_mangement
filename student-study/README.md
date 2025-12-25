# 学生成绩信息管理系统

一个基于B/S模式的完整学生成绩管理信息系统，采用React+TypeScript+Ant Design开发。

## 系统功能概述

### 学生用户功能
- **登陆与注册**: 学生可以通过用户名密码登录系统
- **成绩查询**: 查看自己的所有课程成绩，包括成绩统计（平均分、优秀课程数等）
- **选课管理**: 浏览可选课程、选课和退课
- **在线交流**: 与授课教师进行实时消息交流

### 教师用户功能
- **登陆与注册**: 教师用户认证
- **成绩管理**: 添加、修改、查询学生成绩，撰写评语
- **班级管理**: 查看教授的课程和选课学生信息
- **在线交流**: 与学生进行消息互动

### 管理员功能
- **学生管理**: 添加、编辑、删除学生信息（包括学号、姓名、学院、专业等）
- **教师管理**: 管理教师账户和信息
- **课程管理**: 创建课程、设置授课教师、编辑课程信息
- **成绩管理**: 管理所有学生成绩，支持批量操作
- **系统设置**: 平台管理和配置

## 技术栈

- **前端框架**: React 19.1.1
- **编程语言**: TypeScript 5.8
- **UI组件库**: Ant Design 5.11.0
- **路由管理**: React Router 6.20.0
- **状态管理**: Zustand 4.4.1
- **构建工具**: Vite 7.1.0

## 项目结构

```
src/
├── pages/                          # 页面组件
│   ├── LoginPage.tsx              # 登录页面
│   ├── DashboardLayout.tsx        # 仪表板布局
│   ├── DashboardPage.tsx          # 首页仪表板
│   ├── student/                   # 学生模块
│   │   ├── GradesPage.tsx        # 成绩查询
│   │   ├── CoursesPage.tsx       # 选课管理
│   │   ├── MessagesPage.tsx      # 在线交流
│   │   └── StudentPage.css       # 样式
│   └── admin/                     # 管理员模块
│       ├── StudentsManagePage.tsx # 学生管理
│       ├── GradesManagePage.tsx   # 成绩管理
│       └── CoursesManagePage.tsx  # 课程管理
├── store/                         # 状态管理
│   ├── authStore.ts              # 认证状态
│   └── dataStore.ts              # 数据状态
├── types/                         # TypeScript类型定义
│   └── index.ts
├── App.tsx                        # 主应用组件
└── main.tsx                       # 入口文件
```

## 数据库表结构设计

### 1. 学生信息表 (students)
- 学号 (studentId)
- 姓名 (name)
- 账号 (username)
- 性别 (gender)
- 学院 (college)
- 专业 (major)
- 联系方式 (phone)
- 家庭住址 (homeAddress)
- 邮箱 (email)

### 2. 教师信息表 (teachers)
- 工号 (teacherId)
- 教师姓名 (name)
- 性别 (gender)
- 所属系 (department)
- 职称 (title)
- 授课编号 (courseIds)

### 3. 课程表 (courses)
- 课程号 (courseId)
- 课程名 (courseName)
- 学分 (credits)
- 学期 (semester)
- 学时 (hours)
- 教师ID (teacherId)

### 4. 学生选课表 (studentCourses)
- 学号 (studentId)
- 课程号 (courseId)
- 成绩 (score)
- 状态 (status)

### 5. 成绩表 (grades)
- 学号 (studentId)
- 课程号 (courseId)
- 成绩 (score)
- 等级 (gradeLevel)
- 教师评语 (feedback)

### 6. 消息表 (messages)
- 发送者 (senderId)
- 接收者 (receiverId)
- 内容 (content)
- 时间戳 (timestamp)
- 是否已读 (isRead)

## 快速开始

### 安装依赖
```bash
npm install
```

### 开发模式运行
```bash
npm run dev
```

应用将在 `http://localhost:5173` 启动

### 生产构建
```bash
npm run build
```

### 构建预览
```bash
npm run preview
```

## 演示账号

系统提供了三个演示账号用于快速体验：

| 用户类型 | 用户名 | 密码 | 说明 |
|---------|-------|------|------|
| 学生 | student01 | password | 可查看成绩、选课、与教师交流 |
| 教师 | teacher01 | password | 可管理成绩、查看班级信息 |
| 管理员 | admin01 | password | 可管理学生、教师、课程、成绩 |

## 核心功能演示

### 1. 登录系统
- 访问应用首页，使用演示账号登录
- 系统会根据用户角色显示不同的仪表板和菜单

### 2. 学生成绩查询
- 登录为学生后，进入"成绩查询"页面
- 查看所有课程成绩、平均分、优秀课程数统计

### 3. 选课系统
- 进入"选课管理"页面
- 浏览可选课程并进行选课
- 查看已选课程并可以退课

### 4. 在线交流
- 与指定教师进行实时消息交流
- 支持发送和接收消息

### 5. 管理员功能
- 管理学生信息（添加、编辑、删除）
- 管理课程（添加、编辑、删除）
- 管理成绩（添加、编辑、删除成绩记录）

## 开发指南

### 添加新页面
1. 在相应目录下创建新的 `.tsx` 文件
2. 在 `App.tsx` 中添加对应的路由
3. 在 `DashboardLayout.tsx` 中添加菜单项

### 修改状态管理
- 编辑 `store/authStore.ts` 或 `store/dataStore.ts`
- 使用 Zustand 提供的 `create` 方法定义状态和方法

### 添加新的类型
- 在 `types/index.ts` 中定义新的接口

## API接口设计（后端实现参考）

所有API均使用RESTful设计，以下是核心接口：

```
POST   /api/auth/login              # 用户登录
POST   /api/auth/register           # 用户注册
POST   /api/auth/logout             # 用户登出

GET    /api/grades                  # 获取成绩列表
POST   /api/grades                  # 添加成绩
PUT    /api/grades/:id              # 更新成绩
DELETE /api/grades/:id              # 删除成绩

GET    /api/courses                 # 获取课程列表
POST   /api/courses                 # 添加课程
PUT    /api/courses/:id             # 更新课程
DELETE /api/courses/:id             # 删除课程

GET    /api/students                # 获取学生列表
POST   /api/students                # 添加学生
PUT    /api/students/:id            # 更新学生
DELETE /api/students/:id            # 删除学生

POST   /api/messages                # 发送消息
GET    /api/messages                # 获取消息列表
PUT    /api/messages/:id/read       # 标记消息已读
```

## 浏览器支持

- Chrome (最新版本)
- Firefox (最新版本)
- Safari (最新版本)
- Edge (最新版本)

## 许可证

MIT License

## 联系方式

如有任何问题或建议，欢迎提交Issue或Pull Request。

## 更新日志

### v1.0.0 (2024-11-02)
- ✅ 完成学生成绩查询功能
- ✅ 完成选课管理功能
- ✅ 完成在线交流功能
- ✅ 完成管理员管理功能
- ✅ 搭建完整的系统框架