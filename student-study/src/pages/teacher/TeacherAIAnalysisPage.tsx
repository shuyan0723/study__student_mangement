import { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Select,
  Button,
  Checkbox,
  Input,
  message,
  Row,
  Col,
  Statistic,
  Progress,
  Space,
  Divider,
  Alert,
  Spin,
  Tag
} from 'antd';
import { ThunderboltOutlined, BarChartOutlined, FileTextOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDataStore } from '../../store/dataStore';
import { useAuthStore } from '../../store/authStore';
import type { AnalysisStats, AnalysisRequest, AnalysisTemplate } from '../../types';

const { TextArea } = Input;
const { Option } = Select;

export const TeacherAIAnalysisPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { courses } = useDataStore();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<AnalysisStats | null>(null);
  const [templates, setTemplates] = useState<AnalysisTemplate[]>([]);

  // 获取教师的课程
  const teacherCourses = courses.filter((c) => c.teacherId === user?.id);

  // 分析维度选项
  const dimensionOptions = [
    { label: '分数分布', value: '分数分布', description: '平均分、最高分、最低分、及格率、优秀率等' },
    { label: '知识点薄弱项', value: '知识点薄弱项', description: '按错误率分析学生的知识薄弱点' },
    { label: '学生分层', value: '学生分层', description: '优秀、中等、待提升学生的分布情况' },
    { label: '历史成绩对比', value: '历史成绩对比', description: '与上次考试成绩的对比分析' },
    { label: '平行班对比', value: '平行班对比', description: '与其他班级的成绩对比' },
    { label: '提分建议', value: '提分建议', description: '针对不同层次学生的提分建议' }
  ];

  // 加载统计数据和模板
  useEffect(() => {
    loadStats();
    loadTemplates();
  }, []);

  // 处理从模板页面跳转过来的情况
  useEffect(() => {
    if (templates.length > 0) {
      const selectedTemplateId = sessionStorage.getItem('selectedTemplateId');
      if (selectedTemplateId) {
        const template = templates.find(t => t.id === selectedTemplateId);
        if (template) {
          const dimensions = typeof template.analysisDimensions === 'string'
            ? JSON.parse(template.analysisDimensions)
            : template.analysisDimensions;
          form.setFieldsValue({
            analysisDimensions: dimensions,
            customInstruction: template.defaultPrompt || ''
          });
          message.success(`已应用模板：${template.templateName}`);
          sessionStorage.removeItem('selectedTemplateId');
        }
      }
    }
  }, [templates, form]);

  const loadTemplates = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ai-analysis/templates`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setTemplates(data.data);
      }
    } catch (error) {
      console.error('加载模板失败:', error);
    }
  };

  const handleTemplateChange = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      const dimensions = typeof template.analysisDimensions === 'string'
        ? JSON.parse(template.analysisDimensions)
        : template.analysisDimensions;
      form.setFieldsValue({
        analysisDimensions: dimensions,
        customInstruction: template.defaultPrompt || ''
      });
      message.success(`已应用模板：${template.templateName}`);
    }
  };

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ai-analysis/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      } else {
        // 如果API未配置或失败，设置默认值
        console.warn('加载统计数据失败，使用默认值:', data.message);
        setStats({
          todayCount: 0,
          monthCount: 0,
          dailyLimit: 10,
          monthlyLimit: 100,
          remainingToday: 10,
          remainingMonth: 100
        });
      }
    } catch (error) {
      console.error('加载统计数据失败:', error);
      // 设置默认值，确保功能可用
      setStats({
        todayCount: 0,
        monthCount: 0,
        dailyLimit: 10,
        monthlyLimit: 100,
        remainingToday: 10,
        remainingMonth: 100
      });
    }
  };

  const handleSubmitAnalysis = async (values: any) => {
    if (!values.courseIds || values.courseIds.length === 0) {
      message.error('请至少选择一门课程');
      return;
    }

    if (!values.analysisDimensions || values.analysisDimensions.length === 0) {
      message.error('请至少选择一个分析维度');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');

      // 构建课程名称数组
      const selectedCourses = teacherCourses.filter(c => values.courseIds.includes(c.id));
      const courseNames = selectedCourses.map(c => c.courseName);

      const requestData: AnalysisRequest = {
        courseIds: values.courseIds,
        courseNames,
        examType: values.examType,
        analysisDimensions: values.analysisDimensions,
        customInstruction: values.customInstruction
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ai-analysis/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
      });

      const data = await response.json();

      if (data.success) {
        message.success('AI分析已发起，请在分析记录中查看结果');
        navigate('/teacher/analysis-records');
      } else {
        if (data.error === 'QUOTA_EXCEEDED') {
          message.error('今日API调用次数已达上限，请明天再试');
        } else {
          message.error(data.message || '发起分析失败');
        }
      }
    } catch (error) {
      message.error('发起分析失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={24}>
        {/* 左侧：统计信息 */}
        <Col span={6}>
          <Card>
            <Statistic
              title="今日剩余次数"
              value={stats?.remainingToday || 0}
              suffix={`/ ${stats?.dailyLimit || 10}`}
              prefix={<ThunderboltOutlined />}
              valueStyle={{ color: stats?.remainingToday === 0 ? '#ff4d4f' : '#3f8600' }}
            />
            <Progress
              percent={stats ? Math.round((stats.remainingToday / stats.dailyLimit) * 100) : 100}
              showInfo={false}
              strokeColor={stats?.remainingToday === 0 ? '#ff4d4f' : '#3f8600'}
              style={{ marginTop: 16 }}
            />
          </Card>

          <Card style={{ marginTop: 16 }}>
            <Statistic
              title="本月剩余次数"
              value={stats?.remainingMonth || 0}
              suffix={`/ ${stats?.monthlyLimit || 100}`}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>

        {/* 右侧：分析发起表单 */}
        <Col span={18}>
          <Card title="发起AI成绩分析">
            <Alert
              message="AI分析功能说明"
              description="系统将调用Kimi大模型对选定课程的成绩数据进行智能分析，生成包含分数分布、知识点薄弱项、学生分层、教学建议等多维度分析报告。"
              type="info"
              showIcon
              style={{ marginBottom: 24 }}
            />

            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmitAnalysis}
            >
              {/* 选择课程 */}
              <Form.Item
                label="选择课程"
                name="courseIds"
                rules={[{ required: true, message: '请至少选择一门课程' }]}
              >
                <Select
                  mode="multiple"
                  placeholder="请选择要分析的课程"
                  maxTagCount={3}
                  disabled={loading}
                >
                  {teacherCourses.map(course => (
                    <Option key={course.id} value={course.id}>
                      {course.courseName} ({course.semester})
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              {/* 考试类型 */}
              <Form.Item
                label="考试类型"
                name="examType"
              >
                <Select placeholder="请选择考试类型（可选）" disabled={loading} allowClear>
                  <Option value="月考">月考</Option>
                  <Option value="期中考试">期中考试</Option>
                  <Option value="期末考试">期末考试</Option>
                  <Option value="单元测试">单元测试</Option>
                  <Option value="其他">其他</Option>
                </Select>
              </Form.Item>

              {/* 使用模板 */}
              {templates.length > 0 && (
                <Form.Item label="使用分析模板">
                  <Select
                    placeholder="选择模板快速填充分析配置（可选）"
                    allowClear
                    disabled={loading}
                    onChange={handleTemplateChange}
                  >
                    {templates.map(template => (
                      <Option key={template.id} value={template.id}>
                        {template.isGlobal && <Tag color="blue">系统</Tag>}
                        {!template.isGlobal && <Tag color="green">我的</Tag>}
                        {template.templateName}
                        {template.description && ` - ${template.description}`}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              )}

              {/* 分析维度 */}
              <Form.Item
                label="分析维度"
                name="analysisDimensions"
                rules={[{ required: true, message: '请至少选择一个分析维度' }]}
              >
                <Checkbox.Group style={{ width: '100%' }}>
                  <Row>
                    {dimensionOptions.map(dim => (
                      <Col span={12} key={dim.value}>
                        <Checkbox value={dim.value} disabled={loading}>
                          <Space direction="vertical" size={0}>
                            <span>{dim.label}</span>
                            <span style={{ fontSize: 12, color: '#999' }}>
                              {dim.description}
                            </span>
                          </Space>
                        </Checkbox>
                      </Col>
                    ))}
                  </Row>
                </Checkbox.Group>
              </Form.Item>

              {/* 自定义分析指令 */}
              <Form.Item
                label="自定义分析要求"
                name="customInstruction"
                extra="可选：可以输入更具体的分析要求，最多500字"
              >
                <TextArea
                  rows={4}
                  placeholder="例如：重点分析80分以下学生的几何知识点掌握情况，并给出针对性辅导建议"
                  maxLength={500}
                  showCount
                  disabled={loading}
                />
              </Form.Item>

              <Divider />

              <Form.Item>
                <Space wrap>
                  <Button
                    type="primary"
                    icon={<BarChartOutlined />}
                    htmlType="submit"
                    loading={loading}
                    disabled={stats ? stats.remainingToday <= 0 : false}
                  >
                    发起AI分析
                  </Button>
                  <Button onClick={() => navigate('/teacher/analysis-records')}>
                    查看分析记录
                  </Button>
                  <Button onClick={() => navigate('/teacher/analysis-templates')}>
                    管理模板
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TeacherAIAnalysisPage;
