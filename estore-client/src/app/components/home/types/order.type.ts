export interface OrderItem {
  productId: number;
  qty: number;
  prise: number;
  amount: number;
}

export interface OrderTypes {
  userName: string;
  address: string;
  city: string;
  state: string;
  pin: string;
  total: number;
  userEmail: string;
  orderDetails: OrderItem[];
}

export interface OrderSummary {
  orderId: number;
  orderDate: string;
  userName: string;
  address: string;
  city: string;
  state: string;
  pin: string;
  total: number;
}

export interface OrderProduct {
  productId: number;
  productName: string;
  qty: number;
  price: number;
  amount: number;
}