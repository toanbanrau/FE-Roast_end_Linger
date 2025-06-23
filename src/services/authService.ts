import { clientAxios } from "../configs/config";
import type { UserRegister } from "../interfaces/user";

// Đăng nhập
export interface LoginPayload {
  email: string;
  password: string;
}
export const login = async (data: LoginPayload) => {
  const response = await clientAxios.post("/auth/login", data);
  return response.data;
};

// Đăng ký
export const register = async (data: UserRegister) => {
  const response = await clientAxios.post("/auth/register", data);
  return response.data;
};

export const getProfile = async (): Promise<UserRegister> => {
  const response = await clientAxios.get("/profile");
  return response.data.data;
};

// Đăng xuất
export const logout = async () => {
  const response = await clientAxios.post("/auth/logout");
  return response.data;
};

// Quên mật khẩu
export const forgotPassword = async (email: string) => {
  const response = await clientAxios.post("/auth/forgot-password", { email });
  return response.data;
};

// Đặt lại mật khẩu
export interface ResetPasswordPayload {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}
export const resetPassword = async (data: ResetPasswordPayload) => {
  const response = await clientAxios.post("/auth/reset-password", data);
  return response.data;
};

// Xác thực email
export const verifyEmail = async () => {
  const response = await clientAxios.post("/auth/verify-email");
  return response.data;
};

// Gửi lại email xác thực
export const resendVerification = async () => {
  const response = await clientAxios.post("/auth/resend-verification");
  return response.data;
};
