import { useState } from 'react';
import { Form, Input, Button, Card, Alert, Space, Tabs, Spin } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import './LoginPage.less';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { login, loading } = useAuthStore();
  const [error, setError] = useState<string>('');

  const handleLogin = async (values: { username: string; password: string }) => {
    setError('');
    try {
      await login(values);
      navigate('/dashboard');
    } catch (err) {
      setError('登录失败，请检查用户名和密码');
    }
  };

  const demoAccounts = [
    { username: 'student01', password: 'password', role: '学生' },
    { username: 'teacher01', password: 'password', role: '教师' },
    { username: 'admin01', password: 'password', role: '管理员' },
  ];

  return (
    <div className="login-container">
      <Card className="login-card" title="学生成绩信息管理系统" bordered={false}>
        <Spin spinning={loading}>
          {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}

          <Form form={form} onFinish={handleLogin} layout="vertical">
            <Form.Item
              name="username"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="用户名"
                size="large"
                disabled={loading}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="密码"
                size="large"
                disabled={loading}
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" block size="large" htmlType="submit" loading={loading}>
                登录
              </Button>
            </Form.Item>
          </Form>

          <div className="demo-accounts">
            <p style={{ marginBottom: 12, textAlign: 'center', color: '#666' }}>演示账号</p>
            <Tabs
              items={demoAccounts.map((account) => ({
                label: account.role,
                key: account.username,
                children: (
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div className="account-info">
                      <p>
                        <strong>用户名：</strong> {account.username}
                      </p>
                      <p>
                        <strong>密码：</strong> {account.password}
                      </p>
                    </div>
                    <Button
                      type="dashed"
                      block
                      onClick={() => {
                        form.setFieldsValue(account);
                        handleLogin(account);
                      }}
                      loading={loading}
                    >
                      快速登录为{account.role}
                    </Button>
                  </Space>
                ),
              }))}
            />
          </div>
        </Spin>
      </Card>
    </div>
  );
};

export default LoginPage;