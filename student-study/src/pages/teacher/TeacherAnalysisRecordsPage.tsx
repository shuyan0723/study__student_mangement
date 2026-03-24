import { useState, useEffect, useRef } from 'react';
import {
  Card,
  Table,
  Button,
  Tag,
  Space,
  Modal,
  message,
  Popconfirm,
  Row,
  Col,
  Statistic,
  Timeline,
  Typography,
  Select,
  Progress,
  Alert
} from 'antd';
import {
  EyeOutlined,
  DeleteOutlined,
  DownloadOutlined,
  ReloadOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { AnalysisRecord, AnalysisResult } from '../../types';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

export const TeacherAnalysisRecordsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState<AnalysisRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [reportVisible, setReportVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AnalysisRecord | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    loadRecords();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [page, statusFilter]);

  // 自动刷新分析中的记录
  useEffect(() => {
    const hasAnalyzing = records.some(r => r.status === 'analyzing' || r.status === 'pending');
    if (hasAnalyzing && !intervalRef.current) {
      intervalRef.current = setInterval(() => {
        loadRecordsSilent();
      }, 5000); // 每5秒刷新一次
    } else if (!hasAnalyzing && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [records]);

  const loadRecordsSilent = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      });
      if (statusFilter) {
        params.append('status', statusFilter);
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/ai-analysis/records?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const data = await response.json();

      if (data.success) {
        setRecords(data.data.records);
        setTotal(data.data.total);
      }
    } catch (error) {
      console.error('静默刷新失败:', error);
    }
  };

  const loadRecords = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      });
      if (statusFilter) {
        params.append('status', statusFilter);
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/ai-analysis/records?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const data = await response.json();

      if (data.success) {
        setRecords(data.data.records);
        setTotal(data.data.total);
      }
    } catch (error) {
      message.error('加载分析记录失败');
    } finally {
      setLoading(false);
    }
  };

  // 计算统计数据
  const stats = {
    total: records.length,
    completed: records.filter(r => r.status === 'completed').length,
    analyzing: records.filter(r => r.status === 'analyzing' || r.status === 'pending').length,
    failed: records.filter(r => r.status === 'failed').length,
    totalTokens: records.reduce((sum, r) => sum + (r.tokensUsed || 0), 0),
    totalCost: records.reduce((sum, r) => sum + (r.estimatedCost || 0), 0)
  };

  const handleViewReport = async (record: AnalysisRecord) => {
    if (record.status !== 'completed') {
      message.info('分析尚未完成');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/ai-analysis/records/${record.id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const data = await response.json();

      if (data.success) {
        setSelectedRecord(data.data);
        setReportVisible(true);
      }
    } catch (error) {
      message.error('加载报告失败');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/ai-analysis/records/${id}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const data = await response.json();

      if (data.success) {
        message.success('删除成功');
        loadRecords();
      }
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleExportReport = (record: AnalysisRecord) => {
    if (!record.analysisResult) {
      message.warning('报告未生成');
      return;
    }

    // 导出为JSON文件
    const dataStr = JSON.stringify(record.analysisResult, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${record.courseNames.join('_')}_${new Date(record.createdAt).toLocaleDateString()}_分析报告.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getStatusTag = (status: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      pending: { color: 'default', text: '待处理' },
      analyzing: { color: 'processing', text: '分析中' },
      completed: { color: 'success', text: '已完成' },
      failed: { color: 'error', text: '失败' },
      deleted: { color: 'default', text: '已删除' }
    };
    const s = statusMap[status] || { color: 'default', text: status };
    return <Tag color={s.color}>{s.text}</Tag>;
  };

  const columns: ColumnsType<AnalysisRecord> = [
    {
      title: '分析时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (text: string) => new Date(text).toLocaleString()
    },
    {
      title: '分析范围',
      key: 'scope',
      ellipsis: true,
      render: (_: any, record: AnalysisRecord) => (
        <div>
          <div>{record.courseNames.join('、')}</div>
          {record.examType && <Tag color="blue">{record.examType}</Tag>}
        </div>
      )
    },
    {
      title: '分析维度',
      dataIndex: 'analysisDimensions',
      key: 'analysisDimensions',
      ellipsis: true,
      render: (dimensions: string[]) => dimensions.join('、')
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => getStatusTag(status)
    },
    {
      title: '消耗Token',
      dataIndex: 'tokensUsed',
      key: 'tokensUsed',
      width: 100,
      render: (tokens?: number) => tokens || '-'
    },
    {
      title: '预估成本',
      dataIndex: 'estimatedCost',
      key: 'estimatedCost',
      width: 100,
      render: (cost?: number) => cost ? `¥${cost.toFixed(4)}` : '-'
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_: any, record: AnalysisRecord) => (
        <Space size="small">
          {record.status === 'completed' && (
            <>
              <Button
                type="link"
                size="small"
                icon={<EyeOutlined />}
                onClick={() => handleViewReport(record)}
              >
                查看报告
              </Button>
              <Button
                type="link"
                size="small"
                icon={<DownloadOutlined />}
                onClick={() => handleExportReport(record)}
              >
                导出
              </Button>
            </>
          )}
          {record.status === 'failed' && (
            <Text type="secondary">{record.errorMessage || '分析失败'}</Text>
          )}
          <Popconfirm
            title="确定要删除这条分析记录吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const renderAnalysisResult = (result: AnalysisResult) => (
    <div style={{ padding: '24px' }}>
      <Title level={3}>{result.title}</Title>

      {/* 基础数据概览 */}
      <Card title="基础数据概览" style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          {result.summary.totalStudents && (
            <Col span={6}>
              <Statistic title="学生总数" value={result.summary.totalStudents} />
            </Col>
          )}
          {result.summary.average && (
            <Col span={6}>
              <Statistic
                title="平均分"
                value={result.summary.average}
                precision={2}
                suffix="分"
              />
            </Col>
          )}
          {result.summary.highest && (
            <Col span={6}>
              <Statistic title="最高分" value={result.summary.highest} suffix="分" />
            </Col>
          )}
          {result.summary.lowest && (
            <Col span={6}>
              <Statistic title="最低分" value={result.summary.lowest} suffix="分" />
            </Col>
          )}
          {result.summary.passRate && (
            <Col span={6}>
              <Statistic
                title="及格率"
                value={result.summary.passRate * 100}
                precision={1}
                suffix="%"
              />
            </Col>
          )}
          {result.summary.excellentRate && (
            <Col span={6}>
              <Statistic
                title="优秀率"
                value={result.summary.excellentRate * 100}
                precision={1}
                suffix="%"
              />
            </Col>
          )}
        </Row>
      </Card>

      {/* 分维度分析 */}
      {result.dimensions.map((dim, index) => (
        <Card key={index} title={dim.name} style={{ marginBottom: 16 }}>
          <Paragraph>{dim.content}</Paragraph>
          <Title level={5}>改进建议：</Title>
          <Timeline
            items={dim.suggestions.map((suggestion, i) => ({
              children: suggestion,
              color: i < 3 ? 'green' : 'blue'
            }))}
          />
        </Card>
      ))}

      {/* 综合建议 */}
      <Card title="综合教学建议" style={{ marginBottom: 16 }}>
        <Timeline
          items={result.overallSuggestions.map((suggestion, index) => ({
            children: (
              <Space key={index}>
                <Tag color={index < 3 ? 'red' : 'orange'}>优先级{index + 1}</Tag>
                <Text>{suggestion}</Text>
              </Space>
            )
          }))}
        />
      </Card>

      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <Space>
          <Button onClick={() => setReportVisible(false)}>关闭</Button>
          <Button type="primary" onClick={() => handleExportReport(selectedRecord!)}>
            <DownloadOutlined /> 导出报告
          </Button>
        </Space>
      </div>
    </div>
  );

  return (
    <div style={{ padding: '24px' }}>
      {/* 统计信息卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总记录数"
              value={total}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已完成"
              value={stats.completed}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="分析中"
              value={stats.analyzing}
              valueStyle={{ color: stats.analyzing > 0 ? '#faad14' : '#999' }}
            />
            {stats.analyzing > 0 && (
              <Progress
                percent={100}
                status="active"
                showInfo={false}
                size="small"
                style={{ marginTop: 8 }}
              />
            )}
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总消耗Token"
              value={stats.totalTokens}
              valueStyle={{ fontSize: 20, color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {stats.analyzing > 0 && (
        <Alert
          message="有分析任务正在进行中"
          description="系统将自动刷新分析状态，您也可以手动点击刷新按钮查看最新进展。"
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <Card
        title="AI分析记录"
        extra={
          <Space>
            <Select
              placeholder="筛选状态"
              allowClear
              style={{ width: 120 }}
              onChange={(value) => {
                setStatusFilter(value);
                setPage(1);
              }}
              value={statusFilter}
            >
              <Option value="pending">待处理</Option>
              <Option value="analyzing">分析中</Option>
              <Option value="completed">已完成</Option>
              <Option value="failed">失败</Option>
            </Select>
            <Button icon={<ReloadOutlined />} onClick={loadRecords} loading={loading}>
              刷新
            </Button>
            <Button type="primary" onClick={() => navigate('/teacher/ai-analysis')}>
              发起新分析
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={records}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{
            current: page,
            pageSize: 10,
            total,
            onChange: (newPage) => setPage(newPage),
            showSizeChanger: false,
            showTotal: (total) => `共 ${total} 条记录`
          }}
        />
      </Card>

      {/* 报告详情模态框 */}
      <Modal
        title="分析报告详情"
        open={reportVisible}
        onCancel={() => setReportVisible(false)}
        footer={null}
        width={1000}
        style={{ top: 20 }}
      >
        {selectedRecord?.analysisResult && renderAnalysisResult(selectedRecord.analysisResult)}
      </Modal>
    </div>
  );
};

export default TeacherAnalysisRecordsPage;
