import React from 'react';
import { Filter, RotateCcw, Check, Star, X } from 'lucide-react';
import { useFilters } from '../../context/FilterContext';
import { useAdminData } from '../../context/AdminDataContext';
import { mockCategories } from '../../data/mockCategories';
import { mockProducts } from '../../data/mockProducts';

interface FilterSidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const {
    filters,
    setCategory,
    setSubcategory,
    toggleBrand,
    setPriceRange,
    toggleSize,
    toggleColor,
    setInStockOnly,
    setMinRating,
    resetFilters,
  } = useFilters();

  const { categories, products } = useAdminData();
  const categoryList = categories && categories.length > 0 ? categories : mockCategories;
  const productList = products && products.length > 0 ? products : mockProducts;

  // Extract unique brands dynamically from current product list
  const availableBrands = Array.from(new Set(productList.map((p) => p.brand)));

  // Categorize category type for contextual filter displays
  const selectedCatSlug = (filters.category || '').toLowerCase();

  const isTechCategory =
    selectedCatSlug.includes('electronics') ||
    selectedCatSlug.includes('gaming') ||
    selectedCatSlug.includes('office') ||
    selectedCatSlug.includes('automotive');

  const isApparelOrFootwearCategory =
    selectedCatSlug.includes('fashion') ||
    selectedCatSlug.includes('shoes') ||
    selectedCatSlug.includes('bags') ||
    selectedCatSlug.includes('baby') ||
    selectedCatSlug.includes('sports');

  // Show all attribute filters if no category selected, or filter based on category type
  const showApparelFilters = !filters.category || isApparelOrFootwearCategory;
  const showTechFilters = !filters.category || isTechCategory;

  const availableSizes = ['Small', 'Medium', 'Large', 'X-Large', '40', '41', '42', '43', '44'];
  const availableColors = [
    'Matte Black',
    'Silver Grey',
    'Midnight Blue',
    'Crisp White',
    'Rose Gold',
    'Crimson Red',
    'Cognac Tan',
  ];

  const availableRamOptions = ['8GB', '12GB', '16GB', '32GB'];
  const availableStorageOptions = ['128GB', '256GB', '512GB', '1TB NVMe'];

  const content = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2 font-bold text-gray-900 text-base">
          <Filter className="w-4 h-4 text-brand-600" />
          <span>Filter Products</span>
        </div>
        <button
          onClick={resetFilters}
          className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" />
          Reset All
        </button>
      </div>

      {/* Categories Hierarchy */}
      <div className="space-y-3">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">Categories</h4>
        <div className="space-y-1 text-xs">
          <button
            onClick={() => setCategory('')}
            className={`w-full text-left py-1.5 px-2 rounded-lg font-semibold transition-colors ${
              !filters.category ? 'bg-brand-50 text-brand-600' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            All Categories
          </button>
          {categoryList.map((cat) => {
            const catCount = productList.filter((p) => p.categoryId === cat.id || p.category.toLowerCase() === cat.name.toLowerCase()).length;

            return (
              <div key={cat.id} className="space-y-0.5">
                <button
                  onClick={() => setCategory(cat.slug)}
                  className={`w-full flex items-center justify-between py-1.5 px-2 rounded-lg font-semibold transition-colors ${
                    filters.category === cat.slug ? 'bg-brand-50 text-brand-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="text-[10px] text-gray-400 font-normal">{catCount}</span>
                </button>

                {/* Subcategories */}
                {filters.category === cat.slug && cat.subcategories && cat.subcategories.length > 0 && (
                  <div className="pl-4 space-y-0.5 border-l-2 border-brand-100 my-1">
                    {cat.subcategories.map((sub: any, subIdx: number) => {
                      const subName = typeof sub === 'string' ? sub : sub.name;
                      const subSlug = typeof sub === 'string' ? String(sub).toLowerCase().replace(/\s+/g, '-') : sub.slug;
                      return (
                        <button
                          key={subSlug}
                          onClick={() => setSubcategory(subSlug)}
                          className={`w-full text-left py-1 px-2 rounded-md font-medium text-[11px] transition-colors ${
                            filters.subcategory === subSlug ? 'text-brand-600 font-bold bg-brand-50/50' : 'text-gray-500 hover:text-gray-900'
                          }`}
                        >
                          {subName}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-3 pt-4 border-t border-gray-100">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">Price Range (Rs.)</h4>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice || ''}
              onChange={(e) => setPriceRange(Number(e.target.value) || 0, filters.maxPrice)}
              className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-brand-500"
            />
            <span className="text-gray-400 text-xs">-</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice || ''}
              onChange={(e) => setPriceRange(filters.minPrice, Number(e.target.value) || 500000)}
              className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>
      </div>

      {/* Brand Filter */}
      <div className="space-y-3 pt-4 border-t border-gray-100">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">Brands</h4>
        <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1 scrollbar-thin">
          {availableBrands.map((brand) => {
            const isChecked = filters.brands.includes(brand);
            return (
              <label key={brand} className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer hover:text-brand-600">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleBrand(brand)}
                  className="w-3.5 h-3.5 rounded text-brand-600 focus:ring-brand-500 border-gray-300"
                />
                <span>{brand}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Contextual Apparel / Footwear Size Filter */}
      {showApparelFilters && (
        <div className="space-y-3 pt-4 border-t border-gray-100">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">Apparel & Shoe Size</h4>
          <div className="flex flex-wrap gap-1.5">
            {availableSizes.map((size) => {
              const isSelected = filters.sizes.includes(size);
              return (
                <button
                  key={size}
                  onClick={() => toggleSize(size)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    isSelected ? 'bg-brand-600 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Contextual Color Filter */}
      {showApparelFilters && (
        <div className="space-y-3 pt-4 border-t border-gray-100">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">Color Palette</h4>
          <div className="flex flex-wrap gap-1.5">
            {availableColors.map((color) => {
              const isSelected = filters.colors.includes(color);
              return (
                <button
                  key={color}
                  onClick={() => toggleColor(color)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 transition-all ${
                    isSelected ? 'bg-gray-900 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 text-brand-400" />}
                  <span>{color}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Contextual Tech / Electronics Specs Filters */}
      {showTechFilters && (
        <div className="space-y-3 pt-4 border-t border-gray-100">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">Memory & Storage</h4>
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-gray-500">RAM Capacity</div>
            <div className="flex flex-wrap gap-1.5">
              {availableRamOptions.map((ram) => (
                <button
                  key={ram}
                  onClick={() => toggleSize(ram)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    filters.sizes.includes(ram) ? 'bg-brand-600 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {ram}
                </button>
              ))}
            </div>
            <div className="text-[11px] font-bold text-gray-500 pt-1">Internal Storage</div>
            <div className="flex flex-wrap gap-1.5">
              {availableStorageOptions.map((storage) => (
                <button
                  key={storage}
                  onClick={() => toggleSize(storage)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    filters.sizes.includes(storage) ? 'bg-brand-600 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {storage}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Availability & Rating Filters */}
      <div className="space-y-3 pt-4 border-t border-gray-100">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">Availability & Rating</h4>
        <label className="flex items-center gap-2 text-xs font-semibold text-gray-800 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="w-3.5 h-3.5 rounded text-brand-600 focus:ring-brand-500 border-gray-300"
          />
          <span>In Stock Only</span>
        </label>

        <div className="space-y-1 pt-2">
          {[4, 3, 2].map((r) => (
            <button
              key={r}
              onClick={() => setMinRating(filters.minRating === r ? 0 : r)}
              className={`w-full flex items-center gap-1.5 py-1 px-2 rounded-lg text-xs font-medium transition-colors ${
                filters.minRating === r ? 'bg-amber-50 text-amber-700 font-bold' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-3 h-3 ${i < r ? 'fill-amber-400' : 'text-gray-300'}`} />
                ))}
              </div>
              <span>& Up</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm h-fit">
        {content}
      </aside>

      {/* Mobile Filter Modal / Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onCloseMobile} />
          <div className="relative w-4/5 max-w-xs h-full bg-white shadow-2xl p-5 overflow-y-auto ml-auto animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <h3 className="font-extrabold text-gray-900 text-lg">Filters</h3>
              <button onClick={onCloseMobile} className="p-2 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            {content}
          </div>
        </div>
      )}
    </>
  );
};
