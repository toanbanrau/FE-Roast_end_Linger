export interface OrderItem {
  product_id: number;
  quantity: number;
  price: number;
}

// New interfaces based on the API response from the user
interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}

interface DeliveryInfo {
  address: string;
  city: string;
  district: string;
  ward: string;
  full_address: string;
}

interface OrderTotals {
  subtotal: string;
  shipping_fee: string;
  discount_amount: string;
  total_amount: string;
  formatted_total: string;
}

interface OrderStatus {
  id: number;
  name: string;
  color: string;
  can_be_cancelled: boolean;
}

interface OrderDates {
  created_at: string;
  delivery_date: string | null;
  completed_date: string | null;
  updated_at: string;
}

// Product interface for order items
interface Product {
  id: number;
  name: string;
  current_name: string;
  slug: string;
  image: string;
}

// Variant interface for order items
interface Variant {
  id: number;
  name: string;
  current_name: string;
  sku: string;
  image: string;
}

// Product snapshot interface
interface ProductSnapshot {
  product_id: number;
  product_name: string;
  product_description: string;
  product_sku: string;
  product_price: string;
  variant_id: number;
  variant_name: string;
  variant_sku: string;
  variant_price: number;
}

// Order item interface with full details
interface OrderItemDetail {
  id: number;
  order_id: number;
  product: Product;
  variant: Variant;
  full_product_info: string;
  quantity: number;
  unit_price: string;
  total_price: string;
  formatted_unit_price: string;
  formatted_total_price: string;
  product_snapshot: ProductSnapshot;
  created_at: string;
  updated_at: string;
}

// Order history interface
interface OrderHistory {
  id: number;
  order_id: number;
  old_status: {
    id: number | null;
    name: string | null;
    color: string | null;
  };
  new_status: OrderStatus;
  updated_by: {
    id: number;
    name: string;
    full_name: string;
  };
  notes: string;
  change_description: string;
  created_at: string;
  updated_at: string;
}

// Main IOrder interface updated to match the API response
export interface IOrder {
  id: number;
  order_number: string;
  customer_info: CustomerInfo;
  delivery_info: DeliveryInfo;
  order_totals: OrderTotals;
  payment_method: string;
  status: OrderStatus;
  promotion_code: string | null;
  notes: string | null;
  is_guest_order: boolean;
  user_id: number;
  dates: OrderDates;
  items: OrderItemDetail[];
  histories: OrderHistory[];
}

// This interface is for creating an order, may need review later
export interface IOrderCreate {
  user_id?: number;
  customer_name: string;
  customer_email: string;
  delivery_address: string;
  customer_phone: string;
  payment_method: string;
  notes?: string;
  promotion_code?: string;
  items: OrderItem[];
} 