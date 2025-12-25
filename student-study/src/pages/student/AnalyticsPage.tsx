import { Card, Row, Col, Statistic, Empty, Space } from 'antd';
import { LineChartOutlined, BarChartOutlined, PieChartOutlined } from '@ant-design/icons';
import { useAuthStore } from '../../store/authStore';
import { useDataStore } from '../../store/dataStore';
import { useMemo, useRef, useEffect } from 'react';
import * as echarts from 'echarts';

export const AnalyticsPage = () => {
  const { user } = useAuthStore();
  const { grades, courses } = useDataStore();

  const pieChartRef = useRef<HTMLDivElement>(null);
  const lineChartRef = useRef<HTMLDivElement>(null);
  const barChartRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (pieChartRef.current && studentGrades.length > 0) {
      const myChart = echarts.init(pieChartRef.current);
      const option = {
        title: { text: '成绩等级分布', left: 'center', top: 0 },
        tooltip: { trigger: 'item' },
        legend: { bottom: '0%' },
        series: [{
          name: '课程数量',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '45%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: { show: false, position: 'center' },
          emphasis: {
            label: { show: true, fontSize: 16, fontWeight: 'bold' },
          },
          data: [
            { value: analytics.gradeDistribution.A, name: 'A级(优秀)', itemStyle: { color: '#52c41a' } },
            { value: analytics.gradeDistribution.B, name: 'B级(良好)', itemStyle: { color: '#1890ff' } },
            { value: analytics.gradeDistribution.C, name: 'C级(中等)', itemStyle: { color: '#faad14' } },
            { value: analytics.gradeDistribution.D, name: 'D级(及格)', itemStyle: { color: '#fa8c16' } },
            { value: analytics.gradeDistribution.F, name: 'F级(不及格)', itemStyle: { color: '#ff4d4f' } },
          ],
        }],
      };
      myChart.setOption(option);
      const handleResize = () => myChart.resize();
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        myChart.dispose();
      };
    }
  }, [analytics.gradeDistribution, studentGrades.length]);

  useEffect(() => {
    if (lineChartRef.current && studentGrades.length > 0) {
      const myChart = echarts.init(lineChartRef.current);
      const sortedGrades = [...studentGrades].sort((a, b) => a.courseId.localeCompare(b.courseId));
      const courseNames = sortedGrades.map(g => {
        const course = courses.find(c => c.id === g.courseId);
        return course?.courseName || g.courseId;
      });
      const scores = sortedGrades.map(g => g.score);
      const option = {
        title: { text: '各课程成绩趋势', left: 'center', top: 0 },
        tooltip: { trigger: 'axis' },
        xAxis: {
          type: 'category',
          data: courseNames,
          axisLabel: { interval: 0, rotate: 30 },
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 100,
        },
        series: [{
          name: '成绩',
          type: 'line',
          data: scores,
          smooth: true,
          lineStyle: { width: 3, color: '#1890ff' },
          itemStyle: { color: '#1890ff' },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
              { offset: 1, color: 'rgba(24, 144, 255, 0.05)' },
            ]),
          },
          markLine: {
            data: [
              { yAxis: 60, name: '及格线', lineStyle: { color: '#faad14' } },
              { yAxis: 85, name: '优秀线', lineStyle: { color: '#52c41a' } },
            ],
          },
        }],
      };
      myChart.setOption(option);
      const handleResize = () => myChart.resize();
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        myChart.dispose();
      };
    }
  }, [studentGrades, courses]);

  useEffect(() => {
    if (barChartRef.current && studentGrades.length > 0) {
      const myChart = echarts.init(barChartRef.current);
      const sortedGrades = [...studentGrades].sort((a, b) => a.courseId.localeCompare(b.courseId));
      const courseNames = sortedGrades.map(g => {
        const course = courses.find(c => c.id === g.courseId);
        return course?.courseName || g.courseId;
      });
      const scores = sortedGrades.map(g => g.score);
      const option = {
        title: { text: '各课程成绩对比', left: 'center', top: 0 },
        tooltip: { trigger: 'axis' },
        xAxis: {
          type: 'category',
          data: courseNames,
          axisLabel: { interval: 0, rotate: 30 },
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 100,
        },
        series: [{
          name: '成绩',
          type: 'bar',
          data: scores.map((score) => ({
            value: score,
            itemStyle: {
              color: score >= 85 ? '#52c41a' : score >= 60 ? '#1890ff' : '#ff4d4f',
            },
          })),
          barWidth: '50%',
          label: {
            show: true,
            position: 'top',
            formatter: '{c}分',
          },
        }],
      };
      myChart.setOption(option);
      const handleResize = () => myChart.resize();
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        myChart.dispose();
      };
    }
  }, [studentGrades, courses]);

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
        <Col xs={24} md={8}>
          <Card title="成绩等级分布">
            <div ref={pieChartRef} style={{ height: 300 }} />
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card title="各课程成绩趋势">
            <div ref={lineChartRef} style={{ height: 300 }} />
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card title="各课程成绩对比">
            <div ref={barChartRef} style={{ height: 300 }} />
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
