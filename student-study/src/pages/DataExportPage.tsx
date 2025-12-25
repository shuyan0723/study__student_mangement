import { Card, Table, Button, Form, Input, Select, Row, Col, message } from 'antd';
import { DownloadOutlined, SearchOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useDataStore } from '../store/dataStore';

export const DataExportPage = () => {
  const [form] = Form.useForm();
  const { students, courses, grades } = useDataStore();
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [exportFormat, setExportFormat] = useState('csv');
  const [exportType, setExportType] = useState('grades');

  const handleSearch = async (values: any) => {
    setLoading(true);
    try {
      let results:any = [];

      switch (values.searchType) {
        case 'student':
          results = students.filter((s) => {
            if (values.keyword) {
              return (
                s.name?.includes(values.keyword) ||
                s.studentId?.includes(values.keyword) ||
                s.email?.includes(values.keyword)
              );
            }
            return true;
          });
          break;

        case 'grade':
          results = grades.filter((g) => {
            if (values.scoreRange) {
              const [min, max] = values.scoreRange.split('-').map(Number);
              return g.score >= min && g.score <= max;
            }
            return true;
          });
          break;

        case 'course':
          results = courses.filter((c) => {
            if (values.keyword) {
              return c.courseName?.includes(values.keyword);
            }
            return true;
          });
          break;

        default:
          results = [];
      }

      await new Promise((resolve) => setTimeout(resolve, 300));
      setSearchResults(results);
      message.success(`找到 ${results.length} 条记录`);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      let content = '';
      let filename = '';

      switch (exportType) {
        case 'grades':
          filename = `grades_${new Date().getTime()}.${exportFormat}`;
          if (exportFormat === 'csv') {
            content = '学号,课程号,课程名,成绩,等级,反馈\n';
            grades.forEach((g) => {
              const course = courses.find((c) => c.courseId === g.courseId);
              content += `${g.studentId},${g.courseId},"${course?.courseName}",${g.score},${g.gradeLevel},"${g.feedback || ''}"\n`;
            });
          } else {
            // Excel format
            content = 'Excel导出数据\n';
          }
          break;

        case 'students':
          filename = `students_${new Date().getTime()}.${exportFormat}`;
          if (exportFormat === 'csv') {
            content = '学号,姓名,学院,专业,联系方式\n';
            students.forEach((s) => {
              content += `${s.studentId},"${s.name}","${s.college}","${s.major}","${s.phone || ''}"\n`;
            });
          }
          break;

        case 'courses':
          filename = `courses_${new Date().getTime()}.${exportFormat}`;
          if (exportFormat === 'csv') {
            content = '课程号,课程名,学分,学时,学期\n';
            courses.forEach((c) => {
              content += `${c.courseId},"${c.courseName}",${c.credits},${c.hours},"${c.semester}"\n`;
            });
          }
          break;

        default:
          return;
      }

      // 创建blob并下载
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      message.success('数据导出成功');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: '关键字段',
      dataIndex: 'studentId',
      key: 'studentId',
      width: '20%',
    },
    {
      title: '详细信息',
      dataIndex: 'name',
      key: 'name',
      width: '40%',
    },
    {
      title: '额外信息',
      dataIndex: 'major',
      key: 'major',
      width: '30%',
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Button type="link" size="small">
          查看详情
        </Button>
      ),
    },
  ];

  return (
    <div>
      {/* 高级搜索 */}
      <Card title="🔍 高级搜索" style={{ marginBottom: 24 }}>
        <Form form={form} onFinish={handleSearch} layout="vertical">
          <Row gutter={16}>
            <Col xs={24} sm={12} md={6}>
              <Form.Item
                name="searchType"
                label="搜索类型"
                initialValue="student"
                rules={[{ required: true }]}
              >
                <Select
                  options={[
                    { label: '搜索学生', value: 'student' },
                    { label: '搜索成绩', value: 'grade' },
                    { label: '搜索课程', value: 'course' },
                  ]}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Form.Item name="keyword" label="关键字">
                <Input placeholder="输入搜索关键字" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Form.Item name="scoreRange" label="成绩范围">
                <Select
                  placeholder="选择成绩范围"
                  options={[
                    { label: '90-100 (优秀)', value: '90-100' },
                    { label: '80-89 (良好)', value: '80-89' },
                    { label: '70-79 (中等)', value: '70-79' },
                    { label: '60-69 (及格)', value: '60-69' },
                    { label: '0-59 (不及格)', value: '0-59' },
                  ]}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Form.Item label=" ">
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  block
                  htmlType="submit"
                  loading={loading}
                >
                  搜索
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>

        {searchResults.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <p>找到 {searchResults.length} 条记录</p>
            <Table
              dataSource={searchResults}
              columns={columns}
              rowKey={(record) => record.id || JSON.stringify(record)}
              size="small"
              pagination={{ pageSize: 10 }}
            />
          </div>
        )}
      </Card>

      {/* 数据导出 */}
      <Card title="📊 数据导出">
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={6}>
            <p>选择导出类型：</p>
            <Select
              value={exportType}
              onChange={setExportType}
              options={[
                { label: '导出成绩数据', value: 'grades' },
                { label: '导出学生信息', value: 'students' },
                { label: '导出课程数据', value: 'courses' },
              ]}
              style={{ width: '100%' }}
            />
          </Col>

          <Col xs={24} sm={12} md={6}>
            <p>选择导出格式：</p>
            <Select
              value={exportFormat}
              onChange={setExportFormat}
              options={[
                { label: 'CSV 格式', value: 'csv' },
                { label: 'Excel 格式', value: 'excel' },
              ]}
              style={{ width: '100%' }}
            />
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={handleExport}
              loading={loading}
              style={{ marginTop: 24, width: '100%' }}
            >
              导出数据
            </Button>
          </Col>
        </Row>

        <div style={{ padding: 12, background: '#f0f5ff', borderRadius: 4 }}>
          <p style={{ margin: '0 0 8px 0' }}>
            <strong>导出说明：</strong>
          </p>
          <ul style={{ margin: 0, paddingLeft: 20, fontSize: 12 }}>
            <li>CSV 格式可用 Excel、Google Sheets 等工具打开</li>
            <li>导出的数据包含所有可见字段</li>
            <li>大数据集导出可能需要较长时间</li>
            <li>导出文件自动包含时间戳以避免覆盖</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default DataExportPage;
