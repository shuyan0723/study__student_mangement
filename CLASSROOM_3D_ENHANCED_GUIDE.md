# 3D教室场景增强功能 - 使用指南

## ✅ 已完成功能列表

### 1. 360度视角控制
- ✅ **鼠标拖拽旋转** - 按住鼠标左键拖动可360度旋转视角
- ✅ **滚轮缩放** - 使用鼠标滚轮可以放大/缩小场景
- ✅ **预设视角** - 提供多个快捷视角按钮
  - 重置视角 - 恢复默认视角
  - 俯视图 - 从上方查看整个教室
  - 教师视角 - 从讲台视角查看学生
- ✅ **平滑控制** - 启用了阻尼效果，操作更流畅

### 2. 学生活动状态（7种状态）

| 状态 | 图标 | 颜色 | 描述 | 动画效果 |
|------|------|------|------|----------|
| 正在听课 | 👂 | 绿色 | 专注听讲中 | 轻微呼吸效果 |
| 正在提问 | 🙋 | 蓝色 | 举手提问 | 上下举手运动 |
| 正在做笔记 | ✍️ | 黄色 | 记录重点 | 轻微晃动写字 |
| 走神/分心 | 😴 | 红色 | 需要提醒 | 低垂状态 |
| 小组讨论 | 💬 | 紫色 | 与同学交流 | 正常状态 |
| 有疑惑 | ❓ | 橙色 | 需要帮助 | 左右摇头 |
| 理解点头 | ✅ | 青色 | 明白了 | 点头动作 |

### 3. 点击学生查看详情
- ✅ **点击检测** - 点击3D场景中的学生球体查看详情
- ✅ **详情弹窗** - 显示学生完整信息
  - 基本信息（学号、姓名）
  - 当前状态和图标
  - 活动持续时间
  - 参与度评分（带进度条）
  - 活动统计（提问次数、做笔记次数、分心次数）
- ✅ **智能建议** - 根据学生状态提供教学建议
  - 分心学生：提醒需要吸引注意力
  - 疑惑学生：建议提供额外帮助

### 4. 真实教室布局
- ✅ **教室结构**
  - 地板（50x40单位）
  - 后墙（带黑板）
  - 前墙（带门和窗户）
  - 左右侧墙
  - 讲台和教师位置
- ✅ **学生区域**
  - 课桌（3x2单位）
  - 椅子（带靠背）
  - 8个学生座位（2行4列）
- ✅ **光照系统**
  - 环境光
  - 定向光（带阴影）
  - 点光源（蓝色和绿色）
- ✅ **阴影效果** - 启用PCF软阴影

### 5. 实时数据展示
- ✅ **顶部统计卡片**
  - 总互动次数
  - 活跃学生数
  - 平均参与度
  - 提问数
- ✅ **学生活动列表**
  - 按参与度排序
  - 实时状态标签
  - 参与度进度条
  - 点击可查看详情

### 6. 互动连线
- ✅ **学生讨论连线** - 正在讨论的学生之间显示紫色虚线
- ✅ **动态效果** - 连线会随学生位置自动更新

## 🎮 操作指南

### 基本操作
1. **旋转视角**：按住鼠标左键拖动
2. **缩放场景**：滚动鼠标滚轮
3. **平移视角**：按住鼠标右键拖动
4. **查看学生详情**：点击3D场景中的学生球体

### 视角切换
- 点击右上角的视角按钮快速切换
  - **重置视角**：恢复到默认位置
  - **俯视图**：从正上方查看教室布局
  - **教师视角**：站在讲台位置查看学生

### 学生状态识别
- 观察学生头顶的图标了解当前活动
- 查看学生球体颜色判断状态
  - 绿色：良好状态
  - 蓝色：积极参与
  - 黄色：中性状态
  - 红色：需要关注
  - 橙色：需要帮助
  - 紫色：小组讨论
  - 青色：理解状态

## 📊 数据结构

```typescript
interface StudentActivity {
  studentId: string;           // 学生ID
  name: string;                // 姓名
  studentIdNumber: string;     // 学号
  currentActivity: ActivityType; // 当前活动状态
  activityStartTime: string;   // 活动开始时间
  activityDuration: number;    // 活动持续时间（分钟）
  participationScore: number;  // 参与度评分（0-100）
  questionCount: number;       // 提问次数
  noteTakingCount: number;     // 做笔记次数
  distractedCount: number;     // 分心次数
  position: { x, y, z };       // 3D位置坐标
  status: 'active' | 'idle' | 'away'; // 在线状态
  lastActive: string;          // 最后活跃时间
}
```

## 🔧 技术特性

### Three.js 功能
- ✅ WebGL渲染器（抗锯齿）
- ✅ 透视相机（FOV 60度）
- ✅ OrbitControls（轨道控制）
- ✅ Raycaster（射线检测）
- ✅ 阴影贴图（2048x2048）
- ✅ 纹理和材质（Phong材质）
- ✅ 几何体（球体、立方体、平面）
- ✅ 精灵（学生活动图标）
- ✅ 线条（互动连线）
- ✅ 动画循环（60fps）

### React 集成
- ✅ 函数式组件 + Hooks
- ✅ useRef 存储Three.js对象
- ✅ useEffect 初始化和清理
- ✅ useCallback 优化性能
- ✅ useState 管理状态
- ✅ 响应式设计

### 性能优化
- ✅ 条件渲染（isClient检查）
- ✅ 内存清理（useEffect返回函数）
- ✅ 阴影优化（PCF软阴影）
- ✅ 几何体复用
- ✅ 材质共享

## 🚀 未来扩展

### 建议增强功能
1. **WebSocket实时更新**
   - 连接后端WebSocket获取实时学生状态
   - 自动更新学生活动状态
   - 实时推送课堂互动数据

2. **历史数据回放**
   - 保存课堂录像数据
   - 时间轴控制回放
   - 速度调节（0.5x, 1x, 2x）

3. **多人协作**
   - 支持多个教师同时观看
   - 实时标注功能
   - 语音/文字聊天

4. **数据导出**
   - 导出学生参与度报告
   - 生成课堂分析图表
   - PDF报告导出

5. **AI分析集成**
   - 自动识别异常行为
   - 智能提醒和建议
   - 预测学生表现趋势

## 📝 使用示例

### 更新学生状态
```typescript
setStudentActivities(prev => prev.map(student =>
  student.studentId === '1'
    ? { ...student, currentActivity: 'questioning' }
    : student
));
```

### 添加新学生
```typescript
setStudentActivities(prev => [...prev, {
  studentId: '9',
  name: '新学生',
  studentIdNumber: '2024009',
  currentActivity: 'listening',
  // ... 其他字段
}]);
```

### 切换到特定视角
```typescript
changeView('teacher'); // 教师视角
changeView('top');     // 俯视图
changeView('front');   // 正面视角
```

## 🐛 故障排除

### 问题1：场景不显示
- 检查是否已安装 `three` 包
- 确认浏览器支持WebGL
- 查看控制台错误信息

### 问题2：点击无反应
- 确认已点击到学生球体上
- 检查raycaster初始化
- 验证学生数据是否正确

### 问题3：性能卡顿
- 减少学生数量
- 降低阴影质量
- 关闭不必要的动画

## 📚 相关文件

- **主组件**: `student-study/src/pages/teacher/Classroom3DScene.tsx`
- **类型定义**: 在组件文件中导出 `StudentActivity` 和 `StudentActivityType`
- **路由配置**: `student-study/src/routes/teacherRoutes.tsx`
- **依赖包**: `three@latest`, `@types/three`

## 🎓 学习资源

- Three.js官方文档: https://threejs.org/docs/
- OrbitControls文档: https://threejs.org/docs/#examples/en/controls/OrbitControls
- React + Three.js教程: https://docs.pmnd.rs/react-three-fiber/getting-started

---

**版本**: 1.0.0
**更新时间**: 2024-03-24
**开发者**: Claude Code AI Assistant
