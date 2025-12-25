import { useState } from 'react';
import { Card, Table, Button, Modal, Form, Input, InputNumber, Select, Space, message } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useDataStore } from '../../store/dataStore';
import type { Grade } from '../../types';

const gradeLetters = ['A', 'B', 'C', 'D', 'F'];

export const GradesManagePage = () => {
  const { grades, courses, addGrade, updateGrade, deleteGrade } = useDataStore();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: '学生ID',
      dataIndex: 'studentId',
      key: 'studentId',
    },
    {
      title: '课程名称',
      key: 'courseName',
      render: (_: any, record: Grade) => courses.find((c) => c.courseId === record.courseId)?.courseName,
    },
    {
      title: '成绩',
      dataIndex: 'score',
      key: 'score',
      sorter: (a: Grade, b: Grade) => a.score - b.score,
    },
    {
      title: '等级',
      dataIndex: 'gradeLevel',
      key: 'gradeLevel',
    },
    {
      title: '评语',
      dataIndex: 'feedback',
      key: 'feedback',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'operation',
      render: (_: any, record: Grade) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const handleEdit = (grade: Grade) => {
    setEditingId(grade.id);
    form.setFieldsValue({
      studentId: grade.studentId,
      courseId: grade.courseId,
      score: grade.score,
      gradeLevel: grade.gradeLevel,
      feedback: grade.feedback,
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '是否确定删除此成绩?',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        deleteGrade(id);
        message.success('成绩已删除');
      },
    });
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (editingId) {
        updateGrade({
          id: editingId,
          ...values,
          updatedAt: new Date().toISOString(),
        });
        message.success('成绩已更新');
      } else {
        addGrade({
          id: `grade_${Date.now()}`,
          ...values,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        message.success('成绩已添加');
      }

      form.resetFields();
      setIsModalVisible(false);
      setEditingId(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Card
        title="成绩管理"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingId(null);
              form.resetFields();
              setIsModalVisible(true);
            }}
          >
            添加成绩
          </Button>
        }
      >
        <Table
          dataSource={grades}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingId ? '编辑成绩' : '添加成绩'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="studentId"
            label="学生ID"
            rules={[{ required: true, message: '请输入学生ID' }]}
          >
            <Input placeholder="请输入学生ID" disabled={!!editingId} />
          </Form.Item>

          <Form.Item
            name="courseId"
            label="课程"
            rules={[{ required: true, message: '请选择课程' }]}
          >
            <Select
              placeholder="请选择课程"
              options={courses.map((c) => ({
                label: c.courseName,
                value: c.courseId,
              }))}
              disabled={!!editingId}
            />
          </Form.Item>

          <Form.Item
            name="score"
            label="成绩"
            rules={[{ required: true, message: '请输入成绩' }]}
          >
            <InputNumber min={0} max={100} placeholder="请输入成绩" />
          </Form.Item>

          <Form.Item
            name="gradeLevel"
            label="等级"
            rules={[{ required: true, message: '请选择等级' }]}
          >
            <Select
              placeholder="请选择等级"
              options={gradeLetters.map((g) => ({
                label: g,
                value: g,
              }))}
            />
          </Form.Item>

          <Form.Item name="feedback" label="评语">
            <Input.TextArea rows={3} placeholder="请输入教师评语" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              {editingId ? '更新' : '添加'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default GradesManagePage;
