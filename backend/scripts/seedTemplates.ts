import { Sequelize } from 'sequelize';
import 'dotenv/config';

// 创建数据库连接
const sequelize = new Sequelize(
  process.env.DB_NAME || 'student_grade_system',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    dialect: 'mysql',
    logging: false
  }
);

// 默认模板数据
const defaultTemplates = [
  {
    template_name: '月考成绩标准分析',
    description: '适用于每月考试的标准成绩分析，包含分数分布、学生分层和提分建议',
    analysis_dimensions: JSON.stringify(['分数分布', '学生分层', '提分建议']),
    default_prompt: '本次月考主要分析重点：关注80分以下学生的知识薄弱环节，提供具体的改进建议',
    is_global: true
  },
  {
    template_name: '期中考试全面分析',
    description: '期中考试深度分析，包含知识点薄弱项和历史对比',
    analysis_dimensions: JSON.stringify(['分数分布', '知识点薄弱项', '学生分层', '历史成绩对比', '提分建议']),
    default_prompt: '期中考试分析要求：1. 对比开学初的成绩变化；2. 找出班级共性的薄弱知识点；3. 为不同层次学生制定提升计划',
    is_global: true
  },
  {
    template_name: '期末考试总结分析',
    description: '期末考试全面总结，包含所有维度的深度分析',
    analysis_dimensions: JSON.stringify(['分数分布', '知识点薄弱项', '学生分层', '历史成绩对比', '平行班对比', '提分建议']),
    default_prompt: '期末总结分析：全面评估本学期教学效果，分析学生进步情况，总结教学经验，为下学期教学提供参考',
    is_global: true
  },
  {
    template_name: '知识点薄弱项专项分析',
    description: '专注于知识薄弱环节的深度分析',
    analysis_dimensions: JSON.stringify(['分数分布', '知识点薄弱项', '提分建议']),
    default_prompt: '专项分析：重点分析错误率较高的知识点，找出教学中的薄弱环节，提供针对性的强化训练建议',
    is_global: true
  },
  {
    template_name: '快速成绩诊断',
    description: '快速了解班级整体情况的轻量级分析',
    analysis_dimensions: JSON.stringify(['分数分布', '学生分层']),
    default_prompt: '快速诊断：简要分析班级成绩分布，识别需要关注的学生群体',
    is_global: true
  },
  {
    template_name: '平行班对比分析',
    description: '与其他班级的成绩对比分析',
    analysis_dimensions: JSON.stringify(['分数分布', '学生分层', '平行班对比', '提分建议']),
    default_prompt: '对比分析：对比其他平行班级的成绩，找出优势和差距，借鉴优秀教学经验',
    is_global: true
  }
];

async function seedTemplates() {
  try {
    console.log('🔄 开始初始化默认分析模板...');

    // 获取管理员用户ID
    const [users] = await sequelize.query(
      "SELECT id FROM users WHERE role = 'admin' LIMIT 1"
    );

    const adminId = users.length > 0 ? users[0].id : null;

    if (!adminId) {
      console.log('⚠️  警告: 未找到管理员用户，created_by 将设置为 NULL');
    }

    // 检查是否已存在模板
    const [existingTemplates] = await sequelize.query(
      'SELECT COUNT(*) as count FROM analysis_templates WHERE is_global = true'
    );
    const templateCount = existingTemplates[0]?.count || 0;

    if (templateCount > 0) {
      console.log(`✅ 已存在 ${templateCount} 个全局模板，跳过初始化`);
      process.exit(0);
    }

    // 插入默认模板
    for (const template of defaultTemplates) {
      const templateId = crypto.randomUUID();
      await sequelize.query(
        `INSERT INTO analysis_templates (
          id, template_name, description, analysis_dimensions,
          default_prompt, is_global, created_by, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        {
          replacements: [
            templateId,
            template.template_name,
            template.description,
            template.analysis_dimensions,
            template.default_prompt,
            template.is_global,
            adminId
          ]
        }
      );
      console.log(`✅ 创建模板: ${template.template_name}`);
    }

    console.log('✨ 默认分析模板初始化完成！');
    process.exit(0);

  } catch (error) {
    console.error('❌ 初始化失败:', error);
    process.exit(1);
  }
}

// 运行脚本
seedTemplates();
