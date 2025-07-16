import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { IUser, UserLogin, UserRegister } from '../interfaces/user';
import { login, register, getProfile, logout } from '../services/authService';
import { isAxiosError } from 'axios';
import { useCartStore } from './useCartStore';
import toast from 'react-hot-toast';

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

          // Sync cart sau khi login thành công
          useCartStore.getState().syncCart();
        } catch (error) {
          let errorMessage = 'Login failed';

          if (isAxiosError(error)) {
            errorMessage = error.response?.data?.message || error.message || 'Login failed';
          } else if (error instanceof Error) {
            errorMessage = error.message;
          }

          set({ error: errorMessage, loading: false });

          // Throw error để mutation có thể catch và không navigate
          throw error;
        }
      },
      register: async (payload) => {
        set({ loading: true, error: null });
        try {
          const { user } = await register(payload);
          set({ user, isAuthenticated: true, loading: false });
        } catch (error) {
          let errorMessage = 'Register failed';

          if (isAxiosError(error)) {
            errorMessage = error.response?.data?.message || error.message || 'Register failed';
          } else if (error instanceof Error) {
            errorMessage = error.message;
          }

          set({ error: errorMessage, loading: false });

          // Throw error để mutation có thể catch
          throw error;
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
          useCartStore.getState().clearLocalCart();
        }
      },
      logout: async () => {
        set({ loading: true, error: null });
        try {
          await logout();
          localStorage.removeItem('token');

          // Clear cart khi logout
          useCartStore.getState().clearLocalCart();

          set({ user: null, isAuthenticated: false, loading: false });

          // Thông báo đăng xuất thành công
          toast.success('Đăng xuất thành công!');
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
