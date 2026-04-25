-- 创建默认的AI分析模板
-- 这些模板会在系统初始化时自动插入

-- 插入系统全局模板
INSERT INTO analysis_templates (
  id,
  template_name,
  description,
  analysis_dimensions,
  default_prompt,
  is_global,
  created_by,
  created_at,
  updated_at
) VALUES
-- 1. 月考成绩分析模板
(
  UUID(),
  '月考成绩标准分析',
  '适用于每月考试的标准成绩分析，包含分数分布、学生分层和提分建议',
  '["分数分布", "学生分层", "提分建议"]',
  '本次月考主要分析重点：关注80分以下学生的知识薄弱环节，提供具体的改进建议',
  true,
  (SELECT id FROM users WHERE role = 'admin' LIMIT 1),
  NOW(),
  NOW()
),

-- 2. 期中考试全面分析模板
(
  UUID(),
  '期中考试全面分析',
  '期中考试深度分析，包含知识点薄弱项和历史对比',
  '["分数分布", "知识点薄弱项", "学生分层", "历史成绩对比", "提分建议"]',
  '期中考试分析要求：1. 对比开学初的成绩变化；2. 找出班级共性的薄弱知识点；3. 为不同层次学生制定提升计划',
  true,
  (SELECT id FROM users WHERE role = 'admin' LIMIT 1),
  NOW(),
  NOW()
),

-- 3. 期末考试总结分析模板
(
  UUID(),
  '期末考试总结分析',
  '期末考试全面总结，包含所有维度的深度分析',
  '["分数分布", "知识点薄弱项", "学生分层", "历史成绩对比", "平行班对比", "提分建议"]',
  '期末总结分析：全面评估本学期教学效果，分析学生进步情况，总结教学经验，为下学期教学提供参考',
  true,
  (SELECT id FROM users WHERE role = 'admin' LIMIT 1),
  NOW(),
  NOW()
),

-- 4. 专项突破分析模板
(
  UUID(),
  '知识点薄弱项专项分析',
  '专注于知识薄弱环节的深度分析',
  '["分数分布", "知识点薄弱项", "提分建议"]',
  '专项分析：重点分析错误率较高的知识点，找出教学中的薄弱环节，提供针对性的强化训练建议',
  true,
  (SELECT id FROM users WHERE role = 'admin' LIMIT 1),
  NOW(),
  NOW()
),

-- 5. 快速诊断模板
(
  UUID(),
  '快速成绩诊断',
  '快速了解班级整体情况的轻量级分析',
  '["分数分布", "学生分层"]',
  '快速诊断：简要分析班级成绩分布，识别需要关注的学生群体',
  true,
  (SELECT id FROM users WHERE role = 'admin' LIMIT 1),
  NOW(),
  NOW()
),

-- 6. 平行班对比分析模板
(
  UUID(),
  '平行班对比分析',
  '与其他班级的成绩对比分析',
  '["分数分布", "学生分层", "平行班对比", "提分建议"]',
  '对比分析：对比其他平行班级的成绩，找出优势和差距，借鉴优秀教学经验',
  true,
  (SELECT id FROM users WHERE role = 'admin' LIMIT 1),
  NOW(),
  NOW()
);

-- 创建教师个人模板示例
-- 教师登录后可以基于这些模板创建自己的版本
