# AI 分析功能测试指南

## ✅ 已完成的配置

### 1. 依赖安装
- ✅ 后端安装了 `axios`
- ✅ 后端配置了 Kimi API 密钥在 `.env` 文件中

### 2. 数据库表
启动后端时，以下表会自动创建：
- ✅ `api_configs` - API 配置
- ✅ `analysis_records` - 分析记录
- ✅ `analysis_templates` - 分析模板

### 3. 路由和控制器
- ✅ `/api/ai-analysis/config` - API 配置管理
- ✅ `/api/ai-analysis/stats` - 统计信息
- ✅ `/api/ai-analysis/analyze` - 发起分析
- ✅ `/api/ai-analysis/records` - 分析记录

## 🚀 启动步骤

### 1. 启动后端
```bash
cd backend
npm start
```

你应该看到：
```
✅ Database connection has been established successfully.
✅ Database models synchronized successfully.
📡 WebSocket server initialized
🚀 Server running at http://localhost:3000
```

### 2. 启动前端
```bash
cd student-study
npm run dev
```

### 3. 测试 AI 分析
1. 登录教师账号
2. 点击左侧菜单 "AI成绩分析"
3. 选择一门课程
4. 至少选择一个分析维度（勾选）
5. 点击 "发起AI分析"

## 📊 预期结果

### 成功流程：
1. 按钮显示加载状态
2. 后端调用 Kimi API
3. AI 分析成绩数据
4. 返回结构化报告：
   - 基础数据概览（平均分、及格率等）
   - 分维度分析（分数分布、知识点薄弱项等）
   - 教学建议

5. 自动跳转到 "分析记录" 页面
6. 可以查看详细报告

### 报告示例：
```json
{
  "title": "数据结构成绩分析报告",
  "summary": {
    "totalStudents": 30,
    "average": 78.5,
    "highest": 95,
    "lowest": 45,
    "passRate": 0.87,
    "excellentRate": 0.43
  },
  "dimensions": [
    {
      "name": "分数分布",
      "content": "班级成绩呈正态分布...",
      "suggestions": ["建议1", "建议2"]
    }
  ],
  "overallSuggestions": [
    "建议加强基础知识讲解",
    "建议增加练习次数"
  ]
}
```

## ⚠️ 可能的问题

### 1. 数据库连接失败
检查 `.env` 中的数据库配置：
```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=student_grade_system
DB_USER=root
DB_PASSWORD=123456
```

### 2. API 调用失败
- 检查网络连接
- 确认 Kimi API 密钥有效
- 查看后端日志

### 3. 按钮仍然禁用
- 刷新页面
- 检查后端是否正常运行
- 查看浏览器控制台错误

## 🔧 调试方法

### 查看后端日志
```bash
cd backend
npm start
# 观察控制台输出
```

### 查看前端请求
打开浏览器开发者工具 → Network 标签
- 查看 `/api/ai-analysis/analyze` 请求
- 查看请求和响应内容

### 检查数据库
```sql
-- 查看分析记录
SELECT * FROM analysis_records ORDER BY created_at DESC LIMIT 5;

-- 查看 API 配置
SELECT * FROM api_configs WHERE is_active = 1;
```

## 💡 快速测试

如果只想快速测试 API 是否工作：

### 在浏览器控制台测试
```javascript
// 1. 登录后，在控制台执行
const token = localStorage.getItem('token');

// 2. 测试发起分析
fetch('http://localhost:3000/api/ai-analysis/analyze', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    courseIds: ['COU001'],
    courseNames: ['数据结构'],
    examType: '期中考试',
    analysisDimensions: ['分数分布', '知识点薄弱项'],
    customInstruction: '重点分析低分学生'
  })
})
.then(r => r.json())
.then(data => console.log(data));
```

现在重启后端服务，应该就能正常使用 AI 分析功能了！🎉
