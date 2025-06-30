import { adminAxios, clientAxios } from "../configs/config";
import type { IOrder, IOrderCreate } from "../interfaces/order";

// API Response wrapper interface
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const checkout = async (order: IOrderCreate): Promise<IOrder> => {
    const response = await clientAxios.post<ApiResponse<IOrder>>('/orders', order);
    return response.data.data;
}

export const getAllOrders = async (): Promise<IOrder[]> => {
    const response = await clientAxios.get<ApiResponse<IOrder[]>>('/orders');
    return response.data.data;
}

export const getMyOrders = async (): Promise<IOrder[]> => {
    const response = await clientAxios.get<ApiResponse<{orders: IOrder[]}>>('/orders');
    return response.data.data.orders;
}

export const getMyOrderById = async (id: number): Promise<IOrder> => {
    const response = await clientAxios.get<ApiResponse<IOrder>>(`/orders/${id}`);
    return response.data.data;
}

export const getOrdersByUserId = async (userId: number): Promise<IOrder[]> => {
    const response = await adminAxios.get<ApiResponse<IOrder[]>>(`/orders/user/${userId}`);
    return response.data.data;
}

export const getOrderById = async (id: number): Promise<IOrder> => {
    const response = await adminAxios.get<ApiResponse<IOrder>>(`/orders/${id}`);
    return response.data.data;
}

export const updateOrderStatus = async (id: number, status: string): Promise<IOrder> => {
    const response = await adminAxios.patch<ApiResponse<IOrder>>(`/orders/${id}/status`, { status });
    return response.data.data;
}
