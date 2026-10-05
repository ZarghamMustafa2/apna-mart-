import React from 'react';
import { Link } from 'react-router-dom';
import { useAdminData } from '../../context/AdminDataContext';
import { ProductCard } from '../common/ProductCard';
import { ArrowRight, Tag } from 'lucide-react';

export const SaleDealsSection: React.FC = () => {
  const { products } = useAdminData();
  const productList = products && products.length > 0 ? products : [];

  // Filter products with active sale price (max 8)
  const saleProducts = productList
    .filter((p) => p.salePrice && p.salePrice < p.regularPrice)
    .slice(0, 8);

  if (saleProducts.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8 lg:py-10 bg-red-50/40 dark:bg-red-950/20 rounded-2xl sm:rounded-3xl border border-red-100 dark:border-red-900/30 my-3 sm:my-6">
      <div className="flex items-center justify-between gap-3 mb-4 sm:mb-8">
        <div>
          <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-red-600 dark:text-red-400 flex items-center gap-1.5">
            <Tag className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-500" />
            Limited Time Offers
          </span>
          <h2 className="text-xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mt-0.5">
            Special Deals & Discounts
          </h2>
        </div>

        <Link
          to="/shop?filter=sale"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-5 sm:py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-[11px] sm:text-xs rounded-xl sm:rounded-2xl transition-all shadow-2xs flex-shrink-0"
        >
          <span>All Deals</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
        {saleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};
