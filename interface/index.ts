import { Timestamp } from 'firebase/firestore';
export interface Product {
  id: string;
  name: string;
  price: number;
  imgUrl: string;
  quantity: number;
  category: string;
  categorySlug: string
  timestamp?: Timestamp 
}

export interface Category {
  id: string;
  category: string;
  slug: string;
}

export interface UserType {
  email: string;
  password?:string;
  displayName?:string;
 
}

export interface CartItemType extends Product {
  cartQuantity: number;
  totalPrice: number;
}

export interface CartType {
  cartItems: CartItemType[]
  totalPrice: number
}

export interface SortProps {
  field: string,
  isAscending: boolean
}

export interface PaymentProps {
  id: string,
  userId: string,
  cart: CartItemType[],
  totalPrice: number,
  bank?: string,
  accountNumber?: string,
  accountOwner?: string,
  paymentTime: Timestamp | number
}