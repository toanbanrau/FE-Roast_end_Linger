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
  category_id: number;
  brand_id: number;
  origin_id: number;
  slug: string;
  coffee_type: string;
  roast_level: string;
  flavor_profile: string;
  strength_score: string;
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
  primary_image?: {
    id: number;
    product_id: number;
    image_url: string;
    alt_text: string;
    sort_order: number;
    is_primary: boolean;
    created_at: string;
    updated_at: string;
  };
  category?: {
    id: number;
    category_name: string;
    slug: string;
  };
  brand?: {
    id: number;
    brand_name: string;
    slug: string;
  };
  origin?: {
    id: number;
    origin_name: string;
    country: string;
  };
  images?: IProductImage[];
}

// Interface cho dữ liệu tạo sản phẩm (form add, multipart/form-data)
export interface IProductCreate {
  product_name: string;
  description: string;
  short_description: string;
  base_price: number;
  category_id: number;
  brand_id: number;
  origin_id: number;
  coffee_type: string;
  roast_level: string;
  flavor_profile: string;
  strength_score: number;
  meta_title: string;
  meta_description: string;
  stock_quantity: number;
  has_variants: boolean;
  status: 'active' | 'inactive';
  is_featured: boolean;
  images: {
    image_file: File; // File upload
    alt_text?: string;
    sort_order?: number;
    is_primary?: boolean;
  }[];
  variants?: {
    variant_name: string;
    sku_code: string;
    price: number;
    stock_quantity: number;
  }[];
}

export interface IProductVariant {
    id: number;
    product_id: number;
    sku_code: string;
    variant_name: string;
    price: string;
    stock_quantity: number;
    image_url: string | null;
    image?: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

// Interfaces for Admin Product Detail
export interface IAdminProductImage {
  id: number;
  image_url: string;
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
  base_price: string;
  formatted_price?: string;
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
  category: IAdminProductCategory | null;
  brand: IAdminProductBrand | null;
  origin: IAdminProductOrigin | null;
  primary_image: IAdminProductImage | null;
  images?: IAdminProductImage[];
  variants?: any[];
  created_at: string;
  updated_at: string;
}

export interface IAdminProductDetailResponse {
  data: IAdminProduct;
  message: string;
}
