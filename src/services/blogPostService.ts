import { adminAxios } from "../configs/config";
import type { IAdminBlogPost, IAdminBlogPostForm } from "../interfaces/blog";

// Lấy tất cả bài viết blog
export const getAllBlogPosts = async (): Promise<IAdminBlogPost[]> => {
  const response = await adminAxios.get("/blog-posts");
  return response.data.data.data || response.data;
};

// Lấy bài viết blog theo id
export const getBlogPostById = async (id: number): Promise<IAdminBlogPost> => {
  const response = await adminAxios.get(`/blog-posts/${id}`);
  return response.data.data || response.data;
};

// Tạo mới bài viết blog
export const createBlogPost = async (post: IAdminBlogPostForm): Promise<IAdminBlogPost> => {
  const response = await adminAxios.post("/blog-posts", post);
  return response.data.data || response.data;
};

// Cập nhật bài viết blog
export const updateBlogPost = async (id: number, post: IAdminBlogPostForm): Promise<IAdminBlogPost> => {
  const response = await adminAxios.put(`/blog-posts/${id}`, post);
  return response.data.data || response.data;
};

// Xóa bài viết blog
export const deleteBlogPost = async (id: number): Promise<void> => {
  await adminAxios.delete(`/blog-posts/${id}`);
};