import { CartItem } from './cart';

export type OrderStatus =
  | 'New Order'
  | 'Confirmed'
  | 'Processing'
  | 'Packed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned'
  | 'Refunded';

export type PaymentMethod = 'cod' | 'card' | 'wallet';

export interface TrackingStep {
  status: OrderStatus;
  label: string;
  description: string;
  timestamp?: string;
  completed: boolean;
  current: boolean;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email?: string;
  city: string;
  area: string;
  address: string;
  notes?: string;
}

export interface Order {
  id: string; // e.g. "ORD-2026-89421"
  userId?: string; // Authenticated Customer ID
  createdAt: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: ShippingAddress;
  items: CartItem[];
  paymentMethod: PaymentMethod;
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  subtotal: number;
  discount: number;
  couponDiscount: number;
  shippingFee: number;
  total: number;
  status: OrderStatus;
  trackingNumber: string;
  estimatedDelivery: string;
  trackingHistory: {
    status: OrderStatus;
    timestamp: string;
    note: string;
  }[];
}
