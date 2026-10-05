import React, { useState } from 'react';
import { useAdminData } from '../../context/AdminDataContext';
import { Coupon } from '../../types/cart';
import { Tag, Plus, Trash2, Check, AlertCircle } from 'lucide-react';

export const AdminCouponsPage: React.FC = () => {
  const { coupons, addCoupon, deleteCoupon } = useAdminData();
  const [showAddModal, setShowAddModal] = useState(false);

  const [code, setCode] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState<number | undefined>(10);
  const [discountAmount, setDiscountAmount] = useState<number | undefined>(undefined);
  const [minSpend, setMinSpend] = useState(2000);
  const [description, setDescription] = useState('');

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      addCoupon({
        code: code.trim().toUpperCase(),
        discountPercentage: discountPercentage || undefined,
        discountAmount: discountAmount || undefined,
        minSpend,
        description: description || `Discount promo code ${code.toUpperCase()}`,
      });
      setShowAddModal(false);
      setCode('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600">Promotions</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-0.5">
            Coupons & Discounts Management ({coupons.length})
          </h1>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-3 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon Code</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {coupons.map((coupon) => (
          <div key={coupon.code} className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-4 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-brand-600" />
                <span className="font-extrabold text-lg text-gray-900 font-mono tracking-wider">{coupon.code}</span>
              </div>
              <button
                onClick={() => deleteCoupon(coupon.code)}
                className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-brand-50/50 rounded-2xl border border-brand-100 text-xs font-bold text-brand-900">
              {coupon.discountPercentage ? `${coupon.discountPercentage}% OFF` : `Flat Rs. ${coupon.discountAmount} OFF`}
            </div>

            <p className="text-xs text-gray-500">{coupon.description}</p>

            <div className="text-[11px] font-semibold text-gray-400 border-t border-gray-100 pt-2">
              Min Spend: <strong>Rs. {(coupon.minSpend || 0).toLocaleString()}</strong>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 space-y-4">
            <h3 className="text-lg font-extrabold text-gray-900 border-b border-gray-100 pb-3">
              Create New Coupon Code
            </h3>

            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FLASH20"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-bold uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Discount Percentage (%)</label>
                <input
                  type="number"
                  placeholder="10"
                  value={discountPercentage || ''}
                  onChange={(e) => setDiscountPercentage(Number(e.target.value) || undefined)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Min Spend Required (Rs.)</label>
                <input
                  type="number"
                  value={minSpend}
                  onChange={(e) => setMinSpend(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Description</label>
                <input
                  type="text"
                  placeholder="e.g. 10% discount on first purchase"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 py-3 bg-brand-600 text-white font-extrabold text-xs rounded-xl shadow-md">
                  Create Coupon
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="py-3 px-5 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
