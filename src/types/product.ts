export type ProductBadge = 'New' | 'Sale' | 'Best Seller' | 'Featured' | 'Trending';

export interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  attributes: Record<string, string>;
  regularPrice: number;
  salePrice?: number;
  stock: number;
  image?: string;
}

export interface SpecificationItem {
  name: string;
  value: string;
}

export interface SpecificationGroup {
  groupName: string;
  items: SpecificationItem[];
}

export interface ProductReview {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  sku: string;
  category: string;
  categoryId: string;
  subcategory?: string;
  subcategoryId?: string;
  shortDescription: string;
  description: string;
  regularPrice: number;
  salePrice?: number;
  stock: number;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  badges: ProductBadge[];
  images: string[];
  videoUrl?: string;
  hasVariants?: boolean;
  variants?: ProductVariant[];
  variantAttributes?: {
    name: string;
    options: string[];
  }[];
  specifications: (SpecificationItem | SpecificationGroup)[];
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  createdAt: string;
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  itemCount?: number;
  image?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  image: string;
  itemCount?: number;
  subcategories: Subcategory[];
  status?: string;
  featured?: boolean;
}
