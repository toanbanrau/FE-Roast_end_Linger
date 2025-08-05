import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ICart, IAddProductToCartPayload } from '../interfaces/cart';
import * as cartService from '../services/cartService';

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

const initialState: ICart | null = null;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: initialState,
      loading: false,
      isClearing: false,
      syncCart: async () => {
        try {
          const cart = await cartService.getCart();
          set({ cart });
        } catch (error) {
          console.error('Không thể đồng bộ giỏ hàng:', error);
        }
      },
      getCart: async () => {
        set({ loading: true });
        try {
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
          if (!res.success) throw new Error(res.message || 'Thêm sản phẩm thất bại!');
          await get().syncCart();
        } catch (error) {
          console.log(error);
        } finally {
          set({ loading: false });
        }
      },
      updateQuantity: async (itemId, quantity) => {
        const currentCart = get().cart;
        if (!currentCart) return;

        // 1. Optimistic update - cập nhật UI ngay lập tức
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
            if (!res.success) throw new Error(res.message || 'Cập nhật số lượng thất bại!');

            // 4. Sync lại với server để đảm bảo dữ liệu chính xác
            await get().syncCart();
          } catch (error) {
            // Bỏ qua lỗi nếu request bị cancel
            if (error instanceof Error && error.name === 'AbortError') return;

            console.log(error);

            // 5. Rollback nếu API thất bại
            set({ cart: currentCart });

            // Có thể thêm toast notification ở đây
            // toast.error('Cập nhật số lượng thất bại!');
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
          if (!res.success) throw new Error(res.message || 'Xóa sản phẩm thất bại!');

          // 3. Sync lại với server
          await get().syncCart();
        } catch (error) {
          console.log(error);

          // 4. Rollback nếu API thất bại
          set({ cart: currentCart });
        }
      },
      clearCart: async () => {
        set({ loading: true });
        try {
          const res = await cartService.clearCart();
          if (!res.success) throw new Error(res.message || 'Xóa giỏ hàng thất bại!');
          set({ cart: initialState });
        } catch (error) {
          console.log(error);
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

useCartStore.subscribe((state) => {
  if (!state.cart && !state.loading && !state.isClearing) {
    state.syncCart();
  }
});
