import axiosInstance from "../configs/config";
import type { ICategory, ICategoryForm } from "../interfaces/category";


// Lấy tất cả category
export const getAllCategories = async (): Promise<ICategory[]> => {
  const response = await axiosInstance.get("/categories");
  return response.data;
};

// Lấy category theo id
export const getCategoryById = async (id: number): Promise<ICategory> => {
  const response = await axiosInstance.get(`/categories/${id}`);
  return response.data;
};

// Tạo mới category
export const createCategory = async (category:ICategoryForm): Promise<ICategory> => {
  const response = await axiosInstance.post("/categories", category);
  return response.data;
};

// Cập nhật category
export const updateCategory = async (id: number, category:ICategory): Promise<ICategory> => {
  const response = await axiosInstance.put(`/categories/${id}`, category);
  return response.data;
};

// Xóa category
export const deleteCategory = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/categories/${id}`);
};