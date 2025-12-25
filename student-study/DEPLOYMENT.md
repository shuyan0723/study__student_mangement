# 学生成绩管理系统 - 部署与后端集成指南

## 部署指南

### 开发环境部署

#### 前置要求
- Node.js 16+ 
- npm 或 yarn

#### 步骤

1. **克隆项目**
```bash
cd student-study
```

2. **安装依赖**
```bash
npm install
```

3. **启动开发服务器**
```bash
npm run dev
```

应用将在 `http://localhost:5173` 运行

### 生产环境部署

#### 构建应用
```bash
npm run build
```

生成的文件将在 `dist/` 目录中

#### 部署到服务器

**使用Nginx反向代理示例：**

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 代理API请求到后端
    location /api/ {
        proxy_pass http://backend-server:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**使用Docker部署：**

```dockerfile
# Dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 后端集成指南

### 连接真实API

修改 `store/authStore.ts` 中的登录函数：

```typescript
login: async (request: LoginRequest) => {
  set({ loading: true });
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) throw new Error('登录失败');
    
    const data = await response.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    set({
      token: data.token,
      user: data.user,
      isAuthenticated: true,
      loading: false,
    });
  } catch (error) {
    set({ loading: false });
    throw error;
  }
},
```

### 环境变量配置

创建 `.env.local` 文件：

```env
VITE_API_BASE_URL=http://your-backend-api.com
VITE_APP_NAME=学生成绩管理系统
```

在代码中使用：

```typescript
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

// 在API调用中
fetch(`${apiBaseUrl}/api/grades`);
```

### HTTP拦截器

创建 `src/utils/http.ts`：

```typescript
import { useAuthStore } from '../store/authStore';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const { token } = useAuthStore.getState();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${apiBaseUrl}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    useAuthStore.getState().logout();
    window.location.href = '/login';
  }

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}
```

## 推荐的后端技术栈

### 使用Express.js和MongoDB

```typescript
// backend/src/routes/auth.ts
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 从数据库查询用户
    const user = await User.findOne({ username });
    
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }
    
    // 生成JWT令牌
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: '登录失败' });
  }
});

export default router;
```

### 使用Python FastAPI

```python
# backend/app/routes/auth.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import jwt
from datetime import timedelta

router = APIRouter()

class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/login")
async def login(request: LoginRequest):
    # 查询用户
    user = await User.find_one({"username": request.username})
    
    if not user or not verify_password(request.password, user.password):
        raise HTTPException(status_code=401, detail="用户名或密码错误")
    
    # 生成访问令牌
    access_token = create_access_token(
        data={"sub": str(user.id), "role": user.role},
        expires_delta=timedelta(hours=24)
    )
    
    return {
        "token": access_token,
        "user": {
            "id": str(user.id),
            "username": user.username,
            "email": user.email,
            "role": user.role,
        }
    }
```

### 使用Java Spring Boot

```java
// LoginController.java
@RestController
@RequestMapping("/api/auth")
public class LoginController {
    
    @Autowired
    private UserService userService;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            User user = userService.findByUsername(request.getUsername());
            
            if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                return ResponseEntity.status(401).body("用户名或密码错误");
            }
            
            String token = jwtTokenProvider.generateToken(user.getId(), user.getRole());
            
            return ResponseEntity.ok(new LoginResponse(
                token,
                new UserDTO(user)
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("登录失败");
        }
    }
}
```

## 数据库迁移脚本

### MongoDB初始化脚本

```javascript
// scripts/init-db.js
const mongoose = require('mongoose');

async function initDatabase() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  // 创建索引
  await User.collection.createIndex({ username: 1 }, { unique: true });
  await Course.collection.createIndex({ courseId: 1 }, { unique: true });
  await Grade.collection.createIndex({ studentId: 1, courseId: 1 }, { unique: true });
  
  // 插入初始数据
  const defaultCourses = [
    { courseId: 'C001', courseName: '数据结构', credits: 3, ... },
    // 更多课程数据
  ];
  
  await Course.insertMany(defaultCourses);
  
  console.log('数据库初始化完成');
}

initDatabase().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
```

## 安全配置

### CORS配置

```typescript
// 后端
import cors from 'cors';

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

### JWT配置

```typescript
// 中间件
export function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: '未授权' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: '令牌无效' });
  }
}
```

## 常见问题

### Q: 如何处理CORS问题?
A: 在后端配置CORS中间件，允许前端域名访问。

### Q: 如何使用HTTPS?
A: 在生产环境使用SSL证书，可以使用Let's Encrypt免费获取。

### Q: 如何扩展系统功能?
A: 参考`开发指南`部分，添加新页面和API端点。

### Q: 如何备份数据?
A: 使用数据库的内置备份工具或定期导出数据。

## 性能优化

1. **代码分割**: 使用React.lazy()进行路由级别的代码分割
2. **图片优化**: 使用WebP格式并压缩图像
3. **缓存策略**: 设置适当的HTTP缓存头
4. **数据库索引**: 为常用查询字段创建索引
5. **API分页**: 实现分页以减少数据传输量

## 监控和日志

推荐使用以下工具：

- **前端监控**: Sentry
- **日志管理**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **性能监控**: New Relic 或 DataDog
- **应用性能**: Prometheus + Grafana

## 获取支持

如有问题，请：

1. 查阅项目文档
2. 搜索相关GitHub Issues
3. 提交新的Issue详述问题和复现步骤
4. 联系项目维护者

---

最后更新: 2024年11月2日
