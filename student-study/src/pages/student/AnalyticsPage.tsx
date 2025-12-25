import { Card, Row, Col, Statistic, Progress, Empty, Space, Tag } from 'antd';
import { LineChartOutlined, BarChartOutlined, PieChartOutlined } from '@ant-design/icons';
import { useAuthStore } from '../../store/authStore';
import { useDataStore } from '../../store/dataStore';
import { useMemo } from 'react';

export const AnalyticsPage = () => {
  const { user } = useAuthStore();
  const { grades, courses } = useDataStore();

  const studentGrades = useMemo(() => {
    return grades.filter((g) => g.studentId === user?.id);
  }, [grades, user?.id]);

  const analytics = useMemo(() => {
    if (studentGrades.length === 0) {
      return {
        avgScore: 0,
        highestScore: 0,
        lowestScore: 0,
        gradeDistribution: { A: 0, B: 0, C: 0, D: 0, F: 0 },
        passRate: 0,
        excellentRate: 0,
      };
    }

    const scores = studentGrades.map((g) => g.score);
    const avgScore = scores.reduce((a, b) => a + b) / scores.length;
    const highestScore = Math.max(...scores);
    const lowestScore = Math.min(...scores);

    const gradeDistribution = studentGrades.reduce(
      (acc, g) => {
        acc[g.gradeLevel as 'A' | 'B' | 'C' | 'D' | 'F']++;
        return acc;
      },
      { A: 0, B: 0, C: 0, D: 0, F: 0 }
    );

    const passRate = ((studentGrades.filter((g) => g.score >= 60).length / studentGrades.length) * 100).toFixed(1);
    const excellentRate = ((studentGrades.filter((g) => g.score >= 85).length / studentGrades.length) * 100).toFixed(1);

    return {
      avgScore: avgScore.toFixed(2),
      highestScore,
      lowestScore,
      gradeDistribution,
      passRate: parseFloat(passRate),
      excellentRate: parseFloat(excellentRate),
    };
  }, [studentGrades]);

  if (studentGrades.length === 0) {
    return (
      <Card title="成绩分析">
        <Empty description="暂无成绩数据，无法生成分析报告" />
      </Card>
    );
  }

  return (
    <div>
      {/* 关键指标 */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title="平均成绩"
              value={analytics.avgScore}
              suffix="分"
              prefix={<LineChartOutlined />}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title="最高成绩"
              value={analytics.highestScore}
              suffix="分"
              prefix={<BarChartOutlined />}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title="最低成绩"
              value={analytics.lowestScore}
              suffix="分"
              prefix={<BarChartOutlined />}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title="及格率"
              value={analytics.passRate}
              suffix="%"
              prefix={<PieChartOutlined />}
            />
          </Col>
        </Row>
      </Card>

      <Row gutter={24}>
        {/* 成绩等级分布 */}
        <Col xs={24} md={12}>
          <Card title="成绩等级分布">
            <Space direction="vertical" style={{ width: '100%' }}>
              {Object.entries(analytics.gradeDistribution).map(([grade, count]) => (
                <div key={grade}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span>
                      <Tag color={['success', 'processing', 'warning', 'warning', 'error'][grade.charCodeAt(0) - 65]}>
                        {grade} 级
                      </Tag>
                    </span>
                    <span>{count} 门课程</span>
                  </div>
                  <Progress
                    percent={(count / studentGrades.length) * 100}
                    size="small"
                    status={grade === 'F' ? 'exception' : 'active'}
                  />
                </div>
              ))}
            </Space>
          </Card>
        </Col>

        {/* 学习状态 */}
        <Col xs={24} md={12}>
          <Card title="学习状态评估">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ padding: '12px', background: '#f0f5ff', borderRadius: 4 }}>
                <p style={{ margin: 0 }}>
                  <strong>优秀率</strong>
                </p>
                <Progress
                  type="circle"
                  percent={analytics.excellentRate}
                  width={60}
                  format={(percent) => `${percent}%`}
                />
                <p style={{ margin: '8px 0 0 0', color: '#666', fontSize: 12 }}>
                  成绩≥85分的课程比例
                </p>
              </div>

              <div style={{ padding: '12px', background: '#f6ffed', borderRadius: 4 }}>
                <p style={{ margin: 0 }}>
                  <strong>及格情况</strong>
                </p>
                <Progress
                  type="circle"
                  percent={analytics.passRate}
                  width={60}
                  format={(percent) => `${percent}%`}
                  status={analytics.passRate >= 90 ? 'success' : 'active'}
                />
                <p style={{ margin: '8px 0 0 0', color: '#666', fontSize: 12 }}>
                  成绩≥60分的课程比例
                </p>
              </div>

              <div style={{ padding: '12px', background: '#fff7e6', borderRadius: 4 }}>
                <p style={{ margin: 0 }}>
                  <strong>已完成课程</strong>
                </p>
                <p style={{ fontSize: 20, fontWeight: 'bold', margin: '8px 0 0 0' }}>
                  {studentGrades.length} / {courses.length}
                </p>
                <p style={{ margin: '8px 0 0 0', color: '#666', fontSize: 12 }}>
                  完成度: {((studentGrades.length / courses.length) * 100).toFixed(0)}%
                </p>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* 学习建议 */}
      <Card title="学习建议" style={{ marginTop: 24 }}>
        <Space direction="vertical">
          {analytics.passRate < 60 && (
            <div style={{ padding: '12px', background: '#fff2f0', borderRadius: 4, borderLeft: '4px solid #ff7875' }}>
              <p style={{ margin: 0, color: '#d32f2f' }}>
                <strong>⚠️ 警告</strong>: 你的及格率较低，建议加强学习！
              </p>
            </div>
          )}

          {analytics.excellentRate >= 80 && (
            <div style={{ padding: '12px', background: '#f6ffed', borderRadius: 4, borderLeft: '4px solid #52c41a' }}>
              <p style={{ margin: 0, color: '#2b8a3e' }}>
                <strong>✓ 优秀</strong>: 你的成绩表现优异，继续保持！
              </p>
            </div>
          )}

          {analytics.excellentRate >= 50 && analytics.excellentRate < 80 && (
            <div style={{ padding: '12px', background: '#e6f7ff', borderRadius: 4, borderLeft: '4px solid #1890ff' }}>
              <p style={{ margin: 0, color: '#0050b3' }}>
                <strong>→ 建议</strong>: 继续努力，争取更多的优秀成绩！
              </p>
            </div>
          )}

          {analytics.passRate >= 90 && (
            <div style={{ padding: '12px', background: '#f0f5ff', borderRadius: 4, borderLeft: '4px solid #1890ff' }}>
              <p style={{ margin: 0, color: '#003eb3' }}>
                <strong>✓ 稳定</strong>: 你的学习状态稳定，保持势头！
              </p>
            </div>
          )}

          <div style={{ padding: '12px', background: '#fafafa', borderRadius: 4 }}>
            <p style={{ margin: '0 0 8px 0' }}>
              <strong>💡 建议</strong>:
            </p>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              <li>定期复习已学课程</li>
              <li>参加课外学习小组</li>
              <li>主动与老师沟通疑难</li>
              <li>制定长期学习计划</li>
            </ul>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default AnalyticsPage;
