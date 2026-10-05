import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Home,
  Grid,
  ShoppingBag,
  Heart,
  User,
  X,
  ChevronRight,
  ChevronDown,
  Search,
  Phone,
  HelpCircle,
  Package,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { mockCategories } from '../../data/mockCategories';
import { useFilters } from '../../context/FilterContext';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const [mobileSearch, setMobileSearch] = useState('');
  const { cartCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isLoggedIn } = useAuth();
  const { setSearchQuery } = useFilters();
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileSearch.trim()) {
      setSearchQuery(mobileSearch.trim());
      onClose();
      navigate(`/shop?search=${encodeURIComponent(mobileSearch.trim())}`);
    }
  };

  const toggleCategoryExpand = (catId: string) => {
    setExpandedCat(expandedCat === catId ? null : catId);
  };

  return (
    <>
      {/* Slide-out Mobile Sidebar Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />

          {/* Drawer Panel */}
          <div className="relative w-4/5 max-w-sm h-full bg-white shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-300">
            <div>
              {/* Drawer Header */}
              <div className="p-5 bg-gradient-to-r from-slate-900 to-brand-950 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center font-extrabold text-white text-lg">
                    A
                  </div>
                  <span className="font-extrabold text-lg tracking-tight">ApnaMart</span>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Search Bar */}
              <div className="p-4 border-b border-gray-100 bg-gray-50">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    type="text"
                    placeholder="Search product, category..."
                    value={mobileSearch}
                    onChange={(e) => setMobileSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:border-brand-500 focus:outline-none"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </form>
              </div>

              {/* Mobile Navigation Links & Accordion */}
              <div className="p-4 space-y-1">
                <Link
                  to="/"
                  onClick={onClose}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-brand-50 font-semibold text-gray-800 transition-colors"
                >
                  <Home className="w-5 h-5 text-brand-600" />
                  <span>Home</span>
                </Link>

                <Link
                  to="/shop"
                  onClick={onClose}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-brand-50 font-semibold text-gray-800 transition-colors"
                >
                  <Grid className="w-5 h-5 text-brand-600" />
                  <span>Shop All Products</span>
                </Link>

                {/* Categories Accordion */}
                <div className="pt-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-gray-400 px-3 mb-2">
                    Categories
                  </div>
                  {mockCategories.map((cat) => {
                    const isExpanded = expandedCat === cat.id;
                    return (
                      <div key={cat.id} className="mb-1">
                        <button
                          onClick={() => toggleCategoryExpand(cat.id)}
                          className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-100 font-medium text-gray-800 text-sm transition-colors"
                        >
                          <span>{cat.name}</span>
                          <ChevronDown
                            className={`w-4 h-4 text-gray-400 transition-transform ${
                              isExpanded ? 'rotate-180 text-brand-600' : ''
                            }`}
                          />
                        </button>

                        {isExpanded && (
                          <div className="pl-6 pr-2 py-1 space-y-1 bg-gray-50/70 rounded-xl my-1">
                            <Link
                              to={`/shop?category=${cat.slug}`}
                              onClick={onClose}
                              className="block p-2 text-xs font-bold text-brand-600 hover:underline"
                            >
                              All in {cat.name} →
                            </Link>
                            {cat.subcategories.map((sub) => (
                              <Link
                                key={sub.id}
                                to={`/shop?category=${cat.slug}&subcategory=${sub.slug}`}
                                onClick={onClose}
                                className="block p-2 text-xs font-medium text-gray-600 hover:text-brand-600 hover:bg-white rounded-lg transition-colors"
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-gray-100 space-y-1">
                  <Link
                    to="/track-order"
                    onClick={onClose}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-brand-50 text-sm font-semibold text-gray-700"
                  >
                    <Package className="w-5 h-5 text-gray-500" />
                    Track Order
                  </Link>
                  <Link
                    to="/faq"
                    onClick={onClose}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-brand-50 text-sm font-semibold text-gray-700"
                  >
                    <HelpCircle className="w-5 h-5 text-gray-500" />
                    Help & FAQs
                  </Link>
                </div>
              </div>
            </div>

            {/* Drawer Footer Account Snippet */}
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              {isLoggedIn ? (
                <Link
                  to="/account"
                  onClick={onClose}
                  className="flex items-center gap-3 p-2 bg-white rounded-xl shadow-sm border border-gray-200"
                >
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                    alt={user?.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-gray-900 truncate">{user?.name}</div>
                    <div className="text-xs text-brand-600 font-semibold">View Account</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Link>
              ) : (
                <Link
                  to="/auth"
                  onClick={onClose}
                  className="w-full py-3 bg-brand-600 text-white rounded-xl font-bold text-center text-sm block shadow-md hover:bg-brand-700 transition-colors"
                >
                  Sign In / Create Account
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Navigation Bar for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-gray-200/80 dark:border-slate-800 lg:hidden px-2 h-14 flex items-center justify-around shadow-lg">
        <Link
          to="/"
          className="flex flex-col items-center gap-0.5 text-gray-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-cyan-400 transition-colors p-1"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Home</span>
        </Link>

        <Link
          to="/shop"
          className="flex flex-col items-center gap-0.5 text-gray-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-cyan-400 transition-colors p-1"
        >
          <Grid className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Shop</span>
        </Link>

        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center gap-0.5 text-brand-600 dark:text-cyan-400 transition-colors p-1"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-brand-600 dark:bg-cyan-500 text-white dark:text-slate-950 text-[10px] font-extrabold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold">Cart</span>
        </button>

        <Link
          to="/wishlist"
          className="relative flex flex-col items-center gap-0.5 text-gray-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-cyan-400 transition-colors p-1"
        >
          <div className="relative">
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-red-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold">Wishlist</span>
        </Link>

        <Link
          to={isLoggedIn ? "/account" : "/auth"}
          className="flex flex-col items-center gap-0.5 text-gray-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-cyan-400 transition-colors p-1"
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-semibold">{isLoggedIn ? 'Account' : 'Sign In'}</span>
        </Link>
      </div>
    </>
  );
};
