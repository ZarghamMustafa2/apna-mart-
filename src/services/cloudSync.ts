import { isSupabaseConfigured } from './supabase';
import {
  fetchProductsFromSupabase,
  saveProductToSupabase,
  fetchCategoriesFromSupabase,
  saveCategoryToSupabase,
  fetchCouponsFromSupabase,
  saveCouponToSupabase,
  fetchCmsFromSupabase,
  saveCmsToSupabase,
  fetchSettingsFromSupabase,
  saveSettingsToSupabase,
  fetchReviewsFromSupabase,
  saveReviewToSupabase,
  fetchOrdersFromSupabase,
  saveOrderToSupabase,
} from './supabaseDb';
import {
  getAllProductsAdmin,
  getCategories,
  getCoupons,
  getHeroSlides,
  getPromoBanners,
  getHomepageSections,
  getStoreSettings,
  getReviews,
  getOrders,
  dbPut,
} from './apiServices';

export interface SyncStatus {
  inProgress: boolean;
  totalSynced: number;
  message: string;
  error?: string;
}

/**
 * Migrates all local data (Products, Categories, Banners, CMS, Coupons, Settings, Reviews, Orders)
 * from the client into Supabase Cloud Database.
 */
export async function syncLocalDataToCloud(
  onProgress?: (status: SyncStatus) => void
): Promise<{ success: boolean; message: string; count: number }> {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      message: 'Supabase is not configured. Please enter your project URL and Anon Key first.',
      count: 0,
    };
  }

  let syncedCount = 0;

  try {
    // 1. Settings
    onProgress?.({ inProgress: true, totalSynced: syncedCount, message: 'Syncing Store Settings to Cloud...' });
    const localSettings = await getStoreSettings();
    if (localSettings) {
      await saveSettingsToSupabase(localSettings);
      syncedCount++;
    }

    // 2. Categories
    onProgress?.({ inProgress: true, totalSynced: syncedCount, message: 'Syncing Categories to Cloud...' });
    const localCategories = await getCategories();
    for (const cat of localCategories) {
      await saveCategoryToSupabase(cat);
      syncedCount++;
    }

    // 3. Products
    onProgress?.({ inProgress: true, totalSynced: syncedCount, message: 'Syncing Products to Cloud...' });
    const localProducts = await getAllProductsAdmin();
    for (const prod of localProducts) {
      await saveProductToSupabase(prod);
      syncedCount++;
    }

    // 4. Coupons
    onProgress?.({ inProgress: true, totalSynced: syncedCount, message: 'Syncing Coupons to Cloud...' });
    const localCoupons = await getCoupons();
    for (const cpn of localCoupons) {
      await saveCouponToSupabase(cpn);
      syncedCount++;
    }

    // 5. CMS Hero Slides, Promo Banners & Sections
    onProgress?.({ inProgress: true, totalSynced: syncedCount, message: 'Syncing Homepage CMS to Cloud...' });
    const heroSlides = await getHeroSlides();
    if (heroSlides && heroSlides.length > 0) {
      await saveCmsToSupabase('hero_slides', heroSlides);
      syncedCount++;
    }
    const promoBanners = await getPromoBanners();
    if (promoBanners && promoBanners.length > 0) {
      await saveCmsToSupabase('promo_banners', promoBanners);
      syncedCount++;
    }
    const homepageSections = await getHomepageSections();
    if (homepageSections) {
      await saveCmsToSupabase('homepage_sections', homepageSections);
      syncedCount++;
    }

    // 6. Reviews
    onProgress?.({ inProgress: true, totalSynced: syncedCount, message: 'Syncing Customer Reviews to Cloud...' });
    const localReviews = await getReviews();
    for (const rev of localReviews) {
      await saveReviewToSupabase(rev);
      syncedCount++;
    }

    // 7. Orders
    onProgress?.({ inProgress: true, totalSynced: syncedCount, message: 'Syncing Orders to Cloud...' });
    const localOrders = await getOrders();
    for (const ord of localOrders) {
      await saveOrderToSupabase(ord);
      syncedCount++;
    }

    onProgress?.({ inProgress: false, totalSynced: syncedCount, message: 'Sync complete!' });
    return {
      success: true,
      message: `Successfully synchronized ${syncedCount} records to Supabase Cloud Database!`,
      count: syncedCount,
    };
  } catch (err: any) {
    console.error('Data sync failed:', err);
    onProgress?.({
      inProgress: false,
      totalSynced: syncedCount,
      message: 'Sync failed.',
      error: err?.message || 'Database error',
    });
    return {
      success: false,
      message: `Sync failed: ${err?.message || 'Check database schema and table permissions.'}`,
      count: syncedCount,
    };
  }
}

/**
 * Pulls latest records from Supabase into local IndexedDB cache for offline resilience.
 */
export async function syncCloudDataToLocal(): Promise<void> {
  if (!isSupabaseConfigured()) return;

  try {
    const cloudProducts = await fetchProductsFromSupabase();
    for (const p of cloudProducts) {
      await dbPut('products', p);
    }

    const cloudCategories = await fetchCategoriesFromSupabase();
    for (const c of cloudCategories) {
      await dbPut('categories', c);
    }

    const cloudOrders = await fetchOrdersFromSupabase();
    for (const o of cloudOrders) {
      await dbPut('orders', o);
    }

    const cloudReviews = await fetchReviewsFromSupabase();
    for (const r of cloudReviews) {
      await dbPut('reviews', r);
    }

    const cloudSettings = await fetchSettingsFromSupabase();
    if (cloudSettings) {
      await dbPut('settings', cloudSettings);
    }
  } catch (e) {
    console.warn('Background local cache sync skipped:', e);
  }
}
