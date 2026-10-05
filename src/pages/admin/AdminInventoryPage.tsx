import React, { useState } from 'react';
import { useAdminData } from '../../context/AdminDataContext';
import { StockAdjustModal } from '../../components/admin/inventory/StockAdjustModal';
import { StatusBadge } from '../../components/admin/common/StatusBadge';
import { Boxes, Plus, Minus, History, Search } from 'lucide-react';

export const AdminInventoryPage: React.FC = () => {
  const { products, stockMovements } = useAdminData();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'inventory' | 'history'>('inventory');

  const [selectedAdjustProduct, setSelectedAdjustProduct] = useState<{
    id: string;
    name: string;
    stock: number;
    variantId?: string;
    variantName?: string;
  } | null>(null);

  const filteredProducts = products.filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600">Stock Control</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-0.5">
            Inventory & Stock Movement Audit
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'inventory' ? 'bg-brand-600 text-white shadow-md' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Inventory Stock Levels
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
              activeTab === 'history' ? 'bg-brand-600 text-white shadow-md' : 'bg-gray-100 text-gray-700'
            }`}
          >
            <History className="w-4 h-4" />
            Audit History Log ({stockMovements.length})
          </button>
        </div>
      </div>

      {activeTab === 'inventory' && (
        <div className="space-y-4">
          {/* Search */}
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search inventory by title or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-500 shadow-sm"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>

          {/* Table */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-gray-50/80 text-gray-400 font-extrabold uppercase border-b border-gray-100">
                    <th className="py-3.5 px-4">Product Details</th>
                    <th className="py-3.5 px-4">SKU</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Current Stock</th>
                    <th className="py-3.5 px-4">Stock Status</th>
                    <th className="py-3.5 px-4 text-right">Quick Stock Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-semibold text-gray-800">
                  {filteredProducts.map((prod) => (
                    <React.Fragment key={prod.id}>
                      <tr className="hover:bg-gray-50/50">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img src={prod.images[0]} alt={prod.name} className="w-10 h-10 rounded-xl object-cover bg-gray-50 flex-shrink-0" />
                            <div>
                              <div className="font-extrabold text-gray-900">{prod.name}</div>
                              {prod.hasVariants && (
                                <span className="text-[10px] text-brand-600 font-bold">
                                  {prod.variants?.length} Variant Combinations
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px]">{prod.sku}</td>
                        <td className="py-3.5 px-4 text-gray-600">{prod.category}</td>
                        <td className="py-3.5 px-4">
                          <span className={`font-extrabold text-sm ${prod.stock <= 5 ? 'text-amber-600' : 'text-gray-900'}`}>
                            {prod.stock} units
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <StatusBadge status={prod.stock > 0 ? 'In Stock' : 'Out of Stock'} />
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() =>
                              setSelectedAdjustProduct({
                                id: prod.id,
                                name: prod.name,
                                stock: prod.stock,
                              })
                            }
                            className="px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 font-extrabold text-xs rounded-xl transition-colors"
                          >
                            Adjust Stock
                          </button>
                        </td>
                      </tr>

                      {/* Render Variants rows if available */}
                      {prod.hasVariants &&
                        prod.variants?.map((varItem) => (
                          <tr key={varItem.id} className="bg-gray-50/40 text-xs">
                            <td className="py-2 px-4 pl-12 font-bold text-gray-700">
                              ↳ Variant: {varItem.name}
                            </td>
                            <td className="py-2 px-4 font-mono text-[11px] text-gray-500">{varItem.sku}</td>
                            <td className="py-2 px-4 text-gray-400">-</td>
                            <td className="py-2 px-4 font-extrabold text-gray-900">{varItem.stock} units</td>
                            <td className="py-2 px-4">
                              <StatusBadge status={varItem.stock > 0 ? 'In Stock' : 'Out of Stock'} size="sm" />
                            </td>
                            <td className="py-2 px-4 text-right">
                              <button
                                onClick={() =>
                                  setSelectedAdjustProduct({
                                    id: prod.id,
                                    name: prod.name,
                                    stock: varItem.stock,
                                    variantId: varItem.id,
                                    variantName: varItem.name,
                                  })
                                }
                                className="px-2.5 py-1 bg-white border border-gray-200 hover:bg-gray-100 text-gray-800 font-bold text-[11px] rounded-lg"
                              >
                                Adjust Variant
                              </button>
                            </td>
                          </tr>
                        ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h3 className="text-base font-extrabold text-gray-900 border-b border-gray-100 pb-3">
            Stock Adjustment History & Audit Log
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-gray-400 font-extrabold uppercase border-b border-gray-100">
                  <th className="pb-3 px-2">Timestamp</th>
                  <th className="pb-3 px-2">Product / Variant</th>
                  <th className="pb-3 px-2">Type</th>
                  <th className="pb-3 px-2">Qty Changed</th>
                  <th className="pb-3 px-2">Stock Transition</th>
                  <th className="pb-3 px-2">Reason</th>
                  <th className="pb-3 px-2">Adjusted By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-semibold text-gray-800">
                {stockMovements.map((mov) => (
                  <tr key={mov.id}>
                    <td className="py-3 px-2 text-gray-400">{mov.timestamp}</td>
                    <td className="py-3 px-2">
                      <div className="font-bold text-gray-900">{mov.productName}</div>
                      {mov.variantName && <div className="text-brand-600 text-[11px]">{mov.variantName}</div>}
                    </td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${mov.changeType === 'Increase' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                        {mov.changeType}
                      </span>
                    </td>
                    <td className="py-3 px-2 font-extrabold">{mov.changeType === 'Increase' ? `+${mov.quantityChanged}` : `-${mov.quantityChanged}`}</td>
                    <td className="py-3 px-2 text-gray-500">
                      {mov.previousStock} → <strong className="text-gray-900">{mov.newStock}</strong>
                    </td>
                    <td className="py-3 px-2 font-bold text-gray-700">{mov.reason}</td>
                    <td className="py-3 px-2 text-brand-600 font-bold">{mov.adjustedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Adjust Modal */}
      {selectedAdjustProduct && (
        <StockAdjustModal
          isOpen={!!selectedAdjustProduct}
          onClose={() => setSelectedAdjustProduct(null)}
          productId={selectedAdjustProduct.id}
          productName={selectedAdjustProduct.name}
          currentStock={selectedAdjustProduct.stock}
          variantId={selectedAdjustProduct.variantId}
          variantName={selectedAdjustProduct.variantName}
        />
      )}
    </div>
  );
};
