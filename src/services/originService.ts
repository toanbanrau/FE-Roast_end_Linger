import { adminAxios } from "../configs/config";
import type { IProductOrigin } from "../interfaces/product";

// Lấy tất cả origin
export const getAllOrigins = async (): Promise<IProductOrigin[]> => {
  const response = await adminAxios.get("/admin/origins");
  return response.data.data;
}; 