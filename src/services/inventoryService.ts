import { adminAxios } from "../configs/config";
import type {
  IInventoryLot,
  IInventoryLotsResponse,
  IInventoryLotsQuery,
  IImportInventoryRequest,
  IExportInventoryRequest,
  IExportInventoryResponse,
  IReturnInventoryRequest,
  IReturnInventoryResponse,
  IExpiringProduct,
  IExpiredProduct,
  IExpiringQuery,
  IProcessExpiredResponse,
} from "../interfaces/inventory";

// 1. Lấy danh sách lô hàng
export const getInventoryLots = async (
  params?: IInventoryLotsQuery
): Promise<IInventoryLotsResponse> => {
  const response = await adminAxios.get("/inventory/lots", { params });
  return response.data.data;
};

// 2. Lấy chi tiết một lô hàng
export const getInventoryLotById = async (id: number): Promise<IInventoryLot> => {
  const response = await adminAxios.get(`/inventory/lots/${id}`);
  return response.data.data;
};

// 3. Nhập kho
export const importInventory = async (
  data: IImportInventoryRequest
): Promise<IInventoryLot> => {
  const response = await adminAxios.post("/inventory/import", data);
  return response.data.data;
};

// 4. Xuất kho
export const exportInventory = async (
  data: IExportInventoryRequest
): Promise<IExportInventoryResponse> => {
  const response = await adminAxios.post("/inventory/export", data);
  return response.data.data;
};

// 5. Hoàn trả hàng
export const returnInventory = async (
  data: IReturnInventoryRequest
): Promise<IReturnInventoryResponse> => {
  const response = await adminAxios.post("/inventory/return", data);
  return response.data.data;
};

// 6. Lấy danh sách sản phẩm sắp hết hạn
export const getExpiringProducts = async (
  params?: IExpiringQuery
): Promise<IExpiringProduct[]> => {
  const response = await adminAxios.get("/inventory/expiring", { params });
  return response.data.data;
};

// 7. Lấy danh sách sản phẩm đã hết hạn
export const getExpiredProducts = async (): Promise<IExpiredProduct[]> => {
  const response = await adminAxios.get("/inventory/expired");
  return response.data.data;
};

// 8. Xử lý hàng hết hạn
export const processExpiredProducts = async (): Promise<IProcessExpiredResponse> => {
  const response = await adminAxios.post("/inventory/process-expired");
  return response.data.data;
};

// 9. Cập nhật thông tin lô hàng (nếu cần)
export const updateInventoryLot = async (
  id: number,
  data: Partial<IImportInventoryRequest>
): Promise<IInventoryLot> => {
  const response = await adminAxios.put(`/inventory/lots/${id}`, data);
  return response.data.data;
};

// 10. Xóa lô hàng (nếu cần)
export const deleteInventoryLot = async (id: number): Promise<void> => {
  await adminAxios.delete(`/inventory/lots/${id}`);
};

// 11. Thống kê tồn kho
export const getInventoryStats = async () => {
  const response = await adminAxios.get("/inventory/stats");
  return response.data.data;
};

// 12. Lấy lịch sử giao dịch kho
export const getInventoryTransactions = async (params?: {
  page?: number;
  per_page?: number;
  type?: 'import' | 'export' | 'return';
  product_id?: number;
  date_from?: string;
  date_to?: string;
}) => {
  const response = await adminAxios.get("/inventory/transactions", { params });
  return response.data.data;
};
