import { useState } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, Space, message } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useDataStore } from '../../store/dataStore';
import type { Teacher } from '../../types';

export const TeachersManagePage = () => {
  const { teachers, addTeacher, updateTeacher } = useDataStore();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: '工号',
      dataIndex: 'teacherId',
      key: 'teacherId',
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
      title: '所属系',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: '职称',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '操作',
      key: 'operation',
      render: (_: any, record: Teacher) => (
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

  const handleEdit = (teacher: Teacher) => {
    setEditingId(teacher.id);
    form.setFieldsValue({
      teacherId: teacher.teacherId,
      name: teacher.name,
      gender: teacher.gender,
      department: teacher.department,
      title: teacher.title,
      email: teacher.email,
      phone: teacher.phone,
      hireDate: teacher.hireDate,
      education: teacher.education,
      researchArea: teacher.researchArea,
      status: teacher.status,
    });
    setIsModalVisible(true);
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      if (editingId) {
        // 更新教师
        const updatedTeacher = {
          id: editingId,
          username: values.teacherId,
          email: values.email,
          phone: values.phone,
          role: 'teacher' as const,
          createdAt: new Date().toISOString(),
          ...values,
          courseIds: [], // 暂时为空数组
        };
        updateTeacher(updatedTeacher);
        message.success('教师信息已更新');
      } else {
        // 添加教师
        const newTeacher = {
          id: `teacher_${Date.now()}`,
          username: values.teacherId,
          email: values.email,
          phone: values.phone,
          role: 'teacher' as const,
          createdAt: new Date().toISOString(),
          ...values,
          courseIds: [], // 初始为空数组
        };
        addTeacher(newTeacher);
        message.success('教师已添加');
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
        title="教师管理"
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
            添加教师
          </Button>
        }
      >
        <Table
          dataSource={teachers}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingId ? '编辑教师' : '添加教师'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        style={{height: '98%', top: '1%', overflow: 'hidden' }}
        // borderRadius={12}
        // scrollable={false}
        bodyStyle={{ overflow: 'hidden' }}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="teacherId"
            label="工号"
            rules={[{ required: true, message: '请输入工号' }]}
          >
            <Input placeholder="请输入工号" disabled={!!editingId} />
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
            name="department"
            label="所属系"
            rules={[{ required: true, message: '请输入所属系' }]}
          >
            <Input placeholder="请输入所属系" />
          </Form.Item>

          <Form.Item
            name="title"
            label="职称"
            rules={[{ required: true, message: '请输入职称' }]}
          >
            <Select
              placeholder="请选择职称"
              options={[
                { label: '教授', value: '教授' },
                { label: '副教授', value: '副教授' },
                { label: '讲师', value: '讲师' },
                { label: '助教', value: '助教' },
              ]}
            />
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

          <Form.Item name="phone" label="联系方式">
            <Input placeholder="请输入联系方式" />
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

export default TeachersManagePage;
