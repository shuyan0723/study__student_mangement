import { Card, Row, Col, Statistic, List, Empty, Button } from 'antd';
import { FileTextOutlined, TeamOutlined, CreditCardOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useDataStore } from '../store/dataStore';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { grades, courses, studentCourses } = useDataStore();

  const getStudentStats = () => {
    const myGrades = grades.filter((g) => g.studentId === user?.id);
    const myCourses = studentCourses.filter((sc) => sc.studentId === user?.id);
    
    return {
      totalCourses: myCourses.length,
      totalGrades: myGrades.length,
      avgScore: myGrades.length > 0 
        ? (myGrades.reduce((sum, g) => sum + g.score, 0) / myGrades.length).toFixed(2)
        : 0,
      excellentCount: myGrades.filter((g) => g.score >= 85).length,
    };
  };

  const getTeacherStats = () => {
    const myCourses = courses.filter((c) => c.teacherId === user?.id);
    const myStudents = studentCourses.filter((sc) => 
      myCourses.some(c => c.courseId === sc.courseId)
    );
    
    return {
      totalCourses: myCourses.length,
      totalStudents: new Set(myStudents.map(s => s.studentId)).size,
    };
  };

  const getAdminStats = () => {
    return {
      totalCourses: courses.length,
      totalGrades: grades.length,
    };
  };

  const renderStudentDashboard = () => {
    const stats = getStudentStats();
    return (
      <>
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="平均成绩"
                value={stats.avgScore}
                suffix="分"
                prefix={<FileTextOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="已修课程"
                value={stats.totalCourses}
                suffix="门"
                prefix={<CreditCardOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="已评分课程"
                value={stats.totalGrades}
                suffix="门"
                prefix={<FileTextOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="优秀课程"
                value={stats.excellentCount}
                suffix="门"
                prefix={<TeamOutlined />}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Card title="最近成绩" style={{ cursor: 'pointer' }} onClick={() => navigate('/student/grades')}>
              {grades.filter((g) => g.studentId === user?.id).slice(0, 3).length > 0 ? (
                <List
                  dataSource={grades.filter((g) => g.studentId === user?.id).slice(0, 3)}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        title={courses.find((c) => c.courseId === item.courseId)?.courseName}
                        description={`成绩: ${item.score} (${item.gradeLevel})`}
                      />
                    </List.Item>
                  )}
                />
              ) : (
                <Empty description="暂无成绩" />
              )}
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title="选修课程" style={{ cursor: 'pointer' }} onClick={() => navigate('/student/courses')}>
              {studentCourses.filter((sc) => sc.studentId === user?.id).slice(0, 3).length > 0 ? (
                <List
                  dataSource={studentCourses.filter((sc) => sc.studentId === user?.id).slice(0, 3)}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        title={courses.find((c) => c.courseId === item.courseId)?.courseName}
                        description={`状态: ${item.status}`}
                      />
                    </List.Item>
                  )}
                />
              ) : (
                <Empty description="暂无选课" />
              )}
            </Card>
          </Col>
        </Row>
      </>
    );
  };

  const renderTeacherDashboard = () => {
    const stats = getTeacherStats();
    return (
      <>
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="教授课程"
                value={stats.totalCourses}
                suffix="门"
                prefix={<CreditCardOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="教学学生"
                value={stats.totalStudents}
                suffix="人"
                prefix={<TeamOutlined />}
              />
            </Card>
          </Col>
        </Row>

        <Card title="我的课程">
          {courses.filter((c) => c.teacherId === user?.id).length > 0 ? (
            <List
              dataSource={courses.filter((c) => c.teacherId === user?.id)}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={item.courseName}
                    description={`学分: ${item.credits}, 学时: ${item.hours}, 学期: ${item.semester}`}
                  />
                </List.Item>
              )}
            />
          ) : (
            <Empty description="暂无课程" />
          )}
        </Card>
      </>
    );
  };

  const renderAdminDashboard = () => {
    const stats = getAdminStats();
    return (
      <>
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="总课程数"
                value={stats.totalCourses}
                suffix="门"
                prefix={<CreditCardOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="总成绩记录"
                value={stats.totalGrades}
                suffix="条"
                prefix={<FileTextOutlined />}
              />
            </Card>
          </Col>
        </Row>

        <Card title="管理功能">
          <Row gutter={16}>
            <Col xs={24} sm={12} md={6}>
              <Button block type="primary" onClick={() => navigate('/admin/students')}>
                学生管理
              </Button>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Button block type="primary" onClick={() => navigate('/admin/teachers')}>
                教师管理
              </Button>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Button block type="primary" onClick={() => navigate('/admin/courses')}>
                课程管理
              </Button>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Button block type="primary" onClick={() => navigate('/admin/grades')}>
                成绩管理
              </Button>
            </Col>
          </Row>
        </Card>
      </>
    );
  };

  return (
    <div>
      <Card style={{ marginBottom: 24, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <h2 style={{ color: 'white', margin: 0 }}>欢迎, {user?.username}!</h2>
        <p style={{ color: 'rgba(255, 255, 255, 0.85)', margin: '8px 0 0 0' }}>
          {user?.role === 'student' && '祝你学习进步'}
          {user?.role === 'teacher' && '感谢你的教学工作'}
          {user?.role === 'admin' && '系统运行正常'}
        </p>
      </Card>

      {user?.role === 'student' && renderStudentDashboard()}
      {user?.role === 'teacher' && renderTeacherDashboard()}
      {user?.role === 'admin' && renderAdminDashboard()}
    </div>
  );
};

export default DashboardPage;
