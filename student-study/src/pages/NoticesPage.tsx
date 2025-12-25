import { Card, List, Button, Modal, Form, Input, Select, Space, Tag, Empty, Badge, message } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, BellOutlined } from '@ant-design/icons';
import { useState, useMemo } from 'react';
import { useAuthStore } from '../store/authStore';

interface Notice {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'error';
  publishBy: string;
  publishTime: string;
  isRead: boolean;
  targetRole: 'all' | 'student' | 'teacher' | 'admin';
}

export const NoticesPage = () => {
  const { user } = useAuthStore();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [notices, setNotices] = useState<Notice[]>([
    {
      id: '1',
      title: '2024年秋季学期考试安排通知',
      content: '各位同学，根据学校教务安排，2024年秋季学期期末考试时间定于12月15日-12月25日期间进行。请各位同学按时参加考试，若有特殊情况请提前向教务处申请。',
      type: 'info',
      publishBy: '教务处',
      publishTime: '2024-11-02 10:00',
      isRead: false,
      targetRole: 'all',
    },
    {
      id: '2',
      title: '教学系统维护通知',
      content: '本系统将于11月3日晚上22:00-23:00进行日常维护，期间系统将无法访问，请各位用户提前规划好学习时间。',
      type: 'warning',
      publishBy: '系统管理员',
      publishTime: '2024-11-02 09:30',
      isRead: true,
      targetRole: 'all',
    },
    {
      id: '3',
      title: '优秀学生表彰公告',
      content: '经过评选，以下同学获得本学期优秀学生荣誉称号：李明、王红、张三等。特此表彰！',
      type: 'success',
      publishBy: '学生事务部',
      publishTime: '2024-11-01 14:00',
      isRead: true,
      targetRole: 'student',
    },
  ]);

  const visibleNotices = useMemo(() => {
    return notices.filter(
      (notice) =>
        notice.targetRole === 'all' || notice.targetRole === (user?.role as string)
    );
  }, [notices, user?.role]);

  const unreadCount = visibleNotices.filter((n) => !n.isRead).length;

  const handleAddNotice = async (values: any) => {
    if (user?.role !== 'admin') {
      message.error('只有管理员可以发布公告');
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newNotice: Notice = {
        id: `notice_${Date.now()}`,
        ...values,
        publishBy: user?.username || '管理员',
        publishTime: new Date().toLocaleString('zh-CN'),
        isRead: false,
      };

      setNotices([newNotice, ...notices]);
      form.resetFields();
      setIsModalVisible(false);
      message.success('公告发布成功');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNotice = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除此公告吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        setNotices(notices.filter((n) => n.id !== id));
        message.success('公告已删除');
      },
    });
  };

  const handleMarkAsRead = (id: string) => {
    setNotices(
      notices.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const typeColorMap: Record<string, string> = {
    info: 'blue',
    warning: 'orange',
    success: 'green',
    error: 'red',
  };

  const typeTextMap: Record<string, string> = {
    info: '信息',
    warning: '警告',
    success: '成功',
    error: '错误',
  };

  return (
    <div>
      {/* 通知统计 */}
      <Card style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0 }}>
              <BellOutlined /> 系统公告和通知
            </h3>
            <p style={{ margin: '8px 0 0 0', color: '#999', fontSize: 12 }}>
              共 {visibleNotices.length} 条公告，{unreadCount} 条未读
            </p>
          </div>
          {user?.role === 'admin' && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                form.resetFields();
                setIsModalVisible(true);
              }}
            >
              发布公告
            </Button>
          )}
        </div>
      </Card>

      {/* 公告列表 */}
      <Card>
        {visibleNotices.length > 0 ? (
          <List
            dataSource={visibleNotices}
            renderItem={(notice) => (
              <List.Item
                key={notice.id}
                style={{
                  padding: '16px 0',
                  borderBottom: '1px solid #f0f0f0',
                  opacity: notice.isRead ? 0.7 : 1,
                }}
              >
                <List.Item.Meta
                  avatar={
                    !notice.isRead && (
                      <Badge status="processing" style={{ marginRight: 8 }} />
                    )
                  }
                  title={
                    <div>
                      <span style={{ marginRight: 8 }}>
                        <Tag color={typeColorMap[notice.type]}>
                          {typeTextMap[notice.type]}
                        </Tag>
                      </span>
                      <span style={{ fontWeight: notice.isRead ? 'normal' : 'bold' }}>
                        {notice.title}
                      </span>
                    </div>
                  }
                  description={
                    <div style={{ marginTop: 8 }}>
                      <p style={{ margin: '0 0 8px 0', color: '#666' }}>
                        {notice.content.substring(0, 100)}
                        {notice.content.length > 100 ? '...' : ''}
                      </p>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: 12,
                          color: '#999',
                        }}
                      >
                        <span>
                          发布者：{notice.publishBy} | 时间：{notice.publishTime}
                        </span>
                        <Space>
                          {!notice.isRead && (
                            <Button
                              type="link"
                              size="small"
                              onClick={() => handleMarkAsRead(notice.id)}
                            >
                              标记已读
                            </Button>
                          )}
                          <Button type="link" size="small">
                            查看详情
                          </Button>
                          {user?.role === 'admin' && (
                            <>
                              <Button type="link" size="small" icon={<EditOutlined />}>
                                编辑
                              </Button>
                              <Button
                                type="link"
                                size="small"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => handleDeleteNotice(notice.id)}
                              >
                                删除
                              </Button>
                            </>
                          )}
                        </Space>
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <Empty description="暂无公告" />
        )}
      </Card>

      {/* 发布公告模态框 */}
      <Modal
        title="发布新公告"
        open={isModalVisible && user?.role === 'admin'}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleAddNotice} layout="vertical">
          <Form.Item
            name="title"
            label="公告标题"
            rules={[{ required: true, message: '请输入公告标题' }]}
          >
            <Input placeholder="请输入公告标题" />
          </Form.Item>

          <Form.Item
            name="content"
            label="公告内容"
            rules={[{ required: true, message: '请输入公告内容' }]}
          >
            <Input.TextArea rows={4} placeholder="请输入公告内容" />
          </Form.Item>

          <Form.Item
            name="type"
            label="公告类型"
            rules={[{ required: true }]}
            initialValue="info"
          >
            <Select
              options={[
                { label: '信息', value: 'info' },
                { label: '警告', value: 'warning' },
                { label: '成功', value: 'success' },
                { label: '错误', value: 'error' },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="targetRole"
            label="目标用户"
            rules={[{ required: true }]}
            initialValue="all"
          >
            <Select
              options={[
                { label: '所有用户', value: 'all' },
                { label: '学生', value: 'student' },
                { label: '教师', value: 'teacher' },
                { label: '管理员', value: 'admin' },
              ]}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              发布公告
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default NoticesPage;
