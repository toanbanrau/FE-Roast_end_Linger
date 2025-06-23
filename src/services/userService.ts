import { adminAxios } from "../configs/config";
import type { IUser } from "../interfaces/user";

// Lấy danh sách user (có phân trang)
export const getAllUsers = async (page: number = 1): Promise<{ data: IUser[]; meta?: any; links?: any }> => {
  const response = await adminAxios.get(`/users?page=${page}`);
  return response.data;
};

// Lấy user theo id
export const getUserById = async (id: number): Promise<IUser> => {
  const response = await adminAxios.get(`/users/${id}`);
  return response.data;
}; 