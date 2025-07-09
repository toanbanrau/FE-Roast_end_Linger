import adminAxios from "../configs/config";
import type {
  IAttribute,
  IAttributeValue,
  ICreateAttributeRequest,
  IUpdateAttributeRequest,
  ICreateAttributeValueRequest,
  IUpdateAttributeValueRequest,
  IBulkCreateAttributeValuesRequest,
  IBulkDeleteRequest,
  IReorderAttributesRequest,
  IAttributeResponse,
  IAttributesResponse,
  IAttributeValueResponse,
  IAttributeValuesResponse,
  IBulkDeleteResponse,
  IToggleStatusResponse,
  IAttributeCombinationsResponse,
  IUsedCombinationsResponse,
  IAttributeQueryParams,
  IAttributeValueQueryParams,
} from "../interfaces/attribute";

// ================= ATTRIBUTE MANAGEMENT =================

// Lấy danh sách thuộc tính
export const getAttributes = async (params?: IAttributeQueryParams): Promise<IAttribute[]> => {
  const queryParams = new URLSearchParams();
  
  if (params?.status !== undefined) queryParams.append('status', params.status.toString());
  if (params?.search) queryParams.append('search', params.search);
  if (params?.sort) queryParams.append('sort', params.sort);
  if (params?.order) queryParams.append('order', params.order);

  const url = `/attributes${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const response = await adminAxios.get<IAttributesResponse>(url);
  return response.data.data;
};

// Tạo thuộc tính mới
export const createAttribute = async (data: ICreateAttributeRequest): Promise<IAttribute> => {
  const response = await adminAxios.post<IAttributeResponse>('/attributes', data);
  return response.data.data;
};

// Lấy chi tiết thuộc tính
export const getAttributeById = async (id: number): Promise<IAttribute> => {
  const response = await adminAxios.get<IAttributeResponse>(`/attributes/${id}`);
  return response.data.data;
};

// Cập nhật thuộc tính
export const updateAttribute = async (id: number, data: IUpdateAttributeRequest): Promise<IAttribute> => {
  const response = await adminAxios.put<IAttributeResponse>(`/attributes/${id}`, data);
  return response.data.data;
};

// Xóa nhiều thuộc tính
export const bulkDeleteAttributes = async (data: IBulkDeleteRequest): Promise<IBulkDeleteResponse['data']> => {
  const response = await adminAxios.delete<IBulkDeleteResponse>('/attributes/bulk-delete', { data });
  return response.data.data;
};

// Bật/tắt trạng thái thuộc tính
export const toggleAttributeStatus = async (id: number): Promise<{ id: number; status: boolean }> => {
  const response = await adminAxios.patch<IToggleStatusResponse>(`/attributes/${id}/toggle-status`);
  return response.data.data;
};

// Sắp xếp lại thứ tự thuộc tính
export const reorderAttributes = async (data: IReorderAttributesRequest): Promise<void> => {
  await adminAxios.patch('/attributes/reorder', data);
};

// ================= ATTRIBUTE VALUE MANAGEMENT BY ATTRIBUTE =================

// Lấy giá trị theo thuộc tính
export const getAttributeValues = async (
  attributeId: number, 
  params?: IAttributeValueQueryParams
): Promise<IAttributeValuesResponse['data']> => {
  const queryParams = new URLSearchParams();
  
  if (params?.status !== undefined) queryParams.append('status', params.status.toString());
  if (params?.search) queryParams.append('search', params.search);

  const url = `/attributes/${attributeId}/values${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const response = await adminAxios.get<IAttributeValuesResponse>(url);
  return response.data.data;
};

// Tạo giá trị cho thuộc tính
export const createAttributeValue = async (
  attributeId: number, 
  data: ICreateAttributeValueRequest
): Promise<IAttributeValue> => {
  const response = await adminAxios.post<IAttributeValueResponse>(`/attributes/${attributeId}/values`, data);
  return response.data.data;
};

// Cập nhật giá trị thuộc tính
export const updateAttributeValue = async (
  attributeId: number,
  valueId: number,
  data: IUpdateAttributeValueRequest
): Promise<IAttributeValue> => {
  const response = await adminAxios.put<IAttributeValueResponse>(`/attributes/${attributeId}/values/${valueId}`, data);
  return response.data.data;
};

// Xóa giá trị thuộc tính
export const deleteAttributeValue = async (attributeId: number, valueId: number): Promise<void> => {
  await adminAxios.delete(`/attributes/${attributeId}/values/${valueId}`);
};

// Tạo nhiều giá trị cùng lúc
export const bulkCreateAttributeValues = async (
  attributeId: number,
  data: IBulkCreateAttributeValuesRequest
): Promise<IAttributeValue[]> => {
  const response = await adminAxios.post<{ success: boolean; data: IAttributeValue[]; message: string }>(
    `/attributes/${attributeId}/values/bulk-create`,
    data
  );
  return response.data.data;
};

// ================= GLOBAL ATTRIBUTE VALUE MANAGEMENT (Deprecated) =================

// Xóa nhiều giá trị thuộc tính (global)
export const bulkDeleteAttributeValues = async (data: IBulkDeleteRequest): Promise<IBulkDeleteResponse['data']> => {
  const response = await adminAxios.delete<IBulkDeleteResponse>('/attribute-values/bulk-delete', { data });
  return response.data.data;
};

// ================= ATTRIBUTE COMBINATIONS =================

// Lấy tất cả tổ hợp có thể
export const getAttributeCombinations = async (): Promise<IAttributeCombinationsResponse['data']> => {
  const response = await adminAxios.get<IAttributeCombinationsResponse>('/attribute-combinations');
  return response.data.data;
};

// Lấy tổ hợp đã sử dụng
export const getUsedAttributeCombinations = async (): Promise<IUsedCombinationsResponse['data']> => {
  const response = await adminAxios.get<IUsedCombinationsResponse>('/attribute-combinations/used');
  return response.data.data;
};
