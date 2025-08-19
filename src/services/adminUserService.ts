// Service quản lý user cho admin
import type { IUser } from "../interfaces/user";
import { adminAxios } from "../configs/config";

// API Response wrapper interface
interface ApiResponse<T> {
  data: T;
  message: string;
}

// Query parameters interface
interface UserQueryParams {
  role?: string;
  email?: string;
  status?: string;
  page?: number;
}

// User form data interface
interface UserFormData {
  name: string;
  email: string;
  password?: string;
  role: string;
  status: string;
}

// Lấy danh sách người dùng với filters
export const getAdminUsers = async (params?: UserQueryParams): Promise<{ data: IUser[]; meta?: any; links?: any }> => {
  const queryString = new URLSearchParams();

  if (params?.role) queryString.append('role', params.role);
  if (params?.email) queryString.append('email', params.email);
  if (params?.status) queryString.append('status', params.status);
  if (params?.page) queryString.append('page', params.page.toString());

  const response = await adminAxios.get<ApiResponse<IUser[]>>(`/users?${queryString.toString()}`);
  return { data: response.data.data.data };
};

// Lấy chi tiết người dùng
export const getAdminUserDetail = async (id: number): Promise<IUser> => {
  const response = await adminAxios.get<ApiResponse<IUser>>(`/users/${id}`);
  return response.data.data;
};

// Tạo người dùng mới
export const createAdminUser = async (data: UserFormData): Promise<IUser> => {
  const response = await adminAxios.post<ApiResponse<IUser>>(`/users`, data);
  return response.data.data;
};

// Cập nhật người dùng
export const updateAdminUser = async (id: number, data: Partial<UserFormData>): Promise<IUser> => {
  const response = await adminAxios.put<ApiResponse<IUser>>(`/users/${id}`, data);
  return response.data.data;
};

// Xóa người dùng
export const deleteAdminUser = async (id: number): Promise<void> => {
  await adminAxios.delete<ApiResponse<null>>(`/users/${id}`);
};
