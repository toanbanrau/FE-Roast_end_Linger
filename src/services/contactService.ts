import { clientAxios } from "../configs/config";
import type { IContactForm } from "../interfaces/contact";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const sendContactForm = async (formData: IContactForm): Promise<ApiResponse<any>> => {
  const response = await clientAxios.post<ApiResponse<any>>("/contacts", formData);
  return response.data;
};
