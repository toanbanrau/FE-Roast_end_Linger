export interface ICategory {
  id: number;
  category_name: string;
  description?: string;
  slug: string;
  image?: string;
  parent_id?: number;
  sort_order?: number;
  status?: number;
}

export type ICategoryForm = Omit<ICategory, 'id'>;


