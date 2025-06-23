import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Cart, CartItem } from '../interfaces/cart';
import { toast } from 'react-toastify';

interface CartState {
  cart: Cart;
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
}

const initialState: Cart = {
  id: 0,
  userId: 0,
  items: [],
  totalAmount: 0,
};

const calculateTotalAmount = (items: CartItem[]) => {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: initialState,
      addToCart: (item) => {
        const { cart } = get();
        const existingItem = cart.items.find((i) => i.id === item.id);
        let updatedItems;
        if (existingItem) {
          updatedItems = cart.items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
          );
        } else {
          updatedItems = [...cart.items, item];
        }

        set({
          cart: {
            ...cart,
            items: updatedItems,
            totalAmount: calculateTotalAmount(updatedItems),
          },
        });
        toast.success('Đã thêm sản phẩm vào giỏ hàng!');
      },
      removeFromCart: (itemId) => {
        const { cart } = get();
        const updatedItems = cart.items.filter((item) => item.id !== itemId);
        set({
          cart: {
            ...cart,
            items: updatedItems,
            totalAmount: calculateTotalAmount(updatedItems),
          },
        });
        toast.success('Đã xóa sản phẩm khỏi giỏ hàng!');
      },
      updateQuantity: (itemId, quantity) => {
        if (quantity < 1) {
            get().removeFromCart(itemId);
            return;
        }
        const { cart } = get();
        const updatedItems = cart.items.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        );
        set({
          cart: {
            ...cart,
            items: updatedItems,
            totalAmount: calculateTotalAmount(updatedItems),
          },
        });
      },
      clearCart: () => {
        set({ cart: initialState });
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
