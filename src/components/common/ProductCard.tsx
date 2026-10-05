import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, Check, Star } from 'lucide-react';
import { Product } from '../../types/product';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const isWishlisted = isInWishlist(product.id);
  const primaryImage = product.images[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80';
  const secondaryImage = product.images[1] || primaryImage;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const discountPercentage = product.salePrice
    ? Math.round(((product.regularPrice - product.salePrice) / product.regularPrice) * 100)
    : 0;

  return (
    <div
      className="group relative bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-gray-100 dark:border-slate-800 shadow-2xs hover:shadow-xl dark:hover:border-slate-700 transition-all duration-300 flex flex-col h-full overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Badges */}
      <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 flex flex-col gap-1 pointer-events-none">
        {product.salePrice && (
          <span className="px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-[11px] font-extrabold bg-red-500 text-white rounded-full shadow-xs">
            -{discountPercentage}%
          </span>
        )}
        {product.badges.includes('New') && (
          <span className="px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-[11px] font-extrabold bg-emerald-500 text-white rounded-full shadow-xs">
            New
          </span>
        )}
        {product.badges.includes('Best Seller') && (
          <span className="px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-[11px] font-extrabold bg-amber-500 text-white rounded-full shadow-xs">
            Best Seller
          </span>
        )}
      </div>

      {/* Floating Wishlist Heart Button */}
      <button
        onClick={handleWishlistClick}
        aria-label="Add to wishlist"
        className={`absolute top-2 right-2 sm:top-3 sm:right-3 z-10 p-1.5 sm:p-2 rounded-full transition-all duration-200 ${
          isWishlisted
            ? 'bg-red-50 dark:bg-red-950/50 text-red-500 shadow-xs scale-110'
            : 'bg-white/85 dark:bg-slate-800/85 backdrop-blur-xs text-slate-600 dark:text-slate-300 hover:text-red-500 hover:bg-white shadow-2xs'
        }`}
      >
        <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? 'fill-red-500' : ''}`} />
      </button>

      {/* Product Image Area */}
      <Link to={`/product/${product.slug}`} className="relative aspect-square w-full bg-gray-50 dark:bg-slate-950 overflow-hidden block">
        <img
          src={isHovered ? secondaryImage : primaryImage}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          decoding="async"
        />

        {/* Quick View Button (Desktop only) */}
        {onQuickView && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView(product);
            }}
            className="hidden sm:flex absolute bottom-3 left-1/2 -translate-x-1/2 px-3.5 py-1.5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-slate-800 dark:text-white text-xs font-semibold rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 items-center gap-1.5 hover:bg-brand-600 hover:text-white"
          >
            <Eye className="w-3.5 h-3.5" />
            Quick View
          </button>
        )}
      </Link>

      {/* Content Area */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-1 justify-between gap-1.5 sm:gap-2.5">
        <div>
          {/* Brand & Stock */}
          <div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mb-0.5 sm:mb-1">
            <span className="font-extrabold uppercase tracking-wider text-brand-600 dark:text-cyan-400 truncate max-w-[85px] sm:max-w-[120px]">
              {product.brand}
            </span>
            <span className={product.inStock ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-red-500 font-bold'}>
              {product.inStock ? 'In Stock' : 'Out'}
            </span>
          </div>

          {/* Product Name */}
          <Link
            to={`/product/${product.slug}`}
            className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 hover:text-brand-600 dark:hover:text-cyan-400 line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] leading-tight sm:leading-snug transition-colors duration-200 block"
          >
            {product.name}
          </Link>

          {/* Rating */}
          <div className="mt-1 flex items-center gap-1 text-[11px] sm:text-xs">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {product.rating.toFixed(1)}
            </span>
            <span className="text-[10px] text-gray-400">
              ({product.reviewCount})
            </span>
          </div>
        </div>

        {/* Price & Add to Cart */}
        <div className="pt-2 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between gap-1">
          <div className="min-w-0 flex-1">
            <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">
              Rs. {(product.salePrice || product.regularPrice).toLocaleString()}
            </div>
            {product.salePrice && (
              <div className="text-[10px] sm:text-xs text-gray-400 line-through truncate">
                Rs. {product.regularPrice.toLocaleString()}
              </div>
            )}
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={!product.inStock}
            className={`shrink-0 py-1.5 px-2 sm:py-2 sm:px-3 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-extrabold transition-all duration-200 flex items-center gap-1 active:scale-95 ${
              addedAnimation
                ? 'bg-emerald-600 text-white'
                : product.inStock
                ? 'bg-slate-900 dark:bg-cyan-500 text-white dark:text-slate-950 hover:bg-brand-600 dark:hover:bg-cyan-400 shadow-2xs'
                : 'bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-600 cursor-not-allowed'
            }`}
            title="Add to Cart"
          >
            {addedAnimation ? (
              <>
                <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="hidden sm:inline">Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="hidden sm:inline">Add</span>
                <span className="inline sm:hidden">+</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
