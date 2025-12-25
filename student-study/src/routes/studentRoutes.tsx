import React from 'react';
import { Route } from 'react-router-dom';

// 学生相关页面（pages/student文件夹）
import StudentGradesPage from '../pages/student/GradesPage';       // src/pages/student/GradesPage.tsx
import StudentCoursesPage from '../pages/student/CoursesPage';     // src/pages/student/CoursesPage.tsx
import StudentMessagesPage from '../pages/student/MessagesPage';   // src/pages/student/MessagesPage.tsx
import AnalyticsPage from '../pages/student/AnalyticsPage';        // src/pages/student/AnalyticsPage.tsx
import SchedulePage from '../pages/student/SchedulePage';          // src/pages/student/SchedulePage.tsx
import AppealPage from '../pages/student/AppealPage';              // src/pages/student/AppealPage.tsx

// 其他页面（根目录pages文件夹）
import DataExportPage from '../pages/DataExportPage';              // src/pages/DataExportPage.tsx
import NoticesPage from '../pages/NoticesPage';                    // src/pages/NoticesPage.tsx
import ProfilePage from '../pages/ProfilePage';                    // src/pages/ProfilePage.tsx

// 返回Route元素数组而不是JSX组件
export const studentRoutes = [
  <Route key="student-grades" path="student/grades" element={<StudentGradesPage />} navName="成绩查询" />,
  <Route key="student-courses" path="student/courses" element={<StudentCoursesPage />} navName="选课管理" />,
  <Route key="student-messages" path="student/messages" element={<StudentMessagesPage />} navName="在线交流" />,
  <Route key="student-analytics" path="student/analytics" element={<AnalyticsPage />} navName="成绩分析" />,
  <Route key="student-schedule" path="student/schedule" element={<SchedulePage />} navName="课程表" />,
  <Route key="student-profile" path="student/profile" element={<ProfilePage />} navName="个人资料" />,
  <Route key="student-notices" path="student/notices" element={<NoticesPage />} navName="系统公告" />,
  <Route key="student-appeal" path="student/appeal" element={<AppealPage />} navName="成绩申诉" />,
  <Route key="student-data-export" path="student/data-export" element={<DataExportPage />} navName="数据导出" />
];

// 学生路由导航栏名称映射
export const studentRouteNames = {
  'student/grades': '成绩查询',
  'student/courses': '选课管理',
  'student/messages': '在线交流',
  'student/analytics': '成绩分析',
  'student/schedule': '课程表',
  'student/profile': '个人资料',
  'student/notices': '系统公告',
  'student/appeal': '成绩申诉',
  'student/data-export': '数据导出'
};

export default studentRoutes;