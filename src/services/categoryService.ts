import { adminAxios, clientAxios } from "../configs/config";
import type {
  ICategory,
  ICategoryForm,
  ICategoryListResponse,
  ICategoryTreeResponse,
  ICategoryResponse,
  ICategoryBulkAction
} from "../interfaces/category";

// === ADMIN FUNCTIONS ===

// Lấy danh sách danh mục với phân trang và filter
export const getAllCategoriesAdmin = async (params?: {
  search?: string;
  status?: boolean;
  parent_id?: number;
  sort_by?: string;
  sort_direction?: string;
  per_page?: number;
  paginate?: boolean;
}): Promise<ICategoryListResponse> => {
  const response = await adminAxios.get("/categories", { params });
  return response.data;
};

// Lấy cây danh mục
export const getCategoryTree = async (params?: {
  status?: boolean;
}): Promise<ICategoryTreeResponse> => {
  const response = await adminAxios.get("/categories/tree", { params });
  return response.data;
};

// Lấy category theo id
export const getCategoryById = async (id: number): Promise<ICategoryResponse> => {
  const response = await adminAxios.get(`/categories/${id}`);
  return response.data;
};

// Tạo mới category
export const createCategory = async (category: ICategoryForm): Promise<ICategoryResponse> => {
  const response = await adminAxios.post("/categories", category);
  return response.data;
};

// Cập nhật category
export const updateCategory = async (id: number, category: ICategoryForm): Promise<ICategoryResponse> => {
  const response = await adminAxios.put(`/categories/${id}`, category);
  return response.data;
};

// Xóa category
export const deleteCategory = async (id: number): Promise<void> => {
  await adminAxios.delete(`/categories/${id}`);
};

// Bulk actions
export const bulkActionCategories = async (data: ICategoryBulkAction): Promise<{ status: string; message: string }> => {
  const response = await adminAxios.post("/categories/bulk-action", data);
  return response.data;
};

// === CLIENT FUNCTIONS ===

// Lấy tất cả category cho client (public API)
export const getAllCategories = async (): Promise<ICategory[]> => {
  const response = await clientAxios.get("/categories");
  return response.data.data;
};

// Lấy tất cả danh mục cho client
export const getAllCategoriesClient = async (): Promise<{ data: ICategory[] }> => {
    const response = await clientAxios.get('/categories');
    return response.data.data;
};