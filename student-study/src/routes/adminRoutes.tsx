import React from 'react';
import { Route } from 'react-router-dom';

// 管理员相关页面（pages/admin文件夹）
import StudentsManagePage from '../pages/admin/StudentsManagePage';    // src/pages/admin/StudentsManagePage.tsx
import CoursesManagePage from '../pages/admin/CoursesManagePage';      // src/pages/admin/CoursesManagePage.tsx
import GradesManagePage from '../pages/admin/GradesManagePage';        // src/pages/admin/GradesManagePage.tsx
import TeachersManagePage from '../pages/admin/TeachersManagePage';    // src/pages/admin/TeachersManagePage.tsx
import SettingsPage from '../pages/admin/SettingsPage';                // src/pages/admin/SettingsPage.tsx

// 返回Route元素数组而不是JSX组件
export const adminRoutes = [
  <Route key="admin-students" path="admin/students" element={<StudentsManagePage />} navName="学生管理" />,
  <Route key="admin-courses" path="admin/courses" element={<CoursesManagePage />} navName="课程管理" />,
  <Route key="admin-grades" path="admin/grades" element={<GradesManagePage />} navName="成绩管理" />,
  <Route key="admin-teachers" path="admin/teachers" element={<TeachersManagePage />} navName="教师管理" />,
  <Route key="admin-settings" path="admin/settings" element={<SettingsPage />} navName="系统设置" />
];

// 管理员路由导航栏名称映射
export const adminRouteNames = {
  'admin/students': '学生管理',
  'admin/courses': '课程管理',
  'admin/grades': '成绩管理',
  'admin/teachers': '教师管理',
  'admin/settings': '系统设置'
};

export default adminRoutes;