import { adminAxios, clientAxios } from "../configs/config";
import type { IPromotion, IPromotionCreate, IPromotionUpdate } from "../interfaces/promotion";

export const getAllPromotions = async (): Promise<IPromotion[]> => {
  const response = await adminAxios.get("/promotions");
  return response.data.data.data || [];
};

export const getPromotionById = async (id: number): Promise<IPromotion> => {
  const response = await adminAxios.get(`/promotions/${id}`);
  return response.data.data || response.data;
};

export const createPromotion = async (promotion: IPromotionCreate): Promise<IPromotion> => {
  const response = await adminAxios.post("/promotions", promotion);
  return response.data.data || response.data;
};

export const updatePromotion = async (id: number, promotion: IPromotionUpdate): Promise<IPromotion> => {
  const response = await adminAxios.put(`/promotions/${id}`, promotion);
  return response.data.data || response.data;
};

export const deletePromotion = async (id: number): Promise<void> => {
  await adminAxios.delete(`/promotions/${id}`);
};

// ================= CLIENT PROMOTION SERVICE =================

// Lấy danh sách promotions có thể sử dụng cho client
export const getAvailablePromotions = async (): Promise<{
  data: IPromotion[];
  meta: {
    current_page: number;
    last_page: number;
    total: number;
    from: number;
    to: number;
  };
}> => {
  const response = await clientAxios.get("/promotions");
  return response.data.data;
};
