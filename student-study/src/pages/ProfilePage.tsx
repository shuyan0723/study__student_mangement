import { Card, Form, Input, Button, Row, Col, Avatar, Divider, message, Upload, Space } from 'antd';
import { UserOutlined, CameraOutlined, SaveOutlined } from '@ant-design/icons';
import { useAuthStore } from '../store/authStore';
import { useState } from 'react';
import type { RcFile } from 'antd/es/upload';

export const ProfilePage = () => {
  const [form] = Form.useForm();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState<string>('');

  const handleUploadAvatar = (file: RcFile) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatar(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    return false;
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      message.success('个人信息已更新');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <Card title="个人资料" style={{ marginBottom: 24 }}>
        <Row gutter={24}>
          <Col xs={24} sm={8} style={{ textAlign: 'center' }}>
            <Avatar
              size={120}
              icon={<UserOutlined />}
              src={avatar}
              style={{ marginBottom: 16, backgroundColor: '#667eea' }}
            />
            <Upload
              maxCount={1}
              beforeUpload={handleUploadAvatar}
              accept="image/*"
            >
              <Button icon={<CameraOutlined />} block>
                修改头像
              </Button>
            </Upload>
            <p style={{ marginTop: 16, color: '#999', fontSize: 12 }}>
              支持 JPG、PNG 格式，大小不超过 2MB
            </p>
          </Col>

          <Col xs={24} sm={16}>
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                username: user?.username,
                email: user?.email,
                phone: user?.phone || '',
              }}
              onFinish={handleSubmit}
            >
              <Form.Item
                label="用户名"
                name="username"
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input disabled />
              </Form.Item>

              <Form.Item
                label="邮箱"
                name="email"
                rules={[
                  { required: true, message: '请输入邮箱' },
                  { type: 'email', message: '邮箱格式不正确' },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="联系方式"
                name="phone"
                rules={[
                  {
                    pattern: /^1[3-9]\d{9}$/,
                    message: '请输入有效的手机号码',
                  },
                ]}
              >
                <Input placeholder="请输入手机号码" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<SaveOutlined />}
                  size="large"
                >
                  保存修改
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Card>

      <Card title="账号安全">
        <Divider>修改密码</Divider>

        <Form layout="vertical">
          <Row gutter={24}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="当前密码"
                rules={[{ required: true, message: '请输入当前密码' }]}
              >
                <Input.Password />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="新密码"
                rules={[{ required: true, message: '请输入新密码' }]}
              >
                <Input.Password />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="确认新密码"
            rules={[{ required: true, message: '请确认新密码' }]}
          >
            <Input.Password />
          </Form.Item>

          <Button type="primary">更新密码</Button>
        </Form>

        <Divider>登录记录</Divider>

        <Space direction="vertical" style={{ width: '100%' }}>
          <div style={{ padding: '12px', background: '#fafafa', borderRadius: 4 }}>
            <p style={{ margin: 0 }}>
              <strong>最后登录</strong>: 2024-11-02 14:30:00
            </p>
            <p style={{ margin: '4px 0 0 0', color: '#999', fontSize: 12 }}>
              IP 地址: 192.168.1.100 | 设备: Windows 10
            </p>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default ProfilePage;
