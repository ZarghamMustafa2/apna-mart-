import React from 'react';
import { useAdminData } from '../../context/AdminDataContext';
import { mockProducts } from '../../data/mockProducts';
import { ProductCard } from '../common/ProductCard';
import { Product } from '../../types/product';
import { Sparkles } from 'lucide-react';

interface RelatedProductsProps {
  currentProduct: Product;
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({ currentProduct }) => {
  const { products } = useAdminData();
  const productList = products && products.length > 0 ? products : mockProducts;

  // Filter related products prioritized by subcategory -> category -> brand
  let related = productList.filter(
    (p) =>
      p.id !== currentProduct.id &&
      p.subcategory &&
      currentProduct.subcategory &&
      p.subcategory.toLowerCase() === currentProduct.subcategory.toLowerCase()
  );

  // Fallback to same category if fewer than 4 products
  if (related.length < 4) {
    const sameCat = productList.filter(
      (p) =>
        p.id !== currentProduct.id &&
        !related.some((r) => r.id === p.id) &&
        (p.categoryId === currentProduct.categoryId ||
          p.category.toLowerCase() === currentProduct.category.toLowerCase())
    );
    related = [...related, ...sameCat];
  }

  // Fallback to same brand if still fewer than 4 products
  if (related.length < 4) {
    const sameBrand = productList.filter(
      (p) =>
        p.id !== currentProduct.id &&
        !related.some((r) => r.id === p.id) &&
        p.brand.toLowerCase() === currentProduct.brand.toLowerCase()
    );
    related = [...related, ...sameBrand];
  }

  const finalRelated = related.slice(0, 4);

  if (finalRelated.length === 0) return null;

  return (
    <section className="mt-12 pt-8 border-t border-gray-100">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-brand-600" />
        <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">
          You May Also Like
        </h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6">
        {finalRelated.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};
