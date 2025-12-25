import { useState } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Badge, message } from 'antd';
import {
  HomeOutlined,
  FileTextOutlined,
  MessageOutlined,
  TeamOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
} from '@ant-design/icons';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import './DashboardLayout.scss';

const { Header, Sider, Content } = Layout;

export const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
    message.success('已退出登录');
  };

  // 根据用户角色生成菜单项
  const getMenuItems = () => {
    const baseItems = [
      {
        key: 'dashboard',
        icon: <HomeOutlined />,
        label: '首页',
        onClick: () => navigate('/dashboard'),
      },
    ];

    const studentItems = [
      {
        key: 'grades',
        icon: <FileTextOutlined />,
        label: '成绩查询',
        onClick: () => navigate('/student/grades'),
      },
      {
        key: 'courses',
        icon: <FileTextOutlined />,
        label: '选课管理',
        onClick: () => navigate('/student/courses'),
      },
      {
        key: 'analytics',
        icon: <FileTextOutlined />,
        label: '成绩分析',
        onClick: () => navigate('/student/analytics'),
      },
      {
        key: 'schedule',
        icon: <FileTextOutlined />,
        label: '课程表',
        onClick: () => navigate('/student/schedule'),
      },
      {
        key: 'messages',
        icon: <MessageOutlined />,
        label: '在线交流',
        onClick: () => navigate('/student/messages'),
      },
      {
        key: 'appeal',
        icon: <FileTextOutlined />,
        label: '成绩申诉',
        onClick: () => navigate('/student/appeal'),
      },
      {
        key: 'notices',
        icon: <FileTextOutlined />,
        label: '系统公告',
        onClick: () => navigate('/student/notices'),
      },
      {
        key: 'data-export',
        icon: <FileTextOutlined />,
        label: '数据导出',
        onClick: () => navigate('/student/data-export'),
      },
    ];

    const teacherItems = [
      {
        key: 'teacher-grades',
        icon: <FileTextOutlined />,
        label: '成绩管理',
        onClick: () => navigate('/teacher/grades'),
      },
      {
        key: 'teacher-classes',
        icon: <TeamOutlined />,
        label: '班级管理',
        onClick: () => navigate('/teacher/classes'),
      },
      {
        key: 'teacher-messages',
        icon: <MessageOutlined />,
        label: '学生交流',
        onClick: () => navigate('/teacher/messages'),
      },
    ];

    const adminItems = [
      {
        key: 'students',
        icon: <TeamOutlined />,
        label: '学生管理',
        onClick: () => navigate('/admin/students'),
      },
      {
        key: 'teachers',
        icon: <TeamOutlined />,
        label: '教师管理',
        onClick: () => navigate('/admin/teachers'),
      },
      {
        key: 'courses-manage',
        icon: <FileTextOutlined />,
        label: '课程管理',
        onClick: () => navigate('/admin/courses'),
      },
      {
        key: 'all-grades',
        icon: <FileTextOutlined />,
        label: '成绩管理',
        onClick: () => navigate('/admin/grades'),
      },
      {
        key: 'system',
        icon: <SettingOutlined />,
        label: '系统设置',
        onClick: () => navigate('/admin/settings'),
      },
    ];

    if (user?.role === 'student') {
      return [...baseItems, ...studentItems];
    } else if (user?.role === 'teacher') {
      return [...baseItems, ...teacherItems];
    } else if (user?.role === 'admin') {
      return [...baseItems, ...adminItems];
    }
    return baseItems;
  };

  const userMenuItems = [
    {
      key: 'profile',
      label: '个人资料',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'logout',
      label: '退出登录',
      danger: true,
      onClick: handleLogout,
    },
  ];

  const currentKey = location.pathname.split('/')[1] || 'dashboard';

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={240}
        collapsedWidth={80}
        theme="light"
        className="dashboard-sider"
      >
        <div className="logo">
          {!collapsed && <span>成绩管理系统</span>}
        </div>
        <Menu
          mode="inline"
          items={getMenuItems()}
          selectedKeys={[currentKey]}
          style={{ borderRight: 'none' }}
        />
      </Sider>

      <Layout>
        <Header className="dashboard-header">
          <div className="header-left">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: '18px' }}
            />
          </div>

          <div className="header-right">
            <Badge count={3} style={{ backgroundColor: '#f5222d' }}>
              <Button
                type="text"
                icon={<BellOutlined style={{ fontSize: '18px' }} />}
              />
            </Badge>

            <Dropdown
              menu={{ items: userMenuItems }}
              trigger={['click']}
              placement="bottomRight"
            >
              <div className="user-menu" style={{ cursor: 'pointer' }}>
                <Avatar style={{ backgroundColor: '#667eea' }}>
                  {user?.username.charAt(0).toUpperCase()}
                </Avatar>
                <span className="username">{user?.username}</span>
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content className="dashboard-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
