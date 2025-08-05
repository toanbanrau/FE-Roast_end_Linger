// Admin Blog Post interfaces
export interface IAdminBlogPost {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  featured_image?: string | null;
  meta_title: string;
  meta_description: string;
  status: 'draft' | 'published' | 'archived';
  view_count: number;
  created_at: string;
  updated_at: string;
  category: {
    id: number;
    category_name: string;
  };
  author: {
    id: number;
    name: string;
  };
  comments?: IAdminBlogComment[];
}

export interface IAdminBlogComment {
  id: number;
  content: string;
  status: 'approved' | 'pending' | 'rejected';
  created_at: string;
  user: {
    id: number;
    name: string;
  };
}

export interface IAdminBlogPostForm {
  title: string;
  slug?: string;
  summary?: string;
  content: string;
  blog_category_id: number;
  featured_image?: File | null;
  meta_title?: string;
  meta_description?: string;
  status?: 'draft' | 'published' | 'archived';
}

export interface IAdminBlogPostListParams {
  page?: number;
  per_page?: number;
  search?: string;
  keyword?: string; // Legacy search parameter
  category_id?: number;
  status?: 'draft' | 'published' | 'archived';
  author_id?: number;
}

export interface IAdminBlogPostPagination {
  current_page: number;
  data: IAdminBlogPost[];
  last_page: number;
  per_page: number;
  total: number;
  // Optional fields từ Laravel pagination (nếu có)
  first_page_url?: string;
  from?: number;
  last_page_url?: string;
  links?: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url?: string | null;
  path?: string;
  prev_page_url?: string | null;
  to?: number;
}

// Client Blog interfaces
export interface IBlogCategory {
  id: number;
  category_name: string;
  slug: string;
  description?: string;
  parent_category_id?: number | null;
  sort_order?: number;
  status?: boolean;
  created_at?: string;
  updated_at?: string;
  posts_count?: number;
  children?: IBlogCategory[];
}

export interface IBlogCategoryDetail extends IBlogCategory {
  parent?: IBlogCategory | null;
  posts?: IBlogPostSummary[];
}

export interface IBlogCategoryPosts {
  category: IBlogCategory;
  posts: IBlogPostSummary[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
}

export interface IBlogAuthor {
  id: number;
  name: string;
  email?: string;
}

export interface IBlogUser {
  id: number;
  name: string;
}

export interface IBlogTag {
  id: number;
  tag_name: string;
  slug: string;
}

export interface IBlogPost {
  id: number;
  user_id: number;
  blog_category_id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  featured_image: string | null;
  meta_title: string;
  meta_description: string;
  view_count: number;
  status: string;
  created_at: string;
  updated_at: string;
  user: IBlogUser;
  category: IBlogCategorySimple;
  tags?: IBlogTag[];
  related_posts?: IBlogPostSummary[];
}

export interface IBlogUser {
  id: number;
  name: string;
}

export interface IBlogCategorySimple {
  id: number;
  category_name: string;
}

export interface IBlogPostSummary {
  id: number;
  title: string;
  slug: string;
  summary: string;
  featured_image: string | null;
  view_count: number;
  created_at: string;
  category: IBlogCategorySimple;
  user: IBlogUser;
}

export interface IBlogSearchResult extends IBlogPostSummary {
  relevance_score: number;
}

export interface IBlogPagination {
  current_page: number;
  data: IBlogPostSummary[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: any[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface IBlogSearchResponse {
  query: string;
  total_results: number;
  current_page: number;
  per_page: number;
  total_pages: number;
  results: IBlogSearchResult[];
}

export interface IBlogListParams {
  page?: number;
  per_page?: number;
  category_id?: number;
  author_id?: number;
  sort?: 'newest' | 'oldest' | 'popular';
  featured?: boolean;
  search?: string; // Thêm search parameter
}

export interface IBlogSearchParams {
  query: string;
  category_id?: number;
  page?: number;
  per_page?: number;
}

// Client Blog interfaces
export interface IBlogCategory {
  id: number;
  category_name: string;
  slug: string;
  description?: string;
}

export interface IBlogAuthor {
  id: number;
  name: string;
  email?: string;
}

export interface IBlogTag {
  id: number;
  tag_name: string;
  slug: string;
}

export interface IBlogPost {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  featured_image: string | null;
  is_featured: boolean;
  view_count: number;
  status: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  meta_title?: string;
  meta_description?: string;
  category: IBlogCategory;
  author: IBlogAuthor;
  tags: IBlogTag[];
  related_posts?: IBlogPostSummary[];
}

export interface IBlogPostSummary {
  id: number;
  title: string;
  slug: string;
  summary: string;
  featured_image: string | null;
  view_count: number;
  published_at: string;
  category: IBlogCategory;
  author: IBlogAuthor;
}

export interface IBlogSearchResult extends IBlogPostSummary {
  relevance_score: number;
}

export interface IBlogPagination {
  current_page: number;
  data: IBlogPostSummary[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: any[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface IBlogSearchResponse {
  query: string;
  total_results: number;
  current_page: number;
  per_page: number;
  total_pages: number;
  results: IBlogSearchResult[];
}

export interface IBlogListParams {
  page?: number;
  per_page?: number;
  category_id?: number;
  author_id?: number;
  sort?: 'newest' | 'oldest' | 'popular';
  featured?: boolean;
}

export interface IBlogSearchParams {
  query: string;
  category_id?: number;
  page?: number;
  per_page?: number;
}