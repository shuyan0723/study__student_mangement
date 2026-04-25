# Claude Code 辅助开发指南 - 学生成绩管理系统

本文档专门为 Claude Code 设计，提供详细的开发规范、模式和最佳实践。

---

## 快速参考

### 项目路径
```
项目根: c:\Users\Administrator\Desktop\study__student_mangement\
前端:   student-study/
后端:   backend/
```

### 启动命令
```bash
# 后端
cd backend && npm run dev

# 前端
cd student-study && npm run dev
```

### 访问地址
- 前端: http://localhost:5173
- 后端: http://localhost:3000
- API: http://localhost:3000/api

---

## 核心开发模式

### 模式 1: 添加新功能页面

**示例**: 为教师添加"作业管理"页面

#### 步骤 1: 创建后端 API
```typescript
// backend/src/controllers/homeworkController.ts
import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Homework from '../models/Homework';

export const createHomework = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, courseId, dueDate } = req.body;
    const homework = await Homework.create({
      title,
      description,
      courseId,
      teacherId: req.user!.id,
      dueDate
    });
    res.json({ success: true, data: homework });
  } catch (error) {
    res.status(500).json({ success: false, message: '创建失败' });
  }
};
```

#### 步骤 2: 创建路由
```typescript
// backend/src/routes/homeworkRoutes.ts
import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { authorizeRole } from '../middleware/authMiddleware';
import { createHomework } from '../controllers/homeworkController';

const router = express.Router();

router.post('/', authMiddleware, authorizeRole('teacher'), createHomework);

export default router;
```

#### 步骤 3: 注册路由
```typescript
// backend/src/app.ts
import homeworkRoutes from './routes/homeworkRoutes';
app.use('/api/homework', homeworkRoutes);
```

#### 步骤 4: 创建前端页面
```typescript
// student-study/src/pages/teacher/HomeworkManagePage.tsx
import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker } from 'antd';

export const HomeworkManagePage = () => {
  const [homeworks, setHomeworks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const loadHomeworks = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/homework`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    if (data.success) {
      setHomeworks(data.data);
    }
  };

  const handleSubmit = async (values: any) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/homework`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(values)
    });
    if (response.ok) {
      setModalVisible(false);
      loadHomeworks();
    }
  };

  useEffect(() => {
    loadHomeworks();
  }, []);

  return (
    <div style={{ padding: '24px' }}>
      <Table
        dataSource={homeworks}
        columns={[
          { title: '作业标题', dataIndex: 'title' },
          { title: '截止日期', dataIndex: 'dueDate' }
        ]}
      />
      <Modal
        visible={modalVisible}
        onOk={() => form.submit()}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item name="title" label="作业标题" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="dueDate" label="截止日期" rules={[{ required: true }]}>
            <DatePicker />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
```

#### 步骤 5: 注册路由和菜单
```typescript
// student-study/src/routes/teacherRoutes.tsx
import HomeworkManagePage from '../pages/teacher/HomeworkManagePage';

export const teacherRoutes = [
  <Route key="teacher-homework" path="teacher/homework" element={<HomeworkManagePage />} navName="作业管理" />
];
```

#### 步骤 6: 更新菜单
```typescript
// student-study/src/pages/DashboardLayout.tsx
// 在菜单配置中添加
{
  key: 'teacher-homework',
  icon: <FileTextOutlined />,
  label: '作业管理',
  path: '/teacher/homework'
}
```

---

### 模式 2: 添加数据模型

**示例**: 添加"作业"数据模型

#### 步骤 1: 创建模型文件
```typescript
// backend/src/models/Homework.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface HomeworkAttributes {
  id: string;
  title: string;
  description?: string;
  courseId: string;
  teacherId: string;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface HomeworkCreationAttributes extends Optional<HomeworkAttributes, 'id' | 'createdAt' | 'updatedAt' | 'description'> {}

export class Homework extends Model<HomeworkAttributes, HomeworkCreationAttributes> implements HomeworkAttributes {
  public id!: string;
  public title!: string;
  public description?: string;
  public courseId!: string;
  public teacherId!: string;
  public dueDate!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Homework.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    courseId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'courses',
        key: 'id'
      }
    },
    teacherId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'homeworks',
    timestamps: true
  }
);

export default Homework;
```

#### 步骤 2: 注册模型
```typescript
// backend/src/models/index.ts
import Homework from './Homework';

// 触发模型初始化
Homework;

// 导出模型
export { Homework };

export default {
  // ...其他模型
  Homework
};
```

#### 步骤 3: 定义关联关系
```typescript
// backend/src/models/Homework.ts (添加)
import Course from './Course';
import Teacher from './Teacher';

Homework.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });
Homework.belongsTo(Teacher, { foreignKey: 'teacherId', as: 'teacher' });
```

**数据库表会在服务器重启时自动创建**

---

### 模式 3: 添加前端类型定义

**示例**: 为作业功能添加类型

```typescript
// student-study/src/types/index.ts
export interface Homework {
  id: string;
  title: string;
  description?: string;
  courseId: string;
  teacherId: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  course?: {
    id: string;
    courseName: string;
  };
  teacher?: {
    id: string;
    name: string;
  };
}

export interface HomeworkFormData {
  title: string;
  description?: string;
  courseId: string;
  dueDate: string;
}
```

---

### 模式 4: 使用 Zustand 管理状态

**示例**: 创建作业状态管理

```typescript
// student-study/src/store/homeworkStore.ts
import { create } from 'zustand';
import type { Homework } from '../types';

interface HomeworkStore {
  homeworks: Homework[];
  loading: boolean;
  error: string | null;
  fetchHomeworks: () => Promise<void>;
  addHomework: (homework: Homework) => void;
  updateHomework: (id: string, data: Partial<Homework>) => void;
  deleteHomework: (id: string) => void;
}

export const useHomeworkStore = create<HomeworkStore>((set, get) => ({
  homeworks: [],
  loading: false,
  error: null,

  fetchHomeworks: async () => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/homework`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        set({ homeworks: data.data, loading: false });
      }
    } catch (error) {
      set({ error: '加载失败', loading: false });
    }
  },

  addHomework: (homework) => {
    set({ homeworks: [...get().homeworks, homework] });
  },

  updateHomework: (id, data) => {
    set({
      homeworks: get().homeworks.map(hw => hw.id === id ? { ...hw, ...data } : hw)
    });
  },

  deleteHomework: (id) => {
    set({ homeworks: get().homeworks.filter(hw => hw.id !== id) });
  }
}));
```

---

### 模式 5: 添加 WebSocket 事件处理

**示例**: 实时作业通知

```typescript
// 后端 - backend/src/websocket/websocketServer.ts
socket.on('new_homework', async (data) => {
  // 通知相关学生
  const students = await getStudentsByCourse(data.courseId);
  students.forEach(student => {
    io.to(student.userId).emit('homework_notification', {
      title: data.title,
      message: `新作业: ${data.title}`,
      dueDate: data.dueDate
    });
  });
});
```

```typescript
// 前端 - 在组件中监听
useEffect(() => {
  const socket = io('http://localhost:3000', {
    auth: { token: localStorage.getItem('token') }
  });

  socket.on('homework_notification', (data) => {
    message.info(data.message);
    // 刷新作业列表
    fetchHomeworks();
  });

  return () => {
    socket.disconnect();
  };
}, []);
```

---

## 常见修复场景

### 修复 1: API 返回 401 未授权
**问题**: Token 过期或格式错误
```typescript
// 检查前端是否正确发送 token
const response = await fetch(url, {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`  // 注意 Bearer 前缀
  }
});

// 检查后端中间件是否正确配置
router.use(authMiddleware);  // 确保这行在使用路由之前
```

### 修复 2: TypeScript 类型错误
**问题**: 类型不匹配
```typescript
// ❌ 错误: 不能将类型'string'分配给类型'number'
const score: number = req.body.score;

// ✅ 正确: 显式转换
const score: number = Number(req.body.score);

// ❌ 错误: 属性'xxx'不存在
const name = user.studentName;

// ✅ 正确: 检查类型定义
interface Student {
  name: string;  // 使用正确的字段名
}
```

### 修复 3: Ant Design 组件样式问题
**问题**: 组件样式不生效
```typescript
// 使用 style 属性
<Button style={{ marginRight: '16px' }}>按钮</Button>

// 使用 className
<Button className="custom-button">按钮</Button>

// 配置主题
<ConfigProvider theme={{ token: { colorPrimary: '#1890ff' } }}>
  <App />
</ConfigProvider>
```

### 修复 4: 数据库关联查询失败
**问题**: Sequelize include 不工作
```typescript
// ❌ 错误: 没有定义关联
const grades = await Grade.findAll({
  include: ['student']  // student 关联未定义
});

// ✅ 正确: 先定义关联
// Grade.ts
Grade.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });

// 然后查询
const grades = await Grade.findAll({
  include: [{
    model: Student,
    as: 'student',
    attributes: ['id', 'name', 'studentId']
  }]
});
```

---

## 性能优化建议

### 前端优化
1. **使用 React.memo**: 避免不必要的重渲染
```typescript
export const HomeworkItem = React.memo(({ homework }: { homework: Homework }) => {
  return <div>{homework.title}</div>;
});
```

2. **使用 useMemo 和 useCallback**: 缓存计算结果和函数
```typescript
const filteredHomeworks = useMemo(() => {
  return homeworks.filter(hw => hw.status === 'active');
}, [homeworks]);

const handleSubmit = useCallback(async (values: any) => {
  // 提交逻辑
}, []);
```

3. **延迟加载**: 使用 React.lazy 和 Suspense
```typescript
const HomeworkManagePage = React.lazy(() => import('./pages/teacher/HomeworkManagePage'));

<Suspense fallback={<Spin />}>
  <HomeworkManagePage />
</Suspense>
```

### 后端优化
1. **使用数据库索引**
```typescript
// Homework.ts
Homework.init({
  // ...
  indexes: [
    { fields: ['teacherId'] },
    { fields: ['courseId'] },
    { fields: ['dueDate'] }
  ]
});
```

2. **使用分页**
```typescript
const homeworks = await Homework.findAndCountAll({
  limit: 10,
  offset: (page - 1) * 10,
  order: [['createdAt', 'DESC']]
});
```

3. **缓存常用数据**: 使用 Redis
```typescript
// 缓存课程列表
let courses = await redis.get(`courses:${teacherId}`);
if (!courses) {
  courses = await Course.findAll({ where: { teacherId } });
  await redis.setex(`courses:${teacherId}`, 3600, JSON.stringify(courses));
}
```

---

## 安全最佳实践

### 1. 输入验证
```typescript
import { body, validationResult } from 'express-validator';

router.post('/homework',
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('标题长度1-200字符'),
  body('dueDate').isISO8601().withMessage('日期格式错误'),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    // 处理逻辑
  }
);
```

### 2. SQL 注入防护
```typescript
// ❌ 危险: 拼接 SQL
const sql = `SELECT * FROM homeworks WHERE title = '${title}'`;

// ✅ 安全: 使用参数化查询 (Sequelize 自动处理)
const homeworks = await Homework.findAll({
  where: { title }
});
```

### 3. XSS 防护
```typescript
// 前端: 使用 DOMPurify 清理用户输入
import DOMPurify from 'dompurify';

const cleanDescription = DOMPurify.sanitize(userInput);
```

### 4. 权限验证
```typescript
// 确保用户只能操作自己的数据
const homework = await Homework.findOne({
  where: {
    id: req.params.id,
    teacherId: req.user!.id  // 验证所有权
  }
});

if (!homework) {
  return res.status(403).json({ success: false, message: '无权操作' });
}
```

---

## 调试技巧

### 前端调试
```typescript
// 1. 使用 React DevTools
// 2. 在关键位置添加 console.log
console.log('当前作业列表:', homeworks);

// 3. 使用 debugger
debugger;  // 代码会在此处暂停

// 4. 网络请求调试
fetch(url).then(response => {
  console.log('响应状态:', response.status);
  return response.json();
}).then(data => {
  console.log('响应数据:', data);
});
```

### 后端调试
```typescript
// 1. 使用 console.log
console.log('收到请求:', req.body);
console.log('查询结果:', homeworks);

// 2. 使用调试器
// 在 VS Code 中设置断点，然后按 F5 启动调试

// 3. 查看数据库日志
// 在 .env 中设置
LOG_LEVEL=debug

// 4. SQL 查询日志
console.log(homeworks instanceof Homework);  // true
console.log(JSON.stringify(homeworks, null, 2));  // 查看数据结构
```

---

## Git 提交规范

```bash
# 功能添加
git commit -m "feat(homework): 添加作业管理功能"

# Bug 修复
git commit -m "fix(grades): 修复成绩计算错误"

# 文档更新
git commit -m "docs: 更新 API 文档"

# 代码重构
git commit -m "refactor(auth): 优化认证逻辑"

# 性能优化
git commit -m "perf(database): 添加数据库索引"

# 样式修改
git commit -m "style(homework): 调整作业列表样式"

# 测试添加
git commit -m "test(homework): 添加作业管理测试"
```

---

## 常用命令

```bash
# 后端
cd backend
npm run dev              # 开发模式
npm run build            # 构建
npm start                # 生产启动
npm run lint             # 代码检查
npm run test             # 运行测试

# 前端
cd student-study
npm run dev              # 开发模式
npm run build            # 构建
npm run preview          # 预览构建
npm run lint             # 代码检查

# 数据库
npm run db:setup         # 初始化数据库
npm run db:seed          # 填充测试数据
```

---

**版本**: 1.0.0
**最后更新**: 2026-03-25
