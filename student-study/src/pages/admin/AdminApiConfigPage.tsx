import { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  InputNumber,
  Button,
  message,
  Descriptions,
  Tag,
  Space,
  Divider,
  Alert,
  Row,
  Col,
  Statistic,
  Progress,
  List,
  Typography
} from 'antd';
import { CheckCircleOutlined, LoadingOutlined, SettingOutlined, ThunderboltOutlined, ClockCircleOutlined, DollarOutlined } from '@ant-design/icons';
import type { ApiConfig } from '../../types';

const { Text, Paragraph } = Typography;

export const AdminApiConfigPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [config, setConfig] = useState<ApiConfig | null>(null);
  const [hasConfig, setHasConfig] = useState(false);
  const [usageStats, setUsageStats] = useState<any>(null);

  // 加载API配置和使用统计
  useEffect(() => {
    loadConfig();
    loadUsageStats();
  }, []);

  const loadUsageStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ai-analysis/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setUsageStats(data.data);
      }
    } catch (error) {
      console.error('加载使用统计失败:', error);
    }
  };

  const loadConfig = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ai-analysis/config`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();

      if (data.success && data.data) {
        setConfig(data.data);
        setHasConfig(data.data.hasKey || false);
        form.setFieldsValue({
          apiEndpoint: data.data.apiEndpoint,
          model: data.data.model,
          dailyLimitPerTeacher: data.data.dailyLimitPerTeacher,
          monthlyLimitPerTeacher: data.data.monthlyLimitPerTeacher
        });
      } else {
        setHasConfig(false);
      }
    } catch (error) {
      console.error('加载配置失败:', error);
    }
  };

  const handleSaveConfig = async (values: any) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ai-analysis/config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(values)
      });

      const data = await response.json();

      if (data.success) {
        message.success('API配置保存成功');
        loadConfig();
      } else {
        message.error(data.message || '配置保存失败');
      }
    } catch (error) {
      message.error('配置保存失败');
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async () => {
    const values = form.getFieldsValue(['apiEndpoint', 'apiKey', 'model']);

    if (!values.apiEndpoint || !values.apiKey || !values.model) {
      message.warning('请先填写完整的API配置信息');
      return;
    }

    setTesting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ai-analysis/config/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(values)
      });

      const data = await response.json();

      if (data.success) {
        message.success('API连接测试成功！');
      } else {
        message.error(data.message || 'API连接测试失败');
      }
    } catch (error) {
      message.error('API连接测试失败');
    } finally {
      setTesting(false);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* 使用统计卡片 */}
      {usageStats && (
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="总调用次数"
                value={usageStats.totalCalls || 0}
                prefix={<ThunderboltOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="今日调用"
                value={usageStats.todayCalls || 0}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="活跃教师"
                value={usageStats.activeTeachers || 0}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="总成本"
                value={usageStats.totalCost || 0}
                prefix={<DollarOutlined />}
                precision={4}
                suffix="¥"
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
        </Row>
      )}

      <Card
        title={
          <Space>
            <SettingOutlined />
            <span>AI分析API配置</span>
          </Space>
        }
        extra={
          hasConfig && <Tag color="success" icon={<CheckCircleOutlined />}>已配置</Tag>
        }
      >
        <Alert
          message="Kimi API配置说明"
          description="请配置Kimi大模型API信息用于成绩智能分析功能。API密钥将采用AES-256加密存储。"
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveConfig}
          initialValues={{
            model: 'moonshot-v1-8k',
            dailyLimitPerTeacher: 10,
            monthlyLimitPerTeacher: 100
          }}
        >
          <Form.Item
            label="API接口地址"
            name="apiEndpoint"
            rules={[{ required: true, message: '请输入API接口地址' }]}
          >
            <Input
              placeholder="https://api.moonshot.cn/v1/chat/completions"
              disabled={loading}
            />
          </Form.Item>

          <Form.Item
            label="API密钥"
            name="apiKey"
            rules={[{ required: true, message: '请输入API密钥' }]}
            extra="密钥将被加密存储，只有管理员可以查看和修改"
          >
            <Input.Password
              placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              disabled={loading}
            />
          </Form.Item>

          <Form.Item
            label="模型名称"
            name="model"
            rules={[{ required: true, message: '请输入模型名称' }]}
            extra="可用的Kimi模型：moonshot-v1-8k, moonshot-v1-32k, moonshot-v1-128k"
          >
            <Input
              placeholder="moonshot-v1-8k"
              disabled={loading}
            />
          </Form.Item>

          <Divider>调用限额设置</Divider>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="单教师单日调用上限"
                name="dailyLimitPerTeacher"
                rules={[{ required: true, message: '请输入单日调用上限' }]}
              >
                <InputNumber
                  min={1}
                  max={100}
                  disabled={loading}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="单教师单月调用上限"
                name="monthlyLimitPerTeacher"
                rules={[{ required: true, message: '请输入单月调用上限' }]}
              >
                <InputNumber
                  min={1}
                  max={1000}
                  disabled={loading}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                {hasConfig ? '更新配置' : '保存配置'}
              </Button>
              <Button onClick={handleTestConnection} loading={testing}>
                {testing ? <LoadingOutlined /> : null} 测试连接
              </Button>
              <Button onClick={loadConfig} disabled={loading}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>

        {config && (
          <>
            <Divider>当前配置</Divider>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="API提供商">
                <Tag color="blue">{config.provider}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="模型">{config.model}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={config.isActive ? 'success' : 'default'}>
                  {config.isActive ? '启用' : '禁用'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="单日限额">{config.dailyLimitPerTeacher}次</Descriptions.Item>
              <Descriptions.Item label="单月限额">{config.monthlyLimitPerTeacher}次</Descriptions.Item>
              <Descriptions.Item label="密钥状态">
                {hasConfig ? '已配置' : '未配置'}
              </Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Card>
    </div>
  );
};

export default AdminApiConfigPage;
