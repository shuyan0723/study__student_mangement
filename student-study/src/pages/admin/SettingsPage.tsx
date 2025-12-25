import { Card, Form, Input, Button, Switch, Row, Col, message, Divider } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useState } from 'react';

export const SettingsPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [settings, setSettings] = useState({
    systemName: '学生成绩管理系统',
    adminEmail: 'admin@university.edu',
    maintenanceMode: false,
    enableStudentRegistration: true,
    enableTeacherRegistration: false,
    sessionTimeout: 30,
    maxUploadSize: 10,
  });

  const handleSave = async (values: any) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSettings(values);
      message.success('系统设置已保存');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Card title="系统设置">
        <Form
          form={form}
          layout="vertical"
          initialValues={settings}
          onFinish={handleSave}
        >
          <Divider>基本设置</Divider>

          <Row gutter={24}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="系统名称"
                name="systemName"
                rules={[{ required: true, message: '请输入系统名称' }]}
              >
                <Input placeholder="系统名称" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="管理员邮箱"
                name="adminEmail"
                rules={[
                  { required: true, message: '请输入邮箱' },
                  { type: 'email', message: '请输入有效的邮箱' },
                ]}
              >
                <Input placeholder="管理员邮箱" />
              </Form.Item>
            </Col>
          </Row>

          <Divider>功能设置</Divider>

          <Row gutter={24}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="维护模式"
                name="maintenanceMode"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
              <p style={{ fontSize: '12px', color: '#999' }}>
                启用维护模式后，仅管理员可以访问系统
              </p>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="启用学生注册"
                name="enableStudentRegistration"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="启用教师注册"
                name="enableTeacherRegistration"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <Divider>安全设置</Divider>

          <Row gutter={24}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="会话超时（分钟）"
                name="sessionTimeout"
                rules={[{ required: true, message: '请输入会话超时时间' }]}
              >
                <Input type="number" min={5} max={480} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="最大上传文件大小（MB）"
                name="maxUploadSize"
                rules={[{ required: true, message: '请输入最大上传大小' }]}
              >
                <Input type="number" min={1} max={1000} />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <Form.Item>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              htmlType="submit"
              loading={loading}
              size="large"
            >
              保存设置
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="系统信息" style={{ marginTop: 24 }}>
        <Row gutter={24}>
          <Col xs={24} sm={12}>
            <p>
              <strong>系统版本：</strong> v1.0.0
            </p>
            <p>
              <strong>构建时间：</strong> 2024-11-02
            </p>
          </Col>
          <Col xs={24} sm={12}>
            <p>
              <strong>技术栈：</strong> React + TypeScript + Ant Design
            </p>
            <p>
              <strong>数据库：</strong> 本地存储 (LocalStorage)
            </p>
          </Col>
        </Row>
      </Card>

      <Card title="数据管理" style={{ marginTop: 24 }}>
        <Row gutter={16}>
          <Col xs={24} sm={12} md={6}>
            <Button block danger>
              导出数据
            </Button>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Button block danger>
              导入数据
            </Button>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Button block danger type="dashed">
              清空缓存
            </Button>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Button block danger type="dashed">
              重置系统
            </Button>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default SettingsPage;
