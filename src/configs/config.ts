import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000";

// Token test (chỉ dùng cho development)
const TEST_TOKEN = "8|deIRBpeHBZKkZV9NDUwv3hMQQIwELyT9vOacfoS2fd560b62";

// Instance cho Admin API
export const adminAxios = axios.create({
  baseURL: `${BASE_URL}/api/admin`,
  headers: {
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${localStorage.getItem("token") || TEST_TOKEN}`,
  },
});

// Instance cho Client API
export const clientAxios = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token") || TEST_TOKEN}`,
  },
});

// Luôn lấy token mới nhất cho mọi request
clientAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Để tương thích ngược với code cũ
export default adminAxios;
