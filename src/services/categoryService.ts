import { adminAxios, clientAxios } from "../configs/config";
import type { ICategory, ICategoryForm } from "../interfaces/category";


// Lấy tất cả category
export const getAllCategories = async (): Promise<ICategory[]> => {
  const response = await adminAxios.get("/categories");
  return response.data;
};

// Lấy category theo id
export const getCategoryById = async (id: number): Promise<ICategory> => {
  const response = await adminAxios.get(`/categories/${id}`);
  return response.data;
};

// Tạo mới category
export const createCategory = async (category:ICategoryForm): Promise<ICategory> => {
  const response = await adminAxios.post("/categories", category);
  return response.data;
};

// Cập nhật category
export const updateCategory = async (id: number, category: ICategoryForm): Promise<ICategory> => {
  const response = await adminAxios.put(`/admin/categories/${id}`, category);
  return response.data;
};

// Xóa category
export const deleteCategory = async (id: number): Promise<void> => {
  await adminAxios.delete(`/admin/categories/${id}`);
};

// === CLIENT FUNCTIONS ===

// Lấy tất cả danh mục cho client
export const getAllCategoriesClient = async (): Promise<ICategory[]> => {
    const response = await clientAxios.get('/categories/all');
    return response.data.data;
};