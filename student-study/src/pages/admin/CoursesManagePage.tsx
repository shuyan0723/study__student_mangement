import { useState } from 'react';
import { Card, Table, Button, Modal, Form, Input, InputNumber, Select, Space, message } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useDataStore } from '../../store/dataStore';
import type { Course } from '../../types';

export const CoursesManagePage = () => {
  const { courses, addCourse, updateCourse, deleteCourse } = useDataStore();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const teachers = [
    { id: 'teacher_001', name: '王教授' },
    { id: 'teacher_002', name: '李教授' },
  ];

  const columns = [
    {
      title: '课程名称',
      dataIndex: 'courseName',
      key: 'courseName',
    },
    {
      title: '学分',
      dataIndex: 'credits',
      key: 'credits',
    },
    {
      title: '学时',
      dataIndex: 'hours',
      key: 'hours',
    },
    {
      title: '学期',
      dataIndex: 'semester',
      key: 'semester',
    },
    {
      title: '授课教师',
      key: 'teacherName',
      render: (_: any, record: Course) => record.teacherName,
    },
    {
      title: '操作',
      key: 'operation',
      render: (_: any, record: Course) => (
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
            onClick={() => handleDelete(record.courseId)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const handleEdit = (course: Course) => {
    setEditingId(course.courseId);
    form.setFieldsValue({
      courseName: course.courseName,
      credits: course.credits,
      hours: course.hours,
      semester: course.semester,
      teacherId: course.teacherId,
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '是否确定删除此课程?',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        deleteCourse(id);
        message.success('课程已删除');
      },
    });
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const teacher = teachers.find((t) => t.id === values.teacherId);

      if (editingId) {
        updateCourse({
          courseId: editingId,
          ...values,
          teacherName: teacher?.name,
        });
        message.success('课程已更新');
      } else {
        addCourse({
          courseId: `course_${Date.now()}`,
          ...values,
          teacherName: teacher?.name,
        });
        message.success('课程已添加');
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
        title="课程管理"
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
            添加课程
          </Button>
        }
      >
        <Table
          dataSource={courses}
          columns={columns}
          rowKey="courseId"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingId ? '编辑课程' : '添加课程'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="courseName"
            label="课程名称"
            rules={[{ required: true, message: '请输入课程名称' }]}
          >
            <Input placeholder="请输入课程名称" />
          </Form.Item>

          <Form.Item
            name="credits"
            label="学分"
            rules={[{ required: true, message: '请输入学分' }]}
          >
            <InputNumber min={0} placeholder="请输入学分" />
          </Form.Item>

          <Form.Item
            name="hours"
            label="学时"
            rules={[{ required: true, message: '请输入学时' }]}
          >
            <InputNumber min={0} placeholder="请输入学时" />
          </Form.Item>

          <Form.Item
            name="semester"
            label="学期"
            rules={[{ required: true, message: '请输入学期' }]}
          >
            <Input placeholder="例如: 2024-1" />
          </Form.Item>

          <Form.Item
            name="teacherId"
            label="授课教师"
            rules={[{ required: true, message: '请选择教师' }]}
          >
            <Select
              placeholder="请选择教师"
              options={teachers.map((t) => ({
                label: t.name,
                value: t.id,
              }))}
            />
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

export default CoursesManagePage;
