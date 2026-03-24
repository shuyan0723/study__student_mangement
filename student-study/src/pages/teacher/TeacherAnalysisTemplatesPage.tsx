import { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Tag,
  Space,
  Modal,
  Form,
  Input,
  Checkbox,
  message,
  Popconfirm,
  Tooltip,
  Row,
  Col,
  Alert,
  Descriptions,
  Typography
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, GlobalOutlined, UserOutlined, EyeOutlined, ThunderboltOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { AnalysisTemplate } from '../../types';
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;
const { Text, Paragraph } = Typography;

export const TeacherAnalysisTemplatesPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState<AnalysisTemplate[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<AnalysisTemplate | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<AnalysisTemplate | null>(null);
  const [form] = Form.useForm();

  // 分析维度选项
  const dimensionOptions = [
    { label: '分数分布', value: '分数分布', description: '平均分、最高分、最低分、及格率、优秀率等' },
    { label: '知识点薄弱项', value: '知识点薄弱项', description: '按错误率分析学生的知识薄弱点' },
    { label: '学生分层', value: '学生分层', description: '优秀、中等、待提升学生的分布情况' },
    { label: '历史成绩对比', value: '历史成绩对比', description: '与上次考试成绩的对比分析' },
    { label: '平行班对比', value: '平行班对比', description: '与其他班级的成绩对比' },
    { label: '提分建议', value: '提分建议', description: '针对不同层次学生的提分建议' }
  ];

  useEffect(() => {
    loadTemplates();
  }, []);

  const handlePreview = (template: AnalysisTemplate) => {
    setPreviewTemplate(template);
    setPreviewVisible(true);
  };

  const handleUseTemplate = (template: AnalysisTemplate) => {
    // 保存选中的模板到sessionStorage，在AI分析页面使用
    sessionStorage.setItem('selectedTemplateId', template.id);
    message.success(`已选择模板"${template.templateName}"，即将跳转到分析页面`);
    setTimeout(() => {
      navigate('/teacher/ai-analysis');
    }, 500);
  };

  const loadTemplates = async () => {
    setLoading(true);
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
      message.error('加载模板失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingTemplate(null);
    form.resetFields();
    form.setFieldsValue({
      analysisDimensions: ['分数分布', '学生分层', '提分建议']
    });
    setModalVisible(true);
  };

  const handleEdit = (template: AnalysisTemplate) => {
    setEditingTemplate(template);
    form.setFieldsValue({
      templateName: template.templateName,
      description: template.description,
      analysisDimensions: template.analysisDimensions,
      defaultPrompt: template.defaultPrompt
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ai-analysis/templates/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();

      if (data.success) {
        message.success('模板删除成功');
        loadTemplates();
      } else {
        message.error(data.message || '删除失败');
      }
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const token = localStorage.getItem('token');
      const url = editingTemplate
        ? `${import.meta.env.VITE_API_URL}/api/ai-analysis/templates/${editingTemplate.id}`
        : `${import.meta.env.VITE_API_URL}/api/ai-analysis/templates`;

      const response = await fetch(url, {
        method: editingTemplate ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...values,
          isGlobal: false // 教师只能创建个人模板
        })
      });

      const data = await response.json();

      if (data.success) {
        message.success(editingTemplate ? '模板更新成功' : '模板创建成功');
        setModalVisible(false);
        loadTemplates();
      } else {
        message.error(data.message || '操作失败');
      }
    } catch (error) {
      message.error('操作失败');
    }
  };

  const columns: ColumnsType<AnalysisTemplate> = [
    {
      title: '模板名称',
      dataIndex: 'templateName',
      key: 'templateName',
      width: 200,
      render: (text: string, record) => (
        <Space>
          {record.isGlobal ? <GlobalOutlined style={{ color: '#1890ff' }} /> : <UserOutlined />}
          {text}
        </Space>
      )
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text: string) => text || '-'
    },
    {
      title: '分析维度',
      dataIndex: 'analysisDimensions',
      key: 'analysisDimensions',
      ellipsis: true,
      render: (dimensions: string) => {
        const dims = typeof dimensions === 'string' ? JSON.parse(dimensions) : dimensions;
        return (
          <Space wrap>
            {dims.map((d: string) => (
              <Tag key={d} color="blue">{d}</Tag>
            ))}
          </Space>
        );
      }
    },
    {
      title: '类型',
      dataIndex: 'isGlobal',
      key: 'isGlobal',
      width: 100,
      render: (isGlobal: boolean) => (
        <Tag color={isGlobal ? 'blue' : 'green'}>
          {isGlobal ? '系统模板' : '我的模板'}
        </Tag>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (text: string) => new Date(text).toLocaleString()
    },
    {
      title: '操作',
      key: 'action',
      width: 280,
      fixed: 'right',
      render: (_: any, record: AnalysisTemplate) => (
        <Space size="small" wrap>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handlePreview(record)}
          >
            预览
          </Button>
          <Button
            type="link"
            size="small"
            icon={<ThunderboltOutlined />}
            onClick={() => handleUseTemplate(record)}
          >
            使用
          </Button>
          {!record.isGlobal && (
            <>
              <Button
                type="link"
                size="small"
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
              >
                编辑
              </Button>
              <Popconfirm
                title="确定要删除这个模板吗？"
                onConfirm={() => handleDelete(record.id)}
                okText="确定"
                cancelText="取消"
              >
                <Button
                  type="link"
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                >
                  删除
                </Button>
              </Popconfirm>
            </>
          )}
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title="分析模板管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            创建模板
          </Button>
        }
      >
        <Alert
          message="模板说明"
          description="创建自定义分析模板可以快速发起常用的分析配置。系统模板由管理员创建，所有教师可用；个人模板只有自己可以使用和编辑。"
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />

        <Table
          columns={columns}
          dataSource={templates}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1000 }}
          pagination={{
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 个模板`
          }}
        />
      </Card>

      {/* 创建/编辑模板模态框 */}
      <Modal
        title={editingTemplate ? '编辑模板' : '创建模板'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={700}
        okText="确定"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            analysisDimensions: ['分数分布', '学生分层', '提分建议']
          }}
        >
          <Form.Item
            label="模板名称"
            name="templateName"
            rules={[{ required: true, message: '请输入模板名称' }]}
          >
            <Input placeholder="例如：月考成绩分析模板" />
          </Form.Item>

          <Form.Item
            label="模板描述"
            name="description"
            extra="可选：简要描述此模板的用途"
          >
            <Input placeholder="例如：适用于每月考试的成绩分析" />
          </Form.Item>

          <Form.Item
            label="分析维度"
            name="analysisDimensions"
            rules={[{ required: true, message: '请至少选择一个分析维度' }]}
          >
            <Checkbox.Group style={{ width: '100%' }}>
              <Row>
                {dimensionOptions.map(dim => (
                  <Col span={12} key={dim.value}>
                    <Checkbox value={dim.value}>
                      <Tooltip title={dim.description}>
                        <span>{dim.label}</span>
                      </Tooltip>
                    </Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
          </Form.Item>

          <Form.Item
            label="默认分析指令"
            name="defaultPrompt"
            extra="可选：设置默认的自定义分析要求"
          >
            <TextArea
              rows={4}
              placeholder="例如：重点关注80分以下学生的情况，给出具体改进建议"
              maxLength={500}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 模板预览模态框 */}
      <Modal
        title="模板预览"
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        width={700}
        footer={
          <Space>
            <Button onClick={() => setPreviewVisible(false)}>关闭</Button>
            <Button
              type="primary"
              icon={<ThunderboltOutlined />}
              onClick={() => {
                setPreviewVisible(false);
                if (previewTemplate) {
                  handleUseTemplate(previewTemplate);
                }
              }}
            >
              使用此模板
            </Button>
          </Space>
        }
      >
        {previewTemplate && (
          <div>
            <Descriptions column={1} bordered>
              <Descriptions.Item label="模板名称">
                <Space>
                  {previewTemplate.isGlobal ? <GlobalOutlined style={{ color: '#1890ff' }} /> : <UserOutlined />}
                  {previewTemplate.templateName}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="类型">
                <Tag color={previewTemplate.isGlobal ? 'blue' : 'green'}>
                  {previewTemplate.isGlobal ? '系统模板' : '我的模板'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="描述">
                {previewTemplate.description || '无描述'}
              </Descriptions.Item>
              <Descriptions.Item label="分析维度">
                <Space wrap>
                  {(typeof previewTemplate.analysisDimensions === 'string'
                    ? JSON.parse(previewTemplate.analysisDimensions)
                    : previewTemplate.analysisDimensions
                  ).map((d: string) => (
                    <Tag key={d} color="blue">{d}</Tag>
                  ))}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="默认分析指令">
                {previewTemplate.defaultPrompt ? (
                  <Paragraph ellipsis={{ rows: 3, expandable: true, symbol: '展开' }}>
                    {previewTemplate.defaultPrompt}
                  </Paragraph>
                ) : (
                  <Text type="secondary">无默认指令</Text>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">
                {new Date(previewTemplate.createdAt).toLocaleString()}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TeacherAnalysisTemplatesPage;
