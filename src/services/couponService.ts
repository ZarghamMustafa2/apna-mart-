import { Coupon } from '../types/cart';
import { dbGetAll, dbPut, dbDelete } from './db';
import { isSupabaseConfigured } from './supabase';
import {
  fetchCouponsFromSupabase,
  saveCouponToSupabase,
  deleteCouponFromSupabase,
} from './supabaseDb';

export async function getCoupons(): Promise<Coupon[]> {
  if (isSupabaseConfigured()) {
    try {
      const cloud = await fetchCouponsFromSupabase();
      if (cloud && cloud.length > 0) {
        for (const c of cloud) {
          dbPut('coupons', c).catch(() => {});
        }
        return cloud;
      }
    } catch (e) {
      console.warn('Supabase getCoupons fallback:', e);
    }
  }
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
  if (isSupabaseConfigured()) {
    try {
      await saveCouponToSupabase(coupon);
    } catch (e) {
      console.error('Supabase saveCoupon error:', e);
    }
  }
  return await dbPut<Coupon>('coupons', coupon);
}

export async function deleteCouponByCode(code: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      await deleteCouponFromSupabase(code);
    } catch (e) {
      console.error('Supabase deleteCoupon error:', e);
    }
  }
  return await dbDelete('coupons', code);
}
