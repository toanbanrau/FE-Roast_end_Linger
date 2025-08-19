import adminAxios, { clientAxios } from "../configs/config";
import type { IBrand } from "../interfaces/brand";



export const getAllBrands = async (): Promise<IBrand[]> => {
  const response = await adminAxios.get("/brands");
  return response.data.data; // Extract data from {status: 'success', data: [...]}
};

export const getBrandById = async (id: number): Promise<IBrand> => {
  const response = await adminAxios.get(`/brands/${id}`);
  return response.data.data;
};

export const createBrand = async (formData: FormData): Promise<IBrand> => {
  const response = await adminAxios.post("/brands", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response.data.data || response.data; 
};

export const updateBrand = async (id: number, formData: FormData): Promise<IBrand> => {
  // Thêm _method=PUT vào FormData để backend hiểu đây là PUT request
  formData.append('_method', 'PUT');

  const response = await adminAxios.post(`/brands/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response.data.data || response.data;
};

export const deleteBrand = async (id: number): Promise<void> => {
  await adminAxios.delete(`/brands/${id}`);
};

// ================= CLIENT BRAND SERVICE =================

// Lấy tất cả brands cho client (public API)
export const getAllBrandsClient = async (): Promise<IBrand[]> => {
  const response = await clientAxios.get("/brands");
  return response.data.data;
};