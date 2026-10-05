import React from 'react';
import { X, RotateCcw } from 'lucide-react';
import { useFilters } from '../../context/FilterContext';

export const ActiveFilters: React.FC = () => {
  const {
    filters,
    setSearchQuery,
    setCategory,
    setSubcategory,
    toggleBrand,
    toggleSize,
    toggleColor,
    setInStockOnly,
    setMinRating,
    resetFilters,
  } = useFilters();

  const hasActiveFilters =
    filters.searchQuery ||
    filters.category ||
    filters.subcategory ||
    filters.brands.length > 0 ||
    filters.sizes.length > 0 ||
    filters.colors.length > 0 ||
    filters.inStockOnly ||
    filters.minRating > 0;

  if (!hasActiveFilters) return null;

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto py-2 mb-4 scrollbar-none sm:flex-wrap text-[11px] sm:text-xs">
      <span className="font-bold text-gray-500 dark:text-gray-400 shrink-0 mr-1 hidden sm:inline">Active:</span>

      {filters.searchQuery && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-full font-semibold text-gray-800 dark:text-slate-200 shrink-0 shadow-xs">
          "{filters.searchQuery}"
          <button onClick={() => setSearchQuery('')} className="hover:text-red-500 ml-0.5">
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {filters.category && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-cyan-400 border border-brand-200 dark:border-brand-800 rounded-full font-semibold shrink-0 shadow-xs">
          Cat: {filters.category}
          <button onClick={() => setCategory('')} className="hover:text-red-500 ml-0.5">
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {filters.subcategory && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-cyan-400 border border-brand-200 dark:border-brand-800 rounded-full font-semibold shrink-0 shadow-xs">
          Sub: {filters.subcategory}
          <button onClick={() => setSubcategory('')} className="hover:text-red-500 ml-0.5">
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {filters.brands.map((b) => (
        <span key={b} className="inline-flex items-center gap-1 px-2.5 py-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-full font-semibold text-gray-800 dark:text-slate-200 shrink-0 shadow-xs">
          {b}
          <button onClick={() => toggleBrand(b)} className="hover:text-red-500 ml-0.5">
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}

      {filters.sizes.map((s) => (
        <span key={s} className="inline-flex items-center gap-1 px-2.5 py-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-full font-semibold text-gray-800 dark:text-slate-200 shrink-0 shadow-xs">
          Size: {s}
          <button onClick={() => toggleSize(s)} className="hover:text-red-500 ml-0.5">
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}

      {filters.colors.map((c) => (
        <span key={c} className="inline-flex items-center gap-1 px-2.5 py-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-full font-semibold text-gray-800 dark:text-slate-200 shrink-0 shadow-xs">
          Color: {c}
          <button onClick={() => toggleColor(c)} className="hover:text-red-500 ml-0.5">
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}

      {filters.inStockOnly && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-full font-semibold shrink-0 shadow-xs">
          In Stock
          <button onClick={() => setInStockOnly(false)} className="hover:text-red-500 ml-0.5">
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {filters.minRating > 0 && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 rounded-full font-semibold shrink-0 shadow-xs">
          {filters.minRating}★+
          <button onClick={() => setMinRating(0)} className="hover:text-red-500 ml-0.5">
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      <button
        onClick={resetFilters}
        className="ml-auto text-[11px] font-bold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1 shrink-0 px-2 py-1"
      >
        <RotateCcw className="w-3 h-3" />
        <span>Clear</span>
      </button>
    </div>
  );
};
