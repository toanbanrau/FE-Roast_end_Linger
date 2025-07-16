import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ICart, IAddProductToCartPayload } from '../interfaces/cart';
import * as cartService from '../services/cartService';

interface CartState {
  cart: ICart | null;
  loading: boolean;
  getCart: () => Promise<void>;
  addToCart: (payload: IAddProductToCartPayload) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  clearLocalCart: () => void;
  syncCart: () => Promise<void>;
}

const initialState: ICart | null = null;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: initialState,
      loading: false,
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
        set({ loading: true });
        try {
          const res = await cartService.updateCartItem(itemId, { quantity });
          if (!res.success) throw new Error(res.message || 'Cập nhật số lượng thất bại!');
          await get().syncCart();
        } catch (error) {
          console.log(error);
        } finally {
          set({ loading: false });
        }
      },
      removeFromCart: async (itemId) => {
        set({ loading: true });
        try {
          const res = await cartService.removeFromCart(itemId);
          if (!res.success) throw new Error(res.message || 'Xóa sản phẩm thất bại!');
          await get().syncCart();
        } catch (error) {
          console.log(error);
        } finally {
          set({ loading: false });
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
        set({ cart: initialState, loading: false });
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

useCartStore.subscribe((state) => {
  if (!state.cart && !state.loading) {
    state.syncCart();
  }
});
