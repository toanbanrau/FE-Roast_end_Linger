import { useUserStore } from '../stores/useUserStore';
import { useCartStore } from '../stores/useCartStore';
import { checkTokenInfo } from '../services/authService';
import toast from 'react-hot-toast';

// Global flags để control token handling
let isTokenExpiredToastShown = false;
let tokenCheckInProgress = false;

// Reset toast flag sau 10 giây
const resetToastFlag = () => {
  setTimeout(() => {
    isTokenExpiredToastShown = false;
  }, 10000);
};

// Kiểm tra token có hợp lệ không bằng API
export const isTokenValid = async (token: string): Promise<boolean> => {
  if (!token) return false;

  // Tránh multiple concurrent checks
  if (tokenCheckInProgress) return true;

  try {
    tokenCheckInProgress = true;
    return await checkTokenInfo();
  } catch (error) {
    // Nếu không gọi được API (network issue), coi như token hợp lệ
    console.warn('Cannot check token via API, assuming valid:', error);
    return true;
  } finally {
    tokenCheckInProgress = false;
  }
};

// Xóa toàn bộ dữ liệu local khi token hết hạn
export const clearLocalDataOnTokenError = (): void => {
  try {
    // Xóa token
    localStorage.removeItem('token');

    // Clear user store - KHÔNG gọi handleTokenError để tránh loop
    const userStore = useUserStore.getState();
    userStore.setUser(null);
    userStore.setError(null);

    // Clear cart store - KHÔNG gọi clearLocalCart để tránh loop
    const cartStore = useCartStore.getState();
    cartStore.cart = null;
    cartStore.loading = false;

    // Clear persist storage
    localStorage.removeItem('user-auth-storage');
    localStorage.removeItem('cart-storage');

    console.log('✅ Đã xóa dữ liệu local do token hết hạn');
  } catch (error) {
    console.error('❌ Lỗi khi xóa dữ liệu local:', error);
  }
};

// Xử lý token error từ axios interceptors
export const handleTokenError = (error: any): boolean => {
  // Chỉ xử lý 401/403 errors
  const isTokenError = error?.response?.status === 401 || error?.response?.status === 403;

  if (isTokenError && !isTokenExpiredToastShown) {
    isTokenExpiredToastShown = true;

    // Clear data và show toast
    clearLocalDataOnTokenError();
    toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');

    // Reset flag sau 10 giây
    resetToastFlag();

    return true;
  }

  return false;
};

// Kiểm tra token khi khởi động ứng dụng
export const checkTokenOnAppStart = async (): Promise<void> => {
  const token = localStorage.getItem('token');

  if (token) {
    const isValid = await isTokenValid(token);
    if (!isValid && !isTokenExpiredToastShown) {
      isTokenExpiredToastShown = true;
      clearLocalDataOnTokenError();
      toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
      resetToastFlag();
    }
  }
};

// Export để sử dụng trong các store khác nếu cần
export const showTokenExpiredMessage = () => {
  if (!isTokenExpiredToastShown) {
    isTokenExpiredToastShown = true;
    toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
    resetToastFlag();
  }
};