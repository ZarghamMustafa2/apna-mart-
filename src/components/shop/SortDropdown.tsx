import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import { useFilters } from '../../context/FilterContext';
import { SortOption } from '../../types/filter';

export const SortDropdown: React.FC = () => {
  const { filters, setSortBy } = useFilters();

  const options: { value: SortOption; label: string }[] = [
    { value: 'newest', label: 'Newest Arrivals' },
    { value: 'price-low-high', label: 'Price: Low to High' },
    { value: 'price-high-low', label: 'Price: High to Low' },
    { value: 'most-popular', label: 'Most Popular' },
    { value: 'best-selling', label: 'Best Selling' },
    { value: 'highest-rated', label: 'Highest Rated' },
  ];

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 hidden sm:block" />
      <span className="text-xs font-bold text-gray-500 dark:text-gray-400 hidden sm:block">Sort:</span>
      <select
        value={filters.sortBy}
        onChange={(e) => setSortBy(e.target.value as SortOption)}
        className="px-2.5 py-1.5 sm:px-3 sm:py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-bold text-gray-800 dark:text-slate-200 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 cursor-pointer shadow-2xs"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="dark:bg-slate-900 dark:text-slate-200">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
