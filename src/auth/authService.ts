import { LOCAL_USERS, type StaffUser } from './localUsers';

export type SafeUser = Omit<StaffUser, 'password'>;

const STORAGE_KEY = 'staff_auth';

export const authService = {
  signIn: (username: string, password: string): { user: SafeUser | null; error: string | null } => {
    const user = LOCAL_USERS.find(u => u.username === username && u.password === password);
    
    if (!user) {
      return { user: null, error: 'Invalid username or password' };
    }
    
    const safeUser: SafeUser = {
      id: user.id,
      username: user.username,
      full_name: user.full_name,
      department: user.department
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser));
    return { user: safeUser, error: null };
  },

  signOut: (): void => {
    localStorage.removeItem(STORAGE_KEY);
  },

  getCurrentUser: (): SafeUser | null => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  }
};