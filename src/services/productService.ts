import { Product } from '../types/product';
import { dbGetAll, dbPut, dbDelete } from './db';
import { sanitizeProductForCustomer } from './crypto';
import { FilterState } from '../types/filter';
import { isSupabaseConfigured } from './supabase';
import {
  fetchProductsFromSupabase,
  saveProductToSupabase,
  deleteProductFromSupabase,
} from './supabaseDb';
import { searchProducts } from '../utils/searchUtils';

/**
 * Product Service Layer
 * Central Online Database is the single source of truth.
 * Browser-local storage is strictly for secondary caching, never for isolated fake persistence.
 */

export async function getAllProductsAdmin(): Promise<Product[]> {
  if (isSupabaseConfigured()) {
    try {
      const cloudProducts = await fetchProductsFromSupabase();
      if (cloudProducts !== null && cloudProducts !== undefined) {
        // Cloud is connected: update local cache to match cloud
        for (const p of cloudProducts) {
          dbPut('products', p).catch(() => {});
        }
        return cloudProducts;
      }
    } catch (e: any) {
      console.error('Supabase getAllProductsAdmin error:', e);
      // Fallback to local cache only if cloud network request failed
      return await dbGetAll<Product>('products');
    }
  }

  // Supabase not configured: returns local cached products
  return await dbGetAll<Product>('products');
}

export async function getAllProductsCustomer(filters?: FilterState): Promise<Product[]> {
  const allProducts = await getAllProductsAdmin();

  // 1. Exclude hidden products from customer store
  let filtered = allProducts
    .filter((p) => !p.isHidden)
    .map((p) => sanitizeProductForCustomer(p));

  // 2. Comprehensive multi-field search and relevance ranking
  if (filters?.searchQuery) {
    filtered = searchProducts(filtered, filters.searchQuery);
  }

  if (!filters) return filtered;

  // 3. Faceted Filter criteria
  filtered = filtered.filter((product) => {
    if (filters.category && product.category.toLowerCase() !== filters.category.toLowerCase()) {
      return false;
    }

    if (filters.subcategory && product.subcategory?.toLowerCase() !== filters.subcategory.toLowerCase()) {
      return false;
    }

    if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
      return false;
    }

    const price = product.salePrice || product.regularPrice;
    if (price < filters.minPrice || price > filters.maxPrice) {
      return false;
    }

    if (filters.inStockOnly && (!product.inStock || product.stock <= 0)) {
      return false;
    }

    if (filters.minRating > 0 && product.rating < filters.minRating) {
      return false;
    }

    return true;
  });

  return filtered;
}

export async function getProductBySlugCustomer(slug: string): Promise<Product | undefined> {
  const products = await getAllProductsAdmin();
  const found = products.find((p) => p.slug === slug && !p.isHidden);
  return found ? sanitizeProductForCustomer(found) : undefined;
}

/**
 * Save product to central database.
 * STRICT ENFORCEMENT:
 * - If Supabase is connected: writes to Supabase first, confirms success, then caches locally.
 * - If Supabase fails: throws an explicit error so no false success is shown.
 * - If Supabase is NOT configured: throws an explicit error to prevent browser-local isolation!
 */
export async function saveProductAdmin(product: Product): Promise<Product> {
  if (isSupabaseConfigured()) {
    try {
      await saveProductToSupabase(product);
      // Cache locally only after cloud write succeeded
      await dbPut<Product>('products', product);
      return product;
    } catch (e: any) {
      console.error('Supabase saveProductAdmin write failed:', e);
      throw new Error(`Central database error: ${e.message || 'Failed to save product to central database.'}`);
    }
  }

  // If central database is not configured: save to local cache but throw error so Admin knows it's not shared!
  await dbPut<Product>('products', product);
  throw new Error(
    'Central Online Database (Supabase) is NOT connected! This product was only saved to this specific browser and will NOT appear on your friend\'s device or customer storefront. Please configure your Supabase Project URL and Anon Key in Settings.'
  );
}

/**
 * Delete product from central database.
 */
export async function deleteProductAdmin(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      await deleteProductFromSupabase(id);
      await dbDelete('products', id);
      return true;
    } catch (e: any) {
      console.error('Supabase deleteProductAdmin failed:', e);
      throw new Error(`Central database error: ${e.message || 'Failed to delete product from central database.'}`);
    }
  }

  await dbDelete('products', id);
  throw new Error(
    'Central Online Database (Supabase) is NOT connected! The product was only removed from this browser.'
  );
}
