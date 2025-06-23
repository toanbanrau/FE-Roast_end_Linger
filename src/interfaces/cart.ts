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
    image: string | null;
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
    variant: ICartVariant | null;
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
    user_id: number | null;
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

// Represents the payload for adding an item to the cart
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

// Represents the generic API response structure from the docs
export interface ICartApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}