// Represents simplified product information within a cart item
export interface ICartProduct {
    id: number;
    name: string;
    slug: string;
    image: string;
    status: string;
}

// Represents simplified variant information within a cart item
export interface ICartVariant {
    id: number;
    name: string;
    sku: string;
    image: string;
    status: boolean;
}

// Represents stock information for a cart item
export interface ICartItemStock {
    available_stock: number;
    in_stock: boolean;
    exceeds_stock: boolean;
}

// Represents a single item in the shopping cart
export interface ICartItem {
    id: number;
    cart_id: number;
    product: ICartProduct;
    variant: ICartVariant;
    full_product_info: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    formatted_unit_price: string;
    formatted_total_price: string;
    stock_info: ICartItemStock;
    created_at: string;
    updated_at: string;
}

// Represents the entire shopping cart object
export interface ICart {
    id: number;
    user_id: number;
    is_guest_cart: boolean;
    total_items: number;
    total_product_types: number;
    subtotal: number;
    formatted_subtotal: string;
    is_empty: boolean;
    items: ICartItem[];
    created_at: string;
    updated_at: string;
}

// Payload gửi lên khi thêm sản phẩm vào giỏ hàng
export interface IAddProductToCartPayload {
    product_id: number;
    product_variant_id?: number;
    quantity: number;
}

// Represents the payload for updating a cart item's quantity
export interface IUpdateCartItemPayload {
    quantity: number;
}

// Represents the summary of the cart, often returned after add/update/delete operations
export interface ICartSummary {
    cart_id: number;
    total_items: number;
    total_product_types: number;
    subtotal: number;
    formatted_subtotal: string;
}

// Interface cho dữ liệu trả về từ API /api/cart
export interface ICartResponse {
  success: boolean;
  message: string;
  data: ICart;
}

// Response khi thêm sản phẩm vào giỏ hàng
export interface IAddToCartResponse {
  success: boolean;
  message: string;
  data: IAddToCartData;
}

export interface IAddToCartData {
  cart_item: ICartItemAdd;
  cart_summary: ICartSummary;
}

export interface ICartItemAdd {
  id: number;
  cart_id: number;
  product: ICartProduct;
  variant: ICartVariant;
  quantity: number;
  unit_price: number;
  total_price: number;
  formatted_unit_price: string;
  formatted_total_price: string;
}