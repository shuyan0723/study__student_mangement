import { useState, useMemo } from 'react';
import { Card, Table, Tag, Statistic, Row, Col, Select, Button, Empty, Spin } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { useAuthStore } from '../../store/authStore';
import { useDataStore } from '../../store/dataStore';
import './StudentPage.less';

export const StudentGradesPage = () => {
  const { user } = useAuthStore();
  const { grades, courses } = useDataStore();
  const [loading, setLoading] = useState(false);

  const studentGrades = useMemo(() => {
    return grades.filter((g) => g.studentId === user?.id);
  }, [grades, user?.id]);

  const getCourseName = (courseId: string) => {
    return courses.find((c) => c.courseId === courseId)?.courseName || courseId;
  };

  const avgScore = useMemo(() => {
    if (studentGrades.length === 0) return 0;
    return (studentGrades.reduce((sum, g) => sum + g.score, 0) / studentGrades.length).toFixed(2);
  }, [studentGrades]);

  const excellentCount = studentGrades.filter((g) => g.score >= 85).length;
  const failCount = studentGrades.filter((g) => g.score < 60).length;

  const columns = [
    {
      title: '课程名称',
      key: 'courseName',
      render: (_: any, record: any) => getCourseName(record.courseId),
    },
    {
      title: '成绩',
      dataIndex: 'score',
      key: 'score',
      sorter: (a: any, b: any) => a.score - b.score,
      render: (score: number) => <strong>{score}</strong>,
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
      title: '教师评语',
      dataIndex: 'feedback',
      key: 'feedback',
      render: (feedback: string | undefined) => feedback || '-',
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
    },
  ];

  const handleExport = async () => {
    setLoading(true);
    try {
      // 模拟导出
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // 这里可以集成实际的导出功能
      alert('成绩单已导出为PDF');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-page">
      <Card title="成绩查询" extra={<Button icon={<DownloadOutlined />} onClick={handleExport}>
        导出成绩单
      </Button>}>
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={6}>
            <Statistic title="平均成绩" value={avgScore} suffix="分" />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic title="已修课程" value={studentGrades.length} suffix="门" />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic title="优秀课程" value={excellentCount} suffix="门" />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic title="不及格课程" value={failCount} suffix="门" />
          </Col>
        </Row>

        <Spin spinning={loading}>
          {studentGrades.length > 0 ? (
            <Table
              dataSource={studentGrades}
              columns={columns}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          ) : (
            <Empty description="暂无成绩数据" />
          )}
        </Spin>
      </Card>
    </div>
  );
};

export default StudentGradesPage;
