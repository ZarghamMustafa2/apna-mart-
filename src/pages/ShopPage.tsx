import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { FilterSidebar } from '../components/shop/FilterSidebar';
import { SortDropdown } from '../components/shop/SortDropdown';
import { ActiveFilters } from '../components/shop/ActiveFilters';
import { ProductCard } from '../components/common/ProductCard';
import { useFilters } from '../context/FilterContext';
import { useAdminData } from '../context/AdminDataContext';
import { mockProducts } from '../data/mockProducts';
import { Filter, SearchX, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';

export const ShopPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { filters, setCategory, setSubcategory, setSearchQuery, resetFilters } = useFilters();
  const { products } = useAdminData();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const productList = products && products.length > 0 ? products : mockProducts;
  const filterParam = searchParams.get('filter');

  // Sync URL query params into filter state on page load
  useEffect(() => {
    window.scrollTo(0, 0);
    const cat = searchParams.get('category');
    const sub = searchParams.get('subcategory');
    const search = searchParams.get('search');
    if (cat) setCategory(cat);
    if (sub) setSubcategory(sub);
    if (search) setSearchQuery(search);
  }, [searchParams]);

  // Reset pagination to Page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, filterParam]);

  // Apply filters to product catalog
  let filtered = productList.filter((product) => {
    // Special Section Filter from URL
    if (filterParam === 'featured' && !product.isFeatured && !product.badges?.includes('Featured')) {
      return false;
    }
    if (filterParam === 'new' && !product.isNewArrival && !product.badges?.includes('New')) {
      return false;
    }
    if (filterParam === 'bestseller' && !product.isBestSeller && !product.badges?.includes('Best Seller')) {
      return false;
    }
    if (filterParam === 'sale' && (!product.salePrice || product.salePrice >= product.regularPrice)) {
      return false;
    }

    // Search query
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      const matchName = product.name.toLowerCase().includes(q);
      const matchBrand = product.brand.toLowerCase().includes(q);
      const matchCategory = product.category.toLowerCase().includes(q);
      const matchSKU = product.sku.toLowerCase().includes(q);
      if (!matchName && !matchBrand && !matchCategory && !matchSKU) return false;
    }

    // Category
    if (filters.category && product.category.toLowerCase() !== filters.category.toLowerCase()) {
      return false;
    }

    // Subcategory
    if (filters.subcategory && product.subcategory?.toLowerCase() !== filters.subcategory.toLowerCase()) {
      return false;
    }

    // Brands
    if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
      return false;
    }

    // Price
    const effectivePrice = product.salePrice || product.regularPrice;
    if (effectivePrice < filters.minPrice || effectivePrice > filters.maxPrice) {
      return false;
    }

    // In Stock Only
    if (filters.inStockOnly && !product.inStock) {
      return false;
    }

    // Rating
    if (filters.minRating > 0 && product.rating < filters.minRating) {
      return false;
    }

    // Sizes filter
    if (filters.sizes.length > 0 && product.hasVariants) {
      const hasMatchingSize = product.variants?.some((v) =>
        filters.sizes.includes(v.attributes['Size'] || '')
      );
      if (!hasMatchingSize) return false;
    }

    // Colors filter
    if (filters.colors.length > 0 && product.hasVariants) {
      const hasMatchingColor = product.variants?.some((v) =>
        filters.colors.includes(v.attributes['Color'] || '')
      );
      if (!hasMatchingColor) return false;
    }

    return true;
  });

  // Apply sorting
  filtered.sort((a, b) => {
    const priceA = a.salePrice || a.regularPrice;
    const priceB = b.salePrice || b.regularPrice;

    if (filters.sortBy === 'price-low-high') return priceA - priceB;
    if (filters.sortBy === 'price-high-low') return priceB - priceA;
    if (filters.sortBy === 'highest-rated') return b.rating - a.rating;
    if (filters.sortBy === 'best-selling') return b.reviewCount - a.reviewCount;
    if (filters.sortBy === 'most-popular') return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // newest
  });

  // Pagination calculation
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filtered.slice(startIndex, startIndex + itemsPerPage);

  const getPageTitle = () => {
    if (filterParam === 'featured') return 'Featured Products';
    if (filterParam === 'new') return 'New Arrivals';
    if (filterParam === 'bestseller') return 'Best Sellers Catalog';
    if (filterParam === 'sale') return 'Special Deals & Discounts';
    if (filters.category) return `Category: ${filters.category}`;
    return 'All Products Catalog';
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 pb-20 sm:pb-24 lg:pb-8">
      <SEOHead title={`${getPageTitle()} | ApnaMart`} canonicalUrl="https://apnamart.space/shop" />
      <Breadcrumb items={[{ label: 'Shop Catalog' }]} />

      {/* Header Bar - Compact on mobile */}
      <div className="flex items-center justify-between gap-2 py-2 sm:py-4 border-b border-gray-100 dark:border-slate-800 my-1">
        <div className="min-w-0">
          <h1 className="text-lg sm:text-2xl lg:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight truncate">
            {getPageTitle()}
          </h1>
          <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium truncate">
            Showing <strong className="text-gray-900 dark:text-white">{paginatedProducts.length}</strong> of{' '}
            <strong className="text-gray-900 dark:text-white">{filtered.length}</strong> items
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-800 dark:text-gray-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Filter className="w-3.5 h-3.5 text-brand-600 dark:text-cyan-400" />
            <span>Filter</span>
          </button>

          {/* Sort Dropdown */}
          <SortDropdown />
        </div>
      </div>

      {/* Active Filters Bar */}
      <ActiveFilters />

      {/* Main Layout Grid */}
      <div className="flex gap-8 items-start mt-4 sm:mt-6">
        {/* Desktop Filter Sidebar */}
        <FilterSidebar
          isMobileOpen={isMobileFilterOpen}
          onCloseMobile={() => setIsMobileFilterOpen(false)}
        />

        {/* Product Grid Area */}
        <div className="flex-1 min-w-0 space-y-6 sm:space-y-8">
          {paginatedProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4 lg:gap-6">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination Navigation Bar */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-6 border-t border-gray-100 text-xs">
                  <button
                    onClick={() => {
                      setCurrentPage((p) => Math.max(p - 1, 1));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-xl border border-gray-200 font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  <div className="flex items-center gap-1.5 font-semibold text-gray-600">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => {
                          setCurrentPage(pageNum);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`w-8 h-8 rounded-xl font-bold transition-all ${
                          currentPage === pageNum
                            ? 'bg-brand-600 text-white shadow-md'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      setCurrentPage((p) => Math.min(p + 1, totalPages));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-xl border border-gray-200 font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Empty State */
            <div className="py-16 px-4 text-center bg-white rounded-3xl border border-gray-100 p-8 space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
                <SearchX className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-extrabold text-gray-900">No Products Found</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                We couldn't find any products matching your current search or filter criteria. Try resetting filters or searching with different keywords.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-3 bg-brand-600 text-white font-extrabold text-xs rounded-xl shadow-md inline-flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
