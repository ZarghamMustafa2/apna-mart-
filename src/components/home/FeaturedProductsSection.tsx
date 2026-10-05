import React from 'react';
import { Link } from 'react-router-dom';
import { useAdminData } from '../../context/AdminDataContext';
import { ProductCard } from '../common/ProductCard';
import { useCart } from '../../context/CartContext';
import { ArrowRight, Star, ShoppingBag, Sparkles } from 'lucide-react';

export const FeaturedProductsSection: React.FC = () => {
  const { products } = useAdminData();
  const { addToCart } = useCart();

  const featured = products ? products.filter((p) => p.isFeatured || p.badges.includes('Featured') || p.badges.includes('Best Seller')) : [];
  const displayList = featured.length >= 4 ? featured : (products || []).slice(0, 4);

  if (displayList.length === 0) return null;

  const spotlightProduct = displayList[0];
  const sideProducts = displayList.slice(1, 4);

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8 lg:py-12">
      <div className="flex items-center justify-between gap-3 mb-4 sm:mb-8">
        <div>
          <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-brand-600 dark:text-cyan-400 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            Editor's Pick
          </span>
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5">
            Featured Products
          </h2>
        </div>

        <Link
          to="/shop?filter=featured"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-5 sm:py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 font-extrabold text-[11px] sm:text-xs rounded-xl sm:rounded-2xl transition-all border border-gray-200 dark:border-slate-700 shadow-2xs flex-shrink-0"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5 text-brand-600 dark:text-cyan-400" />
        </Link>
      </div>

      {/* MOBILE: Clean 2-Column Product Grid (< lg) */}
      <div className="grid grid-cols-2 lg:hidden gap-2.5 sm:gap-4">
        {displayList.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* DESKTOP: Asymmetric Spotlight Layout (>= lg) */}
      <div className="hidden lg:grid lg:grid-cols-12 gap-6 items-stretch">
        {/* LEFT: 1 Large Featured Product Spotlight Card (5 cols) */}
        {spotlightProduct && (
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-brand-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl border border-slate-800 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />

            <div className="space-y-4 z-10">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  FLAGSHIP SPOTLIGHT
                </span>
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {spotlightProduct.rating} ({spotlightProduct.reviewCount})
                </span>
              </div>

              {/* Product Image Preview */}
              <Link to={`/product/${spotlightProduct.slug}`} className="block relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-950 my-2">
                <img
                  src={spotlightProduct.images[0]}
                  alt={spotlightProduct.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </Link>

              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-cyan-400">
                  {spotlightProduct.brand} • {spotlightProduct.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-1 group-hover:text-cyan-300 transition-colors line-clamp-2">
                  {spotlightProduct.name}
                </h3>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800 flex items-center justify-between gap-4 z-10 mt-4">
              <div>
                <div className="text-xs text-slate-400 font-semibold">Limited Stock</div>
                <div className="text-2xl font-extrabold text-white">
                  Rs. {(spotlightProduct.salePrice || spotlightProduct.regularPrice).toLocaleString()}
                </div>
              </div>

              <button
                onClick={() => addToCart(spotlightProduct, 1)}
                className="px-5 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs rounded-2xl shadow-lg flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        )}

        {/* RIGHT: 3 Complementary Product Cards (7 cols) */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {sideProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
