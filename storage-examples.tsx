// 实际应用示例 - 学生页面组件
import React, { useEffect, useState } from 'react';
import { useRoleBasedStorage } from './useRoleStorage';

const StudentDashboard: React.FC = () => {
  const {
    currentRole,
    currentUserId,
    isLoading,
    getData,
    setData,
    switchRole
  } = useRoleBasedStorage();

  const [grades, setGrades] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    // 假设用户已登录，获取用户信息
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('userRole');
    
    if (userId && role === 'student') {
      switchRole('student', userId);
    }
  }, []);

  useEffect(() => {
    if (currentRole === 'student' && currentUserId) {
      // 从localStorage获取数据
      const cachedGrades = getData('grades') || [];
      const cachedCourses = getData('courses') || [];
      
      setGrades(cachedGrades);
      setCourses(cachedCourses);
    }
  }, [currentRole, currentUserId, getData]);

  const handleGradeClick = (grade: any) => {
    // 缓存当前查看的成绩详情
    setData('currentGrade', grade);
    
    // 导航到成绩详情页面
    // navigate(`/grade/${grade.id}`);
  };

  if (isLoading) {
    return <div>加载中...</div>;
  }

  return (
    <div className="student-dashboard">
      <h2>学生成绩管理</h2>
      
      <div className="grades-section">
        <h3>我的成绩</h3>
        {grades.map((grade: any) => (
          <div 
            key={grade.id}
            className="grade-item"
            onClick={() => handleGradeClick(grade)}
          >
            <span>{grade.course}</span>
            <span>{grade.score}分</span>
            <span>{grade.grade}</span>
          </div>
        ))}
      </div>

      <div className="courses-section">
        <h3>我的课程</h3>
        {courses.map((course: any) => (
          <div key={course.id} className="course-item">
            <span>{course.name}</span>
            <span>学分: {course.credits}</span>
            <span>教师: {course.teacher}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// 教师页面组件
const TeacherDashboard: React.FC = () => {
  const {
    currentRole,
    currentUserId,
    isLoading,
    getData,
    setData,
    switchRole
  } = useRoleBasedStorage();

  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('userRole');
    
    if (userId && role === 'teacher') {
      switchRole('teacher', userId);
    }
  }, []);

  useEffect(() => {
    if (currentRole === 'teacher' && currentUserId) {
      const cachedCourses = getData('courses') || [];
      const cachedStudents = getData('students') || [];
      
      setCourses(cachedCourses);
      setStudents(cachedStudents);
    }
  }, [currentRole, currentUserId, getData]);

  const handleStudentClick = (student: any) => {
    // 缓存当前查看的学生信息
    setData('currentStudent', student);
    
    // 缓存当前学生的成绩
    const studentGrades = getData('grades')?.filter(
      (grade: any) => grade.studentId === student.id
    ) || [];
    setData('currentStudentGrades', studentGrades);
  };

  if (isLoading) {
    return <div>加载中...</div>;
  }

  return (
    <div className="teacher-dashboard">
      <h2>教师管理面板</h2>
      
      <div className="courses-section">
        <h3>我的课程</h3>
        {courses.map((course: any) => (
          <div key={course.id} className="course-item">
            <span>{course.name}</span>
            <span>学生数: {course.students}</span>
          </div>
        ))}
      </div>

      <div className="students-section">
        <h3>我的学生</h3>
        {students.map((student: any) => (
          <div 
            key={student.id}
            className="student-item"
            onClick={() => handleStudentClick(student)}
          >
            <span>{student.name}</span>
            <span>学号: {student.studentId}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// 登录组件中的角色切换
const LoginForm: React.FC = () => {
  const handleLogin = async (credentials: any) => {
    try {
      // 调用登录API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();
      
      if (data.success) {
        // 存储用户信息到localStorage
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('userRole', data.role);
        localStorage.setItem('token', data.token);
        
        // 根据角色导航到对应页面
        switch (data.role) {
          case 'student':
            // navigate('/student');
            break;
          case 'teacher':
            // navigate('/teacher');
            break;
          case 'admin':
            // navigate('/admin');
            break;
        }
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      handleLogin({
        username: formData.get('username'),
        password: formData.get('password')
      });
    }}>
      <input name="username" type="text" placeholder="用户名" required />
      <input name="password" type="password" placeholder="密码" required />
      <button type="submit">登录</button>
    </form>
  );
};

export { StudentDashboard, TeacherDashboard, LoginForm };