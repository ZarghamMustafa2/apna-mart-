import React, { useState } from 'react';
import { Modal } from '../../common/Modal';
import { AdjustmentReason } from '../../../types/inventory';
import { useAdminData } from '../../../context/AdminDataContext';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { Boxes } from 'lucide-react';

interface StockAdjustModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  currentStock: number;
  variantId?: string;
  variantName?: string;
}

export const StockAdjustModal: React.FC<StockAdjustModalProps> = ({
  isOpen,
  onClose,
  productId,
  productName,
  currentStock,
  variantId,
  variantName,
}) => {
  const { adjustStock } = useAdminData();
  const { adminUser } = useAdminAuth();

  const [adjustmentType, setAdjustmentType] = useState<'add' | 'subtract'>('add');
  const [quantity, setQuantity] = useState<number>(5);
  const [reason, setReason] = useState<AdjustmentReason>('Restock / New Shipment');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qtyChange = adjustmentType === 'add' ? quantity : -quantity;
    adjustStock(productId, variantId, qtyChange, reason, adminUser?.name || 'Admin');
    onClose();
  };

  const reasons: AdjustmentReason[] = [
    'Restock / New Shipment',
    'Damaged Goods',
    'Customer Return',
    'Manual Audit Correction',
    'Sales Discrepancy',
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Stock Adjustment Audit" maxWidth="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 text-xs">
          <div className="font-bold text-gray-900">{productName}</div>
          {variantName && <div className="text-brand-600 font-semibold">Variant: {variantName}</div>}
          <div className="text-gray-500 mt-1">
            Current Stock Level: <strong className="text-gray-900">{currentStock} Units</strong>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setAdjustmentType('add')}
            className={`py-2.5 rounded-xl text-xs font-bold transition-all border ${
              adjustmentType === 'add'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                : 'bg-gray-50 text-gray-700 border-gray-200'
            }`}
          >
            + Add Stock (Restock)
          </button>
          <button
            type="button"
            onClick={() => setAdjustmentType('subtract')}
            className={`py-2.5 rounded-xl text-xs font-bold transition-all border ${
              adjustmentType === 'subtract'
                ? 'bg-red-600 text-white border-red-600 shadow-md'
                : 'bg-gray-50 text-gray-700 border-gray-200'
            }`}
          >
            - Deduct Stock (Damage/Audit)
          </button>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
            Quantity Adjustment *
          </label>
          <input
            type="number"
            min={1}
            required
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-extrabold focus:outline-none focus:border-brand-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
            Mandatory Adjustment Reason *
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value as AdjustmentReason)}
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:border-brand-500 cursor-pointer"
          >
            {reasons.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-colors"
          >
            Confirm & Log Stock Adjustment
          </button>
        </div>
      </form>
    </Modal>
  );
};
