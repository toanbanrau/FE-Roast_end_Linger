import adminAxios from "../configs/config";
import type { ShippingMethod } from "../interfaces/shippingMethod";

export const getAllShippingMethods = async (): Promise<ShippingMethod[]> => {
  const response = await adminAxios.get("/shipping-methods");
  return response.data.data.data; // Lấy mảng data từ response
};

export const getShippingMethodById = async (id: number): Promise<ShippingMethod> => {
  const response = await adminAxios.get(`/shipping-methods/${id}`);
  return response.data.data;
};

export const createShippingMethod = async (formData: FormData): Promise<ShippingMethod> => {
  const response = await adminAxios.post("/shipping-methods", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response.data.data || response.data;
};

export const updateShippingMethod = async (id: number, formData: FormData): Promise<ShippingMethod> => {
  const response = await adminAxios.post(`/shipping-methods/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response.data;
};

export const deleteShippingMethod = async (id: number): Promise<void> => {
  await adminAxios.delete(`/shipping-methods/${id}`);
}; 