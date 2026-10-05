import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { ProductCard } from '../components/common/ProductCard';
import { useWishlist } from '../context/WishlistContext';
import { Heart, ShoppingBag } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlist } = useWishlist();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 pb-20 sm:pb-24 lg:pb-8">
      <Breadcrumb items={[{ label: 'My Saved Wishlist' }]} />

      <div className="border-b border-gray-100 dark:border-slate-800 pb-3 sm:pb-4">
        <h1 className="text-xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
          <Heart className="w-6 h-6 sm:w-7 sm:h-7 text-red-500 fill-red-500" />
          My Saved Wishlist ({wishlist.length})
        </h1>
        <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">
          Saved items will remain stored in your browser session for quick access.
        </p>
      </div>

      {wishlist.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-white rounded-3xl border border-gray-100 p-8 space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900">Your Wishlist is Empty</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            You haven't saved any products to your wishlist yet. Click the heart icon on any product card to save it for later!
          </p>
          <Link
            to="/shop"
            className="inline-block px-8 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-2xl shadow-lg transition-all"
          >
            Explore Products Now
          </Link>
        </div>
      )}
    </div>
  );
};
