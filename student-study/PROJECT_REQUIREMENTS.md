# 学生成绩管理系统 - 完整项目需求文档

**项目名称**: 学生成绩信息管理系统  
**版本**: v1.2.0  
**文档版本**: v1.0  
**更新日期**: 2024年11月2日  
**项目状态**: 前端完成，待后端实现

---

## 📋 文档目录

1. [项目概述](#项目概述)
2. [系统架构](#系统架构)
3. [功能需求](#功能需求)
4. [非功能需求](#非功能需求)
5. [数据需求](#数据需求)
6. [接口需求](#接口需求)
7. [安全需求](#安全需求)
8. [性能需求](#性能需求)
9. [部署需求](#部署需求)
10. [验收标准](#验收标准)

---

## 🎯 项目概述

### 项目背景

学生成绩管理系统是一个面向高等教育机构的B/S模式信息系统，用于管理学生成绩、课程、选课、消息、申诉等教务相关事务。

### 项目目标

| 目标 | 说明 |
|-----|------|
| **功能完整** | 覆盖学生、教师、管理员三个角色的所有核心功能 |
| **易用性强** | 提供直观的用户界面，降低使用学习成本 |
| **数据安全** | 确保用户数据的安全性和隐私保护 |
| **可扩展性** | 系统架构清晰，易于后续扩展和维护 |
| **高可用性** | 系统应保持高可用性，支持并发访问 |

### 核心价值

- **学生**: 随时查看成绩、选课、申诉，与教师沟通
- **教师**: 高效管理成绩、学生、班级信息，与学生互动
- **管理员**: 集中管理系统所有资源和配置
- **学校**: 减少纸质流程，提高管理效率

---

## 🏗️ 系统架构

### 整体架构

```
┌─────────────────────────────────────────┐
│          用户浏览器 (Web Client)         │
│  React 19 + TypeScript + Ant Design     │
│         (前端完成 100% ✅)              │
└────────────────┬────────────────────────┘
                 │ HTTP/HTTPS
                 │ RESTful API
                 ▼
┌─────────────────────────────────────────┐
│         API 网关 / 负载均衡              │
└────────────────┬────────────────────────┘
                 │
        ┌────────┴─────────┐
        ▼                   ▼
┌──────────────────┐  ┌──────────────────┐
│   业务服务器1     │  │   业务服务器2     │
│  Node.js/Python  │  │  Node.js/Python  │
│   /Spring Boot   │  │  /Spring Boot    │
│  (后端需实现)    │  │  (后端需实现)    │
└────────┬─────────┘  └────────┬─────────┘
         │                     │
         └────────────┬────────┘
                      ▼
         ┌────────────────────────┐
         │     数据库服务器        │
         │  MySQL 或 PostgreSQL   │
         │    (需要部署)          │
         └────────────────────────┘
```

### 技术栈

#### 前端 (已完成 ✅)
```
React 19.1.1          - UI 框架
TypeScript 5.8        - 编程语言
React Router 6.20.0   - 路由管理
Zustand 4.4.1         - 状态管理
Ant Design 5.11.0     - UI 组件库
Vite 7.1.0            - 构建工具
```

#### 后端 (待实现 ❌)
```
推荐方案 1: Node.js + Express
- Node.js 18+
- Express 4.18+
- TypeScript 5.8+
- MySQL 或 PostgreSQL
- JWT (jwt-simple)

推荐方案 2: Python + FastAPI
- Python 3.9+
- FastAPI 0.100+
- SQLAlchemy 2.0+
- PostgreSQL 或 MySQL
- PyJWT

推荐方案 3: Java + Spring Boot
- Java 17+
- Spring Boot 3.0+
- Spring Security
- JPA/Hibernate
- MySQL 或 PostgreSQL
```

---

## 📋 功能需求

### 功能需求总览

```
系统功能总计: 32+ 个核心功能
├─ 学生模块: 12 个功能
├─ 教师模块: 6 个功能
├─ 管理员模块: 10 个功能
└─ 系统通用: 4 个功能
```

---

## 👤 功能需求详细规范

### 1. 学生用户功能模块 (12个功能)

#### 1.1 用户认证 [优先级: 🔴 紧急]

**功能描述**: 学生通过用户名和密码登录系统

**需求清单**:
```
✅ 登录页面
   - 输入用户名 (必填)
   - 输入密码 (必填)
   - 记住我 (可选)
   - 验证码 (可选)
   - 登录按钮
   - 忘记密码链接
   - 注册链接

✅ 认证流程
   - 验证用户名和密码
   - 生成 JWT Token (有效期: 24小时)
   - 保存 Token 到 localStorage
   - 跳转到仪表板

✅ 会话管理
   - Token 刷新机制 (到期前刷新)
   - 登出清除 Token
   - 多标签页 Token 同步

✅ 密码安全
   - 密码最少 8 位
   - 必须包含大小写字母和数字
   - 支持密码重置流程
```

**相关文件**: `src/pages/LoginPage.tsx`, `src/store/authStore.ts`

**后端接口**:
```
POST /api/auth/login
请求: { username, password }
响应: { token, user, role, expiresIn }

POST /api/auth/logout
请求: { token }
响应: { success }

POST /api/auth/refresh
请求: { token }
响应: { newToken, expiresIn }

POST /api/auth/register
请求: { username, password, email, role }
响应: { success, userId }
```

---

#### 1.2 成绩查询 [优先级: 🔴 紧急]

**功能描述**: 学生查看自己的所有课程成绩

**需求清单**:
```
✅ 成绩列表
   - 显示课程名称、成绩、等级、教师评语
   - 支持按课程排序
   - 支持按成绩范围筛选
   - 响应式表格设计

✅ 成绩统计
   - 平均分计算
   - 最高分和最低分
   - 及格课程数
   - 优秀课程数 (≥85分)
   - 不及格课程数

✅ 成绩等级
   - A: 85-100
   - B: 70-84
   - C: 60-69
   - D: 50-59
   - F: 0-49

✅ 操作功能
   - 成绩详情查看
   - 成绩导出为 CSV
   - 打印成绩单
```

**相关文件**: `src/pages/student/GradesPage.tsx`

**后端接口**:
```
GET /api/grades
查询参数: { studentId, page, limit, sortBy, filterScore }
响应: { 
  grades: [
    { id, courseId, courseName, score, gradeLevel, 
      feedback, teacher, createdAt }
  ],
  total,
  statistics: { avg, max, min, passCount, excellentCount }
}

GET /api/grades/statistics
查询参数: { studentId }
响应: { avgScore, maxScore, minScore, passCount, 
        excellentCount, failCount }
```

---

#### 1.3 选课管理 [优先级: 🟡 高]

**功能描述**: 学生浏览可选课程并进行选课和退课操作

**需求清单**:
```
✅ 可选课程浏览
   - 显示所有可选课程列表
   - 显示课程代码、名称、学分、学时、教师
   - 显示课程容量和已选人数
   - 显示课程上课时间和地点
   - 搜索和筛选课程

✅ 已选课程管理
   - 显示当前选中的课程
   - 显示总学分
   - 学分上限检查 (建议: 30学分/学期)
   - 显示选课时间

✅ 选课操作
   - 点击"选课"按钮
   - 验证学分不超过上限
   - 验证无时间冲突
   - 显示选课结果反馈

✅ 退课操作
   - 点击"退课"按钮
   - 确认对话框
   - 显示退课结果
   - 退课截止时间检查

✅ 业务规则
   - 退课截止日期: 开课后 2 周内
   - 学分上限: 30 学分/学期
   - 学分下限: 12 学分/学期
   - 不能重复选择同一课程
```

**相关文件**: `src/pages/student/CoursesPage.tsx`

**后端接口**:
```
GET /api/courses
查询参数: { available, page, limit, search }
响应: { courses, total }

GET /api/student-courses
查询参数: { studentId }
响应: { enrolledCourses, totalCredits }

POST /api/student-courses/enroll
请求: { studentId, courseId }
响应: { success, message, enrollmentId }

POST /api/student-courses/drop
请求: { studentId, courseId }
响应: { success, message }

GET /api/student-courses/check-conflict
请求: { courseId }
响应: { hasConflict, conflictCourses }
```

---

#### 1.4 在线交流 [优先级: 🟡 中]

**功能描述**: 学生与授课教师进行实时消息交流

**需求清单**:
```
✅ 消息界面
   - 左侧: 教师列表 (可搜索)
   - 右侧: 消息聊天区
   - 显示未读消息数
   - 显示最后一条消息预览

✅ 消息功能
   - 发送文本消息
   - 显示消息时间戳
   - 显示消息已读状态
   - 消息历史记录 (无限滚动)
   - 消息搜索功能

✅ 通知功能
   - 新消息通知 (页面标题提示)
   - 声音提示 (可选)
   - 消息计数

✅ 消息管理
   - 标记消息已读
   - 删除消息 (可选)
   - 转发消息 (可选)
```

**相关文件**: `src/pages/student/MessagesPage.tsx`

**后端接口**:
```
GET /api/messages
查询参数: { userId, otherId, page, limit }
响应: { messages, total }

POST /api/messages
请求: { senderId, receiverId, content }
响应: { messageId, timestamp }

PUT /api/messages/:id/read
响应: { success }

GET /api/messages/unread-count
响应: { unreadCount }

WebSocket (可选高级功能):
ws://server/chat
事件: message, typing, online, read
```

---

#### 1.5 个人资料管理 [优先级: 🟡 中]

**功能描述**: 学生编辑个人信息和管理账户安全

**需求清单**:
```
✅ 基本信息
   - 学号 (不可编辑)
   - 姓名 (可编辑)
   - 邮箱 (可编辑)
   - 电话 (可编辑)
   - 性别 (可编辑)
   - 学院 (可编辑)
   - 专业 (可编辑)
   - 家庭地址 (可编辑)

✅ 头像管理
   - 上传头像
   - 预览头像
   - 删除头像
   - 支持格式: JPG, PNG
   - 文件大小限制: 2MB

✅ 密码管理
   - 修改密码
   - 输入当前密码验证
   - 新密码强度检查
   - 密码历史检查 (不能与最近5次相同)

✅ 账户安全
   - 绑定邮箱认证
   - 登录记录查看 (最近30条)
   - 登录设备管理 (可远程登出)
   - 两步认证设置 (可选)

✅ 数据验证
   - 邮箱格式验证
   - 电话格式验证 (中国)
   - 实时验证反馈
```

**相关文件**: `src/pages/ProfilePage.tsx`

**后端接口**:
```
GET /api/users/:id/profile
响应: { user profile data }

PUT /api/users/:id/profile
请求: { name, email, phone, ... }
响应: { success }

POST /api/users/:id/avatar
请求: FormData { avatar: File }
响应: { avatarUrl }

PUT /api/users/:id/password
请求: { currentPassword, newPassword }
响应: { success }

GET /api/users/:id/login-records
查询参数: { page, limit }
响应: { records, total }
```

---

#### 1.6 成绩分析 [优先级: 🟡 中]

**功能描述**: 展示学生成绩分析和学习建议

**需求清单**:
```
✅ 关键指标
   - 平均成绩
   - 最高分/最低分
   - 及格率 (百分比)
   - 优秀率 (百分比)

✅ 可视化展示
   - 成绩等级分布 (柱状图或圆饼图)
   - A/B/C/D/F 等级统计
   - 成绩变化趋势 (折线图)
   - 学科成绩对比 (雷达图)

✅ 学习评估
   - 学习状态判断
   - 学习效率评价
   - 风险预警 (成绩下降趋势)
   - 进步提示 (成绩上升趋势)

✅ 智能建议
   - 根据成绩自动生成 3-4 条建议
   - 学习时间建议
   - 选课建议
   - 备考建议

✅ 对标分析 (可选)
   - 与班级平均分对比
   - 与学院平均分对比
   - 排名信息 (可选隐藏)
```

**相关文件**: `src/pages/student/AnalyticsPage.tsx`

**后端接口** (可选，前端自己计算):
```
GET /api/grades/:studentId/analytics
响应: { 
  avgScore, maxScore, minScore,
  passRate, excellentRate,
  gradeDistribution: { A, B, C, D, F },
  classAvg, collegueAvg, rank
}
```

---

#### 1.7 课程表和考试安排 [优先级: 🟢 低]

**功能描述**: 查看课程上课时间和考试安排

**需求清单**:
```
✅ 课程表
   - 显示周课程时间表
   - 显示上课地点
   - 显示授课教师
   - 显示课程性质 (必修/选修)
   - 支持切换周次视图

✅ 考试安排
   - 显示考试科目
   - 显示考试时间
   - 显示考试地点
   - 显示准考证下载
   - 显示考试注意事项

✅ 日历视图
   - iCal 格式导出
   - Google Calendar 集成 (可选)
   - 提醒功能 (可选)

✅ 操作功能
   - 打印课程表
   - 导出为 PDF
   - 分享课程表
```

**相关文件**: `src/pages/student/SchedulePage.tsx`

**后端接口**:
```
GET /api/schedule/courses
查询参数: { studentId, week }
响应: { courses in schedule format }

GET /api/schedule/exams
查询参数: { studentId, semester }
响应: { exams }

POST /api/schedule/export
查询参数: { format: 'ical'|'pdf' }
响应: { downloadUrl }
```

---

#### 1.8 成绩申诉 [优先级: 🟡 中]

**功能描述**: 学生对成绩有异议时可以申诉，教师审核并反馈

**需求清单**:
```
✅ 申诉提交
   - 选择课程
   - 显示原始成绩
   - 输入申诉理由 (≤500字)
   - 上传支持材料 (可选)
   - 提交申诉
   - 同一课程只能申诉一次

✅ 申诉跟踪
   - 显示申诉状态 (待审核/审核中/已批准/已驳回)
   - 显示申诉时间和审核时间
   - 显示审核教师名称
   - 显示审核意见

✅ 申诉流程
   - 学生提交 → 系统接收 (待审核)
   - → 教师审核 (审核中)
   - → 教师反馈 (已批准/已驳回)
   - 如果批准，显示调整后的成绩

✅ 业务规则
   - 申诉截止日期: 成绩发布后 30 天
   - 申诉可在待审核阶段撤回
   - 审核周期: 7 个工作日

✅ 通知机制
   - 申诉提交成功通知
   - 申诉审核完成通知
   - 邮件提醒
```

**相关文件**: `src/pages/student/AppealPage.tsx`

**后端接口**:
```
GET /api/appeals
查询参数: { studentId, status }
响应: { appeals }

POST /api/appeals
请求: { studentId, courseId, appealReason, attachments }
响应: { appealId }

DELETE /api/appeals/:id
需要: 申诉状态为待审核
响应: { success }

PUT /api/appeals/:id/review (教师接口)
请求: { reviewFeedback, newScore, status }
响应: { success }
```

---

#### 1.9 系统公告 [优先级: 🟢 低]

**功能描述**: 查看学校和系统发布的公告信息

**需求清单**:
```
✅ 公告浏览
   - 显示公告标题、内容、发布时间
   - 显示公告类型 (信息/警告/成功)
   - 按发布时间排序 (最新优先)
   - 分页展示

✅ 公告分类
   - 系统公告 (对所有用户)
   - 学生公告 (仅学生)
   - 教师公告 (仅教师)
   - 管理员公告 (仅管理员)

✅ 阅读状态
   - 标记公告已读
   - 显示已读/未读状态
   - 未读数统计
   - 批量标记已读

✅ 搜索和筛选
   - 按关键词搜索
   - 按公告类型筛选
   - 按发布时间筛选
   - 按部门筛选

✅ 操作功能
   - 详情查看
   - 分享公告
   - 下载附件
```

**相关文件**: `src/pages/NoticesPage.tsx`

**后端接口**:
```
GET /api/notices
查询参数: { targetRole, page, limit, search }
响应: { notices, total }

GET /api/notices/:id
响应: { notice detail }

PUT /api/notices/:id/mark-read
响应: { success }

GET /api/notices/unread-count
响应: { unreadCount }
```

---

#### 1.10 高级搜索 [优先级: 🟢 低]

**功能描述**: 支持跨多个维度的高级搜索和筛选

**需求清单**:
```
✅ 搜索类型
   - 搜索学生 (学号、姓名、邮箱)
   - 搜索成绩 (按成绩范围)
   - 搜索课程 (课程名、代码)
   - 搜索消息 (消息内容)

✅ 搜索结果
   - 显示搜索结果数量
   - 分页显示结果
   - 高亮搜索关键词
   - 支持排序 (相关性、时间等)

✅ 高级筛选
   - 成绩范围: 优秀(85-100) / 良好(70-84) / 中等(60-69) / 及格(60以上) / 不及格
   - 时间范围: 开始日期 - 结束日期
   - 状态筛选
   - 多条件组合

✅ 搜索历史
   - 保存最近 10 次搜索
   - 快速重新搜索
   - 清空搜索历史
```

**相关文件**: `src/pages/DataExportPage.tsx` 中的搜索部分

---

#### 1.11 数据导出 [优先级: 🟢 低]

**功能描述**: 导出个人数据为 CSV 或 PDF 格式

**需求清单**:
```
✅ 导出类型
   - 导出成绩单 (CSV/PDF)
   - 导出课程表 (CSV/PDF)
   - 导出个人信息 (CSV/PDF)
   - 导出申诉记录 (CSV)

✅ 导出格式
   - CSV: 可用 Excel/Google Sheets 打开
   - PDF: 已排版、可打印
   - Excel: 支持公式和图表

✅ 导出内容
   - 完整性: 包含所有必要字段
   - 准确性: 数据与系统实时同步
   - 完整性检查: 标题、数据、统计汇总

✅ 操作流程
   - 选择导出类型
   - 选择导出格式
   - 点击导出按钮
   - 自动下载到本地
   - 自动为文件添加时间戳 (避免覆盖)
```

**相关文件**: `src/pages/DataExportPage.tsx` 中的导出部分

---

#### 1.12 仪表板 [优先级: 🔴 高]

**功能描述**: 学生登录后看到的首页仪表板

**需求清单**:
```
✅ 欢迎信息
   - 显示学生姓名和学号
   - 显示当前学期信息
   - 显示登录时间

✅ 快速统计
   - 总成绩和平均分
   - 本学期课程数
   - 未读消息数
   - 待处理申诉数

✅ 快速链接
   - 查看成绩
   - 选课
   - 查看消息
   - 申诉管理

✅ 近期事项
   - 最近的课程
   - 最近的考试
   - 最新的消息
   - 最新的公告

✅ 图表展示
   - 成绩分布饼图
   - 学期成绩变化图
   - 学科成绩对比
```

**相关文件**: `src/pages/DashboardPage.tsx`

---

### 2. 教师用户功能模块 (6个功能)

#### 2.1 成绩管理 [优先级: 🔴 高]

**功能描述**: 教师管理所教课程的学生成绩

**需求清单**:
```
✅ 成绩输入
   - 选择课程
   - 显示选课学生列表
   - 输入学生成绩 (0-100)
   - 自动计算等级 (A/B/C/D/F)
   - 输入评语 (可选)
   - 批量导入成绩 (Excel)

✅ 成绩编辑
   - 修改已录入成绩
   - 修改等级
   - 修改评语
   - 变更记录查看

✅ 成绩查询
   - 按课程筛选
   - 按学生名字搜索
   - 显示统计信息 (平均分、最高分等)
   - 导出成绩 (CSV/Excel)

✅ 成绩审核
   - 成绩提交前预览
   - 数据有效性检查
   - 成绩确认
   - 不可修改已提交成绩 (可选: 需管理员权限修改)

✅ 业务规则
   - 成绩录入截止日期
   - 评语字数限制 (≤200字)
   - 成绩为空不能提交
```

**相关文件**: `src/pages/teacher/GradesManagePage.tsx`

**后端接口**:
```
GET /api/grades
查询参数: { teacherId, courseId, page }
响应: { grades }

POST /api/grades
请求: { studentId, courseId, score, gradeLevel, feedback }
响应: { gradeId }

PUT /api/grades/:id
请求: { score, gradeLevel, feedback }
响应: { success }

POST /api/grades/batch-import
请求: FormData { file: File }
响应: { importedCount, failedCount, errors }

DELETE /api/grades/:id
权限: 仅教师可删除待提交成绩
响应: { success }

POST /api/grades/submit
请求: { courseId }
响应: { success }
```

---

#### 2.2 班级管理 [优先级: 🟡 中]

**功能描述**: 教师管理所教课程的班级和学生

**需求清单**:
```
✅ 班级信息
   - 显示所教课程列表
   - 显示课程名、学期、班级容量
   - 显示当前选课人数
   - 显示教学进度

✅ 学生管理
   - 显示课程的选课学生名单
   - 学生排序 (按学号、姓名)
   - 学生搜索 (按学号、姓名)
   - 显示学生基本信息 (学号、姓名、学院、专业)
   - 显示学生成绩 (如已录入)
   - 显示学生出勤情况 (可选)

✅ 学生操作
   - 查看学生详情
   - 删除学生 (必须审核)
   - 标记学生 (缺勤、预警等)

✅ 统计信息
   - 班级容量和人数
   - 班级平均分
   - 成绩分布
   - 出勤率统计
```

**相关文件**: 暂无 (可选页面)

**后端接口**:
```
GET /api/courses
查询参数: { teacherId }
响应: { courses }

GET /api/courses/:id/students
查询参数: { page, limit, search }
响应: { students, total }

GET /api/courses/:id/statistics
响应: { totalStudents, avgScore, distribution }

PUT /api/students/:id/status
请求: { status: 'absent'|'normal'|'warning' }
响应: { success }
```

---

#### 2.3 在线交流 [优先级: 🟡 中]

**功能描述**: 教师与学生进行消息交流

**需求清单**:
```
✅ 消息功能 (与学生相同)
   - 学生列表
   - 消息聊天
   - 消息历史
   - 标记已读

✅ 高级功能
   - 发送公告给班级
   - 发送作业通知
   - 群发消息
   - 消息模板
```

**后端接口**: 同学生消息接口

---

#### 2.4 申诉审核 [优先级: 🟡 中]

**功能描述**: 审核学生提交的成绩申诉

**需求清单**:
```
✅ 申诉列表
   - 显示所有待审核申诉
   - 按课程筛选
   - 按学生名字搜索
   - 按状态筛选 (待审核/审核中/已完成)
   - 显示申诉时间

✅ 申诉详情
   - 显示学生信息
   - 显示课程和原始成绩
   - 显示申诉理由
   - 显示申诉材料 (如有)

✅ 审核操作
   - 输入审核意见 (≤200字)
   - 如果批准，输入调整后的成绩
   - 选择处理状态 (批准/驳回)
   - 提交审核

✅ 业务规则
   - 批准申诉时必须输入新成绩
   - 新成绩不能低于原始成绩
   - 审核期间不能删除成绩
```

**相关文件**: 暂无 (待开发)

**后端接口**:
```
GET /api/appeals
查询参数: { courseId, status, page }
响应: { appeals }

PUT /api/appeals/:id/review
请求: { reviewFeedback, newScore, status }
响应: { success }
```

---

#### 2.5 教学资源 [优先级: 🟢 低]

**功能描述**: 管理课程的教学资源

**需求清单**:
```
✅ 资源上传
   - 上传教材 (PDF/Word)
   - 上传课件 (PPT)
   - 上传作业 (任意格式)
   - 上传习题 (任意格式)
   - 显示上传进度

✅ 资源管理
   - 显示资源列表
   - 删除资源
   - 修改资源名称
   - 修改资源描述

✅ 权限管理
   - 设置资源可见范围 (学生/教师/公开)
   - 设置资源下载限制

✅ 业务规则
   - 文件大小限制 (建议: 100MB)
   - 支持格式限制
```

**后端接口** (可选):
```
POST /api/resources/upload
请求: FormData { file, description }
响应: { resourceId, url }

GET /api/resources
查询参数: { courseId }
响应: { resources }

DELETE /api/resources/:id
响应: { success }
```

---

#### 2.6 仪表板 [优先级: 🟡 中]

**功能描述**: 教师登录后看到的首页

**需求清单**:
```
✅ 快速统计
   - 所教课程数
   - 学生总数
   - 待改成绩数
   - 待审核申诉数

✅ 近期任务
   - 待改成绩
   - 待审核申诉
   - 即将开始的课程

✅ 快速链接
   - 管理成绩
   - 审核申诉
   - 查看班级
   - 发送消息
```

---

### 3. 管理员用户功能模块 (10个功能)

#### 3.1 学生管理 [优先级: 🔴 高]

**功能描述**: 管理系统中的所有学生账户和信息

**需求清单**:
```
✅ 学生列表
   - 显示所有学生信息
   - 按学号、姓名搜索
   - 按学院、专业、年级筛选
   - 分页显示
   - 显示学生状态 (活跃/停用)

✅ 学生信息字段
   - 学号 (唯一)
   - 姓名
   - 学院
   - 专业
   - 性别
   - 出生日期
   - 邮箱
   - 电话
   - 身份证号 (可选)
   - 入学时间
   - 状态 (活跃/停用/毕业)

✅ 学生操作
   - 添加新学生 (单个或批量)
   - 编辑学生信息
   - 删除学生
   - 停用/激活学生
   - 重置学生密码
   - 导入学生 (Excel)
   - 导出学生 (Excel/CSV)

✅ 业务规则
   - 学号唯一性检查
   - 邮箱唯一性检查 (可选)
   - 新增学生时创建登录账户
   - 学生账户自动生成初始密码 (发送至邮箱)
```

**相关文件**: `src/pages/admin/StudentsManagePage.tsx`

**后端接口**:
```
GET /api/students
查询参数: { page, limit, search, filter }
响应: { students, total }

GET /api/students/:id
响应: { student }

POST /api/students
请求: { studentId, name, email, ... }
响应: { studentId }

PUT /api/students/:id
请求: { name, email, ... }
响应: { success }

DELETE /api/students/:id
响应: { success }

POST /api/students/batch-import
请求: FormData { file }
响应: { importedCount, failedCount }

POST /api/students/:id/reset-password
响应: { success, tempPassword }

PUT /api/students/:id/status
请求: { status: 'active'|'inactive'|'graduated' }
响应: { success }
```

---

#### 3.2 教师管理 [优先级: 🔴 高]

**功能描述**: 管理系统中的所有教师账户和信息

**需求清单**:
```
✅ 教师列表
   - 显示所有教师信息
   - 按工号、姓名搜索
   - 按部门、职称筛选
   - 分页显示

✅ 教师信息字段
   - 工号 (唯一)
   - 姓名
   - 性别
   - 部门/系
   - 职称 (教授/副教授/讲师/助教)
   - 邮箱
   - 电话
   - 研究方向 (可选)
   - 学位 (可选)
   - 工作年限 (可选)

✅ 教师操作
   - 添加新教师
   - 编辑教师信息
   - 删除教师
   - 停用/激活教师
   - 分配课程
   - 修改职称
   - 导入教师
   - 导出教师

✅ 业务规则
   - 工号唯一性检查
   - 新增教师时自动创建登录账户
   - 教师账户初始密码生成
```

**相关文件**: `src/pages/admin/TeachersManagePage.tsx`

**后端接口** (类似学生接口):
```
GET /api/teachers
POST /api/teachers
PUT /api/teachers/:id
DELETE /api/teachers/:id
POST /api/teachers/batch-import
PUT /api/teachers/:id/assign-course
```

---

#### 3.3 课程管理 [优先级: 🔴 高]

**功能描述**: 管理系统中的所有课程

**需求清单**:
```
✅ 课程列表
   - 显示所有课程
   - 按课程代码、名称搜索
   - 按学期、学科筛选
   - 分页显示

✅ 课程信息字段
   - 课程代码 (唯一)
   - 课程名称
   - 学分
   - 学时
   - 学期
   - 学科
   - 授课教师
   - 班级容量
   - 课程类型 (必修/选修)
   - 课程描述
   - 考核方式 (笔试/口试/实践等)

✅ 课程操作
   - 添加新课程
   - 编辑课程信息
   - 删除课程
   - 冻结课程 (不允许选课)
   - 分配教师
   - 导入课程
   - 导出课程

✅ 业务规则
   - 课程代码唯一性检查
   - 删除课程前检查是否有学生选课
   - 课程学分范围: 1-8 分
```

**相关文件**: `src/pages/admin/CoursesManagePage.tsx`

**后端接口**:
```
GET /api/courses
POST /api/courses
PUT /api/courses/:id
DELETE /api/courses/:id
POST /api/courses/batch-import
PUT /api/courses/:id/assign-teacher
```

---

#### 3.4 成绩管理 [优先级: 🔴 高]

**功能描述**: 管理所有学生的成绩记录

**需求清单**:
```
✅ 成绩查询
   - 按学生、课程、学期查询
   - 支持多条件组合查询
   - 显示完整的成绩信息
   - 分页显示

✅ 成绩操作
   - 添加成绩 (管理员操作)
   - 编辑成绩 (需要审核)
   - 删除成绩 (需要审核)
   - 批量导入成绩
   - 导出成绩

✅ 成绩审核
   - 查看成绩变更记录
   - 审核成绩修改请求
   - 批准或驳回修改
   - 操作日志记录

✅ 成绩统计
   - 按课程统计 (平均分、分布等)
   - 按学生统计
   - 按学期统计
   - 导出统计报告

✅ 业务规则
   - 成绩修改需要记录
   - 成绩删除前需要检查依赖
   - 成绩修改有审计日志
```

**相关文件**: `src/pages/admin/GradesManagePage.tsx`

**后端接口**:
```
GET /api/grades (管理员版)
POST /api/grades (管理员创建)
PUT /api/grades/:id (管理员修改)
DELETE /api/grades/:id
POST /api/grades/audit
GET /api/grades/audit-log
POST /api/grades/export-report
```

---

#### 3.5 系统设置 [优先级: 🟡 中]

**功能描述**: 配置系统运行参数和功能开关

**需求清单**:
```
✅ 基本设置
   - 系统名称
   - 系统LOGO (上传)
   - 系统描述
   - 管理员邮箱
   - 学校名称
   - 学校地址

✅ 功能开关
   - 学生自主注册 (开/关)
   - 学生选课开关 (开/关)
   - 成绩查询开关
   - 消息功能
   - 申诉功能
   - 维护模式 (启用时只有管理员可登录)

✅ 安全设置
   - 会话超时时间 (分钟)
   - 最大登录尝试次数
   - 登录锁定时间
   - 密码过期时间 (天)
   - 文件上传大小限制 (MB)
   - 支持的文件类型

✅ 邮件配置
   - SMTP 服务器
   - SMTP 端口
   - 发件人邮箱
   - 发件人名称
   - SMTP 密码
   - 测试邮件发送

✅ 数据备份
   - 自动备份周期
   - 备份保留天数
   - 手动备份按钮
   - 备份恢复
   - 备份列表查看

✅ 系统监控
   - 系统运行状态
   - CPU 和内存使用率
   - 数据库连接状态
   - 最近错误日志
```

**相关文件**: `src/pages/admin/SettingsPage.tsx`

**后端接口**:
```
GET /api/settings
响应: { 所有设置 }

PUT /api/settings
请求: { 修改的设置 }
响应: { success }

POST /api/settings/test-email
请求: { testEmail }
响应: { success }

POST /api/settings/backup
响应: { backupId, filename }

GET /api/settings/backups
响应: { backups: [] }

POST /api/settings/restore
请求: { backupId }
响应: { success }
```

---

#### 3.6 用户权限管理 [优先级: 🟡 中]

**功能描述**: 管理用户角色和权限

**需求清单**:
```
✅ 角色管理
   - 显示系统角色 (学生/教师/管理员)
   - 创建自定义角色 (可选)
   - 编辑角色
   - 删除角色
   - 显示角色权限

✅ 权限管理
   - 显示所有权限列表
   - 为角色分配权限
   - 为用户分配角色
   - 权限级别设置

✅ 用户角色
   - 为用户分配角色
   - 为用户分配多个角色 (可选)
   - 查看用户的所有权限
   - 临时权限赋予 (可选)

✅ 权限审计
   - 显示权限变更记录
   - 显示谁修改了什么权限
   - 权限修改时间戳
```

**后端接口**:
```
GET /api/roles
POST /api/roles
PUT /api/roles/:id
DELETE /api/roles/:id

GET /api/permissions
PUT /api/roles/:id/permissions

GET /api/users/:id/roles
POST /api/users/:id/assign-role
DELETE /api/users/:id/roles/:roleId
```

---

#### 3.7 系统日志 [优先级: 🟢 低]

**功能描述**: 查看和管理系统操作日志

**需求清单**:
```
✅ 日志查询
   - 按操作类型筛选 (登录/修改/删除等)
   - 按用户筛选
   - 按时间范围筛选
   - 按对象筛选 (学生/成绩/课程等)
   - 分页显示

✅ 日志详情
   - 操作者信息
   - 操作时间
   - 操作类型
   - 操作对象
   - 操作前后数据对比 (可选)
   - 操作结果 (成功/失败)

✅ 日志管理
   - 导出日志
   - 定期清理日志 (可配置)
   - 日志归档
   - 日志搜索

✅ 业务规则
   - 日志保留期: 1 年
   - 关键操作必须记录
   - 敏感信息不记录
```

**后端接口**:
```
GET /api/logs
查询参数: { type, userId, startDate, endDate, page }
响应: { logs, total }

GET /api/logs/:id
响应: { log detail }

DELETE /api/logs/:id
响应: { success }

POST /api/logs/export
响应: { downloadUrl }
```

---

#### 3.8 公告管理 [优先级: 🟡 中]

**功能描述**: 发布和管理系统公告

**需求清单**:
```
✅ 公告发布
   - 输入公告标题
   - 输入公告内容 (支持富文本编辑)
   - 选择公告类型 (信息/警告/成功/错误)
   - 选择目标用户 (所有用户/学生/教师/管理员)
   - 上传附件 (可选)
   - 设置发布时间 (立即/定时)
   - 设置过期时间

✅ 公告管理
   - 显示已发布公告列表
   - 编辑公告 (未过期的)
   - 删除公告
   - 置顶公告
   - 撤回公告
   - 显示公告阅读统计

✅ 公告查看
   - 显示公告浏览量
   - 显示公告赞评数 (可选)
   - 显示用户评论 (可选)

✅ 业务规则
   - 公告最少保留 7 天
   - 标题最多 100 字
   - 内容最多 5000 字
   - 附件最多 10 个
```

**相关文件**: `src/pages/NoticesPage.tsx` 中的发布功能

**后端接口**:
```
GET /api/notices (管理员版，显示所有)
POST /api/notices
PUT /api/notices/:id
DELETE /api/notices/:id

PUT /api/notices/:id/pin (置顶)
PUT /api/notices/:id/unpin (取消置顶)

GET /api/notices/:id/statistics
响应: { views, likes, comments }
```

---

#### 3.9 数据分析和报告 [优先级: 🟢 低]

**功能描述**: 生成各类数据分析报告

**需求清单**:
```
✅ 成绩分析报告
   - 学期成绩统计
   - 课程成绩分析
   - 学生成绩排名
   - 成绩趋势分析
   - 不及格预警

✅ 选课分析报告
   - 课程选课人数统计
   - 热门课程排行
   - 课程容量分析
   - 学生学分分析

✅ 用户分析报告
   - 学生总数和在校学生数
   - 教师总数统计
   - 用户活跃度分析
   - 登录行为分析

✅ 系统状态报告
   - 系统运行时间
   - 系统错误统计
   - API 调用统计
   - 性能分析

✅ 报告导出
   - 导出为 PDF
   - 导出为 Excel
   - 定时生成报告
   - 报告邮件发送
```

**后端接口**:
```
GET /api/reports/grades
查询参数: { semester, courseId, type }
响应: { 报告数据 }

GET /api/reports/enrollment
GET /api/reports/users
GET /api/reports/system

POST /api/reports/:id/export
查询参数: { format: 'pdf'|'excel' }
响应: { downloadUrl }
```

---

#### 3.10 仪表板 [优先级: 🔴 高]

**功能描述**: 管理员登录后看到的首页

**需求清单**:
```
✅ 系统概览
   - 学生总数
   - 教师总数
   - 课程总数
   - 系统运行时间

✅ 近期事项
   - 待审核申诉数
   - 系统告警数
   - 待处理事务
   - 今日登录人数

✅ 数据展示
   - 学生增长趋势图
   - 成绩分布饼图
   - 系统使用热度图
   - 错误日志图表

✅ 快速链接
   - 用户管理
   - 课程管理
   - 成绩管理
   - 系统设置
```

---

### 4. 系统通用功能 (4个功能)

#### 4.1 菜单和导航 [优先级: 🔴 高]

**功能描述**: 提供清晰的系统菜单和导航

**需求清单**:
```
✅ 菜单结构
   - 根据用户角色动态生成菜单
   - 学生菜单 12+ 项
   - 教师菜单 6+ 项
   - 管理员菜单 10+ 项

✅ 导航功能
   - 菜单折叠/展开
   - 面包屑导航
   - 返回上级功能
   - 快速搜索菜单项

✅ 用户信息
   - 显示用户名
   - 显示用户角色
   - 显示用户头像
   - 用户下拉菜单 (个人资料、设置、登出)
```

**相关文件**: `src/pages/DashboardLayout.tsx`

---

#### 4.2 响应式设计 [优先级: 🔴 高]

**功能描述**: 适配不同设备和屏幕尺寸

**需求清单**:
```
✅ 屏幕适配
   - 手机 (< 576px)
   - 平板 (576px - 992px)
   - 台式机 (> 992px)

✅ 布局调整
   - 菜单自动折叠 (手机)
   - 表格响应式 (平板)
   - 侧边栏隐藏 (手机)
   - 字体大小调整

✅ 交互优化
   - 触摸友好
   - 手势支持 (可选)
   - 移动网站优化
   - PWA 支持 (可选)
```

---

#### 4.3 国际化和本地化 [优先级: 🟢 低]

**功能描述**: 支持多语言和本地化设置

**需求清单**:
```
✅ 语言支持
   - 中文 (繁体/简体)
   - 英文
   - 其他语言 (可选)

✅ 本地化内容
   - 界面文本翻译
   - 日期时间格式
   - 数字格式
   - 货币格式 (如有)

✅ 语言切换
   - 提供语言选择器
   - 记住用户选择
   - 即时更新界面
```

---

#### 4.4 主题和个性化 [优先级: 🟢 低]

**功能描述**: 支持主题切换和个性化设置

**需求清单**:
```
✅ 主题支持
   - 亮色模式
   - 暗黑模式
   - 自动切换 (跟随系统)

✅ 颜色主题
   - 预设主题 (蓝色、绿色、红色等)
   - 自定义颜色
   - 主题保存

✅ 个性化设置
   - 字体大小调整
   - 侧边栏宽度调整
   - 菜单展示方式调整
```

---

## 🗄️ 数据需求

### 数据实体和关系

```
用户信息
├─ User (用户基础表)
│  ├─ id (UUID)
│  ├─ username (string, unique)
│  ├─ password_hash (string)
│  ├─ email (string)
│  ├─ role (enum: student|teacher|admin)
│  ├─ status (enum: active|inactive|locked)
│  └─ created_at, updated_at

├─ Student (学生表)
│  ├─ id (UUID)
│  ├─ user_id (FK)
│  ├─ student_id (string, unique)
│  ├─ name, gender, college, major
│  ├─ phone, email, home_address
│  └─ admission_date, status

├─ Teacher (教师表)
│  ├─ id (UUID)
│  ├─ user_id (FK)
│  ├─ teacher_id (string, unique)
│  ├─ name, gender, department, title
│  ├─ phone, email, research_area
│  └─ created_at, updated_at

├─ Course (课程表)
│  ├─ id (UUID)
│  ├─ course_id (string, unique)
│  ├─ course_name, credits, semester, hours
│  ├─ teacher_id (FK), description
│  ├─ capacity, enrolled_count
│  └─ status (active|inactive|frozen)

├─ Grade (成绩表)
│  ├─ id (UUID)
│  ├─ student_id (FK)
│  ├─ course_id (FK)
│  ├─ score (0-100)
│  ├─ grade_level (A|B|C|D|F)
│  ├─ feedback (text)
│  └─ submitted_at, updated_at

├─ StudentCourse (学生选课表)
│  ├─ id (UUID)
│  ├─ student_id (FK)
│  ├─ course_id (FK)
│  ├─ enrollment_time (timestamp)
│  └─ status (enrolled|dropped)

├─ Message (消息表)
│  ├─ id (UUID)
│  ├─ sender_id (FK)
│  ├─ receiver_id (FK)
│  ├─ content (text)
│  ├─ is_read (boolean)
│  └─ created_at

├─ Appeal (申诉表)
│  ├─ id (UUID)
│  ├─ student_id (FK)
│  ├─ course_id (FK)
│  ├─ original_score (integer)
│  ├─ appeal_reason (text)
│  ├─ status (pending|reviewing|approved|rejected)
│  ├─ reviewed_by (FK)
│  ├─ review_feedback (text)
│  ├─ new_score (integer)
│  └─ appeal_time, reviewed_time

├─ Notice (公告表)
│  ├─ id (UUID)
│  ├─ title (string)
│  ├─ content (text)
│  ├─ type (info|warning|success|error)
│  ├─ publish_by (FK)
│  ├─ target_role (all|student|teacher|admin)
│  ├─ is_pinned (boolean)
│  └─ publish_time, expire_time

└─ AuditLog (审计日志表)
   ├─ id (UUID)
   ├─ user_id (FK)
   ├─ operation (create|update|delete|login)
   ├─ object_type (student|grade|course|etc)
   ├─ object_id (string)
   ├─ before_value (json)
   ├─ after_value (json)
   └─ created_at
```

### 数据量预测

```
预期用户量:
  - 学生: 10,000 - 50,000
  - 教师: 500 - 2,000
  - 管理员: 10 - 50

预期数据量:
  - 课程: 200 - 500
  - 成绩: 学生数 × 课程数 ≈ 100万 - 2500万
  - 消息: 每月增长 10万 - 100万
  - 选课记录: 学生数 × 平均每学期课程数 ≈ 100万 - 500万
```

---

## 🔐 安全需求

### 认证和授权

```
✅ 认证机制
  - JWT Token 认证
  - Token 有效期: 24 小时
  - 刷新 Token: 7 天
  - 多设备登录支持

✅ 密码安全
  - 最少 8 位字符
  - 必须包含大小写字母和数字
  - bcrypt 加密存储 (salt rounds: 10+)
  - 不允许使用最近 5 个密码
  - 密码过期时间: 90 天

✅ 会话管理
  - 会话超时: 30 分钟无操作自动登出
  - 支持远程登出
  - 支持删除其他设备会话

✅ 权限控制
  - 基于角色的访问控制 (RBAC)
  - 接口级权限检查
  - 数据级权限检查
  - 操作级权限检查
```

### 数据安全

```
✅ 数据加密
  - HTTPS/TLS 1.3+ 传输加密
  - 敏感数据字段加密存储 (密码、身份证等)
  - 数据库连接加密

✅ 数据隐私
  - 用户只能访问自己的数据
  - 教师只能访问所教班级的数据
  - 管理员操作记录审计
  - 敏感数据访问日志

✅ 数据完整性
  - 数据库完整性约束
  - 应用层数据验证
  - 操作前后值记录

✅ 备份和恢复
  - 每日自动备份
  - 备份加密存储
  - 备份保留 30 天
  - 恢复流程测试
```

### 安全漏洞防护

```
✅ 常见漏洞防护
  - SQL 注入: 使用参数化查询
  - XSS 攻击: 输入验证和输出转义
  - CSRF 攻击: CSRF Token 验证
  - DDOS: 速率限制、流量控制
  - 暴力破解: 登录尝试限制、账户锁定

✅ 安全头设置
  - Content-Security-Policy
  - X-Frame-Options: DENY
  - X-Content-Type-Options: nosniff
  - Strict-Transport-Security

✅ API 安全
  - 接口速率限制 (每分钟/小时)
  - 请求大小限制
  - 文件上传扫描
  - 接口参数验证
```

---

## 📊 性能需求

### 性能指标

```
✅ 响应时间
  - 首页加载: < 2 秒
  - 列表查询: < 1 秒
  - 修改操作: < 500 毫秒
  - 搜索操作: < 2 秒

✅ 并发能力
  - 支持并发用户: 1,000+
  - QPS (查询/秒): 10,000+
  - 数据库连接池: 50+

✅ 资源利用
  - 前端包体积: < 500KB (gzip)
  - 内存使用: < 2GB (服务器)
  - 磁盘空间: 根据数据量

✅ 可用性
  - 系统可用性: > 99.5%
  - 数据库故障恢复: < 5 分钟
  - 自动故障转移支持
```

### 性能优化策略

```
✅ 前端优化
  - 代码分割和懒加载
  - 缓存静态资源
  - 压缩图片和资源
  - 使用 CDN

✅ 后端优化
  - 数据库查询优化 (索引、缓存)
  - API 响应缓存
  - 异步处理耗时操作
  - 数据库连接池
  - Redis 缓存

✅ 数据库优化
  - 表分区 (大表)
  - 索引优化
  - 查询优化
  - 定期清理过期数据
```

---

## 🚀 部署需求

### 系统环境

```
✅ 开发环境
  - Node.js 18+ / Python 3.9+ / Java 17+
  - React 19+
  - TypeScript 5+
  - PostgreSQL 12+ / MySQL 8+

✅ 生产环境
  - 多服务器部署 (负载均衡)
  - Docker 容器化
  - Kubernetes 编排 (可选)
  - CDN 加速

✅ 监控和日志
  - 应用性能监控 (APM)
  - 日志聚合 (ELK Stack)
  - 错误追踪 (Sentry)
  - 告警和通知
```

### 部署流程

```
✅ CI/CD 流程
  - 代码提交触发测试
  - 自动构建和打包
  - 自动部署到测试环境
  - 冒烟测试
  - 手动审核
  - 自动部署到生产环境

✅ 版本管理
  - 语义版本控制
  - 变更日志维护
  - 发行说明
  - 灰度发布支持
```

---

## ✅ 验收标准

### 功能验收

```
学生模块验收
  ✅ 可以成功登录和登出
  ✅ 可以查看所有成绩和统计信息
  ✅ 可以进行选课和退课操作
  ✅ 可以发送和接收消息
  ✅ 可以修改个人信息和密码
  ✅ 可以查看分析报告和建议
  ✅ 可以提交和跟踪申诉
  ✅ 可以查看公告和课程表
  ✅ 可以导出数据到本地

教师模块验收
  ✅ 可以输入和修改成绩
  ✅ 可以查看班级学生
  ✅ 可以与学生沟通
  ✅ 可以审核学生申诉
  ✅ 可以查看教学资源

管理员模块验收
  ✅ 可以管理所有用户
  ✅ 可以管理课程信息
  ✅ 可以管理成绩数据
  ✅ 可以配置系统参数
  ✅ 可以发布系统公告
  ✅ 可以查看日志和报告
  ✅ 可以备份和恢复数据
```

### 性能验收

```
✅ 响应时间: 所有操作在规定时间内完成
✅ 并发能力: 支持预期并发用户数
✅ 资源利用: 内存、CPU 使用在合理范围
✅ 数据一致性: 所有数据修改正确保存
```

### 安全验收

```
✅ 认证: 用户身份验证正确
✅ 授权: 权限控制生效
✅ 数据保护: 敏感数据加密存储
✅ 审计: 关键操作有日志记录
✅ 漏洞防护: 通过安全扫描
```

### 易用性验收

```
✅ 界面设计: 符合现代 UI 规范
✅ 交互逻辑: 符合用户习惯
✅ 帮助文档: 完整且易理解
✅ 错误提示: 清晰有指导性
✅ 响应式: 在不同设备上显示正常
```

---

## 📚 相关文档

- `README.md` - 项目基础说明
- `BACKEND_ARCHITECTURE.md` - 后端实现指南
- `FRONTEND_VS_BACKEND.md` - 前后端功能对照表
- `COMPLETE_FEATURES.md` - 完整功能总结
- `DEPLOYMENT.md` - 部署配置指南

---

## 📅 项目时间表

```
阶段 1 (第 1 周): 需求确认和技术选型
  ✓ 确认项目需求
  ✓ 选择后端技术栈
  ✓ 环境搭建

阶段 2 (第 2-4 周): 后端核心开发
  ✓ 认证系统
  ✓ 基础 CRUD 接口
  ✓ 业务逻辑实现
  ✓ 单元测试

阶段 3 (第 5-6 周): 前后端集成和测试
  ✓ 修改前端 stores
  ✓ 集成测试
  ✓ 性能测试
  ✓ 安全审计

阶段 4 (第 7 周): 优化和部署
  ✓ 性能优化
  ✓ 文档完善
  ✓ 用户培训
  ✓ 正式部署
```

---

**文档完成**: 2024年11月2日  
**版本**: v1.0  
**状态**: 就绪



