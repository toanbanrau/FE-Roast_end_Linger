import { adminAxios } from "../configs/config";
import type { IAdminBlogCategory, IAdminBlogCategoryForm } from "../interfaces/category";

// Lấy tất cả danh mục blog
export const getAllBlogCategories = async (): Promise<IAdminBlogCategory[]> => {
  const response = await adminAxios.get("/blog-categories");
  return response.data.data.data || response.data;
};

// Lấy danh mục blog theo id
export const getBlogCategoryById = async (id: number): Promise<IAdminBlogCategory> => {
  const response = await adminAxios.get(`/blog-categories/${id}`);
  return response.data.data || response.data;
};

// Tạo mới danh mục blog
export const createBlogCategory = async (category: IAdminBlogCategoryForm): Promise<IAdminBlogCategory> => {
  const response = await adminAxios.post("/blog-categories", category);
  return response.data.data || response.data;
};

// Cập nhật danh mục blog
export const updateBlogCategory = async (id: number, category: IAdminBlogCategoryForm): Promise<IAdminBlogCategory> => {
  const response = await adminAxios.put(`/blog-categories/${id}`, category);
  return response.data.data || response.data;
};

// Xóa danh mục blog
export const deleteBlogCategory = async (id: number): Promise<void> => {
  await adminAxios.delete(`/blog-categories/${id}`);
}; 