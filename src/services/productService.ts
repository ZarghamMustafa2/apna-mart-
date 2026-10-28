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
 * Customer APIs sanitize purchaseCost and exclude hidden products. Admin APIs maintain full records.
 */

export async function getAllProductsAdmin(): Promise<Product[]> {
  if (isSupabaseConfigured()) {
    try {
      const cloudProducts = await fetchProductsFromSupabase();
      if (cloudProducts && cloudProducts.length > 0) {
        // Cache to local DB
        for (const p of cloudProducts) {
          dbPut('products', p).catch(() => {});
        }
        return cloudProducts;
      } else if (cloudProducts) {
        // Cloud is connected but currently has 0 products:
        // Check if local DB has products to auto-upload so user never loses products
        const localProds = await dbGetAll<Product>('products');
        if (localProds && localProds.length > 0) {
          for (const p of localProds) {
            saveProductToSupabase(p).catch(() => {});
          }
          return localProds;
        }
        return [];
      }
    } catch (e) {
      console.warn('Supabase getAllProductsAdmin fallback to local db:', e);
    }
  }
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

export async function saveProductAdmin(product: Product): Promise<Product> {
  if (isSupabaseConfigured()) {
    try {
      await saveProductToSupabase(product);
    } catch (e) {
      console.error('Supabase saveProductAdmin error:', e);
    }
  }
  return await dbPut<Product>('products', product);
}

export async function deleteProductAdmin(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      await deleteProductFromSupabase(id);
    } catch (e) {
      console.error('Supabase deleteProductAdmin error:', e);
    }
  }
  return await dbDelete('products', id);
}
