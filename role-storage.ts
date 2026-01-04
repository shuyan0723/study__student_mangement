// 基于命名空间的localStorage隔离
class NamespacedStorage {
  private namespaces = {
    student: 'student_ns',
    teacher: 'teacher_ns',
    admin: 'admin_ns'
  };

  // 设置命名空间数据
  set(namespace: string, key: string, value: any): void {
    const nsKey = `${this.namespaces[namespace]}:${key}`;
    localStorage.setItem(nsKey, JSON.stringify(value));
  }

  // 获取命名空间数据
  get(namespace: string, key: string): any {
    const nsKey = `${this.namespaces[namespace]}:${key}`;
    const item = localStorage.getItem(nsKey);
    return item ? JSON.parse(item) : null;
  }

  // 清除命名空间数据
  clearNamespace(namespace: string): void {
    const prefix = this.namespaces[namespace] + ':';
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(prefix)) {
        localStorage.removeItem(key);
      }
    });
  }

  // 获取命名空间所有数据
  getNamespaceData(namespace: string): Record<string, any> {
    const prefix = this.namespaces[namespace] + ':';
    const result: Record<string, any> = {};
    const keys = Object.keys(localStorage);
    
    keys.forEach(key => {
      if (key.startsWith(prefix)) {
        const dataKey = key.replace(prefix, '');
        result[dataKey] = JSON.parse(localStorage.getItem(key) || 'null');
      }
    });
    
    return result;
  }
}

// 角色切换时的完整隔离方案
class RoleBasedStorage {
  private currentRole: string = '';
  private currentUserId: string = '';
  private storage = new LocalStorageManager();

  // 角色切换
  switchRole(role: string, userId: string): void {
    // 清除当前角色数据
    if (this.currentRole && this.currentUserId) {
      this.storage.clearRoleData(this.currentRole, this.currentUserId);
    }

    // 设置新角色
    this.currentRole = role;
    this.currentUserId = userId;

    // 加载新角色的缓存数据
    this.loadRoleCache();
  }

  // 加载角色缓存
  private loadRoleCache(): void {
    // 从服务器获取最新数据并缓存
    this.loadUserProfile();
    this.loadUserSettings();
    this.loadRecentData();
  }

  // 获取当前角色数据
  getCurrentData(key: string): any {
    if (!this.currentRole || !this.currentUserId) return null;
    return this.storage.getData(this.currentRole, this.currentUserId, key);
  }

  // 设置当前角色数据
  setCurrentData(key: string, value: any): void {
    if (!this.currentRole || !this.currentUserId) return;
    this.storage.setData(this.currentRole, this.currentUserId, key, value);
  }

  // 模拟数据加载方法
  private async loadUserProfile(): Promise<void> {
    // 从API获取用户资料
    // this.setCurrentData('profile', userProfile);
  }

  private async loadUserSettings(): Promise<void> {
    // 从API获取用户设置
    // this.setCurrentData('settings', userSettings);
  }

  private async loadRecentData(): Promise<void> {
    // 加载最近访问的数据
    // this.setCurrentData('recentGrades', recentGrades);
    // this.setCurrentData('recentMessages', recentMessages);
  }
}