// React Hook for localStorage isolation
import { useState, useEffect, useCallback } from 'react';
import { LocalStorageManager } from './storage-utils';

const storage = new LocalStorageManager();

export function useRoleBasedStorage() {
  const [currentRole, setCurrentRole] = useState<string>('');
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 角色切换
  const switchRole = useCallback(async (role: string, userId: string) => {
    setIsLoading(true);
    
    try {
      // 清除之前角色的数据
      if (currentRole && currentUserId) {
        storage.clearRoleData(currentRole, currentUserId);
      }

      // 更新当前角色
      setCurrentRole(role);
      setCurrentUserId(userId);

      // 从服务器获取最新数据
      await loadFreshData(role, userId);
    } catch (error) {
      console.error('Role switch failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentRole, currentUserId]);

  // 加载数据
  const loadFreshData = async (role: string, userId: string) => {
    try {
      switch (role) {
        case 'student':
          await loadStudentData(userId);
          break;
        case 'teacher':
          await loadTeacherData(userId);
          break;
        case 'admin':
          await loadAdminData(userId);
          break;
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const loadStudentData = async (userId: string) => {
    // 模拟API调用
    const grades = await fetchStudentGrades(userId);
    const courses = await fetchStudentCourses(userId);
    const messages = await fetchStudentMessages(userId);
    
    storage.setStudentData(userId, 'grades', grades);
    storage.setStudentData(userId, 'courses', courses);
    storage.setStudentData(userId, 'messages', messages);
  };

  const loadTeacherData = async (userId: string) => {
    const courses = await fetchTeacherCourses(userId);
    const students = await fetchTeacherStudents(userId);
    const grades = await fetchTeacherGrades(userId);
    
    storage.setTeacherData(userId, 'courses', courses);
    storage.setTeacherData(userId, 'students', students);
    storage.setTeacherData(userId, 'grades', grades);
  };

  const loadAdminData = async (userId: string) => {
    const users = await fetchAllUsers();
    const courses = await fetchAllCourses();
    const statistics = await fetchSystemStatistics();
    
    storage.setAdminData(userId, 'users', users);
    storage.setAdminData(userId, 'courses', courses);
    storage.setAdminData(userId, 'statistics', statistics);
  };

  // 数据获取方法
  const getData = useCallback((key: string) => {
    if (!currentRole || !currentUserId) return null;
    return storage.getData(currentRole, currentUserId, key);
  }, [currentRole, currentUserId]);

  // 数据设置方法
  const setData = useCallback((key: string, value: any) => {
    if (!currentRole || !currentUserId) return;
    storage.setData(currentRole, currentUserId, key, value);
  }, [currentRole, currentUserId]);

  // 清除数据
  const clearData = useCallback((key?: string) => {
    if (!currentRole || !currentUserId) return;
    
    if (key) {
      const prefix = `grade_system_${currentRole}_${currentUserId}_`;
      localStorage.removeItem(prefix + key);
    } else {
      storage.clearRoleData(currentRole, currentUserId);
    }
  }, [currentRole, currentUserId]);

  return {
    currentRole,
    currentUserId,
    isLoading,
    switchRole,
    getData,
    setData,
    clearData,
  };
}

// 模拟API函数
async function fetchStudentGrades(userId: string) {
  // 实际项目中这里调用真实API
  return [
    { id: 1, course: '数学', score: 85, grade: 'B' },
    { id: 2, course: '英语', score: 92, grade: 'A' }
  ];
}

async function fetchStudentCourses(userId: string) {
  return [
    { id: 1, name: '高等数学', teacher: '张老师', credits: 4 },
    { id: 2, name: '大学英语', teacher: '李老师', credits: 3 }
  ];
}

async function fetchStudentMessages(userId: string) {
  return [
    { id: 1, from: '张老师', content: '作业已批改完成', time: '2024-01-15' }
  ];
}

async function fetchTeacherCourses(userId: string) {
  return [
    { id: 1, name: '高等数学', students: 120 },
    { id: 2, name: '线性代数', students: 85 }
  ];
}

async function fetchTeacherStudents(userId: string) {
  return [
    { id: 1, name: '张三', studentId: '2021001' },
    { id: 2, name: '李四', studentId: '2021002' }
  ];
}

async function fetchTeacherGrades(userId: string) {
  return [
    { studentId: '2021001', courseId: 1, score: 85 },
    { studentId: '2021002', courseId: 1, score: 92 }
  ];
}

async function fetchAllUsers() {
  return [
    { id: 1, name: '张三', role: 'student' },
    { id: 2, name: '李老师', role: 'teacher' }
  ];
}

async function fetchAllCourses() {
  return [
    { id: 1, name: '高等数学', teacher: '李老师' },
    { id: 2, name: '大学英语', teacher: '王老师' }
  ];
}

async function fetchSystemStatistics() {
  return {
    totalUsers: 1000,
    totalCourses: 50,
    totalGrades: 5000
  };
}