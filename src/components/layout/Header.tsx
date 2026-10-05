import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  ChevronDown,
  Sparkles,
  X,
  ArrowRight,
  LogOut,
  Package,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useFilters } from '../../context/FilterContext';
import { ThemeToggle } from '../common/ThemeToggle';
import { mockCategories } from '../../data/mockCategories';
import { mockProducts } from '../../data/mockProducts';

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const [searchInput, setSearchInput] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const { cartCount, summary, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isLoggedIn, logout } = useAuth();
  const { setSearchQuery } = useFilters();
  const navigate = useNavigate();

  const searchRef = useRef<HTMLDivElement>(null);

  // Close search suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchQuery(searchInput.trim());
      setIsSearchFocused(false);
      navigate(`/shop?search=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  // Filtered live search suggestions
  const suggestions = searchInput.trim()
    ? mockProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(searchInput.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchInput.toLowerCase()) ||
          p.category.toLowerCase().includes(searchInput.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchInput.toLowerCase())
      ).slice(0, 5)
    : [];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 shadow-xs transition-all duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-4">
        {/* Mobile Menu Button */}
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-1.5 sm:p-2 rounded-xl text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Open Mobile Navigation"
        >
          <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 group">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white font-extrabold text-base sm:text-xl shadow-md group-hover:scale-105 transition-transform">
            A
          </div>
          <div>
            <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-cyan-400 transition-colors">
              Apna<span className="text-brand-600 dark:text-cyan-400">Mart</span>
            </span>
            <span className="hidden sm:block text-[10px] font-semibold text-gray-400 dark:text-slate-400 tracking-wider uppercase -mt-1">
              Premium E-Commerce
            </span>
          </div>
        </Link>

        {/* Main Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-gray-700">
          <Link to="/" className="hover:text-brand-600 transition-colors">
            Home
          </Link>
          <Link to="/shop" className="hover:text-brand-600 transition-colors">
            Shop All
          </Link>

          {/* Categories Mega Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsCategoryOpen(true)}
            onMouseLeave={() => setIsCategoryOpen(false)}
          >
            <button className="flex items-center gap-1 hover:text-brand-600 transition-colors py-2">
              <span>Categories</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
            </button>

            {isCategoryOpen && (
              <div className="absolute top-full left-0 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 px-2">
                  <span>Browse Categories</span>
                  <Link
                    to="/categories"
                    className="text-brand-600 hover:underline font-extrabold"
                    onClick={() => setIsCategoryOpen(false)}
                  >
                    View All →
                  </Link>
                </div>
                <div className="space-y-1 max-h-96 overflow-y-auto scrollbar-thin">
                  {mockCategories.map((cat) => (
                    <div key={cat.id} className="group/item">
                      <Link
                        to={`/category/${cat.slug}`}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-brand-50 hover:text-brand-600 transition-all font-medium text-gray-800"
                        onClick={() => setIsCategoryOpen(false)}
                      >
                        <span>{cat.name}</span>
                        <span className="text-[11px] text-gray-400 group-hover/item:text-brand-500 font-normal">
                          {cat.subcategories ? cat.subcategories.length : 0} subs
                        </span>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link to="/about" className="hover:text-brand-600 transition-colors">
            About Us
          </Link>
          <Link to="/contact" className="hover:text-brand-600 transition-colors">
            Contact
          </Link>
        </nav>

        {/* Live Search Input Component */}
        <div ref={searchRef} className="relative flex-1 max-w-md hidden sm:block">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search products, brands, categories..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              className="w-full pl-10 pr-10 py-2.5 bg-gray-100/80 border border-transparent rounded-full text-sm focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all outline-none"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Search Autocomplete Suggestions Dropdown */}
          {isSearchFocused && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 p-3 z-50">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 py-1 mb-1">
                Product Suggestions
              </div>
              <div className="divide-y divide-gray-50">
                {suggestions.map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.slug}`}
                    onClick={() => setIsSearchFocused(false)}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-all group"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded-lg bg-gray-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                        {product.brand}
                      </div>
                      <div className="text-sm font-semibold text-gray-800 group-hover:text-brand-600 truncate">
                        {product.name}
                      </div>
                    </div>
                    <div className="text-xs font-bold text-gray-900 flex-shrink-0">
                      Rs. {(product.salePrice || product.regularPrice).toLocaleString()}
                    </div>
                  </Link>
                ))}
              </div>
              <button
                onClick={handleSearchSubmit}
                className="w-full mt-2 py-2 text-center text-xs font-bold text-brand-600 hover:bg-brand-50 rounded-xl transition-all flex items-center justify-center gap-1"
              >
                <span>View all results for "{searchInput}"</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Right Header Action Icons */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Light / Dark Mode Toggle */}
          <ThemeToggle />

          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="relative p-1.5 sm:p-2.5 rounded-full text-gray-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-cyan-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 text-white text-[10px] sm:text-[11px] font-extrabold rounded-full flex items-center justify-center shadow-md animate-pulse">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Icon & Count */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 p-1.5 sm:p-2 px-2.5 sm:px-3 rounded-full bg-brand-50 dark:bg-slate-800 text-brand-700 dark:text-cyan-300 hover:bg-brand-100 dark:hover:bg-slate-700 transition-all group"
            aria-label="Shopping Cart"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 sm:-top-2 sm:-right-2.5 w-4 h-4 sm:w-5 sm:h-5 bg-brand-600 text-white text-[10px] sm:text-[11px] font-extrabold rounded-full flex items-center justify-center shadow-md">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline text-xs font-bold">
              Rs. {summary.total.toLocaleString()}
            </span>
          </button>

          {/* Account Menu */}
          <div className="relative">
            {isLoggedIn ? (
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 transition-all border border-gray-200"
              >
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                  alt={user?.name}
                  className="w-7 h-7 rounded-full object-cover"
                />
                <span className="hidden md:inline text-xs font-semibold text-gray-800 max-w-[100px] truncate">
                  {user?.name.split(' ')[0]}
                </span>
              </button>
            ) : (
              <Link
                to="/auth"
                className="p-1.5 sm:p-2.5 rounded-full text-gray-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-cyan-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all block"
                aria-label="Sign In or Register"
              >
                <User className="w-5 h-5" />
              </Link>
            )}

            {/* Dropdown Menu for Logged In User */}
            {isLoggedIn && isUserMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                onMouseLeave={() => setIsUserMenuOpen(false)}
              >
                <div className="px-3 py-2 border-b border-gray-100 mb-1">
                  <div className="text-sm font-bold text-gray-900">{user?.name}</div>
                  <div className="text-xs text-gray-400 truncate">{user?.email}</div>
                </div>
                <Link
                  to="/account"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-brand-50 hover:text-brand-600 rounded-xl transition-all"
                >
                  <User className="w-4 h-4" />
                  My Profile & Orders
                </Link>
                <Link
                  to="/track-order"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-brand-50 hover:text-brand-600 rounded-xl transition-all"
                >
                  <Package className="w-4 h-4" />
                  Track Order
                </Link>
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-all mt-1 border-t border-gray-50"
                >
                  <LogOut className="w-4 h-4" />
                  Logout Account
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
