export interface CartItem {  
  id: number;
  productId: number; 
  productName: string;
  quantity: number;
  price: number;
  image: string
}
export interface Cart { 
  id: number;
  userId: number;  
  items: CartItem[];
  totalAmount: number;
}