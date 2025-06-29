import { clientAxios } from '../configs/config';
import type {
    ICart,
    IUpdateCartItemPayload,
    IAddProductToCartPayload,
    IAddToCartResponse,
    ICartResponse
} from '../interfaces/cart';

export const getCart = async (): Promise<ICart> => {
    const response = await clientAxios.get('/cart');
    return response.data.data;
};

export const addToCart = async (values: IAddProductToCartPayload): Promise<IAddToCartResponse> => {
    const response = await clientAxios.post('/cart/add', values);
    return response.data;
};

/**
 * Update the quantity of a specific item in the cart.
 */
export const updateCartItem = async (itemId: number, payload: IUpdateCartItemPayload): Promise<ICartResponse> => {
    const response = await clientAxios.put(`/cart/items/${itemId}`, payload);
    return response.data;
};

/**
 * Remove a specific item from the cart.
 */
export const removeFromCart = async (itemId: number): Promise<ICartResponse> => {
    const response = await clientAxios.delete(`/cart/items/${itemId}`);
    return response.data;
};

/**
 * Clear all items from the shopping cart.
 */
export const clearCart = async(): Promise<ICartResponse> => {
    const response = await clientAxios.delete('/cart/clear');
    return response.data;
};
