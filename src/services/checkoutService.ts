import { adminAxios } from "../configs/config";
import type { IOrder, IOrderCreate } from "../interfaces/order";

export const checkout = async (order: IOrderCreate): Promise<IOrder> => {
    const response = await adminAxios.post('/orders', order);
    return response.data;
}

export const getAllOrders = async (): Promise<IOrder[]> => {
    const response = await adminAxios.get('/orders');
    return response.data;
}

export const getOrdersByUserId = async (userId: number): Promise<IOrder[]> => {
    const response = await adminAxios.get(`/orders/user/${userId}`);
    return response.data;
}

export const getOrderById = async (id: number): Promise<IOrder> => {
    const response = await adminAxios.get(`/orders/${id}`);
    return response.data;
}

export const updateOrderStatus = async (id: number, status: string): Promise<IOrder> => {
    const response = await adminAxios.patch(`/orders/${id}/status`, { status });
    return response.data;
}
