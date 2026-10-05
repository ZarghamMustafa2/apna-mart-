import React from 'react';
import { Link } from 'react-router-dom';
import { mockCategories } from '../../data/mockCategories';
import { CategoryCard } from '../common/CategoryCard';
import { ArrowRight } from 'lucide-react';

export const FeaturedCategories: React.FC = () => {
  const categories = mockCategories && mockCategories.length > 0 ? mockCategories : [];
  if (categories.length === 0) return null;

  // Filter 6 featured categories for homepage
  const featuredCategories = categories.filter((c) => c.featured).slice(0, 6);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600">
            Explore Collection
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-1">
            Featured Categories
          </h2>
        </div>

        <Link
          to="/categories"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-50 hover:bg-brand-100 text-brand-700 font-extrabold text-xs rounded-xl transition-all self-start sm:self-auto border border-brand-200 shadow-sm"
        >
          <span>View All 12 Categories</span>
          <ArrowRight className="w-4 h-4 text-brand-600" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredCategories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
};
