import React from 'react';
import { Link } from 'react-router-dom';
import { useAdminData } from '../../context/AdminDataContext';
import { ArrowRight, Sparkles } from 'lucide-react';

export const ShopByCategorySection: React.FC = () => {
  const { categories } = useAdminData();
  const categoryList = categories && categories.length > 0 ? categories : [];

  if (categoryList.length === 0) return null;

  const featuredCategory = categoryList[0];
  const secondaryCategories = categoryList.slice(1, 5);
  // Show first 6 categories in the 2-column mobile grid
  const mobileCategories = categoryList.slice(0, 6);

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8 lg:py-12">
      <div className="flex items-center justify-between gap-3 mb-4 sm:mb-8">
        <div>
          <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-brand-600 dark:text-cyan-400 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            Curated Collections
          </span>
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5">
            Shop by Category
          </h2>
        </div>

        <Link
          to="/categories"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-5 sm:py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 font-extrabold text-[11px] sm:text-xs rounded-xl sm:rounded-2xl transition-all border border-gray-200 dark:border-slate-700 shadow-2xs flex-shrink-0"
        >
          <span>All Categories</span>
          <ArrowRight className="w-3.5 h-3.5 text-brand-600 dark:text-cyan-400" />
        </Link>
      </div>

      {/* MOBILE: Compact 2-Column Category Grid (< lg) */}
      <div className="grid grid-cols-2 lg:hidden gap-2.5 sm:gap-4">
        {mobileCategories.map((cat) => (
          <Link
            key={cat.id}
            to={`/shop?category=${cat.slug}`}
            className="group relative overflow-hidden rounded-2xl bg-slate-900 aspect-[4/3] block shadow-md border border-slate-800 active:scale-[0.98] transition-transform"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-80"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-2.5 sm:p-4 text-white">
              <span className="text-[10px] sm:text-xs font-semibold text-cyan-300">
                {cat.itemCount} Items
              </span>
              <div className="flex items-center justify-between gap-1 mt-0.5">
                <h3 className="text-xs sm:text-sm font-extrabold text-white truncate group-hover:text-cyan-300 transition-colors">
                  {cat.name}
                </h3>
                <span className="p-1 rounded-full bg-white/20 backdrop-blur-xs text-white group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors flex-shrink-0">
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* DESKTOP: Asymmetric Editorial Layout (>= lg) */}
      <div className="hidden lg:grid lg:grid-cols-12 gap-6">
        {/* Large Featured Category Card (7 cols) */}
        {featuredCategory && (
          <Link
            to={`/shop?category=${featuredCategory.slug}`}
            className="lg:col-span-7 group relative overflow-hidden rounded-3xl bg-slate-900 aspect-[16/9] block shadow-xl hover:shadow-2xl transition-all duration-500 border border-slate-800"
          >
            <img
              src={featuredCategory.image}
              alt={featuredCategory.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-8 text-white">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 mb-2 w-fit">
                Featured Department • {featuredCategory.itemCount} Items
              </span>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight group-hover:text-cyan-300 transition-colors">
                    {featuredCategory.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md line-clamp-2">
                    Browse top-tier authentic selection with fast nationwide dispatch.
                  </p>
                </div>
                <span className="p-3.5 rounded-2xl bg-white/20 backdrop-blur-md group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all flex-shrink-0">
                  <ArrowRight className="w-5 h-5" />
                </span>
              </div>
            </div>
          </Link>
        )}

        {/* Secondary Category Cards Grid (5 cols) */}
        <div className="lg:col-span-5 grid grid-cols-1 gap-6">
          {secondaryCategories.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.slug}`}
              className="group relative overflow-hidden rounded-3xl bg-slate-900 aspect-[16/7] block shadow-md hover:shadow-xl transition-all duration-500 border border-slate-800"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent flex flex-col justify-end p-5 text-white">
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 mb-0.5">
                  {cat.itemCount} Products
                </span>
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-extrabold group-hover:text-cyan-300 transition-colors">
                    {cat.name}
                  </h4>
                  <span className="p-2 rounded-xl bg-white/20 backdrop-blur-md group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
