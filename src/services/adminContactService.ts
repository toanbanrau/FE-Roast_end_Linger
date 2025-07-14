import { adminAxios } from "../configs/config";
import type {
  IContact,
  IContactForm,
  IContactStatusUpdate,
  IContactFilters,
  IContactStats,
  ContactApiResponse,
  ContactsPaginatedResponse,
} from "../interfaces/contact";

// Lấy tất cả contacts với filters
export const getAllContacts = async (
  filters?: IContactFilters
): Promise<ContactsPaginatedResponse> => {
  const queryParams = new URLSearchParams();

  if (filters?.search) queryParams.append("search", filters.search);
  if (filters?.status) queryParams.append("status", filters.status);
  if (filters?.sort_by) queryParams.append("sort_by", filters.sort_by);
  if (filters?.sort_direction)
    queryParams.append("sort_direction", filters.sort_direction);
  if (filters?.per_page)
    queryParams.append("per_page", filters.per_page.toString());
  if (filters?.page) queryParams.append("page", filters.page.toString());

  const response = await adminAxios.get<ContactApiResponse<ContactsPaginatedResponse>>(
    `/contacts?${queryParams.toString()}`
  );
  return response.data.data;
};

// Lấy chi tiết contact theo ID
export const getContactById = async (id: number): Promise<IContact> => {
  const response = await adminAxios.get<ContactApiResponse<IContact>>(
    `/contacts/${id}`
  );
  return response.data.data;
};

// Tạo contact mới
export const createContact = async (
  contactData: IContactForm
): Promise<IContact> => {
  const response = await adminAxios.post<ContactApiResponse<IContact>>(
    "/contacts",
    contactData
  );
  return response.data.data;
};

// Cập nhật trạng thái contact
export const updateContactStatus = async (
  id: number,
  statusData: IContactStatusUpdate
): Promise<IContact> => {
  const response = await adminAxios.put<ContactApiResponse<IContact>>(
    `/contacts/${id}`,
    statusData
  );
  return response.data.data;
};

// Xóa contact
export const deleteContact = async (id: number): Promise<void> => {
  await adminAxios.delete(`/contacts/${id}`);
};

// Lấy thống kê contacts
export const getContactStats = async (): Promise<IContactStats> => {
  const response = await adminAxios.get<ContactApiResponse<IContactStats>>(
    "/contacts/stats"
  );
  return response.data.data;
};

// Utility functions
export const getContactStatusOptions = () => [
  {
    value: "new" as const,
    label: "Mới",
    color: "#FFA500",
    description: "Liên hệ mới chưa được xử lý",
  },
  {
    value: "processing" as const,
    label: "Đang xử lý",
    color: "#007BFF",
    description: "Liên hệ đang được nhân viên xử lý",
  },
  {
    value: "resolved" as const,
    label: "Đã giải quyết",
    color: "#28A745",
    description: "Liên hệ đã được giải quyết xong",
  },
];

export const getContactStatusColor = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    new: "#FFA500",
    processing: "#007BFF",
    resolved: "#28A745",
  };
  return statusMap[status] || "#6C757D";
};

export const getContactStatusLabel = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    new: "Mới",
    processing: "Đang xử lý",
    resolved: "Đã giải quyết",
  };
  return statusMap[status] || status;
};
