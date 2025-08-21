import { useEffect } from 'react';
import { useCartStore } from '../stores/useCartStore';
import { useUserStore } from '../stores/useUserStore';

/**
 * Hook để đồng bộ giỏ hàng khi:
 * - App khởi động
 * - User quay lại tab (focus)
 * - User reload trang
 * - User login/logout
 */
export const useCartSync = () => {
  const { syncCart } = useCartStore();
  const { user } = useUserStore();

  useEffect(() => {
    // Chỉ sync khi user đã đăng nhập
    if (!user) return;

    // Sync ngay khi hook được mount (app khởi động/reload)
    syncCart();

    // Sync khi user quay lại tab
    const handleFocus = () => {
      console.log('🔄 Tab focused - syncing cart...');
      syncCart();
    };

    // Sync khi user online lại (sau khi mất mạng)
    const handleOnline = () => {
      console.log('🌐 Back online - syncing cart...');
      syncCart();
    };

    // Sync khi visibility change (tab active/inactive)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('👁️ Tab visible - syncing cart...');
        syncCart();
      }
    };

    // Add event listeners
    window.addEventListener('focus', handleFocus);
    window.addEventListener('online', handleOnline);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('online', handleOnline);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user, syncCart]);

  // Sync khi user login/logout
  useEffect(() => {
    if (user) {
      console.log('👤 User logged in - syncing cart...');
      syncCart();
    } else {
      console.log('👤 User logged out - clearing cart...');
      // Clear cart khi logout
      useCartStore.getState().clearLocalCart();
    }
  }, [user, syncCart]);
};

/**
 * Hook để sync cart theo interval (optional)
 * Sử dụng khi muốn sync định kỳ
 */
export const useCartSyncInterval = (intervalMs: number = 30000) => {
  const { syncCart } = useCartStore();
  const { user } = useUserStore();

  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      console.log('⏰ Interval sync cart...');
      syncCart();
    }, intervalMs);

    return () => clearInterval(interval);
  }, [user, syncCart, intervalMs]);
};
