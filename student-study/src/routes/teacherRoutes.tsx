import { Route } from 'react-router-dom';

// 教师相关页面（pages/teacher文件夹）
import TeacherGradesManagePage from '../pages/teacher/GradesManagePage';    // src/pages/teacher/GradesManagePage.tsx
import ClassManagementPage from '../pages/teacher/ClassManagementPage';    // src/pages/teacher/ClassManagementPage.tsx
import StudentCommunicationPage from '../pages/teacher/StudentCommunicationPage';  // src/pages/teacher/StudentCommunicationPage.tsx
import Grade3DScene from '../pages/teacher/Grade3DScene';                    // src/pages/teacher/Grade3DScene.tsx
import Teaching3DScene from '../pages/teacher/Teaching3DScene';              // src/pages/teacher/Teaching3DScene.tsx
import Classroom3DScene from '../pages/teacher/Classroom3DScene';            // src/pages/teacher/Classroom3DScene.tsx
import TeacherAIAnalysisPage from '../pages/teacher/TeacherAIAnalysisPage'; // src/pages/teacher/TeacherAIAnalysisPage.tsx
import TeacherAnalysisRecordsPage from '../pages/teacher/TeacherAnalysisRecordsPage'; // src/pages/teacher/TeacherAnalysisRecordsPage.tsx
import TeacherAnalysisTemplatesPage from '../pages/teacher/TeacherAnalysisTemplatesPage'; // src/pages/teacher/TeacherAnalysisTemplatesPage.tsx

// 返回Route元素数组而不是JSX组件
export const teacherRoutes = [
  <Route key="teacher-grades" path="teacher/grades" element={<TeacherGradesManagePage />} navName="成绩管理" />,
  <Route key="teacher-classes" path="teacher/classes" element={<ClassManagementPage />} navName="班级管理" />,
  <Route key="teacher-messages" path="teacher/messages" element={<StudentCommunicationPage />} navName="学生交流" />,
  <Route key="teacher-ai-analysis" path="teacher/ai-analysis" element={<TeacherAIAnalysisPage />} navName="AI成绩分析" />,
  <Route key="teacher-analysis-records" path="teacher/analysis-records" element={<TeacherAnalysisRecordsPage />} navName="分析记录" />,
  <Route key="teacher-analysis-templates" path="teacher/analysis-templates" element={<TeacherAnalysisTemplatesPage />} navName="分析模板" />,
  <Route key="teacher-grade-3d" path="teacher/grade-3d" element={<Grade3DScene />} navName="成绩3D分布" />,
  <Route key="teacher-teaching-3d" path="teacher/teaching-3d" element={<Teaching3DScene />} navName="教学数据3D" />,
  <Route key="teacher-classroom-3d" path="teacher/classroom-3d" element={<Classroom3DScene />} navName="课堂互动3D" />
];

// 教师路由导航栏名称映射
export const teacherRouteNames = {
  'teacher/grades': '成绩管理',
  'teacher/classes': '班级管理',
  'teacher/messages': '学生交流',
  'teacher/ai-analysis': 'AI成绩分析',
  'teacher/analysis-records': '分析记录',
  'teacher/analysis-templates': '分析模板',
  'teacher/grade-3d': '成绩3D分布',
  'teacher/teaching-3d': '教学数据3D',
  'teacher/classroom-3d': '课堂互动3D'
};

export default teacherRoutes;