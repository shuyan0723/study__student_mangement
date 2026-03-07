# API 测试示例

本文档提供了常见API操作的curl命令示例，用于快速测试后端服务。

## 基础设置

### 服务器地址
```
http://localhost:3000
```

### 认证方式
所有需要认证的请求都需要在请求头中包含JWT token：
```
Authorization: Bearer <your_access_token>
```

## 1. 健康检查

```bash
curl http://localhost:3000/api/health
```

**响应示例:**
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "timestamp": "2024-03-07T12:00:00.000Z",
    "version": "1.0.0",
    "environment": "development"
  },
  "message": "Server is running"
}
```

## 2. 用户认证

### 2.1 登录

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "123456"
  }'
```

**响应示例:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user-uuid",
      "username": "admin",
      "email": "admin@example.com",
      "role": "admin",
      "avatar_url": null
    },
    "expiresIn": 900000
  },
  "message": "Login successful"
}
```

### 2.2 刷新令牌

```bash
curl -X POST http://localhost:3000/api/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "your_refresh_token_here"
  }'
```

### 2.3 登出

```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer your_access_token_here"
```

## 3. 学生管理

### 3.1 获取所有学生

```bash
curl -X GET "http://localhost:3000/api/students?page=1&limit=10" \
  -H "Authorization: Bearer your_access_token_here"
```

### 3.2 获取学生详情

```bash
curl -X GET "http://localhost:3000/api/students/student-uuid-here" \
  -H "Authorization: Bearer your_access_token_here"
```

### 3.3 创建学生（仅管理员）

```bash
curl -X POST http://localhost:3000/api/students \
  -H "Authorization: Bearer your_access_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": "S004",
    "name": "测试学生",
    "username": "student04",
    "email": "student04@example.com",
    "password": "123456",
    "gender": "male",
    "college": "计算机学院",
    "major": "计算机科学与技术"
  }'
```

### 3.4 更新学生信息

```bash
curl -X PUT "http://localhost:3000/api/students/student-uuid-here" \
  -H "Authorization: Bearer your_access_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "13800138000",
    "home_address": "北京市海淀区"
  }'
```

## 4. 教师管理

### 4.1 获取所有教师

```bash
curl -X GET "http://localhost:3000/api/teachers?page=1&limit=10" \
  -H "Authorization: Bearer your_access_token_here"
```

### 4.2 获取教师详情

```bash
curl -X GET "http://localhost:3000/api/teachers/teacher-uuid-here" \
  -H "Authorization: Bearer your_access_token_here"
```

### 4.3 获取教师的课程

```bash
curl -X GET "http://localhost:3000/api/teachers/teacher-uuid-here/courses" \
  -H "Authorization: Bearer your_access_token_here"
```

## 5. 课程管理

### 5.1 获取所有课程

```bash
curl -X GET "http://localhost:3000/api/courses?page=1&limit=10&semester=2024-1" \
  -H "Authorization: Bearer your_access_token_here"
```

### 5.2 获取课程详情

```bash
curl -X GET "http://localhost:3000/api/courses/course-uuid-here" \
  -H "Authorization: Bearer your_access_token_here"
```

### 5.3 创建课程（管理员/教师）

```bash
curl -X POST http://localhost:3000/api/courses \
  -H "Authorization: Bearer your_access_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "course_id": "CS103",
    "course_name": "计算机网络",
    "credits": 3.5,
    "hours": 56,
    "semester": "2024-1",
    "capacity": 80,
    "description": "计算机网络基础课程"
  }'
```

## 6. 成绩管理

### 6.1 获取所有成绩

```bash
curl -X GET "http://localhost:3000/api/grades?page=1&limit=10" \
  -H "Authorization: Bearer your_access_token_here"
```

### 6.2 获取学生成绩（学生本人）

```bash
curl -X GET "http://localhost:3000/api/grades/student/me" \
  -H "Authorization: Bearer your_access_token_here"
```

### 6.3 获取课程成绩（教师）

```bash
curl -X GET "http://localhost:3000/api/grades/course/course-uuid-here" \
  -H "Authorization: Bearer your_access_token_here"
```

### 6.4 创建成绩

```bash
curl -X POST http://localhost:3000/api/grades \
  -H "Authorization: Bearer your_access_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": "student-uuid-here",
    "course_id": "course-uuid-here",
    "score": 85.5,
    "feedback": "表现良好，继续努力！",
    "submission_status": "graded"
  }'
```

### 6.5 批量更新成绩

```bash
curl -X POST http://localhost:3000/api/grades/batch \
  -H "Authorization: Bearer your_access_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "grades": [
      {
        "id": "grade-uuid-1",
        "score": 90
      },
      {
        "id": "grade-uuid-2",
        "score": 88
      }
    ]
  }'
```

### 6.6 获取成绩统计

```bash
curl -X GET "http://localhost:3000/api/grades/statistics?course_id=course-uuid-here" \
  -H "Authorization: Bearer your_access_token_here"
```

## 7. 消息管理

### 7.1 获取所有消息

```bash
curl -X GET "http://localhost:3000/api/messages?page=1&limit=20" \
  -H "Authorization: Bearer your_access_token_here"
```

### 7.2 获取未读消息数

```bash
curl -X GET "http://localhost:3000/api/messages/unread-count" \
  -H "Authorization: Bearer your_access_token_here"
```

### 7.3 发送消息

```bash
curl -X POST http://localhost:3000/api/messages \
  -H "Authorization: Bearer your_access_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "receiver_id": "user-uuid-here",
    "content": "您好，请问什么时候可以查看成绩？"
  }'
```

### 7.4 获取对话历史

```bash
curl -X GET "http://localhost:3000/api/messages/conversation/user-uuid-here" \
  -H "Authorization: Bearer your_access_token_here"
```

### 7.5 标记消息已读

```bash
curl -X PUT "http://localhost:3000/api/messages/message-uuid-here/read" \
  -H "Authorization: Bearer your_access_token_here"
```

## 8. 申诉管理

### 8.1 获取所有申诉

```bash
curl -X GET "http://localhost:3000/api/appeals?page=1&limit=10&status=pending" \
  -H "Authorization: Bearer your_access_token_here"
```

### 8.2 创建申诉

```bash
curl -X POST http://localhost:3000/api/appeals \
  -H "Authorization: Bearer your_access_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "course_id": "course-uuid-here",
    "original_score": 85,
    "appeal_reason": "我认为我的期末考试应该得到更高的分数，因为我在论述题中提供了充分的论据和实例。"
  }'
```

### 8.3 更新申诉状态（教师/管理员）

```bash
curl -X PUT "http://localhost:3000/api/appeals/appeal-uuid-here/status" \
  -H "Authorization: Bearer your_access_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "approved",
    "new_score": 90,
    "review_feedback": "经复核，同意提高成绩。论述部分确实提供了很好的论据。"
  }'
```

## 9. 错误响应示例

所有错误响应都遵循统一格式：

```json
{
  "success": false,
  "error": "ERROR_CODE",
  "message": "错误描述信息",
  "details": {}
}
```

常见错误代码：
- `VALIDATION_ERROR`: 请求参数验证失败
- `AUTHENTICATION_FAILED`: 认证失败（token无效或过期）
- `AUTHORIZATION_FAILED`: 授权失败（权限不足）
- `NOT_FOUND`: 资源不存在
- `INTERNAL_SERVER_ERROR`: 服务器内部错误

## 10. 使用Postman测试

### 导入环境变量

创建一个Postman环境，包含以下变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `base_url` | `http://localhost:3000` | API基础URL |
| `access_token` | `{{login_response.data.data.accessToken}}` | 访问令牌（自动从登录响应获取） |

### 设置自动认证

在Postman集合级别设置Pre-request Script：

```javascript
// 获取环境变量中的token
const token = pm.environment.get("access_token");

// 如果有token，添加到请求头
if (token) {
  pm.request.headers.add({
    key: "Authorization",
    value: `Bearer ${token}`
  });
}
```

### 测试脚本示例

在登录请求的Tests标签中添加：

```javascript
// 检查响应状态
pm.test("Status code is 200", function () {
  pm.response.to.have.status(200);
});

// 检查响应结构
pm.test("Response has correct structure", function () {
  const jsonData = pm.response.json();
  pm.expect(jsonData.success).to.eql(true);
  pm.expect(jsonData.data).to.have.property("accessToken");
  pm.expect(jsonData.data).to.have.property("user");
});

// 保存token到环境变量
if (pm.response.json().success) {
  pm.environment.set("access_token", pm.response.json().data.data.accessToken);
}
```

## 11. 常见使用场景

### 场景1: 教师给学生录入成绩

1. 首先登录获取token（使用teacher01账号）
2. 获取课程列表，找到课程ID
3. 获取课程的学生列表
4. 为学生录入成绩

### 场景2: 学生查看成绩和发起申诉

1. 首先登录获取token（使用student01账号）
2. 查看个人成绩
3. 对某门课程发起申诉
4. 查看申诉状态

### 场景3: 管理员管理用户

1. 首先登录获取token（使用admin账号）
2. 创建新的学生或教师账号
3. 分配课程给教师
4. 查看系统统计信息

## 注意事项

1. ⚠️ 所有测试中的 `your_access_token_here` 都需要替换为实际的访问令牌
2. ⚠️ 所有的 `uuid-here` 都需要替换为实际的资源ID
3. ⚠️ 某些操作需要特定的角色权限（如创建学生需要管理员权限）
4. ⚠️ Access token通常在15分钟后过期，需要使用refresh token刷新
5. ⚠️ 在生产环境中，请确保使用HTTPS协议

希望这些示例能帮助你快速测试和使用API！
