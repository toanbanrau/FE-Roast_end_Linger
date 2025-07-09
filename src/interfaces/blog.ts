// Blog Post interfaces
export interface IAdminBlogPost {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  blog_category_id: number;
  meta_title: string;
  meta_description: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface IAdminBlogPostForm {
  title: string;
  slug: string;
  summary: string;
  content: string;
  blog_category_id: number;
  meta_title: string;
  meta_description: string;
  status: string;
}