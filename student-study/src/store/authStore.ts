import { create } from 'zustand';
import type { User, LoginRequest } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (request: LoginRequest) => Promise<void>;
  logout: () => void;
  register: (userData: Partial<User>) => Promise<void>;
}

// 从localStorage获取用户信息
const getLocalStorageUser = (): User | null => {
  const userJson = localStorage.getItem('user');
  if (userJson) {
    return JSON.parse(userJson);
  }
  // 默认登录为教师用户进行测试
  const defaultTeacher: User = {
    id: 'teacher_001',
    username: 'teacher01',
    email: 'teacher01@example.com',
    phone: '13900139000',
    role: 'teacher',
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem('user', JSON.stringify(defaultTeacher));
  localStorage.setItem('token', 'token_teacher_001');
  return defaultTeacher;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: getLocalStorageUser(),
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,

  login: async (request: LoginRequest) => {
    set({ loading: true });
    try {
      // 模拟API调用
      const response = await new Promise<{ token: string; user: User }>((resolve) => {
        setTimeout(() => {
          const mockUsers: Record<string, { token: string; user: User }> = {
            'student01': {
              token: 'token_student_001',
              user: {
                id: 'student_001',
                username: 'student01',
                email: 'student01@example.com',
                phone: '13800138000',
                role: 'student',
                createdAt: new Date().toISOString(),
              },
            },
            'teacher01': {
              token: 'token_teacher_001',
              user: {
                id: 'teacher_001',
                username: 'teacher01',
                email: 'teacher01@example.com',
                phone: '13900139000',
                role: 'teacher',
                createdAt: new Date().toISOString(),
              },
            },
            'admin01': {
              token: 'token_admin_001',
              user: {
                id: 'admin_001',
                username: 'admin01',
                email: 'admin01@example.com',
                role: 'admin',
                createdAt: new Date().toISOString(),
              },
            },
          };
          resolve(mockUsers[request.username] || mockUsers['student01']);
        }, 500);
      });

      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      set({
        token: response.token,
        user: response.user,
        isAuthenticated: true,
        loading: false,
      });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  register: async (_userData: Partial<User>) => {
    set({ loading: true });
    try {
      // 模拟注册
      await new Promise((resolve) => setTimeout(resolve, 500));
      set({ loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
}));
