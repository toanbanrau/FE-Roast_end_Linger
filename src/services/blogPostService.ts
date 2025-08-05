import { adminAxios } from "../configs/config";
import type {
  IAdminBlogPost,
  IAdminBlogPostForm,
  IAdminBlogPostListParams,
  IAdminBlogPostPagination
} from "../interfaces/blog";

// Lấy danh sách bài viết blog với phân trang và filter
export const getAllBlogPosts = async (params?: IAdminBlogPostListParams): Promise<IAdminBlogPostPagination> => {
  let url = '/blog-posts';

  if (params) {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append('page', params.page.toString());
    if (params.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.keyword) queryParams.append('keyword', params.keyword);
    if (params.category_id) queryParams.append('category_id', params.category_id.toString());
    if (params.status) queryParams.append('status', params.status);
    if (params.author_id) queryParams.append('author_id', params.author_id.toString());

    const queryString = queryParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  console.log('🔍 API Call:', `${adminAxios.defaults.baseURL}${url}`);

  const response = await adminAxios.get(url);

  console.log('✅ API Response:', response.data);

  // API trả về { status: "success", data: [...], pagination: {...} }
  if (response.data?.status === 'success' && response.data?.data && response.data?.pagination) {
    // Combine data và pagination thành format mong đợi
    const transformedData = {
      ...response.data.pagination,
      data: response.data.data,
    };
    console.log('🔄 Transformed Data:', transformedData);
    return transformedData;
  }

  // Fallback cho format cũ { status: "success", data: { pagination_data } }
  if (response.data?.status === 'success' && response.data?.data) {
    return response.data.data;
  }

  // Fallback cuối cùng
  return response.data.data || response.data;
};

// Lấy bài viết blog theo id
export const getBlogPostById = async (id: number): Promise<IAdminBlogPost> => {
  const response = await adminAxios.get(`/blog-posts/${id}`);
  return response.data.data || response.data;
};

// Tạo mới bài viết blog
export const createBlogPost = async (post: IAdminBlogPostForm): Promise<IAdminBlogPost> => {
  // Nếu có featured_image, sử dụng FormData
  if (post.featured_image) {
    const formData = new FormData();
    formData.append('title', post.title);
    formData.append('content', post.content);
    formData.append('blog_category_id', post.blog_category_id.toString());

    if (post.slug) formData.append('slug', post.slug);
    if (post.summary) formData.append('summary', post.summary);
    if (post.meta_title) formData.append('meta_title', post.meta_title);
    if (post.meta_description) formData.append('meta_description', post.meta_description);
    if (post.status) formData.append('status', post.status);

    formData.append('featured_image', post.featured_image);

    const response = await adminAxios.post("/blog-posts", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  } else {
    // Sử dụng JSON nếu không có image
    const { featured_image, ...postData } = post;
    const response = await adminAxios.post("/blog-posts", postData);
    return response.data.data;
  }
};

// Cập nhật bài viết blog
export const updateBlogPost = async (id: number, post: IAdminBlogPostForm): Promise<IAdminBlogPost> => {
  // Nếu có featured_image (File object để thay thế), sử dụng FormData với POST + _method override
  if ('featured_image' in post && post.featured_image instanceof File) {
    const formData = new FormData();

    // Method override để Laravel treat POST như PUT
    formData.append('_method', 'PUT');

    if (post.title) formData.append('title', post.title);
    if (post.content) formData.append('content', post.content);
    if (post.blog_category_id) formData.append('blog_category_id', post.blog_category_id.toString());
    if (post.slug) formData.append('slug', post.slug);
    if (post.summary) formData.append('summary', post.summary);
    if (post.meta_title) formData.append('meta_title', post.meta_title);
    if (post.meta_description) formData.append('meta_description', post.meta_description);
    if (post.status) formData.append('status', post.status);

    // Thay thế ảnh hiện tại bằng ảnh mới
    formData.append('featured_image', post.featured_image);

    // Sử dụng POST với _method override thay vì PUT trực tiếp
    const response = await adminAxios.post(`/blog-posts/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  } else {
    // Sử dụng PUT JSON nếu không thay đổi image (giữ ảnh hiện tại)
    const { featured_image, ...postData } = post;
    const response = await adminAxios.put(`/blog-posts/${id}`, postData);
    return response.data.data;
  }
};

// Xóa bài viết blog
export const deleteBlogPost = async (id: number): Promise<void> => {
  await adminAxios.delete(`/blog-posts/${id}`);
};