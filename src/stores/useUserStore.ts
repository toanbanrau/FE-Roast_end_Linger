import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { IUser, UserLogin, UserRegister } from '../interfaces/user';
import { login, register, getProfile, logout } from '../services/authService';
import { isAxiosError } from 'axios';
import { useCartStore } from './useCartStore';
import toast from 'react-hot-toast';
import { clearLocalDataOnTokenError } from '../utils/tokenUtils';

interface UserState {
  user: IUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (payload: UserLogin) => Promise<void>;
  register: (payload: UserRegister) => Promise<void>;
  getProfile: () => Promise<void>;
  logout: () => Promise<void>;
  handleTokenError: () => void;
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
          const data = await register(payload);
          // data.user sẽ có đầy đủ thông tin IUser sau khi register thành công
          set({ user: data.user, isAuthenticated: true, loading: false });
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
          // Chỉ xử lý lỗi thông thường, không xử lý token error ở đây
          if (isAxiosError(error)) {
            // Nếu là 401/403, để axios interceptor xử lý
            if (error.response?.status === 401 || error.response?.status === 403) {
              set({ user: null, isAuthenticated: false, loading: false });
              return;
            }
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
      handleTokenError: () => {
        clearLocalDataOnTokenError();
        set({ user: null, isAuthenticated: false, loading: false, error: null });
      },
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'user-auth-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
