import axios from "axios";

// Token test
const TEST_TOKEN = "3|57nUjlT4nQI1h5fFT82o4ZvztXSzA8y7rX6Vmn338b8664c5";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/api/admin",
  headers: {
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${localStorage.getItem("token") || TEST_TOKEN}`,
  },
});

export default axiosInstance;
