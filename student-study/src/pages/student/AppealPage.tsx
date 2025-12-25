import { Card, Table, Button, Modal, Form, Input, Select, Space, Tag, Empty, Steps, message, Divider, Timeline } from 'antd';
import { PlusOutlined, DeleteOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useState, useMemo } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useDataStore } from '../../store/dataStore';

interface Appeal {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  originalScore: number;
  appealReason: string;
  appealTime: string;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedTime?: string;
  reviewFeedback?: string;
  newScore?: number;
}

export const AppealPage = () => {
  const { user } = useAuthStore();
  const { grades, courses } = useDataStore();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [appeals, setAppeals] = useState<Appeal[]>([
    {
      id: '1',
      studentId: 'student_001',
      studentName: '李明',
      courseId: 'C001',
      courseName: '数据结构',
      originalScore: 78,
      appealReason: '认为第三道题判分有误，应该给予部分分数',
      appealTime: '2024-10-28 10:00',
      status: 'approved',
      reviewedBy: '王教授',
      reviewedTime: '2024-10-29 15:00',
      reviewFeedback: '经检查，确实有判分错误，成绩调整为82分',
      newScore: 82,
    },
    {
      id: '2',
      studentId: 'student_001',
      studentName: '李明',
      courseId: 'C002',
      courseName: '算法设计',
      originalScore: 88,
      appealReason: '对最终成绩有异议，希望重新评阅',
      appealTime: '2024-11-01 14:30',
      status: 'reviewing',
      reviewedBy: '李教授',
      reviewedTime: '2024-11-02 10:00',
      reviewFeedback: '正在复审中...',
    },
  ]);

  const myAppeals = useMemo(() => {
    return appeals.filter((a) => a.studentId === user?.id);
  }, [appeals, user?.id]);

  const statusColorMap: Record<string, string> = {
    pending: 'warning',
    reviewing: 'processing',
    approved: 'success',
    rejected: 'error',
  };

  const statusTextMap: Record<string, string> = {
    pending: '待审核',
    reviewing: '审核中',
    approved: '已批准',
    rejected: '已驳回',
  };

  const handleSubmitAppeal = async (values: any) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const selectedGrade = grades.find(
        (g) => g.studentId === user?.id && g.courseId === values.courseId
      );

      if (!selectedGrade) {
        message.error('该课程无成绩记录');
        return;
      }

      const newAppeal: Appeal = {
        id: `appeal_${Date.now()}`,
        studentId: user?.id || '',
        studentName: user?.username || '',
        courseId: values.courseId,
        courseName: courses.find((c) => c.courseId === values.courseId)?.courseName || '',
        originalScore: selectedGrade.score,
        appealReason: values.appealReason,
        appealTime: new Date().toLocaleString('zh-CN'),
        status: 'pending',
      };

      setAppeals([...appeals, newAppeal]);
      form.resetFields();
      setIsModalVisible(false);
      message.success('申诉已提交，请等待审核');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: '课程名称',
      dataIndex: 'courseName',
      key: 'courseName',
    },
    {
      title: '原始成绩',
      dataIndex: 'originalScore',
      key: 'originalScore',
      render: (score: number) => <strong>{score}分</strong>,
    },
    {
      title: '申诉时间',
      dataIndex: 'appealTime',
      key: 'appealTime',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={statusColorMap[status]}>{statusTextMap[status]}</Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Appeal) => (
        <Space>
          <Button type="link" size="small">
            查看详情
          </Button>
          {record.status === 'pending' && (
            <Button
              type="link"
              size="small"
              danger
              onClick={() => {
                Modal.confirm({
                  title: '确认撤回',
                  content: '撤回后无法重新提交，确认撤回吗？',
                  okText: '确定',
                  cancelText: '取消',
                  onOk: () => {
                    setAppeals(appeals.filter((a) => a.id !== record.id));
                    message.success('申诉已撤回');
                  },
                });
              }}
            >
              撤回申诉
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const getCourseOptions = () => {
    const studentGrades = grades.filter((g) => g.studentId === user?.id);
    return studentGrades.map((g) => ({
      label: courses.find((c) => c.courseId === g.courseId)?.courseName || g.courseId,
      value: g.courseId,
    }));
  };

  return (
    <div>
      {/* 申诉说明 */}
      <Card style={{ marginBottom: 24 }}>
        <h3>成绩申诉流程说明</h3>
        <Steps
          current={-1}
          items={[
            { title: '提交申诉', description: '提交成绩申诉申请' },
            { title: '待审核', description: '系统接收您的申诉' },
            { title: '审核中', description: '教师进行复审' },
            { title: '完成', description: '获得审核结果' },
          ]}
        />
      </Card>

      {/* 申诉列表 */}
      <Card
        title="我的申诉记录"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              form.resetFields();
              setIsModalVisible(true);
            }}
          >
            新建申诉
          </Button>
        }
        style={{ marginBottom: 24 }}
      >
        {myAppeals.length > 0 ? (
          <Table
            dataSource={myAppeals}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        ) : (
          <Empty description="暂无申诉记录" />
        )}
      </Card>

      {/* 申诉详情面板 */}
      {myAppeals.length > 0 && (
        <Card title="最近申诉详情">
          {myAppeals.map((appeal) => (
            <div key={appeal.id} style={{ marginBottom: 24 }}>
              <Divider>{appeal.courseName}</Divider>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div>
                  <p>
                    <strong>原始成绩：</strong> {appeal.originalScore} 分
                  </p>
                  <p>
                    <strong>申诉时间：</strong> {appeal.appealTime}
                  </p>
                  <p>
                    <strong>申诉原因：</strong>
                  </p>
                  <p style={{ background: '#fafafa', padding: 12, borderRadius: 4 }}>
                    {appeal.appealReason}
                  </p>
                </div>

                <div>
                  <p>
                    <strong>审核状态：</strong>{' '}
                    <Tag color={statusColorMap[appeal.status]}>
                      {statusTextMap[appeal.status]}
                    </Tag>
                  </p>
                  {appeal.reviewedBy && (
                    <>
                      <p>
                        <strong>审核教师：</strong> {appeal.reviewedBy}
                      </p>
                      <p>
                        <strong>审核时间：</strong> {appeal.reviewedTime}
                      </p>
                    </>
                  )}
                  {appeal.newScore && (
                    <p>
                      <strong>调整后成绩：</strong>{' '}
                      <span style={{ color: '#52c41a', fontSize: 16, fontWeight: 'bold' }}>
                        {appeal.newScore} 分
                      </span>
                    </p>
                  )}

                  {appeal.reviewFeedback && (
                    <>
                      <p>
                        <strong>审核意见：</strong>
                      </p>
                      <p style={{ background: '#f0f5ff', padding: 12, borderRadius: 4 }}>
                        {appeal.reviewFeedback}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </Card>
      )}

      {/* 提交申诉模态框 */}
      <Modal
        title="提交成绩申诉"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmitAppeal} layout="vertical">
          <Form.Item
            name="courseId"
            label="课程选择"
            rules={[{ required: true, message: '请选择课程' }]}
          >
            <Select placeholder="请选择要申诉的课程" options={getCourseOptions()} />
          </Form.Item>

          <Form.Item
            name="appealReason"
            label="申诉理由"
            rules={[{ required: true, message: '请输入申诉理由' }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="请详细说明您认为成绩不合理的原因。建议包括：
1. 具体题目编号和判分问题
2. 参考标准或相关依据
3. 其他支持证据"
            />
          </Form.Item>

          <div style={{ padding: 12, background: '#fafafa', borderRadius: 4, marginBottom: 16 }}>
            <p style={{ margin: '0 0 8px 0', fontSize: 12, color: '#666' }}>
              <strong>注意事项：</strong>
            </p>
            <ul style={{ margin: 0, paddingLeft: 20, fontSize: 12, color: '#666' }}>
              <li>申诉应在成绩发布后30天内提出</li>
              <li>提供具体的申诉理由和依据</li>
              <li>教师将在7个工作日内进行审核</li>
              <li>申诉结果以教师的复审意见为准</li>
            </ul>
          </div>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              提交申诉
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AppealPage;
