import { Coupon } from '../types/cart';

export const mockCoupons: Coupon[] = [
  {
    code: 'WELCOME10',
    discountPercentage: 10,
    description: '10% discount on your first order',
    minSpend: 2000,
  },
  {
    code: 'SAVE15',
    discountPercentage: 15,
    description: '15% off orders above Rs. 10,000',
    minSpend: 10000,
  },
  {
    code: 'FLAT500',
    discountAmount: 500,
    description: 'Flat Rs. 500 OFF on any purchase',
    minSpend: 3000,
  },
];
