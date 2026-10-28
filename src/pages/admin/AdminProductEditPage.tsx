import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAdminData } from '../../context/AdminDataContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { VariantManager } from '../../components/admin/products/VariantManager';
import { MultiImageUploader } from '../../components/common/MultiImageUploader';
import { ConfirmModal } from '../../components/admin/common/ConfirmModal';
import { Product, ProductVariant, ProductBadge } from '../../types/product';
import {
  ArrowLeft,
  Save,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Sliders,
  Check,
  AlertCircle,
  Trash2,
  Eye,
  EyeOff,
} from 'lucide-react';

export const AdminProductEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { products, addProduct, updateProduct, deleteProduct, categories } = useAdminData();
  const { hasPermission } = useAdminAuth();

  const canViewPurchaseCost = hasPermission('view_purchase_cost');
  const canManageProducts = hasPermission('manage_products');
  const existing = isEditing ? products.find((p) => p.id === id) : undefined;

  // 1. PRIMARY EASY FIELDS (Initially visible)
  const [name, setName] = useState(existing?.name || '');
  const [regularPrice, setRegularPrice] = useState<number>(existing?.regularPrice || 0);
  const [salePrice, setSalePrice] = useState<number | undefined>(existing?.salePrice || undefined);
  const [categoryId, setCategoryId] = useState(existing?.categoryId || categories[0]?.id || 'cat-electronics');
  const [stock, setStock] = useState<number>(existing?.stock ?? 10);
  const [desc, setDesc] = useState(existing?.description || '');
  const [images, setImages] = useState<string[]>(existing?.images || []);
  const [isHidden, setIsHidden] = useState<boolean>(existing?.isHidden || false);

  // 2. ADVANCED OPTIONS (Collapsed by default)
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [brand, setBrand] = useState(existing?.brand || 'ApnaMart');
  const [sku, setSku] = useState(existing?.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`);
  const [shortDesc, setShortDesc] = useState(existing?.shortDescription || '');
  const [videoUrl, setVideoUrl] = useState(existing?.videoUrl || '');
  const [purchaseCost, setPurchaseCost] = useState(12000);
  const [badges, setBadges] = useState<ProductBadge[]>(existing?.badges || ['New']);
  const [hasVariants, setHasVariants] = useState(existing?.hasVariants || false);
  const [variants, setVariants] = useState<ProductVariant[]>(existing?.variants || []);

  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Sync state when existing product finishes loading from IndexedDB / cloud
  useEffect(() => {
    if (existing) {
      setName(existing.name || '');
      setRegularPrice(existing.regularPrice || 0);
      setSalePrice(existing.salePrice);
      setCategoryId(existing.categoryId || categories[0]?.id || 'cat-electronics');
      setStock(existing.stock ?? 10);
      setDesc(existing.description || '');
      setImages(existing.images && existing.images.length > 0 ? existing.images : []);
      setIsHidden(Boolean(existing.isHidden));
      setBrand(existing.brand || 'ApnaMart');
      setSku(existing.sku || '');
      setShortDesc(existing.shortDescription || '');
      setVideoUrl(existing.videoUrl || '');
      setBadges(existing.badges || ['New']);
      setHasVariants(existing.hasVariants || false);
      setVariants(existing.variants || []);
    }
  }, [existing, categories]);

  // Discount calculation
  const calculatedDiscount =
    salePrice && regularPrice && salePrice < regularPrice
      ? Math.round(((regularPrice - salePrice) / regularPrice) * 100)
      : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError('Please enter a Product Name.');
      return;
    }
    if (regularPrice <= 0) {
      setFormError('Please enter a valid Price greater than 0.');
      return;
    }
    if (stock < 0) {
      setFormError('Stock quantity cannot be less than 0.');
      return;
    }

    const selectedCategory = categories.find((c) => c.id === categoryId) || categories[0] || { id: 'cat-electronics', name: 'Electronics' };

    const finalImages =
      images.length > 0
        ? images
        : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'];

    const payload = {
      slug: existing?.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: name.trim(),
      brand: brand.trim() || 'ApnaMart',
      sku: sku.trim() || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      category: selectedCategory.name,
      categoryId: selectedCategory.id,
      shortDescription: shortDesc || name.slice(0, 100),
      description: desc || name,
      regularPrice: Number(regularPrice),
      salePrice: salePrice ? Number(salePrice) : undefined,
      stock: Number(stock),
      inStock: Number(stock) > 0,
      rating: existing?.rating || 5.0,
      reviewCount: existing?.reviewCount || 1,
      badges,
      images: finalImages,
      videoUrl: videoUrl || undefined,
      hasVariants,
      variants: hasVariants ? variants : undefined,
      isHidden: Boolean(isHidden),
      specifications: existing?.specifications || [
        {
          groupName: 'General Specs',
          items: [{ name: 'Brand', value: brand || 'ApnaMart' }, { name: 'Warranty', value: '1 Year Warranty' }],
        },
      ],
    };

    try {
      setIsSaving(true);
      if (isEditing && id) {
        await updateProduct(id, payload);
      } else {
        await addProduct(payload as any);
      }
      navigate('/admin/products');
    } catch (err: any) {
      setFormError(err.message || 'Failed to save product. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="p-2.5 rounded-2xl bg-white border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            title="Back to products list"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600">
              Product Catalog
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-0.5">
              {isEditing ? `Edit Product: ${name || 'Item'}` : 'Add New Product'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-8 py-3.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-105"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Product'}</span>
          </button>
        </div>
      </div>

      {formError && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-bold rounded-2xl flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
          <span>{formError}</span>
        </div>
      )}

      {/* Main Form Container */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ============================================================== */}
        {/* 1. SIMPLE MAIN SECTION (The primary fields shown initially)    */}
        {/* ============================================================== */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="text-base sm:text-lg font-extrabold text-gray-900">
              Basic Product Details
            </h2>
            <p className="text-xs text-gray-500 font-medium">
              Fill in these simple details to put your product up for sale.
            </p>
          </div>

          {/* 1. Product Name */}
          <div>
            <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
              Product Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. UltraSound Pro Wireless Headphones"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold focus:bg-white focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>

          {/* 2. Category, Price, and Discount Price */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Category Dropdown */}
            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                Category *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs sm:text-sm font-bold text-gray-800 cursor-pointer focus:bg-white focus:outline-none focus:border-brand-500"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                Price (Rs.) *
              </label>
              <input
                type="number"
                required
                min="1"
                placeholder="e.g. 3500"
                value={regularPrice || ''}
                onChange={(e) => setRegularPrice(Number(e.target.value))}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-gray-900 focus:bg-white focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* Discount / Sale Price */}
            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                Discount Price (Optional)
              </label>
              <input
                type="number"
                min="0"
                placeholder="e.g. 2999"
                value={salePrice || ''}
                onChange={(e) => setSalePrice(Number(e.target.value) || undefined)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-emerald-600 focus:bg-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {calculatedDiscount > 0 && (
            <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-2xl flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Special Offer: Customer gets {calculatedDiscount}% OFF!</span>
            </div>
          )}

          {/* 3. Stock Quantity */}
          <div>
            <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
              Available Stock (Quantity) *
            </label>
            <input
              type="number"
              required
              min="0"
              placeholder="e.g. 25"
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              className="w-full sm:w-48 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-brand-600 focus:bg-white focus:outline-none focus:border-brand-500"
            />
            <span className="text-[11px] text-gray-400 block mt-1">
              How many units do you have in stock to sell? Zero stock will mark the item as Out of Stock.
            </span>
          </div>

          {/* Product Visibility Status (Active / Hidden) */}
          <div className="pt-2 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-0.5">
                Store Visibility Status
              </label>
              <p className="text-xs text-gray-500">
                Choose whether this product is active for customers to search and purchase.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsHidden(false)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                  !isHidden
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>Active (Visible in Store)</span>
              </button>
              <button
                type="button"
                onClick={() => setIsHidden(true)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                  isHidden
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <EyeOff className="w-4 h-4" />
                <span>Inactive (Hidden)</span>
              </button>
            </div>
          </div>

          {/* 4. Product Images (Direct Upload) */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
                Product Images *
              </label>
              <p className="text-xs text-gray-500">
                Upload photos directly. The first photo is the main product picture.
              </p>
            </div>

            <MultiImageUploader
              images={images}
              onChange={setImages}
              maxImages={8}
            />
          </div>

          {/* 5. Product Description */}
          <div className="pt-2 border-t border-gray-100">
            <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
              Product Description
            </label>
            <textarea
              rows={4}
              placeholder="Describe the product features, specifications, and what is included in the package..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:border-brand-500 leading-relaxed"
            />
          </div>
        </div>

        {/* ============================================================== */}
        {/* 2. ADVANCED OPTIONS (Collapsed by default)                      */}
        {/* ============================================================== */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full p-5 sm:p-6 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gray-100 text-gray-700 flex items-center justify-center flex-shrink-0">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-sm sm:text-base text-gray-900 block">
                  Advanced Options (Variants, Brand, SKU, Badges)
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  Click to {showAdvanced ? 'hide' : 'open'} advanced fields like sizes, colors, and SKU codes.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold text-brand-600 bg-brand-50 px-3 py-1.5 rounded-xl">
              <span>{showAdvanced ? 'Collapse' : 'Expand'}</span>
              {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {showAdvanced && (
            <div className="p-6 sm:p-8 border-t border-gray-100 space-y-6 bg-gray-50/40">
              {/* Brand and SKU */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Samsung, Apple, Nike"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    SKU Code (Stock Keeping Unit)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. APNA-EL-4091"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-mono font-bold"
                  />
                </div>
              </div>

              {/* Short Summary & Video */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Short Summary (1-2 sentences)
                  </label>
                  <input
                    type="text"
                    placeholder="Brief 1-sentence highlight for search results and previews"
                    value={shortDesc}
                    onChange={(e) => setShortDesc(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Product Video URL (YouTube embed or MP4)
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm"
                  />
                </div>
              </div>

              {/* Badges */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Highlight Badges
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['New', 'Sale', 'Best Seller', 'Featured', 'Trending'] as ProductBadge[]).map((badge) => {
                    const isSelected = badges.includes(badge);
                    return (
                      <button
                        type="button"
                        key={badge}
                        onClick={() => {
                          setBadges((prev) =>
                            isSelected ? prev.filter((b) => b !== badge) : [...prev, badge]
                          );
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-brand-500'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                        <span>{badge}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Variants Section */}
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-extrabold text-xs sm:text-sm text-gray-900 block">
                      Product Variants (Colors, Sizes, Models)
                    </span>
                    <span className="text-[11px] text-gray-500">
                      Enable if this item has multiple options (like Red / Blue, or Small / Medium / Large).
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={hasVariants}
                    onChange={(e) => setHasVariants(e.target.checked)}
                    className="w-5 h-5 rounded text-brand-600 border-gray-300 cursor-pointer"
                  />
                </div>

                {hasVariants && <VariantManager variants={variants} onChange={setVariants} />}
              </div>

              {/* Purchase Cost (Admin only) */}
              {canViewPurchaseCost && (
                <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-100 max-w-sm">
                  <label className="block text-xs font-bold text-purple-800 uppercase tracking-wider mb-1">
                    Internal Purchase Cost (Rs.)
                  </label>
                  <input
                    type="number"
                    value={purchaseCost}
                    onChange={(e) => setPurchaseCost(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl text-xs font-bold text-purple-900"
                  />
                  <span className="text-[10px] text-purple-600 mt-1 block">
                    Only visible to administrators for profit margin calculation.
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Big Save & Delete Buttons at bottom */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              to="/admin/products"
              className="px-6 py-3.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs sm:text-sm transition-colors text-center"
            >
              Cancel
            </Link>

            {isEditing && canManageProducts && (
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="px-5 py-3.5 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Product</span>
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto px-10 py-3.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all hover:scale-105"
          >
            <Save className="w-5 h-5" />
            <span>{isSaving ? 'Saving Product...' : 'Save Product Now'}</span>
          </button>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <ConfirmModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={async () => {
            if (id && canManageProducts) {
              await deleteProduct(id);
              navigate('/admin/products');
            }
          }}
          title="Delete Product"
          message="Are you sure you want to permanently delete this product?"
          confirmText="Yes, Permanently Delete"
        />
      )}
    </div>
  );
};
