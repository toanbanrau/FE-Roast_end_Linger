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
export interface Product {
  id: number;
  name: string;
  current_name: string;
  slug: string;
  image: string;
}

// Variant interface for order items
export interface Variant {
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
export interface OrderItemDetail {
  id: number;
  order_id: number;
  product: Product;
  variant: Variant | null; // Variant có thể null cho sản phẩm không có biến thể
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
export interface OrderHistory {
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

// SEPAY Payment Info Interfaces
interface SepayBankInfo {
  bank_name: string;
  bank_code: string;
  account_number: string;
  account_name: string;
  // Legacy support
  name?: string;
  branch?: string;
}

interface SepayInstructions {
  step_1: string;
  step_2: string;
  step_3: string;
  step_4: string;
}

interface SepayTransaction {
  id: string;
  transaction_date: string;
  amount_in: number;
  transaction_content: string;
  reference_number: string;
  bank_brand_name: string;
  account_number: string;
}

interface SepayCheck {
  checked_at: string;
  api_response_time_ms: number;
  transactions_found: number;
  matching_transaction: SepayTransaction | null;
}

// Legacy QR Code Info Interface (for backward compatibility)
interface QRCodeInfo {
  viet_qr_url: string;
  instructions: {
    step_1: string;
    step_2: string;
    step_3: string;
    step_4: string;
    step_5: string;
  };
}

// Enhanced Payment Info Interface (supports both legacy and SEPAY)
interface PaymentInfo {
  // SEPAY fields
  payment_id?: number;
  method: string;
  payment_gateway?: string;
  amount: number | string;
  formatted_amount: string;
  transaction_id?: string;
  tracking_content?: string;
  qr_code?: string | QRCodeInfo;
  bank_info: SepayBankInfo;
  auto_confirm?: boolean;
  expires_at?: string;
  instructions?: SepayInstructions;
  sepay_check?: SepayCheck;
  sepay_transaction?: SepayTransaction;
  completed_at?: string;
  detection_method?: string;

  // Legacy fields (for backward compatibility)
  transfer_content?: string;
  qr_code_enabled?: boolean;
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
  payment_info?: PaymentInfo; // Optional for bank transfer orders
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

// Cancel Order Interfaces
export interface CancelOrderRequest {
  reason?: string;
}

export interface CancelOrderResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    order_number: string;
    status: {
      id: number;
      status_name: string;
      display_name: string;
    };
    total_amount: number;
    formatted_total_amount: string;
  };
}