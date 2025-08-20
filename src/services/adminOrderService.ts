import { adminAxios } from "../configs/config";
import type { IOrder } from "../interfaces/order";

// API Response wrapper interface
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Update Order Status Request interface
interface UpdateOrderStatusRequest {
  status_id: number;
  notes?: string;
}

interface OrdersResponse {
  orders: IOrder[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
  filters: {
    search?: string;
    status_id?: number;
    payment_method?: string;
    date_from?: string;
    date_to?: string;
    sort_by?: string;
    sort_direction?: string;
  };
  statistics: {
    total_orders: number;
    total_revenue: number;
    average_order_value: number;
    orders_by_status: { [key: string]: number };
  };
}

// Lấy tất cả đơn hàng với phân trang và filters
export const getAllOrders = async (params?: {
  page?: number;
  per_page?: number;
  search?: string;
  status_id?: number;
  payment_method?: string;
  payment_status?: boolean;
  date_from?: string;
  date_to?: string;
  sort_by?: string;
  sort_direction?: string;
}): Promise<OrdersResponse> => {
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
  if (params?.search) queryParams.append('search', params.search);
  if (params?.status_id) queryParams.append('status_id', params.status_id.toString());
  if (params?.payment_method) queryParams.append('payment_method', params.payment_method);
  if (params?.payment_status !== undefined) queryParams.append('payment_status', params.payment_status.toString());
  if (params?.date_from) queryParams.append('date_from', params.date_from);
  if (params?.date_to) queryParams.append('date_to', params.date_to);
  if (params?.sort_by) queryParams.append('sort_by', params.sort_by);
  if (params?.sort_direction) queryParams.append('sort_direction', params.sort_direction);

  const response = await adminAxios.get<ApiResponse<OrdersResponse>>(`/orders?${queryParams.toString()}`);
  return response.data.data;
};

// Lấy chi tiết đơn hàng theo ID
export const getOrderById = async (id: number): Promise<IOrder> => {
  const response = await adminAxios.get<ApiResponse<IOrder>>(`/orders/${id}`);
  return response.data.data;
};

// Cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (
  id: number,
  statusId: number,
  notes?: string
): Promise<IOrder> => {
  console.log(`🔄 Updating order ${id} status to ${statusId}`);
  console.log(`📤 API URL: PATCH /api/admin/orders/${id}/status`);

  const requestBody: UpdateOrderStatusRequest = {
    status_id: statusId,
    ...(notes && { notes })
  };

  console.log(`📤 Request body:`, requestBody);

  try {
    const response = await adminAxios.patch<ApiResponse<IOrder>>(`/orders/${id}/status`, requestBody);

    console.log(`✅ Order status updated successfully:`, response.data);
    return response.data.data;
  } catch (error) {
    console.error(`❌ Failed to update order status:`, error);
    throw error;
  }
};

// Interface cho Order Status từ API
interface OrderStatus {
  id: number;
  status_name: string;
  description: string;
  color: string;
  sort_order: number;
  can_be_cancelled: boolean;
  is_final_status: boolean;
  orders_count: number;
  created_at: string;
  updated_at: string;
}

// Lấy danh sách trạng thái đơn hàng từ API
export const getOrderStatuses = async (): Promise<OrderStatus[]> => {
  console.log('🔄 Fetching order statuses from API...');

  try {
    const response = await adminAxios.get<ApiResponse<OrderStatus[]>>('/order-statuses');

    console.log('✅ Order statuses fetched successfully:', response.data.data);
    return response.data.data;
  } catch (error) {
    console.error('❌ Failed to fetch order statuses:', error);
    throw error;
  }
};

// Tìm kiếm đơn hàng - sử dụng getAllOrders với search param
export const searchOrders = async (query: string, page: number = 1): Promise<OrdersResponse> => {
  return getAllOrders({ search: query, page });
};

// Lọc đơn hàng theo trạng thái - sử dụng getAllOrders với status_id param
export const getOrdersByStatus = async (statusId: number, page: number = 1): Promise<OrdersResponse> => {
  return getAllOrders({ status_id: statusId, page });
};

// Lọc đơn hàng theo phương thức thanh toán - sử dụng getAllOrders với payment_method param
export const getOrdersByPaymentMethod = async (paymentMethod: string, page: number = 1): Promise<OrdersResponse> => {
  return getAllOrders({ payment_method: paymentMethod, page });
};

interface OrderStatistics {
  summary: {
    total_orders: number;
    total_revenue: number;
    average_order_value: number;
    total_items_sold: number;
  };
  by_status: Array<{
    status_name: string;
    count: number;
    revenue: number;
  }>;
  by_payment_method: Array<{
    payment_method: string;
    count: number;
    revenue: number;
  }>;
  revenue_chart: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
  date_range: {
    from: string;
    to: string;
  };
}

// Thống kê đơn hàng
export const getOrderStats = async (params?: {
  period?: string;
  date_from?: string;
  date_to?: string;
}): Promise<OrderStatistics> => {
  const queryParams = new URLSearchParams();

  if (params?.period) queryParams.append('period', params.period);
  if (params?.date_from) queryParams.append('date_from', params.date_from);
  if (params?.date_to) queryParams.append('date_to', params.date_to);

  const queryString = queryParams.toString();
  const url = queryString ? `/orders/statistics?${queryString}` : '/orders/statistics';

  const response = await adminAxios.get<ApiResponse<OrderStatistics>>(url);
  return response.data.data;
};
