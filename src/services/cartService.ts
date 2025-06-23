import { clientAxios } from '../configs/config';
import type {
    ICart,
    IAddProductToCartPayload,
    IUpdateCartItemPayload,
    ICartItem,
    ICartSummary,
    ICartApiResponse
} from '../interfaces/cart';

export const getCart = async (): Promise<ICart> => {
    const response = await clientAxios.get<ICartApiResponse<ICart>>('/cart');
    return response.data.data;
};

export const addToCart = async (payload: IAddProductToCartPayload): Promise<{ cart_item: ICartItem, cart_summary: ICartSummary }> => {
    const response = await clientAxios.post<ICartApiResponse<{ cart_item: ICartItem, cart_summary: ICartSummary }>>('/cart/add', payload);
    return response.data.data;
};

/**
 * Update the quantity of a specific item in the cart.
 */
export const updateCartItem = async (itemId: number, payload: IUpdateCartItemPayload): Promise<{ cart_item: Partial<ICartItem>, cart_summary: ICartSummary }> => {
    const response = await clientAxios.put<ICartApiResponse<{ cart_item: Partial<ICartItem>, cart_summary: ICartSummary }>>(`/cart/items/${itemId}`, payload);
    return response.data.data;
};

/**
 * Remove a specific item from the cart.
 */
export const removeFromCart = async (itemId: number): Promise<{ cart_summary: ICartSummary }> => {
    const response = await clientAxios.delete<ICartApiResponse<{ cart_summary: ICartSummary }>>(`/cart/items/${itemId}`);
    return response.data.data;
};

/**
 * Clear all items from the shopping cart.
 */
export const clearCart = async (): Promise<{ cart_summary: ICartSummary }> => {
    const response = await clientAxios.delete<ICartApiResponse<{ cart_summary: ICartSummary }>>('/cart/clear');
    return response.data.data;
};
