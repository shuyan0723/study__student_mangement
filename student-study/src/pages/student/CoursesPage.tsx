import { useState, useMemo } from 'react';
import { Card, Button, Empty, Tag, Modal, message } from 'antd';
import { CheckOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useAuthStore } from '../../store/authStore';
import { useDataStore } from '../../store/dataStore';
import './StudentPage.less';

export const StudentCoursesPage = () => {
  const { user } = useAuthStore();
  const { courses, studentCourses, enrollCourse } = useDataStore();
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const myEnrolledCourses = useMemo(() => {
    return studentCourses
      .filter((sc) => sc.studentId === user?.id)
      .map((sc) => ({
        ...sc,
        courseName: courses.find((c) => c.courseId === sc.courseId)?.courseName,
        teacherName: courses.find((c) => c.courseId === sc.courseId)?.teacherName,
      }));
  }, [studentCourses, courses, user?.id]);

  const availableCourses = useMemo(() => {
    const enrolledIds = myEnrolledCourses.map((c) => c.courseId);
    return courses.filter((c) => !enrolledIds.includes(c.courseId));
  }, [courses, myEnrolledCourses]);

  const handleEnroll = async (courseId: string) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      const newEnrollment = {
        id: `enrollment_${Date.now()}`,
        studentId: user?.id || '',
        courseId,
        status: 'enrolled' as const,
        enrolledAt: new Date().toISOString(),
      };
      
      enrollCourse(newEnrollment);
      message.success('选课成功');
      setIsModalVisible(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDropCourse = (_enrollmentId: string) => {
    Modal.confirm({
      title: '确认退课',
      content: '确定要退出这门课程吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        message.success('已退课');
      },
    });
  };

  const statusColorMap: Record<string, string> = {
    enrolled: 'processing',
    completed: 'success',
    failed: 'error',
  };

  const statusTextMap: Record<string, string> = {
    enrolled: '学习中',
    completed: '已完成',
    failed: '不及格',
  };

  return (
    <div className="student-page">
      <Card
        title="选课管理"
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
          >
            选择课程
          </Button>
        }
      >
        <div style={{ marginBottom: 24 }}>
          <h3>已选课程（{myEnrolledCourses.length}门）</h3>
          {myEnrolledCourses.length > 0 ? (
            <div>
              {myEnrolledCourses.map((course) => (
                <div key={course.id} className="course-item">
                  <div className="course-info">
                    <div className="course-details">
                      <div className="course-name">{course.courseName}</div>
                      <div className="course-meta">
                        <span>教师: {course.teacherName}</span>
                        <span>学分: 3</span>
                        <span>
                          <Tag color={statusColorMap[course.status]}>
                            {statusTextMap[course.status]}
                          </Tag>
                        </span>
                      </div>
                    </div>
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDropCourse(course.id)}
                    >
                      退课
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Empty description="还未选课" />
          )}
        </div>
      </Card>

      <Modal
        title="选择课程"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={700}
      >
        {availableCourses.length > 0 ? (
          <div>
            {availableCourses.map((course) => (
              <div key={course.courseId} className="course-item">
                <div className="course-info">
                  <div className="course-details">
                    <div className="course-name">{course.courseName}</div>
                    <div className="course-meta">
                      <span>教师: {course.teacherName}</span>
                      <span>学分: {course.credits}</span>
                      <span>学时: {course.hours}</span>
                      <span>学期: {course.semester}</span>
                    </div>
                  </div>
                  <Button
                    type="primary"
                    icon={<CheckOutlined />}
                    onClick={() => handleEnroll(course.courseId)}
                    loading={loading}
                  >
                    选择
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Empty description="没有可选课程" />
        )}
      </Modal>
    </div>
  );
};

export default StudentCoursesPage;
