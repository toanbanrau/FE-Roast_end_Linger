import axiosInstance from "../configs/config";
import type { IUser, UserLogin, UserRegister } from "../interfaces/user";


// Đăng nhập
export const login = async (payload:UserLogin ): Promise<{ token: string; user: IUser }> => {
  const response = await axiosInstance.post("/auth/login", payload);
  return response.data;
};

// Đăng ký
export const register = async (payload: UserRegister): Promise<{ token: string; user: IUser }> => {
  const response = await axiosInstance.post("/auth/register", payload);
  return response.data;
};

export const getProfile = async (): Promise<IUser> => {
  const response = await axiosInstance.get("/auth/profile");
  return response.data;
};

export const logout = async (): Promise<void> => {
  await axiosInstance.post("/auth/logout");
};
