import React from 'react';
import { useAdminData } from '../../../context/AdminDataContext';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LowStockAlerts: React.FC = () => {
  const { products } = useAdminData();
  const lowStockItems = products.filter((p) => p.stock <= 5);

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-500" />
          <h3 className="text-base font-extrabold text-gray-900">Low Stock Warnings</h3>
        </div>
        <Link to="/admin/inventory" className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1">
          <span>Manage Stock</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto pr-1">
        {lowStockItems.length > 0 ? (
          lowStockItems.map((prod) => (
            <div key={prod.id} className="py-3 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3 min-w-0">
                <img src={prod.images[0]} alt={prod.name} className="w-10 h-10 rounded-lg object-cover bg-gray-50 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="font-bold text-gray-900 truncate">{prod.name}</div>
                  <div className="text-[11px] text-gray-400">SKU: {prod.sku}</div>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold ${prod.stock === 0 ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                {prod.stock === 0 ? 'Out of Stock' : `${prod.stock} units left`}
              </span>
            </div>
          ))
        ) : (
          <p className="text-xs text-gray-500 py-4 text-center">All inventory levels are healthy!</p>
        )}
      </div>
    </div>
  );
};
