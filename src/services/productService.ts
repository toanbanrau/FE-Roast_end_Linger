import { adminAxios, clientAxios } from "../configs/config";
import type { IProduct, IProductCreate } from "../interfaces/product";
import type {
} from "../interfaces/product";

// ================= ADMIN PRODUCT SERVICE =================

// Lấy danh sách sản phẩm (có filter/search/pagination)
export const getAdminProducts = async (): Promise<IProduct> => {
  const res = await adminAxios.get("/products");
  return res.data.data;
};

// Lấy chi tiết sản phẩm
export const getAdminProductDetail = async (id: number): Promise<IProduct> => {
  const res = await adminAxios.get(`/products/${id}`);
  return res.data.data;
};

// Tạo sản phẩm mới (multipart/form-data)
export const createAdminProduct = async (formData: FormData): Promise<IProductCreate> => {
  const res = await adminAxios.post("/products/with-variants", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
};

// Cập nhật sản phẩm (multipart/form-data)
export const updateAdminProduct = async (id: number, formData: FormData): Promise<IProductCreate> => {
  const res = await adminAxios.put(`/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
};

// Xóa sản phẩm
export const deleteAdminProduct = async (id: number): Promise<void> => {
  await adminAxios.delete(`/products/${id}`);
};

// Bulk delete
export const bulkDeleteAdminProducts = async (ids: number[]): Promise<void> => {
  await adminAxios.post("/products/bulk-delete", { ids });
};

// Bulk update status
export const bulkUpdateAdminProductStatus = async (ids: number[], status: string): Promise<void> => {
  await adminAxios.post("/products/bulk-update-status", { ids, status });
};

// Toggle status
export const toggleAdminProductStatus = async (id: number) => {
  const res = await adminAxios.put(`/products/${id}/toggle-status`);
  return res.data.data;
};

// Set primary image
export const setAdminProductPrimaryImage = async (productId: number, imageId: number): Promise<void> => {
  await adminAxios.put(`/products/${productId}/images/${imageId}/set-primary`);
};

// Lấy danh sách nhóm thuộc tính và giá trị thuộc tính cho sản phẩm
export const getAttributeCombinations = async () => {
  const res = await adminAxios.get('/products/attribute-combinations');
  return res.data.data;
};

// ================= CLIENT PRODUCT SERVICE =================

export const getAllProductsClient = async (queryParams?: URLSearchParams): Promise<{
  data: IProduct[];
  meta: {
    current_page: number;
    last_page: number;
    total: number;
    from: number;
    to: number;
  };
  links: unknown;
}> => {
  const url = queryParams ? `/products?${queryParams.toString()}` : "/products";
  const res = await clientAxios.get(url);
  return res.data;
};

export const getProductById = async (id: number): Promise<IProduct> => {
  const response = await clientAxios.get(`/products/${id}`);
  return response.data.data;
};
