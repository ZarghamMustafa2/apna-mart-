import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { ProductGallery } from '../components/product/ProductGallery';
import { VariantSelector } from '../components/product/VariantSelector';
import { ProductTabs } from '../components/product/ProductTabs';
import { RelatedProducts } from '../components/product/RelatedProducts';
import { RecentlyViewed } from '../components/product/RecentlyViewed';
import { PriceDisplay } from '../components/common/PriceDisplay';
import { Rating } from '../components/common/Rating';
import { Toast } from '../components/common/Toast';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAdminData } from '../context/AdminDataContext';
import { mockProducts } from '../data/mockProducts';
import { ProductVariant } from '../types/product';
import { ShoppingBag, Zap, Heart, ShieldCheck, Truck, RotateCcw, Plus, Minus, Share2 } from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';

export const ProductDetailPage: React.FC = () => {
  const { productSlug } = useParams<{ productSlug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { products } = useAdminData();

  const productList = products && products.length > 0 ? products : mockProducts;
  const product = productList.find((p) => p.slug === productSlug) || productList[0];

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants && product.variants.length > 0 ? product.variants[0] : undefined
  );
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (product.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    } else {
      setSelectedVariant(undefined);
    }
  }, [productSlug, product]);

  const isWishlisted = isInWishlist(product.id);
  const effectiveRegularPrice = selectedVariant ? selectedVariant.regularPrice : product.regularPrice;
  const effectiveSalePrice = selectedVariant ? selectedVariant.salePrice : product.salePrice;
  const maxStock = selectedVariant ? selectedVariant.stock : product.stock;
  const currentSKU = selectedVariant ? selectedVariant.sku : product.sku;

  // Active product images (switches to variant image if variant has its own image)
  const galleryImages = selectedVariant?.image
    ? [selectedVariant.image, ...product.images.filter((img) => img !== selectedVariant.image)]
    : product.images;

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: galleryImages,
    description: product.description || product.shortDescription,
    sku: currentSKU,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    offers: {
      '@type': 'Offer',
      url: `https://apnamart.space/product/${product.slug}`,
      priceCurrency: 'PKR',
      price: effectiveSalePrice || effectiveRegularPrice,
      itemCondition: 'https://schema.org/NewCondition',
      availability: maxStock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
  };

  const handleAddToCart = () => {
    if (product.hasVariants && product.variantAttributes && product.variantAttributes.length > 0) {
      const missingAttr = product.variantAttributes.find((attr) => !selectedAttributes[attr.name]);
      if (missingAttr) {
        setToastMessage(`Please select a ${missingAttr.name} before adding to cart.`);
        return;
      }
    }

    addToCart(product, quantity, selectedVariant, selectedAttributes);
    setToastMessage(`Added ${quantity} x ${product.name} to your shopping cart!`);
  };

  const handleBuyNow = () => {
    if (product.hasVariants && product.variantAttributes && product.variantAttributes.length > 0) {
      const missingAttr = product.variantAttributes.find((attr) => !selectedAttributes[attr.name]);
      if (missingAttr) {
        setToastMessage(`Please select a ${missingAttr.name} before buying now.`);
        return;
      }
    }

    addToCart(product, quantity, selectedVariant, selectedAttributes);
    navigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8 pb-24 lg:pb-8">
      <SEOHead
        title={`${product.name} - ${product.brand}`}
        description={product.shortDescription || product.description}
        canonicalUrl={`https://apnamart.space/product/${product.slug}`}
        ogImage={galleryImages[0]}
        ogType="product"
        jsonLd={productSchema}
      />

      <Breadcrumb
        items={[
          { label: 'Shop', link: '/shop' },
          { label: product.category, link: `/shop?category=${product.categoryId}` },
          { label: product.name },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-6 items-start">
        {/* Left Column: Product Media Gallery */}
        <ProductGallery
          images={galleryImages}
          productName={product.name}
          videoUrl={product.videoUrl}
        />

        {/* Right Column: Product Info & Actions */}
        <div className="space-y-6">
          {/* Brand & Badges */}
          <div className="flex items-center justify-between">
            <Link
              to={`/shop?category=${product.categoryId}`}
              className="text-xs font-extrabold uppercase tracking-wider text-brand-600 hover:underline"
            >
              {product.brand}
            </Link>
            <div className="flex items-center gap-2">
              {product.badges.map((b) => (
                <span
                  key={b}
                  className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-brand-50 text-brand-700 border border-brand-200"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Product Name */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
            {product.name}
          </h1>

          {/* Rating Summary & SKU */}
          <div className="flex items-center gap-4 text-xs">
            <Rating rating={product.rating} reviewCount={product.reviewCount} size="md" />
            <span className="text-gray-300">|</span>
            <span className="text-gray-500 font-semibold">
              SKU: <strong className="text-gray-900">{currentSKU}</strong>
            </span>
          </div>

          {/* Price Area */}
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
            <PriceDisplay
              regularPrice={effectiveRegularPrice}
              salePrice={effectiveSalePrice}
              size="xl"
              showSavings={true}
            />
            <p className="text-[11px] text-gray-400 font-medium pt-1">
              Inclusive of all taxes. Cash on Delivery nationwide.
            </p>
          </div>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            {product.shortDescription || product.description}
          </p>

          {/* Variants Selector */}
          <VariantSelector
            product={product}
            onVariantChange={(variant, attrs) => {
              setSelectedVariant(variant);
              setSelectedAttributes(attrs);
            }}
          />

          {/* Quantity & Direct Actions */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">Quantity:</span>
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2.5 text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-extrabold text-gray-900 min-w-[40px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(maxStock, quantity + 1))}
                  disabled={quantity >= maxStock}
                  className="p-2.5 text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-30"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="text-xs text-gray-400 font-medium">({maxStock} available)</span>
            </div>

            {/* CTA Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={maxStock <= 0}
                className="py-4 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 text-white font-extrabold text-sm rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>{maxStock <= 0 ? 'Out of Stock' : 'Add to Cart'}</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={maxStock <= 0}
                className="py-4 bg-slate-900 hover:bg-black disabled:bg-gray-300 text-white font-extrabold text-sm rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <Zap className="w-5 h-5 fill-amber-400 text-amber-400" />
                <span>Buy Now</span>
              </button>
            </div>

            {/* Wishlist & Share */}
            <div className="flex items-center gap-4 pt-2">
              <button
                onClick={() => toggleWishlist(product)}
                className={`flex items-center gap-2 text-xs font-bold py-2 px-4 rounded-xl transition-all ${
                  isWishlisted ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500' : ''}`} />
                <span>{isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
              </button>

              <button
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  setToastMessage('Product link copied to clipboard!');
                }}
                className="flex items-center gap-2 text-xs font-bold py-2 px-4 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
          </div>

          {/* Value Props */}
          <div className="grid grid-cols-3 gap-2 pt-6 border-t border-gray-100 text-center">
            <div className="p-3 rounded-2xl bg-gray-50/80">
              <Truck className="w-5 h-5 text-brand-600 mx-auto mb-1" />
              <span className="text-[11px] font-bold text-gray-800 block">Fast Delivery</span>
            </div>
            <div className="p-3 rounded-2xl bg-gray-50/80">
              <ShieldCheck className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              <span className="text-[11px] font-bold text-gray-800 block">100% Authentic</span>
            </div>
            <div className="p-3 rounded-2xl bg-gray-50/80">
              <RotateCcw className="w-5 h-5 text-amber-600 mx-auto mb-1" />
              <span className="text-[11px] font-bold text-gray-800 block">7-Day Guarantee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <ProductTabs product={product} />

      {/* Related Products */}
      <RelatedProducts currentProduct={product} />

      {/* Recently Viewed Products */}
      <RecentlyViewed currentProductId={product.id} />

      {/* Mobile Sticky Purchase Bar (sits right above bottom navigation bar at bottom-14) */}
      <div className="fixed bottom-14 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-gray-200 dark:border-slate-800 p-2.5 lg:hidden flex items-center justify-between gap-3 shadow-xl">
        <div className="min-w-0">
          <div className="text-xs font-bold text-gray-900 dark:text-white truncate max-w-[140px]">{product.name}</div>
          <PriceDisplay
            regularPrice={effectiveRegularPrice}
            salePrice={effectiveSalePrice}
            size="sm"
          />
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleAddToCart}
            disabled={maxStock <= 0}
            className="px-3 py-2 bg-brand-600 dark:bg-cyan-500 hover:bg-brand-700 dark:hover:bg-cyan-400 disabled:bg-gray-300 dark:disabled:bg-slate-800 text-white dark:text-slate-950 font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-1 active:scale-95 transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add</span>
          </button>
          <button
            onClick={handleBuyNow}
            disabled={maxStock <= 0}
            className="px-3 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 disabled:bg-gray-300 dark:disabled:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-1 active:scale-95 transition-all border border-slate-700"
          >
            <Zap className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          isOpen={!!toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
};
