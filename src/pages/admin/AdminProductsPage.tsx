import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminData } from '../../context/AdminDataContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { StatusBadge } from '../../components/admin/common/StatusBadge';
import { ConfirmModal } from '../../components/admin/common/ConfirmModal';
import { Plus, Search, Edit3, Copy, Trash2, Eye, EyeOff, Star, Filter, RotateCcw } from 'lucide-react';
import { Product } from '../../types/product';

export const AdminProductsPage: React.FC = () => {
  const { products, deleteProduct, duplicateProduct, toggleProductStatus } = useAdminData();
  const { hasPermission } = useAdminAuth();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStockStatus, setSelectedStockStatus] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const canViewPurchaseCost = hasPermission('view_purchase_cost');

  const filtered = products.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.sku.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (selectedCategory && p.categoryId !== selectedCategory) return false;
    if (selectedStockStatus === 'instock' && p.stock <= 0) return false;
    if (selectedStockStatus === 'out' && p.stock > 0) return false;
    return true;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(filtered.map((p) => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    selectedProducts.forEach((id) => deleteProduct(id));
    setSelectedProducts([]);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600">Catalog Management</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-0.5">
            Product Listing ({filtered.length})
          </h1>
        </div>

        <Link
          to="/admin/products/new"
          className="px-5 py-3 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full max-w-md">
          <input
            type="text"
            placeholder="Search products by title, SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:border-brand-500"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 cursor-pointer"
          >
            <option value="">All Categories</option>
            <option value="cat-electronics">Electronics</option>
            <option value="cat-fashion">Fashion</option>
            <option value="cat-shoes">Shoes</option>
            <option value="cat-home">Home & Lifestyle</option>
          </select>

          {/* Stock Filter */}
          <select
            value={selectedStockStatus}
            onChange={(e) => setSelectedStockStatus(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 cursor-pointer"
          >
            <option value="">All Stock Levels</option>
            <option value="instock">In Stock Only</option>
            <option value="out">Out of Stock Only</option>
          </select>

          {/* Bulk Action Button */}
          {selectedProducts.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Selected ({selectedProducts.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50/80 text-gray-400 font-extrabold uppercase border-b border-gray-100">
                <th className="py-3.5 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === filtered.length && filtered.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-600 border-gray-300"
                  />
                </th>
                <th className="py-3.5 px-4">Product Info</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">SKU</th>
                {canViewPurchaseCost && <th className="py-3.5 px-4 text-purple-600">Cost (Confidential)</th>}
                <th className="py-3.5 px-4">Regular Price</th>
                <th className="py-3.5 px-4">Sale Price</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-semibold text-gray-800">
              {filtered.map((prod) => {
                const isSelected = selectedProducts.includes(prod.id);
                // Simulated confidential purchase cost (e.g. 60% of regular price)
                const mockPurchaseCost = Math.round(prod.regularPrice * 0.65);

                return (
                  <tr key={prod.id} className={isSelected ? 'bg-brand-50/30' : 'hover:bg-gray-50/50'}>
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(prod.id)}
                        className="w-4 h-4 rounded text-brand-600 border-gray-300"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img src={prod.images[0]} alt={prod.name} className="w-12 h-12 rounded-xl object-cover bg-gray-50 flex-shrink-0" />
                        <div>
                          <span className="text-[10px] font-bold uppercase text-brand-600">{prod.brand}</span>
                          <div className="font-extrabold text-gray-900 line-clamp-1">{prod.name}</div>
                          <div className="flex gap-1 mt-0.5">
                            {prod.badges.map((b) => (
                              <span key={b} className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-gray-100 text-gray-600">
                                {b}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{prod.category}</td>
                    <td className="py-3 px-4 font-mono text-[11px]">{prod.sku}</td>

                    {canViewPurchaseCost && (
                      <td className="py-3 px-4 font-bold text-purple-700 bg-purple-50/40">
                        Rs. {mockPurchaseCost.toLocaleString()}
                      </td>
                    )}

                    <td className="py-3 px-4">Rs. {prod.regularPrice.toLocaleString()}</td>
                    <td className="py-3 px-4 font-extrabold text-brand-600">
                      {prod.salePrice ? `Rs. ${prod.salePrice.toLocaleString()}` : '-'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-extrabold ${prod.stock <= 5 ? 'text-amber-600' : 'text-gray-900'}`}>
                        {prod.stock} units
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={prod.inStock ? 'In Stock' : 'Out of Stock'} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/admin/products/edit/${prod.id}`}
                          className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                          title="Edit Product"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => duplicateProduct(prod.id)}
                          className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Duplicate Product"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleProductStatus(prod.id)}
                          className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Hide / Unhide Product"
                        >
                          {prod.inStock ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-red-500" />}
                        </button>
                        <button
                          onClick={() => setDeleteTargetId(prod.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteTargetId && (
        <ConfirmModal
          isOpen={!!deleteTargetId}
          onClose={() => setDeleteTargetId(null)}
          onConfirm={() => deleteProduct(deleteTargetId)}
          title="Delete Product"
          message="Are you sure you want to permanently remove this product from the catalog?"
        />
      )}
    </div>
  );
};
