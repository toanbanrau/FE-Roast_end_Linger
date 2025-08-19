export interface ICategory {
  id: number;
  category_name: string;
  description?: string;
  slug: string;
  parent_category_id: number | null;
  sort_order: number;
  status: boolean;
  created_at: string;
  updated_at: string;
  parent?: ICategory | null;
  children?: ICategory[];
  all_children?: ICategory[];
  products?: any[];
  full_path?: string;
  level?: number;
  ancestors?: ICategory[];
  products_count?: number;
}

export type ICategoryForm = Omit<ICategory, 'id' | 'created_at' | 'updated_at' | 'parent' | 'children' | 'all_children' | 'products' | 'full_path' | 'level' | 'ancestors' | 'products_count'>;

// Admin Category API Response interfaces
export interface ICategoryListResponse {
  status: string;
  data: {
    current_page: number;
    data: ICategory[];
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
  };
  message: string;
}

export interface ICategoryTreeResponse {
  status: string;
  data: ICategory[];
  message: string;
}

export interface ICategoryResponse {
  status: string;
  data: ICategory;
  message: string;
}

// Bulk action interface
export interface ICategoryBulkAction {
  action: 'activate' | 'deactivate' | 'delete';
  category_ids: number[];
}

export interface IAdminBlogCategory {
  id: number;
  category_name: string;
  description?: string;
  slug: string;
  parent_category_id?: number | null;
  sort_order?: number;
  status: boolean;
  created_at?: string;
  updated_at?: string;
  parent?: IAdminBlogCategory | null;
  children?: IAdminBlogCategory[];
}
 


export type IAdminBlogCategoryForm = Omit<IAdminBlogCategory, 'id' | 'created_at' | 'updated_at' | 'parent' | 'children'>;


