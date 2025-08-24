// Lấy đơn hàng theo order_number (dùng cho PaymentPage)
export const getOrderDetail = async (orderNumber: string) => {
    const response = await clientAxios.get<ApiResponse<{ order: IOrder }>>(`/orders/by-number/${orderNumber}`);
    return response.data;
};
import { adminAxios, clientAxios } from "../configs/config";
import type { IOrder, IOrderCreate, CancelOrderRequest, CancelOrderResponse, PaymentInfo } from "../interfaces/order";

// API Response wrapper interface
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const checkout = async (order: IOrderCreate): Promise<{ order: IOrder; payment_info?: PaymentInfo }> => {
    const response = await clientAxios.post<ApiResponse<{ order: IOrder; payment_info?: PaymentInfo }>>('/orders', order);
    return response.data.data; // Trả về cả order và payment_info
}

export const getAllOrders = async (): Promise<IOrder[]> => {
    const response = await clientAxios.get<ApiResponse<IOrder[]>>('/orders');
    return response.data.data;
}

// Interface cho paginated orders response
export interface PaginatedOrdersResponse {
    orders: IOrder[];
    pagination: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
}

export interface OrdersQueryParams {
    page?: number;
    per_page?: number;
    search?: string;
    status?: string;
}

export const getMyOrders = async (params: OrdersQueryParams = {}): Promise<PaginatedOrdersResponse> => {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.set('page', params.page.toString());
    if (params.per_page) queryParams.set('per_page', params.per_page.toString());
    if (params.search) queryParams.set('search', params.search);
    if (params.status && params.status !== 'all') queryParams.set('status', params.status);

    const url = `/orders${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    console.log('🔍 Fetching orders with params:', url);

    const response = await clientAxios.get<ApiResponse<PaginatedOrdersResponse>>(url);
    return response.data.data;
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

// Cancel order
export const cancelOrder = async (id: number, request: CancelOrderRequest): Promise<CancelOrderResponse['data']> => {
    const response = await clientAxios.post<CancelOrderResponse>(`/orders/${id}/cancel`, request);
    return response.data.data;
}

export const updateOrderStatus = async (id: number, status: string): Promise<IOrder> => {
    const response = await adminAxios.patch<ApiResponse<IOrder>>(`/orders/${id}/status`, { status });
    return response.data.data;
}



// Confirm delivery
export const confirmDelivery = async (orderId: number): Promise<IOrder> => {
    const response = await clientAxios.post<ApiResponse<IOrder>>(`/orders/${orderId}/confirm-delivery`);
    return response.data.data;
}
