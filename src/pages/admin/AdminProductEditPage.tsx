import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAdminData } from '../../context/AdminDataContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { VariantManager } from '../../components/admin/products/VariantManager';
import { MultiImageUploader } from '../../components/common/MultiImageUploader';
import { Product, ProductVariant, ProductBadge } from '../../types/product';
import { ArrowLeft, Save, Plus, Trash2, Image, Sparkles } from 'lucide-react';

export const AdminProductEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { products, addProduct, updateProduct, categories } = useAdminData();
  const { hasPermission } = useAdminAuth();

  const canViewPurchaseCost = hasPermission('view_purchase_cost');

  const existing = isEditing ? products.find((p) => p.id === id) : undefined;

  // Form State
  const [name, setName] = useState(existing?.name || '');
  const [brand, setBrand] = useState(existing?.brand || 'ApexTech');
  const [sku, setSku] = useState(existing?.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`);
  const [categoryId, setCategoryId] = useState(existing?.categoryId || 'cat-electronics');
  const [shortDesc, setShortDesc] = useState(existing?.shortDescription || '');
  const [desc, setDesc] = useState(existing?.description || '');
  const [purchaseCost, setPurchaseCost] = useState(12000);
  const [regularPrice, setRegularPrice] = useState(existing?.regularPrice || 18500);
  const [salePrice, setSalePrice] = useState<number | undefined>(existing?.salePrice || 14999);
  const [stock, setStock] = useState(existing?.stock || 25);
  const [badges, setBadges] = useState<ProductBadge[]>(existing?.badges || ['New']);
  const [images, setImages] = useState<string[]>(existing?.images || [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80',
  ]);
  const [hasVariants, setHasVariants] = useState(existing?.hasVariants || false);
  const [variants, setVariants] = useState<ProductVariant[]>(existing?.variants || []);

  const calculatedDiscount = salePrice && salePrice < regularPrice
    ? Math.round(((regularPrice - salePrice) / regularPrice) * 100)
    : 0;

  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError('Product title cannot be empty.');
      return;
    }
    if (regularPrice < 0 || (salePrice !== undefined && salePrice < 0)) {
      setFormError('Product price cannot be negative.');
      return;
    }
    if (stock < 0) {
      setFormError('Stock quantity cannot be negative.');
      return;
    }

    const selectedCategory = categories.find((c) => c.id === categoryId) || categories[0];

    const payload = {
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name,
      brand,
      sku,
      category: selectedCategory.name,
      categoryId: selectedCategory.id,
      shortDescription: shortDesc,
      description: desc,
      regularPrice,
      salePrice,
      stock,
      inStock: stock > 0,
      rating: existing?.rating || 4.8,
      reviewCount: existing?.reviewCount || 12,
      badges,
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'],
      hasVariants,
      variants: hasVariants ? variants : undefined,
      specifications: existing?.specifications || [
        {
          groupName: 'General Specs',
          items: [{ name: 'Brand', value: brand }, { name: 'Warranty', value: '1 Year Brand Warranty' }],
        },
      ],
    };

    if (isEditing && id) {
      updateProduct(id, payload);
    } else {
      addProduct(payload as any);
    }

    navigate('/admin/products');
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div className="flex items-center gap-3">
          <Link to="/admin/products" className="p-2 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600">Product Management</span>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              {isEditing ? `Edit Product: ${name}` : 'Create New Product'}
            </h1>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-105"
        >
          <Save className="w-4 h-4" />
          <span>Save Product Changes</span>
        </button>
      </div>

      {formError && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-2xl flex items-center gap-2">
          <span>⚠️ {formError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Columns: Main Details & Variants */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h3 className="text-base font-extrabold text-gray-900 border-b border-gray-100 pb-3">Basic Information</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. UltraSound Pro Wireless Headphones"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Brand</label>
                  <input
                    type="text"
                    required
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Category</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">SKU Code</label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Full Description</label>
                <textarea
                  rows={5}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Pricing & Stock Section */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h3 className="text-base font-extrabold text-gray-900 border-b border-gray-100 pb-3">Pricing & Inventory</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {canViewPurchaseCost && (
                <div className="p-3 bg-purple-50/50 rounded-2xl border border-purple-100">
                  <label className="block text-[11px] font-bold text-purple-700 uppercase mb-1">Purchase Cost (Admin)</label>
                  <input
                    type="number"
                    value={purchaseCost}
                    onChange={(e) => setPurchaseCost(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-white border border-purple-200 rounded-xl text-xs font-bold text-purple-900"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Regular Price *</label>
                <input
                  type="number"
                  required
                  value={regularPrice}
                  onChange={(e) => setRegularPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Sale Price</label>
                <input
                  type="number"
                  value={salePrice || ''}
                  onChange={(e) => setSalePrice(Number(e.target.value) || undefined)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Stock Qty *</label>
                <input
                  type="number"
                  required
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-brand-600"
                />
              </div>
            </div>

            {calculatedDiscount > 0 && (
              <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-2xl flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Calculated Sale Discount: {calculatedDiscount}% OFF</span>
              </div>
            )}
          </div>

          {/* Variants Toggle & Manager */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white rounded-3xl border border-gray-100">
              <span className="font-extrabold text-sm text-gray-900">Enable Product Variants (Size, Color, RAM, Storage)</span>
              <input
                type="checkbox"
                checked={hasVariants}
                onChange={(e) => setHasVariants(e.target.checked)}
                className="w-5 h-5 rounded text-brand-600 border-gray-300 cursor-pointer"
              />
            </div>

            {hasVariants && <VariantManager variants={variants} onChange={setVariants} />}
          </div>
        </div>

        {/* Right Sidebar: Media & Badges */}
        <div className="space-y-6">
          {/* Media Manager */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h3 className="text-base font-extrabold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <Image className="w-4 h-4 text-brand-600" />
              Product Media Gallery
            </h3>

            <MultiImageUploader
              images={images}
              onChange={setImages}
              maxImages={10}
            />
          </div>

          {/* Badges */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-3">
            <h3 className="text-base font-extrabold text-gray-900 border-b border-gray-100 pb-3">Product Badges</h3>
            <div className="space-y-2">
              {(['New', 'Sale', 'Best Seller', 'Featured', 'Trending'] as ProductBadge[]).map((badge) => {
                const isSelected = badges.includes(badge);
                return (
                  <label key={badge} className="flex items-center justify-between text-xs font-bold text-gray-800 cursor-pointer">
                    <span>{badge}</span>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {
                        setBadges(
                          isSelected ? badges.filter((b) => b !== badge) : [...badges, badge]
                        );
                      }}
                      className="w-4 h-4 rounded text-brand-600 border-gray-300"
                    />
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
