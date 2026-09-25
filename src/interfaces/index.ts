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