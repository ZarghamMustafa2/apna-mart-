import { dbGetAll, dbGetById, dbPut, dbDelete } from './db';
import { isSupabaseConfigured } from './supabase';
import {
  fetchReviewsFromSupabase,
  saveReviewToSupabase,
  deleteReviewFromSupabase,
} from './supabaseDb';

export interface CustomerReview {
  id: string;
  productId: string;
  productName: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  comment: string;
  status: 'Approved' | 'Pending' | 'Hidden';
  verifiedPurchase: boolean;
}

const defaultReviews: CustomerReview[] = [
  {
    id: 'rev-1',
    productId: 'prod-headphones-1',
    productName: 'UltraSound Pro Wireless Headphones',
    userName: 'Zayn Shah',
    rating: 5,
    date: '2026-08-22',
    comment: 'Amazing sound quality and battery life! Delivered within 2 days to Karachi. Quality is 10/10 as described.',
    status: 'Approved',
    verifiedPurchase: true,
  },
  {
    id: 'rev-2',
    productId: 'prod-smartphone-1',
    productName: 'Apex Smartphone Pro 5G',
    userName: 'Hamza Malik',
    rating: 5,
    date: '2026-08-20',
    comment: 'Superfast charging and smooth 120Hz display. Authentic sealed packaging with local warranty card.',
    status: 'Approved',
    verifiedPurchase: true,
  },
  {
    id: 'rev-3',
    productId: 'prod-sneakers-1',
    productName: 'ProRunner FlyMesh Sneakers',
    userName: 'Usman Ali',
    rating: 4,
    date: '2026-08-24',
    comment: 'Very comfortable for daily workout routines. High quality build and true to size.',
    status: 'Approved',
    verifiedPurchase: true,
  },
];

export async function getReviews(): Promise<CustomerReview[]> {
  if (isSupabaseConfigured()) {
    try {
      const cloudReviews = await fetchReviewsFromSupabase();
      if (cloudReviews && cloudReviews.length > 0) {
        for (const r of cloudReviews) {
          dbPut('reviews', r).catch(() => {});
        }
        return cloudReviews;
      }
    } catch (e) {
      console.warn('Supabase getReviews fallback to local db:', e);
    }
  }

  try {
    const list = await dbGetAll<CustomerReview>('reviews');
    if (list && list.length > 0) {
      return list;
    }
    // Seed initial reviews
    for (const r of defaultReviews) {
      await dbPut('reviews', r);
    }
    return defaultReviews;
  } catch (e) {
    console.error('Error fetching reviews:', e);
    return defaultReviews;
  }
}

export async function getProductReviews(productIdOrName: string): Promise<CustomerReview[]> {
  const all = await getReviews();
  const q = productIdOrName.toLowerCase();
  return all.filter(
    (r) =>
      r.status === 'Approved' &&
      (r.productId.toLowerCase() === q || r.productName.toLowerCase().includes(q) || q.includes(r.productName.toLowerCase()))
  );
}

export async function submitReview(data: {
  productId?: string;
  productName: string;
  userName: string;
  rating: number;
  comment: string;
}): Promise<CustomerReview> {
  const newRev: CustomerReview = {
    id: `rev-${Date.now()}`,
    productId: data.productId || 'prod-custom',
    productName: data.productName,
    userName: data.userName.trim(),
    rating: data.rating,
    date: new Date().toISOString().split('T')[0],
    comment: data.comment.trim(),
    status: 'Pending', // Requires admin moderation or approval
    verifiedPurchase: true,
  };

  if (isSupabaseConfigured()) {
    try {
      await saveReviewToSupabase(newRev);
    } catch (e) {
      console.error('Supabase submitReview error:', e);
    }
  }

  await dbPut('reviews', newRev);
  return newRev;
}

export async function updateReviewStatus(
  reviewId: string,
  newStatus: 'Approved' | 'Pending' | 'Hidden'
): Promise<void> {
  let rev = await dbGetById<CustomerReview>('reviews', reviewId);
  if (!rev && isSupabaseConfigured()) {
    const all = await fetchReviewsFromSupabase();
    rev = all.find((r) => r.id === reviewId);
  }

  if (rev) {
    rev.status = newStatus;
    if (isSupabaseConfigured()) {
      try {
        await saveReviewToSupabase(rev);
      } catch (e) {
        console.error('Supabase updateReviewStatus error:', e);
      }
    }
    await dbPut('reviews', rev);
  }
}

export async function deleteReview(reviewId: string): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      await deleteReviewFromSupabase(reviewId);
    } catch (e) {
      console.error('Supabase deleteReview error:', e);
    }
  }
  await dbDelete('reviews', reviewId);
}
