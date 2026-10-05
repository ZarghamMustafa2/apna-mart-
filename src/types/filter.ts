export type SortOption =
  | 'newest'
  | 'price-low-high'
  | 'price-high-low'
  | 'most-popular'
  | 'best-selling'
  | 'highest-rated';

export interface FilterState {
  searchQuery: string;
  category: string;
  subcategory: string;
  brands: string[];
  minPrice: number;
  maxPrice: number;
  sizes: string[];
  colors: string[];
  inStockOnly: boolean;
  minRating: number;
  sortBy: SortOption;
}
