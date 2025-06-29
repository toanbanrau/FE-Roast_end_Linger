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
  subtotal: number;
  shipping_fee: number;
  discount_amount: number;
  total_amount: number;
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
  items?: OrderItem[]; // Making this optional as it's not in the list view
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