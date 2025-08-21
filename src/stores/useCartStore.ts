import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ICart, IAddProductToCartPayload } from '../interfaces/cart';
import * as cartService from '../services/cartService';
import { toast } from 'react-hot-toast';

interface CartState {
  cart: ICart | null;
  loading: boolean;
  isClearing: boolean;
  getCart: () => Promise<void>;
  addToCart: (payload: IAddProductToCartPayload) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  clearLocalCart: () => void;
  syncCart: () => Promise<void>;
}

// Map để lưu trữ timeout cho debouncing
const updateTimeouts = new Map<number, NodeJS.Timeout>();
// Map để lưu trữ AbortController cho việc cancel request
const updateControllers = new Map<number, AbortController>();

// Helper function để kiểm tra canceled error
const isCanceledError = (error: unknown): boolean => {
  if (!error || typeof error !== 'object') return false;

  // Kiểm tra Axios CanceledError
  if ('code' in error && error.code === 'ERR_CANCELED') return true;

  // Kiểm tra AbortError hoặc CanceledError
  if (error instanceof Error && (error.name === 'AbortError' || error.name === 'CanceledError')) return true;

  return false;
};

const initialState: ICart | null = null;

// Helper function để check user authentication
const isUserAuthenticated = (): boolean => {
  try {
    // Sử dụng localStorage để check token thay vì import store
    const token = localStorage.getItem('token');
    return !!token;
  } catch (error) {
    console.error('Error checking user authentication:', error);
    return false;
  }
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: initialState,
      loading: false,
      isClearing: false,
      syncCart: async () => {
        // Kiểm tra user authentication trước khi sync
        if (!isUserAuthenticated()) {
          console.log('⚠️ No authenticated user - skipping cart sync');
          return;
        }

        try {
          console.log('🔄 Syncing cart with server...');
          const cart = await cartService.getCart();
          set({ cart });
          console.log('✅ Cart synced successfully');
        } catch (error: any) {
          // Chỉ log lỗi, không hiển thị toast để tránh spam user
          console.error('❌ Failed to sync cart:', error);

          // Nếu là lỗi 401 (unauthorized), clear cart
          if (error?.response?.status === 401) {
            console.log('🔐 Unauthorized - clearing cart');
            set({ cart: null });
          }

          // Nếu là lỗi network, giữ nguyên cart hiện tại
          // User có thể tiếp tục sử dụng offline
        }
      },
      getCart: async () => {
        // Kiểm tra user authentication trước khi get cart
        if (!isUserAuthenticated()) {
          console.log('⚠️ No authenticated user - skipping getCart');
          return;
        }

        set({ loading: true });
        try {
          console.log('🔄 Getting cart from server...');
          const cart = await cartService.getCart();
          set({ cart });
        } finally {
          set({ loading: false });
        }
      },
      addToCart: async (payload) => {
        set({ loading: true });
        try {
          const res = await cartService.addToCart(payload);
          // Kiểm tra này không cần thiết nữa vì service đã throw error
          // if (!res.success) throw new Error(res.message || 'Thêm sản phẩm thất bại!');
          await get().syncCart();
        } catch (error) {
          console.error('Add to cart error:', error);
          // QUAN TRỌNG: Throw lại error để React Query mutation có thể catch được
          throw error;
        } finally {
          set({ loading: false });
        }
      },
      updateQuantity: async (itemId, quantity) => {
        const currentCart = get().cart;
        if (!currentCart) return;

        // 0. Tìm item cần update để kiểm tra stock
        const targetItem = currentCart.items.find(item => item.id === itemId);
        if (!targetItem) return;

        // Kiểm tra stock trước khi optimistic update
        const availableStock = targetItem.stock_info?.available_stock || 0;
        if (quantity > availableStock) {
          // Không cho phép optimistic update nếu vượt quá stock
          toast.error(`Chỉ còn ${availableStock} sản phẩm trong kho!`);
          return;
        }

        // 1. Optimistic update - cập nhật UI ngay lập tức (chỉ khi hợp lệ)
        const optimisticCart = {
          ...currentCart,
          items: currentCart.items.map(item =>
            item.id === itemId
              ? {
                  ...item,
                  quantity,
                  // Cập nhật tổng tiền cho item
                  total_price: item.unit_price * quantity,
                  formatted_total_price: (item.unit_price * quantity).toLocaleString('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  })
                }
              : item
          )
        };

        // Tính lại tổng tiền giỏ hàng
        const newSubtotal = optimisticCart.items.reduce((sum, item) =>
          sum + (item.unit_price * item.quantity), 0
        );

        // Cập nhật tổng tiền và số lượng items
        optimisticCart.subtotal = newSubtotal;
        optimisticCart.total_items = optimisticCart.items.reduce((sum, item) => sum + item.quantity, 0);
        optimisticCart.formatted_subtotal = newSubtotal.toLocaleString('vi-VN', {
          style: 'currency',
          currency: 'VND'
        });

        // Cập nhật state ngay lập tức
        set({ cart: optimisticCart });

        // 2. Cancel previous request nếu có
        const existingController = updateControllers.get(itemId);
        if (existingController) {
          existingController.abort();
        }

        // Clear previous timeout nếu có
        const existingTimeout = updateTimeouts.get(itemId);
        if (existingTimeout) {
          clearTimeout(existingTimeout);
        }

        // 3. Debounce API call - chỉ gọi API sau 500ms không có thay đổi
        const timeoutId = setTimeout(async () => {
          const controller = new AbortController();
          updateControllers.set(itemId, controller);

          try {
            const res = await cartService.updateCartItem(itemId, { quantity }, controller.signal);
            // Kiểm tra này không cần thiết nữa vì service đã throw error
            // if (!res.success) throw new Error(res.message || 'Cập nhật số lượng thất bại!');

            // 4. Sync lại với server để đảm bảo dữ liệu chính xác
            await get().syncCart();
          } catch (error) {
            // Bỏ qua lỗi nếu request bị cancel
            if (isCanceledError(error)) return;

            // Chỉ log lỗi thật sự, không log cancel errors
            console.error('Cart update error:', error);

            // 5. Rollback nếu API thất bại
            set({ cart: currentCart });

            // Hiển thị thông báo lỗi cho user
            let errorMessage = 'Cập nhật số lượng thất bại!';
            if (error instanceof Error) {
              errorMessage = error.message;
            }
            toast.error(errorMessage);
          } finally {
            // Cleanup
            updateControllers.delete(itemId);
            updateTimeouts.delete(itemId);
          }
        }, 500); // Debounce 500ms

        updateTimeouts.set(itemId, timeoutId);
      },
      removeFromCart: async (itemId) => {
        const currentCart = get().cart;
        if (!currentCart) return;

        // 1. Optimistic update - xóa item ngay lập tức
        const optimisticCart = {
          ...currentCart,
          items: currentCart.items.filter(item => item.id !== itemId)
        };

        // Tính lại tổng tiền và số lượng
        const newSubtotal = optimisticCart.items.reduce((sum, item) =>
          sum + (item.unit_price * item.quantity), 0
        );

        optimisticCart.subtotal = newSubtotal;
        optimisticCart.total_items = optimisticCart.items.reduce((sum, item) => sum + item.quantity, 0);
        optimisticCart.total_product_types = optimisticCart.items.length;
        optimisticCart.is_empty = optimisticCart.items.length === 0;
        optimisticCart.formatted_subtotal = newSubtotal.toLocaleString('vi-VN', {
          style: 'currency',
          currency: 'VND'
        });

        // Cập nhật state ngay lập tức
        set({ cart: optimisticCart });

        // 2. Gọi API ở background
        try {
          const res = await cartService.removeFromCart(itemId);
          // Kiểm tra này không cần thiết nữa vì service đã throw error
          // if (!res.success) throw new Error(res.message || 'Xóa sản phẩm thất bại!');

          // 3. Sync lại với server
          await get().syncCart();
        } catch (error) {
          console.error('Remove from cart error:', error);

          // 4. Rollback nếu API thất bại
          set({ cart: currentCart });
        }
      },
      clearCart: async () => {
        set({ loading: true });
        try {
          const res = await cartService.clearCart();
          // Kiểm tra này không cần thiết nữa vì service đã throw error
          // if (!res.success) throw new Error(res.message || 'Xóa giỏ hàng thất bại!');
          set({ cart: initialState });
        } catch (error) {
          console.error('Clear cart error:', error);
          // QUAN TRỌNG: Throw lại error để component có thể catch được
          throw error;
        } finally {
          set({ loading: false });
        }
      },
      clearLocalCart: () => {
        set({ cart: initialState, loading: false, isClearing: true });
        // Reset isClearing flag sau một chút để tránh sync cart ngay lập tức
        setTimeout(() => {
          set({ isClearing: false });
        }, 100);
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Subscribe listener để auto-sync cart khi cần thiết
useCartStore.subscribe((state) => {
  // Chỉ sync khi:
  // 1. Không có cart
  // 2. Không đang loading
  // 3. Không đang clearing
  // 4. Có authenticated user
  if (!state.cart && !state.loading && !state.isClearing && isUserAuthenticated()) {
    console.log('🔄 Auto-syncing cart due to state change...');
    state.syncCart();
  }
});
