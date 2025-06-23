export interface OrderItem {
  productId: number;
  quantity: number;
  price: number;
}

export interface IOrder {
  id: number;
  userId: number;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  phoneNumber: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  shippingMethod: string;
  shippingFee: number;
  status: string; // e.g., 'pending', 'processing', 'shipped', 'delivered', 'cancelled'
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface IOrderCreate {
    userId?: number;
    customerName: string;
    customerEmail: string;
    shippingAddress: string;
    phoneNumber: string;
    totalAmount: number;
    paymentMethod: string;
    shippingMethod: string;
    shippingFee: number;
    items: OrderItem[];
} 