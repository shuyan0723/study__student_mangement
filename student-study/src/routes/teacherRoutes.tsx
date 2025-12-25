import { Route } from 'react-router-dom';

// 教师相关页面（pages/teacher文件夹）
import TeacherGradesManagePage from '../pages/teacher/GradesManagePage';    // src/pages/teacher/GradesManagePage.tsx
import StudentCommunicationPage from '../pages/teacher/StudentCommunicationPage';  // src/pages/teacher/StudentCommunicationPage.tsx

// 基础页面（根目录pages文件夹）
import DashboardPage from '../pages/DashboardPage';                         // src/pages/DashboardPage.tsx

// 返回Route元素数组而不是JSX组件
export const teacherRoutes = [
  <Route key="teacher-grades" path="teacher/grades" element={<TeacherGradesManagePage />} navName="成绩管理" />,
  <Route key="teacher-classes" path="teacher/classes" element={<DashboardPage />} navName="班级管理" />,
  <Route key="teacher-messages" path="teacher/messages" element={<StudentCommunicationPage />} navName="学生交流" />
];

// 教师路由导航栏名称映射
export const teacherRouteNames = {
  'teacher/grades': '成绩管理',
  'teacher/classes': '班级管理',
  'teacher/messages': '学生交流'
};

export default teacherRoutes;