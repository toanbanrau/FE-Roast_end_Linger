import { clientAxios } from "../configs/config";
import type {
  UserAddress,
  CreateAddressRequest,
  UpdateAddressRequest,
  AddressResponse,
  AddressListResponse,
  SetDefaultAddressResponse,
  DeleteAddressResponse,
} from "../interfaces/address";

// Lấy danh sách địa chỉ của user
export const getAddresses = async (params?: {
  type?: string;
  city?: string;
}): Promise<UserAddress[]> => {
  const response = await clientAxios.get("/user/addresses", { params });
  return response.data.data;
};

// Lấy chi tiết một địa chỉ
export const getAddressById = async (id: number): Promise<UserAddress> => {
  const response = await clientAxios.get(`/user/addresses/${id}`);
  return response.data.data;
};

// Tạo địa chỉ mới
export const createAddress = async (data: CreateAddressRequest): Promise<UserAddress> => {
  const response = await clientAxios.post("/user/addresses", data);
  return response.data.data;
};

// Cập nhật địa chỉ
export const updateAddress = async (
  id: number,
  data: UpdateAddressRequest
): Promise<UserAddress> => {
  const response = await clientAxios.put(`/user/addresses/${id}`, data);
  return response.data.data;
};

// Xóa địa chỉ
export const deleteAddress = async (id: number): Promise<void> => {
  await clientAxios.delete(`/user/addresses/${id}`);
};

// Đặt địa chỉ mặc định
export const setDefaultAddress = async (id: number): Promise<{
  id: number;
  is_default: boolean;
  updated_at: string;
}> => {
  const response = await clientAxios.post(`/user/addresses/${id}/set-default`);
  return response.data.data;
};

// React Query hooks
export const addressQueryKeys = {
  all: ['addresses'] as const,
  lists: () => [...addressQueryKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...addressQueryKeys.lists(), { filters }] as const,
  details: () => [...addressQueryKeys.all, 'detail'] as const,
  detail: (id: number) => [...addressQueryKeys.details(), id] as const,
};

// Query options for React Query
export const addressQueryOptions = {
  getAddresses: (params?: { type?: string; city?: string }) => ({
    queryKey: addressQueryKeys.list(params || {}),
    queryFn: () => getAddresses(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  }),

  getAddressById: (id: number) => ({
    queryKey: addressQueryKeys.detail(id),
    queryFn: () => getAddressById(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
  }),
};