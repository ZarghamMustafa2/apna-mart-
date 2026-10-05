import { Coupon } from '../types/cart';
import { dbGetAll, dbPut, dbDelete } from './db';

export async function getCoupons(): Promise<Coupon[]> {
  return await dbGetAll<Coupon>('coupons');
}

export async function validateCoupon(code: string, subtotal: number): Promise<{ coupon?: Coupon; error?: string }> {
  const coupons = await getCoupons();
  const found = coupons.find((c) => c.code === code.trim().toUpperCase());

  if (!found) {
    return { error: 'Invalid coupon code.' };
  }

  if (found.status && found.status !== 'Active') {
    return { error: 'This coupon is inactive or no longer valid.' };
  }

  if (found.minSpend && subtotal < found.minSpend) {
    return { error: `Minimum order amount of Rs. ${found.minSpend.toLocaleString()} required for coupon ${found.code}.` };
  }

  return { coupon: found };
}

export async function saveCoupon(coupon: Coupon): Promise<Coupon> {
  return await dbPut<Coupon>('coupons', coupon);
}

export async function deleteCouponByCode(code: string): Promise<boolean> {
  return await dbDelete('coupons', code);
}
