import { clientAxios } from "../configs/config";
import type {
  IBlogPost,
  IBlogPostSummary,
  IBlogPagination,
  IBlogSearchResponse,
  IBlogListParams,
  IBlogSearchParams,
  IBlogCategory,
  IBlogCategoryDetail,
  IBlogCategoryPosts
} from "../interfaces/blog";

// Lấy danh sách bài viết blog với phân trang và filter
export const getBlogPosts = async (params?: IBlogListParams): Promise<IBlogPagination> => {
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
  if (params?.category_id) queryParams.append('category_id', params.category_id.toString());
  if (params?.author_id) queryParams.append('author_id', params.author_id.toString());
  if (params?.sort) queryParams.append('sort', params.sort);
  if (params?.featured !== undefined) queryParams.append('featured', params.featured.toString());
  if (params?.search) queryParams.append('search', params.search); // Thêm search parameter

  const response = await clientAxios.get(`/blog?${queryParams.toString()}`);
  return response.data.data;
};

// Lấy top 5 bài viết mới nhất
export const getTop5BlogPosts = async (): Promise<IBlogPostSummary[]> => {
  const response = await clientAxios.get('/blog/top5');
  return response.data.data;
};

// Tìm kiếm bài viết blog
export const searchBlogPosts = async (params: IBlogSearchParams): Promise<IBlogSearchResponse> => {
  // Chỉ gửi query parameter 'q'
  const response = await clientAxios.post(`/blog/search?q=${encodeURIComponent(params.query)}`, params);
  return response.data.data;
};

// Lấy chi tiết bài viết blog theo slug hoặc id
export const getBlogPostBySlug = async (slug: string): Promise<IBlogPost> => {
  const response = await clientAxios.get(`/blog/${slug}`);
  return response.data.data;
};

// Lấy danh sách danh mục blog
export const getBlogCategories = async (params?: {
  search?: string;
  parent_id?: number;
  with_posts?: boolean;
  tree?: boolean;
}): Promise<IBlogCategory[]> => {
  const queryParams = new URLSearchParams();

  if (params?.search) queryParams.append('search', params.search);
  if (params?.parent_id) queryParams.append('parent_id', params.parent_id.toString());
  if (params?.with_posts !== undefined) queryParams.append('with_posts', params.with_posts.toString());
  if (params?.tree !== undefined) queryParams.append('tree', params.tree.toString());

  const response = await clientAxios.get(`/blog-categories?${queryParams.toString()}`);
  return response.data.data;
};

// Lấy chi tiết danh mục blog
export const getBlogCategoryById = async (id: number, params?: {
  with_posts?: boolean;
  posts_limit?: number;
}): Promise<IBlogCategoryDetail> => {
  const queryParams = new URLSearchParams();

  if (params?.with_posts !== undefined) queryParams.append('with_posts', params.with_posts.toString());
  if (params?.posts_limit) queryParams.append('posts_limit', params.posts_limit.toString());

  const response = await clientAxios.get(`/blog-categories/${id}?${queryParams.toString()}`);
  return response.data.data;
};

// Lấy bài viết theo danh mục
export const getBlogPostsByCategory = async (categoryId: number, params?: {
  page?: number;
  per_page?: number;
  sort?: 'newest' | 'oldest' | 'popular';
}): Promise<IBlogCategoryPosts> => {
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
  if (params?.sort) queryParams.append('sort', params.sort);

  const response = await clientAxios.get(`/blog-categories/${categoryId}/posts?${queryParams.toString()}`);
  return response.data.data;
};

// Lấy bài viết theo tag (giả sử có API này)
export const getBlogPostsByTag = async (tagSlug: string, params?: {
  page?: number;
  per_page?: number;
  sort?: 'newest' | 'oldest' | 'popular';
}): Promise<IBlogPagination> => {
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
  if (params?.sort) queryParams.append('sort', params.sort);

  const response = await clientAxios.get(`/blog/tag/${tagSlug}?${queryParams.toString()}`);
  return response.data.data;
};
