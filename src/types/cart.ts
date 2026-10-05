import { Product, ProductVariant } from './product';

export interface CartItem {
  id: string; // unique cart item id (product.id + variant.id)
  product: Product;
  selectedVariant?: ProductVariant;
  selectedAttributes?: Record<string, string>;
  unitPrice: number;
  quantity: number;
}

export interface Coupon {
  code: string;
  discountPercentage?: number;
  discountAmount?: number;
  minSpend?: number;
  status?: 'Active' | 'Inactive' | string;
  description: string;
}

export interface CartSummaryData {
  subtotal: number;
  discount: number;
  couponCode?: string;
  couponDiscount: number;
  shippingFee: number;
  freeShippingThreshold: number;
  total: number;
}
