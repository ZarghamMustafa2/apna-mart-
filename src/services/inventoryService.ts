import { StockMovement, AdjustmentReason } from '../types/inventory';
import { Product } from '../types/product';
import { dbGetAll, dbGetById, dbPut } from './db';

export async function getInventoryLogs(): Promise<StockMovement[]> {
  return await dbGetAll<StockMovement>('inventory_logs');
}

export async function adjustProductStock(
  productId: string,
  variantId: string | undefined,
  changeQty: number,
  reason: AdjustmentReason,
  adjustedBy: string
): Promise<StockMovement | undefined> {
  const product = await dbGetById<Product>('products', productId);
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

  // Update Product in DB
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

  await dbPut<StockMovement>('inventory_logs', log);
  return log;
}
