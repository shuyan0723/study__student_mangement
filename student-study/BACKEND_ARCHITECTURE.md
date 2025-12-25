# 后端实现架构指南

**项目现状**: 前端完全模拟实现 (Mock Data)  
**版本**: v1.2.0  
**更新时间**: 2024年11月2日

---

## 🎯 现状分析

### 当前实现方式

```
当前架构:
├─ 前端: React + TypeScript ✅
├─ 状态管理: Zustand (内存存储) ✅
├─ UI组件: Ant Design ✅
├─ 路由: React Router ✅
└─ 后端: ❌ 未实现 (全是Mock数据)
```

### 数据存储位置

```typescript
// 现在: 所有数据都在这两个文件中
src/store/
├── authStore.ts      // 用户认证 (模拟)
└── dataStore.ts      // 业务数据 (模拟)

特点:
- 数据存储在浏览器内存中
- 刷新页面后数据丢失
- 只支持单用户
- 无法多设备同步
```

---

## 📋 功能分类

### 1. 需要后端支持的功能

#### ✅ 用户认证模块
```
现在的实现:
  - LoginPage.tsx: 模拟登录
  - Token: 假的 JWT
  - 数据源: authStore.ts 的硬编码

需要后端:
  POST /api/auth/login
    请求: { username, password }
    响应: { token, user, role }
  
  POST /api/auth/register
    请求: { username, password, email, role }
    响应: { success, message }
  
  POST /api/auth/logout
    请求: { token }
    响应: { success }
  
  POST /api/auth/refresh
    请求: { token }
    响应: { newToken }
```

**相关文件**:
- `src/store/authStore.ts` - 模拟认证逻辑
- `src/pages/LoginPage.tsx` - 登录页面

---

#### ✅ 学生成绩管理
```
现在的实现:
  - GradesPage.tsx: 显示 mock 数据
  - 数据来源: dataStore.ts

需要后端:
  GET /api/grades
    查询参数: { studentId, courseId, page, limit }
    响应: { grades, total }
  
  POST /api/grades
    请求: { studentId, courseId, score, gradeLevel, feedback }
    响应: { gradeId, success }
  
  PUT /api/grades/:id
    请求: { score, gradeLevel, feedback }
    响应: { success }
  
  DELETE /api/grades/:id
    响应: { success }
```

**相关文件**:
- `src/pages/student/GradesPage.tsx` - 学生查看成绩
- `src/pages/admin/GradesManagePage.tsx` - 管理员管理成绩
- `src/pages/teacher/GradesManagePage.tsx` - 教师管理成绩
- `src/store/dataStore.ts` 中的 `grades` 数据

---

#### ✅ 学生选课管理
```
现在的实现:
  - CoursesPage.tsx: 选课和退课
  - 数据来源: dataStore.ts

需要后端:
  GET /api/courses
    查询参数: { page, limit, available }
    响应: { courses, total }
  
  GET /api/student/courses
    查询参数: { studentId }
    响应: { enrolledCourses }
  
  POST /api/student/courses/enroll
    请求: { studentId, courseId }
    响应: { success, enrollmentId }
  
  POST /api/student/courses/drop
    请求: { studentId, courseId }
    响应: { success }
```

**相关文件**:
- `src/pages/student/CoursesPage.tsx` - 学生选课
- `src/pages/admin/CoursesManagePage.tsx` - 管理员管理课程

---

#### ✅ 在线消息系统
```
现在的实现:
  - MessagesPage.tsx: 模拟消息
  - 数据来源: dataStore.ts

需要后端:
  GET /api/messages
    查询参数: { userId, otherId }
    响应: { messages }
  
  POST /api/messages
    请求: { senderId, receiverId, content }
    响应: { messageId, timestamp }
  
  PUT /api/messages/:id/read
    响应: { success }
  
  WebSocket (高级):
    ws://server/chat
    事件: message, typing, online
```

**相关文件**:
- `src/pages/student/MessagesPage.tsx` - 消息页面

---

#### ✅ 成绩申诉系统
```
现在的实现:
  - AppealPage.tsx: 模拟申诉
  - 数据来源: 本地 useState

需要后端:
  GET /api/appeals
    查询参数: { studentId, status }
    响应: { appeals }
  
  POST /api/appeals
    请求: { studentId, courseId, appealReason }
    响应: { appealId, success }
  
  PUT /api/appeals/:id/review
    请求: { reviewFeedback, newScore, status }
    响应: { success }
  
  DELETE /api/appeals/:id
    响应: { success }
```

**相关文件**:
- `src/pages/student/AppealPage.tsx` - 申诉页面

---

#### ✅ 系统公告管理
```
现在的实现:
  - NoticesPage.tsx: 模拟公告
  - 数据来源: 本地 useState

需要后端:
  GET /api/notices
    查询参数: { targetRole, page, limit }
    响应: { notices, total }
  
  POST /api/notices
    请求: { title, content, type, targetRole }
    响应: { noticeId, success }
  
  PUT /api/notices/:id
    响应: { success }
  
  DELETE /api/notices/:id
    响应: { success }
  
  PUT /api/notices/:id/mark-read
    响应: { success }
```

**相关文件**:
- `src/pages/NoticesPage.tsx` - 公告页面

---

#### ✅ 用户管理
```
现在的实现:
  - StudentsManagePage.tsx: 模拟学生管理
  - TeachersManagePage.tsx: 模拟教师管理
  - 数据来源: dataStore.ts

需要后端:
  GET /api/students
    查询参数: { page, limit, search }
    响应: { students, total }
  
  POST /api/students
    请求: { studentId, name, email, ... }
    响应: { studentId, success }
  
  PUT /api/students/:id
    响应: { success }
  
  DELETE /api/students/:id
    响应: { success }
  
  同样适用于 /api/teachers
```

**相关文件**:
- `src/pages/admin/StudentsManagePage.tsx`
- `src/pages/admin/TeachersManagePage.tsx`

---

### 2. 不需要后端的功能

#### ✅ 前端计算类

```
无需后端服务器，只需前端计算:

1. 成绩分析 (AnalyticsPage.tsx)
   - 平均分计算
   - 最高/最低分
   - 及格率/优秀率
   - 等级分布
   → 数据来自 grades 表，前端计算展示

2. 课程表 (SchedulePage.tsx)
   - 课程安排展示
   - 考试时间展示
   → 数据来自 courses 表，前端组织展示

3. 个人资料 (ProfilePage.tsx)
   - 头像上传 (需要文件服务器)
   - 信息编辑 (需要数据库)
   - 密码修改 (需要后端验证)
   → 部分需要后端支持

4. 数据导出 (DataExportPage.tsx)
   - CSV生成 (前端完成)
   - 文件下载 (浏览器提供)
   → 完全在前端完成
```

---

## 🏗️ 推荐后端架构

### 技术栈选择

#### 选项 1: Node.js + Express (推荐)

```javascript
// 项目结构
backend/
├── src/
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── gradeController.ts
│   │   ├── courseController.ts
│   │   ├── studentController.ts
│   │   ├── teacherController.ts
│   │   ├── messageController.ts
│   │   ├── appealController.ts
│   │   └── noticeController.ts
│   ├── middleware/
│   │   ├── auth.ts (JWT验证)
│   │   └── errorHandler.ts
│   ├── models/
│   │   ├── User.ts
│   │   ├── Grade.ts
│   │   ├── Course.ts
│   │   ├── Student.ts
│   │   ├── Teacher.ts
│   │   ├── Message.ts
│   │   ├── Appeal.ts
│   │   └── Notice.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── grades.ts
│   │   ├── courses.ts
│   │   ├── students.ts
│   │   ├── teachers.ts
│   │   ├── messages.ts
│   │   ├── appeals.ts
│   │   └── notices.ts
│   ├── database/
│   │   └── connection.ts
│   └── app.ts
├── .env
└── package.json

// 依赖包
{
  "express": "^4.18.0",
  "jwt-simple": "^0.5.6",
  "mysql": "^2.18.1",
  "body-parser": "^1.20.0",
  "cors": "^2.8.5",
  "dotenv": "^16.0.0"
}
```

---

#### 选项 2: Python + FastAPI

```python
# 项目结构
backend/
├── app/
│   ├── main.py
│   ├── api/
│   │   ├── auth.py
│   │   ├── grades.py
│   │   ├── courses.py
│   │   ├── students.py
│   │   ├── teachers.py
│   │   ├── messages.py
│   │   ├── appeals.py
│   │   └── notices.py
│   ├── models/
│   │   ├── user.py
│   │   ├── grade.py
│   │   ├── course.py
│   │   └── ...
│   ├── database/
│   │   └── connection.py
│   └── schemas/
│       └── ...
├── requirements.txt
└── .env

# 依赖包
fastapi
sqlalchemy
pymysql
python-jwt
pydantic
```

---

#### 选项 3: Java + Spring Boot

```
backend/
├── src/main/java/com/example/
│   ├── controller/
│   ├── service/
│   ├── repository/
│   ├── entity/
│   ├── dto/
│   ├── config/
│   └── Application.java
├── src/main/resources/
│   ├── application.properties
│   └── application-dev.yml
└── pom.xml
```

---

### 数据库设计

```sql
-- 用户表 (基础)
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(100),
  role ENUM('student', 'teacher', 'admin') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 学生表
CREATE TABLE students (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) UNIQUE NOT NULL,
  student_id VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  gender ENUM('male', 'female'),
  college VARCHAR(100),
  major VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(100),
  home_address TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 教师表
CREATE TABLE teachers (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) UNIQUE NOT NULL,
  teacher_id VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  gender ENUM('male', 'female'),
  department VARCHAR(100),
  title VARCHAR(50),
  email VARCHAR(100),
  phone VARCHAR(20),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 课程表
CREATE TABLE courses (
  course_id VARCHAR(20) PRIMARY KEY,
  course_name VARCHAR(100) NOT NULL,
  credits INT,
  semester VARCHAR(20),
  hours INT,
  teacher_id VARCHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (teacher_id) REFERENCES teachers(id)
);

-- 成绩表
CREATE TABLE grades (
  id VARCHAR(36) PRIMARY KEY,
  student_id VARCHAR(36) NOT NULL,
  course_id VARCHAR(20) NOT NULL,
  score INT,
  grade_level VARCHAR(5),
  feedback TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (course_id) REFERENCES courses(course_id)
);

-- 学生选课表
CREATE TABLE student_courses (
  id VARCHAR(36) PRIMARY KEY,
  student_id VARCHAR(36) NOT NULL,
  course_id VARCHAR(20) NOT NULL,
  enrollment_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20),
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (course_id) REFERENCES courses(course_id),
  UNIQUE KEY (student_id, course_id)
);

-- 消息表
CREATE TABLE messages (
  id VARCHAR(36) PRIMARY KEY,
  sender_id VARCHAR(36) NOT NULL,
  receiver_id VARCHAR(36) NOT NULL,
  content TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_read BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (sender_id) REFERENCES users(id),
  FOREIGN KEY (receiver_id) REFERENCES users(id)
);

-- 申诉表
CREATE TABLE appeals (
  id VARCHAR(36) PRIMARY KEY,
  student_id VARCHAR(36) NOT NULL,
  course_id VARCHAR(20) NOT NULL,
  original_score INT,
  appeal_reason TEXT,
  status VARCHAR(20),
  reviewed_by VARCHAR(36),
  review_feedback TEXT,
  new_score INT,
  appeal_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_time TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (course_id) REFERENCES courses(course_id),
  FOREIGN KEY (reviewed_by) REFERENCES teachers(id)
);

-- 公告表
CREATE TABLE notices (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT,
  type VARCHAR(20),
  publish_by VARCHAR(36) NOT NULL,
  publish_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  target_role VARCHAR(20),
  FOREIGN KEY (publish_by) REFERENCES users(id)
);
```

---

## 🔄 前后端集成步骤

### 第 1 步: 修改 Zustand Store

```typescript
// 修改前 (现在的状态)
// src/store/authStore.ts
const useAuthStore = create((set) => ({
  login: async (username: string, password: string) => {
    // 模拟登录
    const mockUser = { id: 'student_001', username, role: 'student' };
    set({ user: mockUser, token: 'mock-token' });
  }
}));

// 修改后 (真实后端)
const useAuthStore = create((set) => ({
  login: async (username: string, password: string) => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        set({ 
          user: data.user, 
          token: data.token,
          isAuthenticated: true 
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      throw error;
    }
  }
}));
```

---

### 第 2 步: 创建 API 服务层

```typescript
// src/services/api.ts (新增)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// 认证 API
export const authAPI = {
  login: async (username: string, password: string) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return res.json();
  },
  
  register: async (userData: any) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return res.json();
  }
};

// 成绩 API
export const gradesAPI = {
  getGrades: async (filter?: any) => {
    const params = new URLSearchParams(filter).toString();
    const res = await fetch(`${API_BASE_URL}/api/grades?${params}`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return res.json();
  },
  
  addGrade: async (gradeData: any) => {
    const res = await fetch(`${API_BASE_URL}/api/grades`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(gradeData)
    });
    return res.json();
  },
  
  // 其他 API...
};

// 类似的 API 对象...
export const coursesAPI = { /* ... */ };
export const studentsAPI = { /* ... */ };
export const messagesAPI = { /* ... */ };
export const appealsAPI = { /* ... */ };
export const noticesAPI = { /* ... */ };
```

---

### 第 3 步: 修改页面组件

```typescript
// 修改前 (使用 mock 数据)
// src/pages/student/GradesPage.tsx
export const GradesPage = () => {
  const { grades } = useDataStore();
  return <Table dataSource={grades} ... />;
};

// 修改后 (使用 API)
export const GradesPage = () => {
  const { user } = useAuthStore();
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchGrades = async () => {
      try {
        setLoading(true);
        const data = await gradesAPI.getGrades({ 
          studentId: user?.id 
        });
        setGrades(data.grades);
      } catch (error) {
        message.error('获取成绩失败');
      } finally {
        setLoading(false);
      }
    };
    
    fetchGrades();
  }, [user?.id]);
  
  return <Table dataSource={grades} loading={loading} ... />;
};
```

---

## 📱 环境变量配置

```bash
# .env (前端)
VITE_API_URL=http://localhost:3000

# .env.production
VITE_API_URL=https://api.example.com
```

---

## 🔐 认证流程

### JWT Token 流程

```
1. 登录请求
   POST /api/auth/login
   { username, password }
   ↓
2. 后端验证
   检查用户 → 验证密码 → 生成 JWT Token
   ↓
3. 返回 Token
   { token, user, role }
   ↓
4. 前端存储
   localStorage.setItem('token', token)
   ↓
5. 后续请求
   GET /api/grades
   Header: Authorization: Bearer <token>
   ↓
6. 后端验证
   验证 Token 有效性 → 获取用户信息 → 处理请求
```

---

## 📊 API 路由总结

```
认证相关:
  POST   /api/auth/login              登录
  POST   /api/auth/register           注册
  POST   /api/auth/logout             登出
  POST   /api/auth/refresh            刷新 Token

学生相关:
  GET    /api/students                获取学生列表
  GET    /api/students/:id            获取学生详情
  POST   /api/students                创建学生
  PUT    /api/students/:id            更新学生
  DELETE /api/students/:id            删除学生

教师相关:
  GET    /api/teachers                获取教师列表
  GET    /api/teachers/:id            获取教师详情
  POST   /api/teachers                创建教师
  PUT    /api/teachers/:id            更新教师
  DELETE /api/teachers/:id            删除教师

课程相关:
  GET    /api/courses                 获取课程列表
  GET    /api/courses/:id             获取课程详情
  POST   /api/courses                 创建课程
  PUT    /api/courses/:id             更新课程
  DELETE /api/courses/:id             删除课程

成绩相关:
  GET    /api/grades                  获取成绩列表
  GET    /api/grades/:id              获取成绩详情
  POST   /api/grades                  创建成绩
  PUT    /api/grades/:id              更新成绩
  DELETE /api/grades/:id              删除成绩

选课相关:
  GET    /api/student-courses         获取选课列表
  POST   /api/student-courses/enroll  选课
  POST   /api/student-courses/drop    退课

消息相关:
  GET    /api/messages                获取消息列表
  POST   /api/messages                发送消息
  PUT    /api/messages/:id/read       标记已读

申诉相关:
  GET    /api/appeals                 获取申诉列表
  POST   /api/appeals                 提交申诉
  PUT    /api/appeals/:id             更新申诉
  DELETE /api/appeals/:id             删除申诉

公告相关:
  GET    /api/notices                 获取公告列表
  POST   /api/notices                 发布公告
  PUT    /api/notices/:id             编辑公告
  DELETE /api/notices/:id             删除公告
```

---

## ⏱️ 集成时间估算

```
准备阶段: 1-2 天
  - 选择技术栈
  - 项目初始化
  - 数据库设计

核心开发: 2-3 周
  - 认证系统: 3-4 天
  - CRUD 接口: 1 周
  - 业务逻辑: 1 周
  - 错误处理: 2-3 天

前后端集成: 1-2 周
  - 修改 Store
  - 创建 API 层
  - 修改页面组件
  - 测试调试

测试上线: 1 周
  - 功能测试
  - 性能优化
  - 部署配置

总计: 4-6 周
```

---

## 🚀 快速开始集成 (Express 示例)

```bash
# 1. 创建后端项目
mkdir backend && cd backend
npm init -y

# 2. 安装依赖
npm install express cors body-parser jwt-simple mysql dotenv

# 3. 创建基础文件
mkdir src src/routes src/middleware
touch src/app.ts src/routes/auth.ts .env

# 4. .env 配置
DATABASE_URL=mysql://user:pass@localhost:3306/student_grades
JWT_SECRET=your_secret_key
PORT=3000

# 5. 启动服务
npm install -D typescript
npx tsc --init
npm start
```

---

## 📝 总结

### 现状
- ✅ **前端**: 100% 完成 (React + Zustand)
- ❌ **后端**: 0% (全是 Mock 数据)
- ❌ **数据库**: 未连接
- ❌ **认证**: 模拟实现

### 下一步
1. **选择后端技术栈** (推荐 Express/Python/Spring)
2. **设计数据库架构** (已提供 SQL 脚本)
3. **开发 API 接口** (按照路由总结实现)
4. **修改前端 Store** (从 Mock 改为 API 调用)
5. **集成测试** (逐模块集成和测试)
6. **部署上线** (生产环境配置)

### 关键代码位置

**需要修改的文件**:
```
src/store/
├── authStore.ts       ← 改为 API 调用
└── dataStore.ts       ← 改为 API 调用

需要创建:
src/services/
├── api.ts             ← API 服务层
├── auth.ts            ← 认证 API
├── grades.ts          ← 成绩 API
└── ...

需要更新:
src/pages/
└── *.tsx              ← 更新为使用 API
```

---

**建议**: 从认证系统开始集成，然后逐步集成其他模块，这样可以确保稳定性。
