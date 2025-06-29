export interface ICategory {
  id: number;
  category_name: string;
  description: string;
  slug: string;
  image: string;
  parent_category_id: number | null;
  sort_order: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export type ICategoryForm = Omit<ICategory, 'id' | 'created_at' | 'updated_at'>;

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


