import { adminAxios } from "../configs/config";
import type { IOrigin, IOriginCreate, IOriginUpdate } from "../interfaces/origin";

// Lấy tất cả origin
export const getAllOrigins = async (): Promise<IOrigin[]> => {
  const response = await adminAxios.get("/origins");
  return response.data;
};

// Lấy origin theo id
export const getOriginById = async (id: number): Promise<IOrigin> => {
  const response = await adminAxios.get(`/origins/${id}`);
  return response.data;
};

// Tạo mới origin
export const createOrigin = async (origin: IOriginCreate): Promise<IOrigin> => {
  const response = await adminAxios.post("/origins", origin);
  return response.data;
};

// Cập nhật origin
export const updateOrigin = async (id: number, origin: IOriginUpdate): Promise<IOrigin> => {
  const response = await adminAxios.put(`/origins/${id}`, origin);
  return response.data;
};

// Xóa origin
export const deleteOrigin = async (id: number): Promise<void> => {
  await adminAxios.delete(`/origins/${id}`);
}; 