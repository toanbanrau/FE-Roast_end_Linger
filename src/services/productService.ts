import axiosInstance from "../configs/config";
import type { IPromotion, IPromotionCreate, IPromotionUpdate } from "../interfaces/promotion";

export const getAllPromotions = async (): Promise<IPromotion[]> => {
  const response = await axiosInstance.get("/promotions");
  return response.data;
};

// Lấy promotion theo id
export const getPromotionById = async (id: number): Promise<IPromotion> => {
  const response = await axiosInstance.get(`/promotions/${id}`);
  return response.data;
};

// Tạo mới promotion
export const createPromotion = async (promotion:IPromotionCreate): Promise<IPromotion> => {
  const response = await axiosInstance.post("/promotions", promotion);
  return response.data;
};

// Cập nhật promotion
export const updatePromotion = async (id: number, promotion:IPromotionUpdate): Promise<IPromotion> => {
  const response = await axiosInstance.put(`/promotions/${id}`, promotion);
  return response.data;
};

// Xóa promotion
export const deletePromotion = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/promotions/${id}`);
};