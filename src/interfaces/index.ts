export interface IUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  password: string;
  isActive: true;
  role: "customer" | "admin";
}
export interface IPizza {
  id: string;
  name: string;
  category: string;
  "sub-category": string;
  description: string;
  image: string;
  status: string;
  created_at: string;
}

export interface IVariant {
  id: string;
  type: string;
  price: number;
  pizza_id: string;
  created_at: string;
}

export interface IAddress {
  id: string;
  name: string;
  city: string;
  address_line_1: string;
  address_line_2: string;
  pincode: string;
  landmark: string;
  customer_id: string;
  created_at: string;
}

export interface IOrder {
  id: string;
  customer_id: string;
  address_id: string;
  subtotal: number;
  tax?: number; // Default is 0
  total: number;
  payment_id: string;
  status: string;
  created_at: string;
}

export interface IOrderItem {
  id: string;
  name: string;
  quantity: number;
  image: string;
  unit_price: number;
  total_price: number;
  order_id: string;
  created_at: string;
}