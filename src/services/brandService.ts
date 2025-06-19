import axiosInstance from "../configs/config";
import type { IBrand } from "../interfaces/brand";



export const getAllBrands = async (): Promise<IBrand[]> => {
  const response = await axiosInstance.get("/brands");
  return response.data.data; // Extract data from {status: 'success', data: [...]}
};

export const getBrandById = async (id: number): Promise<IBrand> => {
  const response = await axiosInstance.get(`/brands/${id}`);
  return response.data.data;
};

export const createBrand = async (formData: FormData): Promise<IBrand> => {
  const response = await axiosInstance.post("/brands", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response.data.data || response.data; 
};

export const updateBrand = async (id: number, brand: Partial<IBrand>): Promise<IBrand> => {
  const response = await axiosInstance.post(`/brands/${id}`, brand,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
};

export const deleteBrand = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/brands/${id}`);
};