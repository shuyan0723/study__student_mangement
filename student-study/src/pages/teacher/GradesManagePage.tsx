import { useState } from 'react';
import { Card, Table, Button, Select, Space, message, Tag, Modal, Form, InputNumber, Input } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useAuthStore } from '../../store/authStore';
import { useDataStore } from '../../store/dataStore';
import type { Grade } from '../../types';

export const TeacherGradesManagePage = () => {
  const { user } = useAuthStore();
  const { grades, courses, students, updateGrade } = useDataStore();
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  // 获取教师的课程
  const teacherCourses = courses.filter((c) => c.teacherId === user?.id);
  const courseIds = teacherCourses.map((c) => c.courseId);

  // 获取教师课程中的成绩
  const teacherGrades = grades.filter((g) => courseIds.includes(g.courseId));

  const filteredGrades = selectedCourse
    ? teacherGrades.filter((g) => g.courseId === selectedCourse)
    : teacherGrades;

  const columns = [
    {
      title: '学生',
      key: 'student',
      render: (_: any, record: Grade) => {
        const student = students.find((s) => s.id === record.studentId);
        return student?.name || record.studentId;
      },
    },
    {
      title: '课程',
      key: 'course',
      render: (_: any, record: Grade) => {
        return courses.find((c) => c.courseId === record.courseId)?.courseName;
      },
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
      render: (level: string) => {
        const colorMap: Record<string, string> = {
          A: 'success',
          B: 'processing',
          C: 'warning',
          D: 'warning',
          F: 'error',
        };
        return <Tag color={colorMap[level]}>{level}</Tag>;
      },
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
            onClick={() => {
              setEditingGrade(record);
              setModalVisible(true);
              form.setFieldsValue(record);
            }}
          >
            编辑
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card
        title="我的成绩记录"
        extra={
          <Select
            style={{ width: 200 }}
            placeholder="选择课程"
            allowClear
            value={selectedCourse || undefined}
            onChange={setSelectedCourse}
            options={teacherCourses.map((c) => ({
              label: c.courseName,
              value: c.courseId,
            }))}
          />
        }
      >
        <Table
          dataSource={filteredGrades}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title="编辑成绩"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingGrade(null);
          form.resetFields();
        }}
        onOk={() => {
          form.validateFields().then((values) => {
            if (editingGrade) {
              updateGrade({
                ...editingGrade,
                ...values,
                updatedAt: new Date().toISOString().split('T')[0],
              });
              message.success('成绩更新成功');
            }
            setModalVisible(false);
            setEditingGrade(null);
            form.resetFields();
          });
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="score"
            label="分数"
            rules={[{ required: true, message: '请输入分数' }]}
          >
            <InputNumber min={0} max={100} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="gradeLevel"
            label="等级"
            rules={[{ required: true, message: '请选择等级' }]}
          >
            <Select
              options={[
                { label: 'A (优秀)', value: 'A' },
                { label: 'B (良好)', value: 'B' },
                { label: 'C (中等)', value: 'C' },
                { label: 'D (及格)', value: 'D' },
                { label: 'F (不及格)', value: 'F' },
              ]}
            />
          </Form.Item>
          <Form.Item name="feedback" label="评语">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TeacherGradesManagePage;
