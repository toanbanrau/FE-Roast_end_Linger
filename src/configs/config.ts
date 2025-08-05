import axios from "axios";
import { handleTokenError } from "../utils/tokenUtils";
import { useUserStore } from "../stores/useUserStore";

const BASE_URL = "http://127.0.0.1:8000";

// Instance cho Admin API
export const adminAxios = axios.create({
  baseURL: `${BASE_URL}/api/admin`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Instance cho Client API
export const clientAxios = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor cho adminAxios
adminAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Tự động set Content-Type dựa trên dữ liệu
  if (config.data instanceof FormData) {
    config.headers["Content-Type"] = "multipart/form-data";
  } else {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});

// Luôn lấy token mới nhất cho mọi request
clientAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor cho clientAxios để xử lý token lỗi
clientAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Xử lý token lỗi tự động
    handleTokenError(error);
    return Promise.reject(error);
  }
);

// Response interceptor cho adminAxios để xử lý token lỗi
adminAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Xử lý token lỗi tự động
    handleTokenError(error);
    return Promise.reject(error);
  }
);

// Để tương thích ngược với code cũ
export default adminAxios;
