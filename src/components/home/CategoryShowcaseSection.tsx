import React from 'react';
import { Link } from 'react-router-dom';
import { useAdminData } from '../../context/AdminDataContext';
import { ProductCard } from '../common/ProductCard';
import { ArrowRight, Layers } from 'lucide-react';

export const CategoryShowcaseSection: React.FC = () => {
  const { categories, products } = useAdminData();
  const categoryList = categories && categories.length > 0 ? categories : [];
  const productList = products && products.length > 0 ? products : [];

  if (categoryList.length === 0 || productList.length === 0) return null;

  // Pick top 3 categories to showcase
  const showcaseCategories = categoryList.slice(0, 3);

  return (
    <div className="space-y-4 sm:space-y-8 my-3 sm:my-6">
      {showcaseCategories.map((cat) => {
        const catProducts = productList
          .filter((p) => p.categoryId === cat.id || p.category.toLowerCase() === cat.name.toLowerCase())
          .slice(0, 4);

        // Automatically hide category section if no products belong to it
        if (catProducts.length === 0) return null;

        return (
          <section key={cat.id} className="max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-4">
            <div className="flex items-center justify-between gap-3 mb-4 border-b border-gray-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-brand-600 dark:text-cyan-400 flex items-center gap-1.5">
                  <Layers className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  Department Showcase
                </span>
                <h2 className="text-xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mt-0.5">
                  {cat.name}
                </h2>
              </div>

              <Link
                to={`/category/${cat.slug}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-100 dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-slate-700 hover:text-brand-700 dark:hover:text-cyan-300 text-gray-800 dark:text-slate-200 font-extrabold text-[11px] sm:text-xs rounded-xl transition-all border border-gray-200 dark:border-slate-700 flex-shrink-0"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5 text-brand-600 dark:text-cyan-400" />
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
              {catProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};
