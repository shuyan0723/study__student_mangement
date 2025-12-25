import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

// 页面导入
// 基础页面（根目录pages文件夹）
import LoginPage from '../pages/login/LoginPage';        // src/pages/LoginPage.tsx
import DashboardLayout from '../pages/DashboardLayout'; // src/pages/DashboardLayout.tsx
import DashboardPage from '../pages/DashboardPage'; // src/pages/DashboardPage.tsx
import NotFoundPage from './404';                  // src/routes/404.tsx

// 角色路由导入（routes文件夹）
import studentRoutes from './studentRoutes';    // src/routes/studentRoutes.tsx
import adminRoutes from './adminRoutes';        // src/routes/adminRoutes.tsx
import teacherRoutes from './teacherRoutes';    // src/routes/teacherRoutes.tsx

// 受保护路由组件
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

// 主路由配置
function AppRoutes() {
  return (
    <Routes>
      {/* 登录页面 */}
      <Route path="/login" element={<LoginPage />} />

      {/* 主布局路由 */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* 仪表板 */}
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="/" element={<Navigate to="/login" />} />

        {/* 角色路由 - 展开路由数组 */}
        {studentRoutes}
        {adminRoutes}
        {teacherRoutes}

        {/* 临时页面 */}
        <Route path="profile" element={<DashboardPage />} />
      </Route>

      {/* 404页面 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;