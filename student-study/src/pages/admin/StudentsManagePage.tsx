import { useState } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, Space, message } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useDataStore } from '../../store/dataStore';
import type { Student } from '../../types';

export const StudentsManagePage = () => {
  const { students, addStudent, updateStudent } = useDataStore();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: '学号',
      dataIndex: 'studentId',
      key: 'studentId',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      render: (gender: string) => (gender === 'male' ? '男' : '女'),
    },
    {
      title: '学院',
      dataIndex: 'college',
      key: 'college',
    },
    {
      title: '专业',
      dataIndex: 'major',
      key: 'major',
    },
    {
      title: '联系方式',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '操作',
      key: 'operation',
      render: (_: any, record: Student) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button danger size="small" icon={<DeleteOutlined />}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const handleEdit = (student: Student) => {
    setEditingId(student.id);
    form.setFieldsValue({
      studentId: student.studentId,
      name: student.name,
      gender: student.gender,
      college: student.college,
      major: student.major,
      phone: student.phone,
      homeAddress: student.homeAddress,
      email: student.email,
    });
    setIsModalVisible(true);
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (editingId) {
        updateStudent({
          id: editingId,
          username: values.email.split('@')[0],
          role: 'student',
          ...values,
          createdAt: new Date().toISOString(),
        });
        message.success('学生信息已更新');
      } else {
        addStudent({
          id: `student_${Date.now()}`,
          username: values.email.split('@')[0],
          role: 'student',
          ...values,
          createdAt: new Date().toISOString(),
        });
        message.success('学生已添加');
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
        title="学生管理"
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
            添加学生
          </Button>
        }
      >
        <Table
          dataSource={students}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingId ? '编辑学生' : '添加学生'}
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
            label="学号"
            rules={[{ required: true, message: '请输入学号' }]}
          >
            <Input placeholder="请输入学号" disabled={!!editingId} />
          </Form.Item>

          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>

          <Form.Item
            name="gender"
            label="性别"
            rules={[{ required: true, message: '请选择性别' }]}
          >
            <Select
              placeholder="请选择性别"
              options={[
                { label: '男', value: 'male' },
                { label: '女', value: 'female' },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="college"
            label="学院"
            rules={[{ required: true, message: '请输入学院' }]}
          >
            <Input placeholder="请输入学院" />
          </Form.Item>

          <Form.Item
            name="major"
            label="专业"
            rules={[{ required: true, message: '请输入专业' }]}
          >
            <Input placeholder="请输入专业" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="联系方式"
            rules={[{ required: true, message: '请输入联系方式' }]}
          >
            <Input placeholder="请输入联系方式" />
          </Form.Item>

          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱' },
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>

          <Form.Item name="homeAddress" label="家庭住址">
            <Input placeholder="请输入家庭住址" />
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

export default StudentsManagePage;
