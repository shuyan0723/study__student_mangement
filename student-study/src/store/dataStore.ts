import { create } from 'zustand';
import type { Student, Teacher, Course, Grade, Message, StudentCourse } from '../types';

interface DataState {
  students: Student[];
  teachers: Teacher[];
  courses: Course[];
  grades: Grade[];
  messages: Message[];
  studentCourses: StudentCourse[];

  // 学生相关方法
  getStudentById: (id: string) => Student | undefined;
  updateStudent: (student: Student) => void;
  addStudent: (student: Student) => void;

  // 教师相关方法
  getTeacherById: (id: string) => Teacher | undefined;
  updateTeacher: (teacher: Teacher) => void;
  addTeacher: (teacher: Teacher) => void;

  // 课程相关方法
  getCourses: () => Course[];
  getCourseById: (id: string) => Course | undefined;
  addCourse: (course: Course) => void;
  updateCourse: (course: Course) => void;
  deleteCourse: (id: string) => void;

  // 成绩相关方法
  getGradesByStudentId: (studentId: string) => Grade[];
  getGradesByCourseId: (courseId: string) => Grade[];
  addGrade: (grade: Grade) => void;
  updateGrade: (grade: Grade) => void;
  deleteGrade: (id: string) => void;

  // 消息相关方法
  getMessagesByUserId: (userId: string) => Message[];
  addMessage: (message: Message) => void;
  markMessageAsRead: (messageId: string) => void;

  // 选课相关方法
  getStudentCourses: (studentId: string) => StudentCourse[];
  enrollCourse: (enrollment: StudentCourse) => void;
}

// 初始化模拟数据
const mockStudents: Student[] = [
  {
    id: 'student_001',
    username: 'student01',
    email: 'student01@example.com',
    phone: '13800138001',
    role: 'student',
    createdAt: '2024-01-01T00:00:00.000Z',
    studentId: '20200001',
    name: '张三',
    gender: 'male',
    college: '计算机学院',
    major: '计算机科学与技术',
    homeAddress: '北京市海淀区',
  },
  {
    id: 'student_002',
    username: 'student02',
    email: 'student02@example.com',
    phone: '13800138002',
    role: 'student',
    createdAt: '2024-01-01T00:00:00.000Z',
    studentId: '20200002',
    name: '李四',
    gender: 'female',
    college: '计算机学院',
    major: '软件工程',
    homeAddress: '上海市浦东新区',
  },
  {
    id: 'student_003',
    username: 'student03',
    email: 'student03@example.com',
    phone: '13800138003',
    role: 'student',
    createdAt: '2024-01-01T00:00:00.000Z',
    studentId: '20200003',
    name: '王五',
    gender: 'male',
    college: '计算机学院',
    major: '数据科学与大数据技术',
    homeAddress: '广州市天河区',
  },
  {
    id: 'student_004',
    username: 'student04',
    email: 'student04@example.com',
    phone: '13800138004',
    role: 'student',
    createdAt: '2024-01-01T00:00:00.000Z',
    studentId: '20200004',
    name: '赵六',
    gender: 'female',
    college: '计算机学院',
    major: '计算机科学与技术',
    homeAddress: '深圳市南山区',
  },
];

const mockTeachers: Teacher[] = [
  {
    id: 'teacher_001',
    username: 'teacher01',
    email: 'teacher01@example.com',
    phone: '13900139001',
    role: 'teacher',
    createdAt: '2024-01-01T00:00:00.000Z',
    teacherId: 'T001',
    name: '王教授',
    gender: 'male',
    department: '计算机学院',
    title: '教授',
    courseIds: ['C001', 'C002'],
    hireDate: '2000-09-01T00:00:00.000Z',
    education: '博士',
    researchArea: '算法与数据结构',
    status: 'active',
  },
  {
    id: 'teacher_002',
    username: 'teacher02',
    email: 'teacher02@example.com',
    phone: '13900139002',
    role: 'teacher',
    createdAt: '2024-01-01T00:00:00.000Z',
    teacherId: 'T002',
    name: '李教授',
    gender: 'female',
    department: '计算机学院',
    title: '副教授',
    courseIds: ['C003'],
    hireDate: '2005-09-01T00:00:00.000Z',
    education: '硕士',
    researchArea: '数据库技术',
    status: 'active',
  },
];

const mockCourses: Course[] = [
  {
    courseId: 'C001',
    courseName: '数据结构',
    credits: 3,
    semester: '2024-1',
    hours: 48,
    teacherId: 'teacher_001',
    teacherName: '王教授',
  },
  {
    courseId: 'C002',
    courseName: '算法设计',
    credits: 3,
    semester: '2024-1',
    hours: 48,
    teacherId: 'teacher_001',
    teacherName: '王教授',
  },
  {
    courseId: 'C003',
    courseName: '数据库原理',
    credits: 3,
    semester: '2024-1',
    hours: 48,
    teacherId: 'teacher_002',
    teacherName: '李教授',
  },
];

const mockStudentCourses: StudentCourse[] = [
  {
    id: 'SC001',
    studentId: 'student_001',
    courseId: 'C001',
    score: 85,
    status: 'completed',
    enrolledAt: '2024-02-01T00:00:00.000Z',
    completedAt: '2024-06-30T00:00:00.000Z',
  },
  {
    id: 'SC002',
    studentId: 'student_001',
    courseId: 'C002',
    score: 92,
    status: 'completed',
    enrolledAt: '2024-02-01T00:00:00.000Z',
    completedAt: '2024-06-30T00:00:00.000Z',
  },
  {
    id: 'SC003',
    studentId: 'student_002',
    courseId: 'C001',
    score: 78,
    status: 'completed',
    enrolledAt: '2024-02-01T00:00:00.000Z',
    completedAt: '2024-06-30T00:00:00.000Z',
  },
  {
    id: 'SC004',
    studentId: 'student_002',
    courseId: 'C002',
    score: 88,
    status: 'completed',
    enrolledAt: '2024-02-01T00:00:00.000Z',
    completedAt: '2024-06-30T00:00:00.000Z',
  },
  {
    id: 'SC005',
    studentId: 'student_003',
    courseId: 'C001',
    score: 95,
    status: 'completed',
    enrolledAt: '2024-02-01T00:00:00.000Z',
    completedAt: '2024-06-30T00:00:00.000Z',
  },
  {
    id: 'SC006',
    studentId: 'student_004',
    courseId: 'C002',
    score: 82,
    status: 'completed',
    enrolledAt: '2024-02-01T00:00:00.000Z',
    completedAt: '2024-06-30T00:00:00.000Z',
  },
];

const mockGrades: Grade[] = [
  {
    id: 'G001',
    studentId: 'student_001',
    courseId: 'C001',
    score: 85,
    gradeLevel: 'B',
    feedback: '表现不错，继续加油',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: 'G002',
    studentId: 'student_001',
    courseId: 'C002',
    score: 92,
    gradeLevel: 'A',
    feedback: '优秀',
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20',
  },
  {
    id: 'G003',
    studentId: 'student_002',
    courseId: 'C001',
    score: 78,
    gradeLevel: 'B',
    feedback: '需要加强练习',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: 'G004',
    studentId: 'student_002',
    courseId: 'C002',
    score: 88,
    gradeLevel: 'B',
    feedback: '进步明显',
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20',
  },
];

const mockMessages: Message[] = [
  {
    id: 'msg_001',
    senderId: 'student_001',
    senderName: '张三',
    receiverId: 'teacher_001',
    content: '王教授，我想咨询一下关于数据结构课程的问题。',
    timestamp: '2024-03-10T10:00:00.000Z',
    isRead: true,
  },
  {
    id: 'msg_002',
    senderId: 'teacher_001',
    senderName: '王教授',
    receiverId: 'student_001',
    content: '你好，有什么问题可以直接问我。',
    timestamp: '2024-03-10T10:15:00.000Z',
    isRead: true,
  },
  {
    id: 'msg_003',
    senderId: 'student_002',
    senderName: '李四',
    receiverId: 'teacher_001',
    content: '王教授，我的作业什么时候能批改完？',
    timestamp: '2024-03-11T14:30:00.000Z',
    isRead: false,
  },
];

export const useDataStore = create<DataState>((set, get) => ({
  students: mockStudents,
  teachers: mockTeachers,
  courses: mockCourses,
  grades: mockGrades,
  messages: mockMessages,
  studentCourses: mockStudentCourses,

  // 学生方法
  getStudentById: (id: string) => {
    return get().students.find((s) => s.id === id);
  },

  addStudent: (student: Student) => {
    set((state) => ({
      students: [...state.students, student],
    }));
  },

  updateStudent: (student: Student) => {
    set((state) => ({
      students: state.students.map((s) => (s.id === student.id ? student : s)),
    }));
  },

  // 教师方法
  getTeacherById: (id: string) => {
    return get().teachers.find((t) => t.id === id);
  },

  addTeacher: (teacher: Teacher) => {
    set((state) => ({
      teachers: [...state.teachers, teacher],
    }));
  },

  updateTeacher: (teacher: Teacher) => {
    set((state) => ({
      teachers: state.teachers.map((t) => (t.id === teacher.id ? teacher : t)),
    }));
  },

  // 课程方法
  getCourses: () => get().courses,

  getCourseById: (id: string) => {
    return get().courses.find((c) => c.courseId === id);
  },

  addCourse: (course: Course) => {
    set((state) => ({
      courses: [...state.courses, course],
    }));
  },

  updateCourse: (course: Course) => {
    set((state) => ({
      courses: state.courses.map((c) => (c.courseId === course.courseId ? course : c)),
    }));
  },

  deleteCourse: (id: string) => {
    set((state) => ({
      courses: state.courses.filter((c) => c.courseId !== id),
    }));
  },

  // 成绩方法
  getGradesByStudentId: (studentId: string) => {
    return get().grades.filter((g) => g.studentId === studentId);
  },

  getGradesByCourseId: (courseId: string) => {
    return get().grades.filter((g) => g.courseId === courseId);
  },

  addGrade: (grade: Grade) => {
    set((state) => ({
      grades: [...state.grades, grade],
    }));
  },

  updateGrade: (grade: Grade) => {
    set((state) => ({
      grades: state.grades.map((g) => (g.id === grade.id ? grade : g)),
    }));
  },

  deleteGrade: (id: string) => {
    set((state) => ({
      grades: state.grades.filter((g) => g.id !== id),
    }));
  },

  // 消息方法
  getMessagesByUserId: (userId: string) => {
    return get().messages.filter((m) => m.receiverId === userId);
  },

  addMessage: (message: Message) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  markMessageAsRead: (messageId: string) => {
    set((state) => ({
      messages: state.messages.map((m) => (m.id === messageId ? { ...m, isRead: true } : m)),
    }));
  },

  // 选课方法
  getStudentCourses: (studentId: string) => {
    return get().studentCourses.filter((sc) => sc.studentId === studentId);
  },

  enrollCourse: (enrollment: StudentCourse) => {
    set((state) => ({
      studentCourses: [...state.studentCourses, enrollment],
    }));
  },
}));
