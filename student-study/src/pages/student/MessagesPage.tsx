import { useState } from 'react';
import { Card, Input, Button, Empty, Avatar, Space, Form, message } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { useAuthStore } from '../../store/authStore';
import { useDataStore } from '../../store/dataStore';
import './StudentPage.css';

export const StudentMessagesPage = () => {
  const { user } = useAuthStore();
  const { messages, addMessage } = useDataStore();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<string>('');

  const teacherList = [
    { id: 'teacher_001', name: '王教授' },
    { id: 'teacher_002', name: '李教授' },
  ];

  const userMessages = messages.filter(
    (m) => (m.senderId === user?.id || m.receiverId === user?.id) && 
            (selectedTeacher === '' || m.senderId === selectedTeacher || m.receiverId === selectedTeacher)
  );

  const handleSendMessage = async (values: { content: string }) => {
    if (!selectedTeacher) {
      message.error('请先选择要联系的教师');
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      const newMessage = {
        id: `msg_${Date.now()}`,
        senderId: user?.id || '',
        senderName: user?.username || '',
        receiverId: selectedTeacher,
        content: values.content,
        timestamp: new Date().toISOString(),
        isRead: false,
      };

      addMessage(newMessage);
      form.resetFields();
      message.success('消息已发送');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-page">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24 }}>
        {/* 左侧：教师列表 */}
        <Card title="联系教师">
          <Space direction="vertical" style={{ width: '100%' }}>
            {teacherList.map((teacher) => (
              <div
                key={teacher.id}
                onClick={() => setSelectedTeacher(teacher.id)}
                style={{
                  padding: '12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: selectedTeacher === teacher.id ? '#f0f5ff' : 'transparent',
                  border: selectedTeacher === teacher.id ? '2px solid #1890ff' : '1px solid #f0f0f0',
                  transition: 'all 0.3s',
                }}
              >
                <Space>
                  <Avatar style={{ backgroundColor: '#667eea' }}>
                    {teacher.name.charAt(0)}
                  </Avatar>
                  <div>{teacher.name}</div>
                </Space>
              </div>
            ))}
          </Space>
        </Card>

        {/* 右侧：消息列表和输入框 */}
        <Card
          title={selectedTeacher ? `与${teacherList.find(t => t.id === selectedTeacher)?.name}交流` : '选择教师开始交流'}
        >
          {selectedTeacher ? (
            <>
              <div
                style={{
                  height: '400px',
                  overflowY: 'auto',
                  marginBottom: '16px',
                  paddingRight: '12px',
                }}
              >
                {userMessages.length > 0 ? (
                  <Space direction="vertical" style={{ width: '100%' }}>
                    {userMessages.map((msg) => (
                      <div
                        key={msg.id}
                        style={{
                          textAlign: msg.senderId === user?.id ? 'right' : 'left',
                        }}
                      >
                        <div
                          style={{
                            display: 'inline-block',
                            maxWidth: '70%',
                            padding: '12px',
                            borderRadius: '8px',
                            backgroundColor:
                              msg.senderId === user?.id ? '#1890ff' : '#f0f0f0',
                            color: msg.senderId === user?.id ? 'white' : '#333',
                            marginBottom: '8px',
                          }}
                        >
                          {msg.content}
                        </div>
                        <div style={{ fontSize: '12px', color: '#999' }}>
                          {new Date(msg.timestamp).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </Space>
                ) : (
                  <Empty description="暂无消息记录" />
                )}
              </div>

              <Form form={form} onFinish={handleSendMessage} layout="vertical">
                <Form.Item name="content" rules={[{ required: true, message: '请输入消息内容' }]}>
                  <Input.TextArea
                    rows={3}
                    placeholder="输入消息内容..."
                    disabled={loading}
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    icon={<SendOutlined />}
                    htmlType="submit"
                    loading={loading}
                    block
                  >
                    发送
                  </Button>
                </Form.Item>
              </Form>
            </>
          ) : (
            <Empty description="请从左侧列表选择要联系的教师" />
          )}
        </Card>
      </div>
    </div>
  );
};

export default StudentMessagesPage;
