export interface IProductImage {
  id: number;
  product_id: number;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface IProductCategory {
  id: number;
  category_name: string;
  slug: string;
}

export interface IProductBrand {
  id: number;
  brand_name: string;
  slug: string;
}

export interface IProductOrigin {
  id: number;
  origin_name: string;
  country: string;
}

export interface IProduct {
  id: number;
  product_name: string;
  description: string;
  short_description: string;
  base_price: string;
  category_id: number | null;
  brand_id: number | null;
  origin_id: number | null;
  slug: string;
  coffee_type: string | null;
  roast_level: string | null;
  flavor_profile: string | null;
  strength_score: string | null;
  meta_title: string | null;
  meta_description: string | null;
  stock_quantity: number;
  has_variants: boolean;
  status: string;
  is_featured: boolean;
  view_count: number;
  sold_count: number;
  created_at: string;
  updated_at: string;
  primary_image: IProductImage | null;
  category: IProductCategory | null;
  brand: IProductBrand | null;
  origin: IProductOrigin | null;
  variants?: IProductVariant[];
}

export interface IProductListResponse {
  data: IProduct[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
  message?: string;
}

export type IProductCreate = Omit<IProduct, 'id' | 'created_at' | 'updated_at' | 'primary_image' | 'category' | 'brand' | 'origin' | 'view_count' | 'sold_count'> & {
    variants?: Omit<IProductVariant, 'id' | 'product_id' | 'created_at' | 'updated_at'>[];
};
export type IProductUpdate = Partial<IProductCreate>;

export interface IProductVariant {
    id: number;
    product_id: number;
    sku_code: string;
    variant_name: string;
    price: string;
    stock_quantity: number;
    image_url: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface IProductVariantAttributeValue {
    id: number;
    product_variant_id: number;
    attribute_value_id: number;
    created_at: string;
    updated_at: string;
}

export interface IAdminProductImage {
  id: number;
  image_url: string;
  image_name: string;
  local_path: string;
  alt_text: string;
  sort_order: number;
  is_primary: boolean;
}

export interface IAdminProductCategory {
  id: number;
  category_name: string;
}

export interface IAdminProductBrand {
  id: number;
  brand_name: string;
}

export interface IAdminProductOrigin {
  id: number;
  origin_name: string;
}

export interface IAdminProduct {
  id: number;
  product_name: string;
  description: string;
  short_description: string;
  base_price: number;
  formatted_price?: string;
  slug: string;
  coffee_type: string;
  roast_level: string;
  flavor_profile: string;
  strength_score: number;
  stock_quantity: number;
  has_variants: boolean;
  status: string;
  is_featured: boolean;
  view_count: number;
  sold_count: number;
  category: IAdminProductCategory;
  brand: IAdminProductBrand;
  origin: IAdminProductOrigin;
  primary_image: IAdminProductImage;
  images?: IAdminProductImage[];
  variants?: any[];
  created_at: string;
  updated_at: string;
}

export interface IAdminProductMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export interface IAdminProductListResponse {
  data: IAdminProduct[];
  meta: IAdminProductMeta;
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

export interface IAdminProductDetailResponse {
  data: IAdminProduct & { images: IAdminProductImage[]; variants: any[] };
  message: string;
}

export const getAllProductsClient = async (params?: any): Promise<IProductListResponse> => {
  const res = await clientAxios.get("/products", { params });
  return res.data;
}; 