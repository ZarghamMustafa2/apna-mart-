export type AdjustmentReason =
  | 'Restock / New Shipment'
  | 'Damaged Goods'
  | 'Customer Return'
  | 'Manual Audit Correction'
  | 'Sales Discrepancy'
  | 'Initial Stock Input';

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  variantId?: string;
  variantName?: string;
  previousStock: number;
  newStock: number;
  quantityChanged: number;
  changeType: 'Increase' | 'Decrease';
  reason: AdjustmentReason;
  adjustedBy: string;
  timestamp: string;
  notes?: string;
}
