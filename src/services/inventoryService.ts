import { StockMovement, AdjustmentReason } from '../types/inventory';
import { Product } from '../types/product';
import { dbGetAll, dbGetById, dbPut } from './db';
import { isSupabaseConfigured } from './supabase';
import {
  fetchInventoryLogsFromSupabase,
  saveInventoryLogToSupabase,
  saveProductToSupabase,
  fetchProductsFromSupabase,
} from './supabaseDb';

export async function getInventoryLogs(): Promise<StockMovement[]> {
  if (isSupabaseConfigured()) {
    try {
      const cloud = await fetchInventoryLogsFromSupabase();
      if (cloud && cloud.length > 0) {
        for (const log of cloud) {
          dbPut('inventory_logs', log).catch(() => {});
        }
        return cloud;
      }
    } catch (e) {
      console.warn('Supabase getInventoryLogs fallback:', e);
    }
  }
  return await dbGetAll<StockMovement>('inventory_logs');
}

export async function adjustProductStock(
  productId: string,
  variantId: string | undefined,
  changeQty: number,
  reason: AdjustmentReason,
  adjustedBy: string
): Promise<StockMovement | undefined> {
  let product = await dbGetById<Product>('products', productId);
  if (!product && isSupabaseConfigured()) {
    try {
      const all = await fetchProductsFromSupabase();
      product = all.find((p) => p.id === productId);
    } catch (e) {
      // ignore
    }
  }

  if (!product) return undefined;

  let previousStock = product.stock;
  let newStock = Math.max(0, previousStock + changeQty);
  let variantName = '';

  if (variantId && product.variants) {
    const v = product.variants.find((item) => item.id === variantId);
    if (v) {
      previousStock = v.stock;
      newStock = Math.max(0, previousStock + changeQty);
      variantName = v.name;
      v.stock = newStock;
    }
  } else {
    product.stock = newStock;
    product.inStock = newStock > 0;
  }

  // Update Product in Supabase and local DB
  if (isSupabaseConfigured()) {
    try {
      await saveProductToSupabase(product);
    } catch (e) {
      console.error('Supabase adjustProductStock error:', e);
    }
  }
  await dbPut<Product>('products', product);

  // Record Stock Movement Log
  const log: StockMovement = {
    id: `mov-${Date.now()}`,
    productId,
    productName: product.name,
    variantId,
    variantName,
    previousStock,
    newStock,
    quantityChanged: Math.abs(changeQty),
    changeType: changeQty >= 0 ? 'Increase' : 'Decrease',
    reason,
    adjustedBy,
    timestamp: new Date().toLocaleString(),
  };

  if (isSupabaseConfigured()) {
    try {
      await saveInventoryLogToSupabase(log);
    } catch (e) {
      console.error('Supabase saveInventoryLog error:', e);
    }
  }

  await dbPut<StockMovement>('inventory_logs', log);
  return log;
}
