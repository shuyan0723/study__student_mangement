// localStorage 隔离管理工具类
class LocalStorageManager {
  private getPrefix(role: string, userId: string): string {
    return `grade_system_${role}_${userId}_`;
  }

  // 学生身份存储
  setStudentData(userId: string, key: string, value: any): void {
    const prefix = this.getPrefix('student', userId);
    localStorage.setItem(prefix + key, JSON.stringify(value));
  }

  getStudentData(userId: string, key: string): any {
    const prefix = this.getPrefix('student', userId);
    const item = localStorage.getItem(prefix + key);
    return item ? JSON.parse(item) : null;
  }

  // 教师身份存储
  setTeacherData(userId: string, key: string, value: any): void {
    const prefix = this.getPrefix('teacher', userId);
    localStorage.setItem(prefix + key, JSON.stringify(value));
  }

  getTeacherData(userId: string, key: string): any {
    const prefix = this.getPrefix('teacher', userId);
    const item = localStorage.getItem(prefix + key);
    return item ? JSON.parse(item) : null;
  }

  // 管理员身份存储
  setAdminData(userId: string, key: string, value: any): void {
    const prefix = this.getPrefix('admin', userId);
    localStorage.setItem(prefix + key, JSON.stringify(value));
  }

  getAdminData(userId: string, key: string): any {
    const prefix = this.getPrefix('admin', userId);
    const item = localStorage.getItem(prefix + key);
    return item ? JSON.parse(item) : null;
  }

  // 通用方法
  setData(role: string, userId: string, key: string, value: any): void {
    const prefix = this.getPrefix(role, userId);
    localStorage.setItem(prefix + key, JSON.stringify(value));
  }

  getData(role: string, userId: string, key: string): any {
    const prefix = this.getPrefix(role, userId);
    const item = localStorage.getItem(prefix + key);
    return item ? JSON.parse(item) : null;
  }

  // 清除特定身份的所有数据
  clearRoleData(role: string, userId: string): void {
    const prefix = this.getPrefix(role, userId);
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(prefix)) {
        localStorage.removeItem(key);
      }
    });
  }

  // 清除所有数据
  clearAllData(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('grade_system_')) {
        localStorage.removeItem(key);
      }
    });
  }

  // 获取特定身份的所有键
  getRoleKeys(role: string, userId: string): string[] {
    const prefix = this.getPrefix(role, userId);
    const keys = Object.keys(localStorage);
    return keys
      .filter(key => key.startsWith(prefix))
      .map(key => key.replace(prefix, ''));
  }
}

// 使用示例
const storage = new LocalStorageManager();

// 学生登录时存储数据
storage.setStudentData('student123', 'grades', [
  { course: '数学', score: 85 },
  { course: '英语', score: 90 }
]);

// 教师登录时存储数据
storage.setTeacherData('teacher456', 'courses', [
  { id: 1, name: '高等数学' },
  { id: 2, name: '线性代数' }
]);

// 管理员登录时存储数据
storage.setAdminData('admin789', 'settings', {
  theme: 'light',
  language: 'zh-CN'
});

// 获取数据
const studentGrades = storage.getStudentData('student123', 'grades');
const teacherCourses = storage.getTeacherData('teacher456', 'courses');
const adminSettings = storage.getAdminData('admin789', 'settings');

// 角色切换时清除数据
storage.clearRoleData('student', 'student123');