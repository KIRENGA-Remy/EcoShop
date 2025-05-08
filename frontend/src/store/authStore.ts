import { create } from 'zustand';
import { 
  saveUserToStorage, 
  getUserFromStorage, 
  removeUserFromStorage 
} from '../utils/localStorage';

interface User {
  id: string;
  username: string;
  email: string;
  is_admin: boolean;
  token: string;
}

interface AuthState {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: getUserFromStorage(),
  
  login: (userData: User) => {
    saveUserToStorage(userData);
    set({ user: userData });
  },
  
  logout: () => {
    removeUserFromStorage();
    set({ user: null });
  },
}));