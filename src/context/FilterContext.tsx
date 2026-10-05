import React, { createContext, useContext, useState } from 'react';
import { FilterState, SortOption } from '../types/filter';

interface FilterContextType {
  filters: FilterState;
  setSearchQuery: (query: string) => void;
  setCategory: (categorySlug: string) => void;
  setSubcategory: (subcategorySlug: string) => void;
  toggleBrand: (brand: string) => void;
  setPriceRange: (min: number, max: number) => void;
  toggleSize: (size: string) => void;
  toggleColor: (color: string) => void;
  setInStockOnly: (inStock: boolean) => void;
  setMinRating: (rating: number) => void;
  setSortBy: (sort: SortOption) => void;
  resetFilters: () => void;
}

const initialFilterState: FilterState = {
  searchQuery: '',
  category: '',
  subcategory: '',
  brands: [],
  minPrice: 0,
  maxPrice: 200000,
  sizes: [],
  colors: [],
  inStockOnly: false,
  minRating: 0,
  sortBy: 'newest',
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<FilterState>(initialFilterState);

  const setSearchQuery = (searchQuery: string) => {
    setFilters(prev => ({ ...prev, searchQuery }));
  };

  const setCategory = (category: string) => {
    setFilters(prev => ({ ...prev, category, subcategory: '' }));
  };

  const setSubcategory = (subcategory: string) => {
    setFilters(prev => ({ ...prev, subcategory }));
  };

  const toggleBrand = (brand: string) => {
    setFilters(prev => {
      const exists = prev.brands.includes(brand);
      return {
        ...prev,
        brands: exists ? prev.brands.filter(b => b !== brand) : [...prev.brands, brand],
      };
    });
  };

  const setPriceRange = (minPrice: number, maxPrice: number) => {
    setFilters(prev => ({ ...prev, minPrice, maxPrice }));
  };

  const toggleSize = (size: string) => {
    setFilters(prev => {
      const exists = prev.sizes.includes(size);
      return {
        ...prev,
        sizes: exists ? prev.sizes.filter(s => s !== size) : [...prev.sizes, size],
      };
    });
  };

  const toggleColor = (color: string) => {
    setFilters(prev => {
      const exists = prev.colors.includes(color);
      return {
        ...prev,
        colors: exists ? prev.colors.filter(c => c !== color) : [...prev.colors, color],
      };
    });
  };

  const setInStockOnly = (inStockOnly: boolean) => {
    setFilters(prev => ({ ...prev, inStockOnly }));
  };

  const setMinRating = (minRating: number) => {
    setFilters(prev => ({ ...prev, minRating }));
  };

  const setSortBy = (sortBy: SortOption) => {
    setFilters(prev => ({ ...prev, sortBy }));
  };

  const resetFilters = () => {
    setFilters(initialFilterState);
  };

  return (
    <FilterContext.Provider
      value={{
        filters,
        setSearchQuery,
        setCategory,
        setSubcategory,
        toggleBrand,
        setPriceRange,
        toggleSize,
        toggleColor,
        setInStockOnly,
        setMinRating,
        setSortBy,
        resetFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};
