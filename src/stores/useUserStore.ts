import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { IUser, UserLogin, UserRegister } from '../interfaces/user';
import { login, register, getProfile, logout } from '../services/authService';
import { isAxiosError } from 'axios';

interface UserState {
  user: IUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (payload: UserLogin) => Promise<void>;
  register: (payload: UserRegister) => Promise<void>;
  getProfile: () => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: IUser | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      login: async (payload) => {
        set({ loading: true, error: null });
        try {
          const data = await login(payload);
          const { user, token } = data;
          localStorage.setItem('token', token);
          set({ user, isAuthenticated: true, loading: false });
        } catch (error) {
          if (isAxiosError(error)) {
            set({ error: error.response?.data?.message || 'Login failed', loading: false });
          } else {
            set({ error: 'Login failed', loading: false });
          }
        }
      },
      register: async (payload) => {
        set({ loading: true, error: null });
        try {
          const { user } = await register(payload);
          set({ user, isAuthenticated: true, loading: false });
        } catch (error) {
          if (isAxiosError(error)) {
            set({ error: error.response?.data?.message || 'Register failed', loading: false });
          } else {
            set({ error: 'Register failed', loading: false });
          }
        }
      },
      getProfile: async () => {
        set({ loading: true, error: null });
        try {
          const user = await getProfile();
          set({ user, isAuthenticated: true, loading: false });
        } catch (error) {
          if (isAxiosError(error)) {
            set({ error: error.response?.data?.message || 'Get profile failed', loading: false });
          } else {
            set({ error: 'Get profile failed', loading: false });
          }
        }
      },
      logout: async () => {
        set({ loading: true, error: null });
        try {
          await logout();
          localStorage.removeItem('token');
          set({ user: null, isAuthenticated: false, loading: false });
        } catch (error) {
          if (isAxiosError(error)) {
            set({ error: error.response?.data?.message || 'Logout failed', loading: false });
          } else {
            set({ error: 'Logout failed', loading: false });
          }
        }
      },
      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'user-auth-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
