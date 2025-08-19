import { clientAxios } from "../configs/config";
import type { UserRegister, IUser } from "../interfaces/user";

// Interface for token info response
interface TokenInfo {
  expires_at: string;
  expires_in_minutes: number;
  is_expired: boolean;
  created_at: string;
  last_used_at: string;
}

interface TokenInfoResponse {
  current_token: TokenInfo;
  all_tokens: (TokenInfo & { id: number; name: string })[];
  total_tokens: number;
}

// Đăng nhập
export interface LoginPayload {
  email: string;
  password: string;
}
export const login = async (data: LoginPayload) => {
  const response = await clientAxios.post("/auth/login", data);
  return response.data.data;
};

// Đăng ký
export const register = async (data: UserRegister) => {
  const response = await clientAxios.post("/auth/register", data);
  return response.data;
};

export const getProfile = async (): Promise<IUser> => {
  const response = await clientAxios.get("/profile");
  return response.data.data;
};

// Cập nhật profile
export interface UpdateProfilePayload {
  name?: string;
  full_name?: string;
  email?: string;
  address?: string;
  phone_number?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
  avatar?: File;
}

export const updateProfile = async (data: UpdateProfilePayload) => {
  console.log('updateProfile called with data:', data);

  // Luôn sử dụng FormData để hỗ trợ cả file upload và data thông thường
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      // Nếu là file, append trực tiếp
      if (value instanceof File) {
        console.log(`Appending file: ${key}`, value);
        formData.append(key, value);
      } else {
        // Nếu là string/number, convert thành string
        console.log(`Appending field: ${key} = ${value}`);
        formData.append(key, String(value));
      }
    }
  });

  // Log FormData contents
  console.log('FormData contents:');
  for (let [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }

  console.log('Sending POST request to /profile with FormData');
  const response = await clientAxios.post("/profile", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  console.log('Update profile response:', response.data);
  return response.data;
};

// Check token validity
export const checkTokenInfo = async (): Promise<boolean> => {
  try {
    const response = await clientAxios.get<{
      success: boolean;
      message: string;
      data: TokenInfoResponse;
    }>("/auth/token-info");

    // Kiểm tra response thành công và token chưa hết hạn
    if (response.data.success && response.data.data.current_token) {
      return !response.data.data.current_token.is_expired;
    }

    return false;
  } catch (error) {
    // Nếu không gọi được API, coi như token hợp lệ để tránh logout nhầm
    console.warn('Cannot check token via API, assuming valid:', error);
    return true;
  }
};

// Get detailed token information
export const getTokenInfo = async (): Promise<TokenInfoResponse | null> => {
  try {
    const response = await clientAxios.get<{
      success: boolean;
      message: string;
      data: TokenInfoResponse;
    }>("/auth/token-info");

    if (response.data.success) {
      return response.data.data;
    }

    return null;
  } catch (error) {
    console.error('Error getting token info:', error);
    return null;
  }
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

// Đổi mật khẩu (khi đã đăng nhập)
export interface ChangePasswordPayload {
  current_password: string;
  password: string;
  password_confirmation: string;
}
export const changePassword = async (data: ChangePasswordPayload) => {
  const response = await clientAxios.put("/auth/change-password", data);
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

// ================= GOOGLE OAUTH =================

// Google OAuth - Get auth URL
export const getGoogleAuthUrl = async () => {
  const response = await clientAxios.get("/auth/google");
  return response.data;
};

// Google OAuth - Handle callback (if needed for manual handling)
export const handleGoogleCallback = async (code: string) => {
  const response = await clientAxios.get(`/auth/google/callback?code=${code}`);
  return response.data;
};
