import { adminAxios } from "../configs/config";
import type { IOrder } from "../interfaces/order";

// API Response wrapper interface
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
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
export const updateOrderStatus = async (id: number, statusId: number): Promise<IOrder> => {
  const response = await adminAxios.patch<ApiResponse<IOrder>>(`/orders/${id}/status`, {
    status_id: statusId
  });
  return response.data.data;
};

// Lấy danh sách trạng thái đơn hàng (tạm thời dùng static data)
export const getOrderStatuses = async (): Promise<{ id: number; name: string; display_name: string; color: string }[]> => {
  // Tạm thời return static data vì chưa có API này trong docs
  return [
    { id: 1, name: "pending", display_name: "Chờ xác nhận", color: "#FFA500" },
    { id: 2, name: "confirmed", display_name: "Đã xác nhận", color: "#007BFF" },
    { id: 3, name: "processing", display_name: "Đang xử lý", color: "#17A2B8" },
    { id: 4, name: "shipping", display_name: "Đang giao hàng", color: "#6F42C1" },
    { id: 5, name: "delivered", display_name: "Đã giao hàng", color: "#28A745" },
    { id: 6, name: "completed", display_name: "Hoàn thành", color: "#28A745" },
    { id: 7, name: "cancelled", display_name: "Đã hủy", color: "#DC3545" },
    { id: 8, name: "refunded", display_name: "Đã hoàn tiền", color: "#E83E8C" },
  ];
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

  const response = await adminAxios.get<ApiResponse<OrderStatistics>>(`/orders/statistics?${queryParams.toString()}`);
  return response.data.data;
};
