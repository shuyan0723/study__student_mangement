// 用户类型
export type UserRole = 'student' | 'teacher' | 'admin';

// 用户基础接口
export interface User {
  id: string;
  username: string;
  password?: string;
  email: string;
  phone?: string;
  role: UserRole;
  createdAt: string;
}

// 学生用户
export interface Student extends User {
  studentId: string;
  name: string;
  gender: 'male' | 'female';
  college: string;
  major: string;
  homeAddress?: string;
}

// 教师用户
export interface Teacher extends User {
  teacherId: string;
  name: string;
  gender: 'male' | 'female';
  department: string;
  title: string;
  courseIds: string[];
  hireDate: string;
  education: string;
  researchArea: string;
  status: 'active' | 'inactive';
}

// 课程
export interface Course {
  courseId: string;
  courseName: string;
  credits: number;
  semester: string;
  hours: number;
  teacherId: string;
  teacherName?: string;
}

// 学生选课
export interface StudentCourse {
  id: string;
  studentId: string;
  courseId: string;
  score?: number;
  status: 'enrolled' | 'completed' | 'failed';
  enrolledAt: string;
  completedAt?: string;
}

// 成绩信息
export interface Grade {
  id: string;
  studentId: string;
  courseId: string;
  score: number;
  gradeLevel: 'A' | 'B' | 'C' | 'D' | 'F';
  feedback?: string;
  createdAt: string;
  updatedAt: string;
}

// 消息
export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

// 登录请求
export interface LoginRequest {
  username: string;
  password: string;
}

// 登录响应
export interface LoginResponse {
  token: string;
  user: User;
}

// 分页结果
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

// 扩展React Router的路由属性接口，添加自定义的navName属性
declare module 'react-router' {
  interface PathRouteProps {
    navName?: string;
  }
  
  interface LayoutRouteProps {
    navName?: string;
  }
  
  interface IndexRouteProps {
    navName?: string;
  }
}
