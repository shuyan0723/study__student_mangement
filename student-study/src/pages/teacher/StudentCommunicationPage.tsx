import { useState } from 'react';
import { Card, Input, Button, Empty, Avatar, Space, Form, message, Select, Tag } from 'antd';
import { SendOutlined, UserOutlined } from '@ant-design/icons';
import { useAuthStore } from '../../store/authStore';
import { useDataStore } from '../../store/dataStore';

const { Option } = Select;

export const StudentCommunicationPage = () => {
  const { user } = useAuthStore();
  const { messages, students, courses, studentCourses, addMessage } = useDataStore();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<string>('');

  // 获取教师教授的课程
  const teacherCourses = courses.filter((c) => c.teacherId === user?.id);
  
  // 获取教师课程的所有学生
  const getTeacherStudents = () => {
    const courseIds = teacherCourses.map(c => c.courseId);
    const courseStudents = studentCourses.filter(sc => courseIds.includes(sc.courseId));
    const studentIds = new Set(courseStudents.map(sc => sc.studentId));
    return students.filter(s => studentIds.has(s.id));
  };

  const teacherStudents = getTeacherStudents();

  // 根据选择的课程筛选学生
  const filteredStudents = selectedCourse 
    ? teacherStudents.filter(student => 
        studentCourses.some(sc => sc.studentId === student.id && sc.courseId === selectedCourse)
      )
    : teacherStudents;

  // 获取与选中学生的消息记录
  const studentMessages = selectedStudent 
    ? messages.filter(m => 
        (m.senderId === user?.id && m.receiverId === selectedStudent) || 
        (m.senderId === selectedStudent && m.receiverId === user?.id)
      ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    : [];

  // 发送消息
  const handleSendMessage = async (values: { content: string }) => {
    if (!selectedStudent) {
      message.error('请先选择要联系的学生');
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      const newMessage = {
        id: `msg_${Date.now()}`,
        senderId: user?.id || '',
        senderName: user?.username || '',
        receiverId: selectedStudent,
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

  // 格式化时间
  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div>
      <Card style={{ marginBottom: 24 }}>
        <h2>学生交流</h2>
        <p>与你的学生进行消息交流</p>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24 }}>
        {/* 左侧：筛选和学生列表 */}
        <Card title="学生列表">
          {/* 课程筛选 */}
          <div style={{ marginBottom: 16 }}>
            <Select
              placeholder="按课程筛选"
              style={{ width: '100%' }}
              value={selectedCourse || undefined}
              onChange={setSelectedCourse}
              allowClear
            >
              {teacherCourses.map(course => (
                <Option key={course.courseId} value={course.courseId}>
                  {course.courseName}
                </Option>
              ))}
            </Select>
          </div>

          {/* 学生列表 */}
          <Space direction="vertical" style={{ width: '100%', maxHeight: '500px', overflowY: 'auto' }}>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => {
                // 获取学生的未读消息数量
                const unreadCount = messages.filter(m => 
                  m.senderId === student.id && 
                  m.receiverId === user?.id && 
                  !m.isRead
                ).length;
                
                return (
                  <div
                    key={student.id}
                    onClick={() => setSelectedStudent(student.id)}
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      backgroundColor: selectedStudent === student.id ? '#f0f5ff' : 'transparent',
                      border: selectedStudent === student.id ? '2px solid #1890ff' : '1px solid #f0f0f0',
                      transition: 'all 0.3s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Space>
                      <Avatar size={40} icon={<UserOutlined />}>
                        {student.username.charAt(0)}
                      </Avatar>
                      <div>
                        <div style={{ fontWeight: 500 }}>{student.username}</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>ID: {student.id}</div>
                      </div>
                    </Space>
                    {unreadCount > 0 && (
                      <Tag color="error" style={{ margin: 0 }}>{unreadCount}</Tag>
                    )}
                  </div>
                );
              })
            ) : (
              <Empty description="暂无学生数据" />
            )}
          </Space>
        </Card>

        {/* 右侧：消息聊天界面 */}
        <Card
          title={selectedStudent 
            ? `与 ${teacherStudents.find(s => s.id === selectedStudent)?.username} 交流` 
            : '选择学生开始交流'}
        >
          {selectedStudent ? (
            <>
              {/* 消息列表 */}
              <div
                style={{
                  height: '450px',
                  overflowY: 'auto',
                  marginBottom: '16px',
                  padding: '16px',
                  backgroundColor: '#fafafa',
                  borderRadius: '8px',
                }}
              >
                {studentMessages.length > 0 ? (
                  <Space direction="vertical" style={{ width: '100%' }}>
                    {studentMessages.map((msg) => {
                      const isTeacher = msg.senderId === user?.id;
                      const messageStudent = students.find(s => s.id === msg.senderId);
                      return (
                        <div
                          key={msg.id}
                          style={{
                            textAlign: isTeacher ? 'right' : 'left',
                            marginBottom: '12px',
                          }}
                        >
                          <div style={{ marginBottom: '4px', fontSize: '12px', color: '#999' }}>
                            {isTeacher ? '我' : (messageStudent?.username || '学生')} · {formatTime(msg.timestamp)}
                          </div>
                          <div
                            style={{
                              display: 'inline-block',
                              maxWidth: '70%',
                              padding: '10px 14px',
                              borderRadius: '18px',
                              backgroundColor: isTeacher ? '#1890ff' : '#e6f7ff',
                              color: isTeacher ? '#fff' : '#333',
                              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.09)',
                            }}
                          >
                            {msg.content}
                          </div>
                        </div>
                      );
                    })}
                  </Space>
                ) : (
                  <Empty description="暂无消息记录" style={{ marginTop: '150px' }} />
                )}
              </div>

              {/* 消息输入框 */}
              <Form form={form} onFinish={handleSendMessage} layout="vertical">
                <Form.Item name="content" rules={[{ required: true, message: '请输入消息内容' }]}>
                  <Input.TextArea
                    rows={4}
                    placeholder="输入消息内容..."
                    disabled={loading}
                    style={{ resize: 'none', borderRadius: '8px' }}
                  />
                </Form.Item>
                <Form.Item style={{ marginBottom: 0 }}>
                  <Button
                    type="primary"
                    icon={<SendOutlined />}
                    htmlType="submit"
                    loading={loading}
                    block
                    size="large"
                    style={{ borderRadius: '8px' }}
                  >
                    发送消息
                  </Button>
                </Form.Item>
              </Form>
            </>
          ) : (
            <Empty description="请从左侧列表选择要联系的学生" style={{ marginTop: '200px' }} />
          )}
        </Card>
      </div>
    </div>
  );
};

export default StudentCommunicationPage;