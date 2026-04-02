import { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Tabs,
  Avatar,
  Progress,
  Statistic,
  Row,
  Col,
  Input,
  Select,
  Form,
  Modal,
  message,
  Badge,
  Tooltip,
  Alert
} from 'antd';
import {
  TeamOutlined,
  BookOutlined,
  UserOutlined,
  TrophyOutlined,
  EditOutlined,
  SendOutlined,
  FileTextOutlined,
  LineChartOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDataStore } from '../../store/dataStore';
import { useAuthStore } from '../../store/authStore';
import type { ColumnsType } from 'antd/es/table';

const { TextArea } = Input;
const { Option } = Select;

export const ClassManagementPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { courses, students, grades } = useDataStore();
  const [activeTab, setActiveTab] = useState('courses');
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [noticeModalVisible, setNoticeModalVisible] = useState(false);
  const [noticeForm] = Form.useForm();

  // 获取教师的课程
  const teacherCourses = courses.filter((c) => c.teacherId === user?.id);

  // 计算课程统计数据
  const getCourseStats = (courseId: string) => {
    const courseGrades = grades.filter(g => g.courseId === courseId);
    if (courseGrades.length === 0) {
      return { total: 0, average: 0, passRate: 0, excellentRate: 0 };
    }

    const total = courseGrades.length;
    const average = courseGrades.reduce((sum, g) => sum + g.score, 0) / total;
    const passed = courseGrades.filter(g => g.score >= 60).length;
    const excellent = courseGrades.filter(g => g.score >= 85).length;

    return {
      total,
      average,
      passRate: (passed / total) * 100,
      excellentRate: (excellent / total) * 100
    };
  };

  // 获取课程的学生列表
  const getCourseStudents = (courseId: string) => {
    const courseStudentIds = grades
      .filter(g => g.courseId === courseId)
      .map(g => g.studentId);

    return students.filter(s => courseStudentIds.includes(s.id));
  };

  // 获取学生成绩
  const getStudentGrade = (studentId: string, courseId: string) => {
    return grades.find(g => g.studentId === studentId && g.courseId === courseId);
  };

  // 发布通知
  const handlePublishNotice = async (values: any) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...values,
          courseId: selectedCourse?.id,
          targetType: 'course'
        })
      });

      const data = await response.json();
      if (data.success) {
        message.success('通知发布成功');
        setNoticeModalVisible(false);
        noticeForm.resetFields();
      } else {
        message.error(data.message || '发布失败');
      }
    } catch (error) {
      message.error('发布失败');
    }
  };

  // 课程列表列定义
  const courseColumns: ColumnsType<any> = [
    {
      title: '课程名称',
      dataIndex: 'courseName',
      key: 'courseName',
      render: (text, record) => (
        <Space>
          <BookOutlined style={{ color: '#1890ff' }} />
          <span style={{ fontWeight: 500 }}>{text}</span>
        </Space>
      )
    },
    {
      title: '学期',
      dataIndex: 'semester',
      key: 'semester',
      render: (text) => <Tag color="blue">{text}</Tag>
    },
    {
      title: '学生人数',
      dataIndex: 'id',
      key: 'studentCount',
      render: (_, record) => {
        const stats = getCourseStats(record.id);
        return (
          <Badge
            count={stats.total}
            showZero
            style={{ backgroundColor: '#52c41a' }}
          />
        );
      }
    },
    {
      title: '平均分',
      dataIndex: 'id',
      key: 'average',
      render: (_, record) => {
        const stats = getCourseStats(record.id);
        return (
          <Statistic
            value={stats.average}
            precision={1}
            valueStyle={{
              fontSize: '14px',
              color: stats.average >= 80 ? '#3f8600' : stats.average >= 60 ? '#1890ff' : '#ff4d4f'
            }}
          />
        );
      },
      sorter: (a, b) => getCourseStats(a.id).average - getCourseStats(b.id).average
    },
    {
      title: '及格率',
      dataIndex: 'id',
      key: 'passRate',
      render: (_, record) => {
        const stats = getCourseStats(record.id);
        return (
          <Progress
            percent={stats.passRate}
            size="small"
            status={stats.passRate >= 80 ? 'success' : stats.passRate >= 60 ? 'normal' : 'exception'}
          />
        );
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<TeamOutlined />}
            onClick={() => {
              setSelectedCourse(record);
              setActiveTab('students');
            }}
          >
            查看学生
          </Button>
          <Button
            size="small"
            icon={<SendOutlined />}
            onClick={() => {
              setSelectedCourse(record);
              setNoticeModalVisible(true);
            }}
          >
            发布通知
          </Button>
        </Space>
      )
    }
  ];

  // 学生列表列定义
  const studentColumns: ColumnsType<any> = [
    {
      title: '学号',
      dataIndex: 'studentId',
      key: 'studentId',
      width: 120
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          <span>{text}</span>
        </Space>
      )
    },
    {
      title: '成绩',
      dataIndex: 'id',
      key: 'grade',
      render: (_, record) => {
        const grade = getStudentGrade(record.id, selectedCourse?.id);
        if (!grade) return <Tag color="default">未录入</Tag>;

        const score = grade.score;
        let color = 'default';
        let level = 'F';

        if (score >= 90) { color = 'success'; level = 'A'; }
        else if (score >= 85) { color = 'success'; level = 'A-'; }
        else if (score >= 80) { color = 'processing'; level = 'B+'; }
        else if (score >= 75) { color = 'processing'; level = 'B'; }
        else if (score >= 70) { color = 'processing'; level = 'B-'; }
        else if (score >= 60) { color = 'warning'; level = 'C'; }
        else { color = 'error'; level = 'F'; }

        return (
          <Space>
            <Tag color={color} style={{ fontSize: '14px', padding: '4px 12px' }}>
              {score}分
            </Tag>
            <Tag>{level}</Tag>
          </Space>
        );
      },
      sorter: (a, b) => {
        const gradeA = getStudentGrade(a.id, selectedCourse?.id)?.score || 0;
        const gradeB = getStudentGrade(b.id, selectedCourse?.id)?.score || 0;
        return gradeB - gradeA;
      }
    },
    {
      title: '评语',
      dataIndex: 'id',
      key: 'comment',
      render: (_, record) => {
        const grade = getStudentGrade(record.id, selectedCourse?.id);
        return (
          <Tooltip title={grade?.feedback}>
            <span style={{
              maxWidth: '200px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              display: 'inline-block'
            }}>
              {grade?.feedback || '-'}
            </span>
          </Tooltip>
        );
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate(`/teacher/grades?courseId=${selectedCourse?.id}&studentId=${record.id}`)}
          >
            编辑成绩
          </Button>
        </Space>
      )
    }
  ];

  // 课程选择器
  const courseSelector = (
    <Select
      style={{ width: 300 }}
      placeholder="选择课程"
      value={selectedCourse?.id}
      onChange={(value) => {
        const course = teacherCourses.find(c => c.id === value);
        setSelectedCourse(course);
      }}
    >
      {teacherCourses.map(course => (
        <Option key={course.id} value={course.id}>
          {course.courseName} ({course.semester})
        </Option>
      ))}
    </Select>
  );

  const tabItems = [
    {
      key: 'courses',
      label: (
        <span>
          <BookOutlined />
          我的课程
        </span>
      ),
      children: (
        <Table
          columns={courseColumns}
          dataSource={teacherCourses}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 门课程`
          }}
        />
      )
    },
    {
      key: 'students',
      label: (
        <span>
          <TeamOutlined />
          学生管理
        </span>
      ),
      children: selectedCourse ? (
        <>
          <Card style={{ marginBottom: 16 }}>
            <Row gutter={16} align="middle">
              <Col span={8}>
                <Space>
                  <span>当前课程：</span>
                  <span style={{ fontWeight: 500, color: '#1890ff' }}>
                    {selectedCourse.courseName}
                  </span>
                </Space>
              </Col>
              <Col span={8}>
                {courseSelector}
              </Col>
              <Col span={8}>
                <Row gutter={8}>
                  <Col span={8}>
                    <Statistic
                      title="学生总数"
                      value={getCourseStats(selectedCourse.id).total}
                      prefix={<TeamOutlined />}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="平均分"
                      value={getCourseStats(selectedCourse.id).average}
                      precision={1}
                      prefix={<LineChartOutlined />}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="及格率"
                      value={getCourseStats(selectedCourse.id).passRate}
                      suffix="%"
                      prefix={<TrophyOutlined />}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>

          <Table
            columns={studentColumns}
            dataSource={getCourseStudents(selectedCourse.id)}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `共 ${total} 名学生`
            }}
          />
        </>
      ) : (
        <Card>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <TeamOutlined style={{ fontSize: '48px', color: '#ccc' }} />
            <p style={{ marginTop: '16px', color: '#999' }}>
              请先选择一门课程查看学生信息
            </p>
            {courseSelector}
          </div>
        </Card>
      )
    },
    {
      key: 'progress',
      label: (
        <span>
          <FileTextOutlined />
          教学进度
        </span>
      ),
      children: (
        <Card>
          <Alert
            message="教学进度管理"
            description="此功能将帮助您跟踪课程进度、制定教学计划、管理教学资源。该功能正在开发中，敬请期待。"
            type="info"
            showIcon
          />
        </Card>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title="班级管理"
        extra={
          <Space>
            <Button icon={<LineChartOutlined />} onClick={() => navigate('/teacher/grade-3d')}>
              成绩分布3D
            </Button>
            <Button icon={<TrophyOutlined />} onClick={() => navigate('/teacher/ai-analysis')}>
              AI成绩分析
            </Button>
          </Space>
        }
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
        />
      </Card>

      {/* 发布通知弹窗 */}
      <Modal
        title="发布课程通知"
        open={noticeModalVisible}
        onCancel={() => setNoticeModalVisible(false)}
        onOk={() => noticeForm.validateFields().then(handlePublishNotice)}
        width={600}
      >
        <Form
          form={noticeForm}
          layout="vertical"
        >
          <Form.Item label="目标课程">
            <Input
              value={`${selectedCourse?.courseName} (${selectedCourse?.semester})`}
              disabled
            />
          </Form.Item>

          <Form.Item
            label="通知标题"
            name="title"
            rules={[{ required: true, message: '请输入通知标题' }]}
          >
            <Input placeholder="例如：期中考试安排" />
          </Form.Item>

          <Form.Item
            label="通知内容"
            name="content"
            rules={[{ required: true, message: '请输入通知内容' }]}
          >
            <TextArea
              rows={6}
              placeholder="请输入详细的通知内容..."
              maxLength={1000}
              showCount
            />
          </Form.Item>

          <Form.Item
            label="优先级"
            name="priority"
            initialValue="normal"
          >
            <Select>
              <Option value="low">低</Option>
              <Option value="normal">普通</Option>
              <Option value="high">高</Option>
              <Option value="urgent">紧急</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ClassManagementPage;
