import { Product } from '../types/product';
import { dbGetAll, dbGetById, dbPut, dbDelete } from './db';
import { sanitizeProductForCustomer } from './crypto';
import { FilterState } from '../types/filter';

/**
 * Product Service Layer
 * Customer APIs sanitize purchaseCost. Admin APIs maintain full records.
 */

export async function getAllProductsAdmin(): Promise<Product[]> {
  return await dbGetAll<Product>('products');
}

export async function getAllProductsCustomer(filters?: FilterState): Promise<Product[]> {
  const products = await dbGetAll<Product>('products');

  let filtered = products.map((p) => sanitizeProductForCustomer(p));

  if (!filters) return filtered;

  // Filter criteria
  filtered = filtered.filter((product) => {
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      const matchName = product.name.toLowerCase().includes(q);
      const matchBrand = product.brand.toLowerCase().includes(q);
      const matchCat = product.category.toLowerCase().includes(q);
      const matchSku = product.sku.toLowerCase().includes(q);
      if (!matchName && !matchBrand && !matchCat && !matchSku) return false;
    }

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

    if (filters.inStockOnly && !product.inStock) {
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
  const products = await dbGetAll<Product>('products');
  const found = products.find((p) => p.slug === slug);
  return found ? sanitizeProductForCustomer(found) : undefined;
}

export async function saveProductAdmin(product: Product): Promise<Product> {
  return await dbPut<Product>('products', product);
}

export async function deleteProductAdmin(id: string): Promise<boolean> {
  return await dbDelete('products', id);
}
