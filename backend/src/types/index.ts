// User Role Type
export type UserRole = 'student' | 'teacher' | 'admin';
export type UserStatus = 'active' | 'inactive' | 'locked';

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  details?: any;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// User Types
export interface IUser {
  id: string;
  username: string;
  password_hash: string;
  email?: string;
  avatar_url?: string;
  role: UserRole;
  status: UserStatus;
  last_login?: Date;
  login_attempts: number;
  locked_until?: Date;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

// Student Types
export interface IStudent {
  id: string;
  user_id: string;
  student_id: string;
  name: string;
  gender?: string;
  date_of_birth?: Date;
  college?: string;
  major?: string;
  phone?: string;
  home_address?: string;
  admission_date?: Date;
  status: string;
  created_at: Date;
  updated_at: Date;
}

// Teacher Types
export interface ITeacher {
  id: string;
  user_id: string;
  teacher_id: string;
  name: string;
  gender?: string;
  department?: string;
  title?: string;
  phone?: string;
  research_area?: string;
  education?: string;
  years_of_service?: number;
  created_at: Date;
  updated_at: Date;
}

// Course Types
export interface ICourse {
  id: string;
  course_id: string;
  course_name: string;
  credits: number;
  hours: number;
  semester?: string;
  category?: string;
  teacher_id?: string;
  description?: string;
  capacity: number;
  enrolled_count: number;
  assessment_method?: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

// Grade Types
export interface IGrade {
  id: string;
  student_id: string;
  course_id: string;
  score?: number;
  grade_level?: string;
  feedback?: string;
  submission_status: string;
  submitted_at?: Date;
  created_at: Date;
  updated_at: Date;
}

// Message Types
export interface IMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  read_at?: Date;
  created_at: Date;
  updated_at: Date;
}

// Appeal Types
export interface IAppeal {
  id: string;
  student_id: string;
  course_id: string;
  original_score?: number;
  appeal_reason: string;
  attachments?: any;
  status: string;
  reviewed_by?: string;
  review_feedback?: string;
  new_score?: number;
  appeal_time: Date;
  reviewed_time?: Date;
  created_at: Date;
  updated_at: Date;
}

// Notice Types
export interface INotice {
  id: string;
  title: string;
  content: string;
  type: string;
  publish_by?: string;
  target_role: string;
  is_pinned: boolean;
  publish_time: Date;
  expire_time?: Date;
  views: number;
  created_at: Date;
  updated_at: Date;
}

// Request Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    username: string;
    email?: string;
    role: UserRole;
    avatar_url?: string;
  };
  expiresIn: number;
}

export interface CreateStudentRequest {
  username: string;
  password: string;
  student_id: string;
  name: string;
  email?: string;
  gender?: string;
  date_of_birth?: string;
  college?: string;
  major?: string;
  phone?: string;
}

export interface CreateGradeRequest {
  student_id: string;
  course_id: string;
  score: number;
  feedback?: string;
}

export interface CreateMessageRequest {
  receiver_id: string;
  content: string;
}

export interface CreateAppealRequest {
  course_id: string;
  appeal_reason: string;
}