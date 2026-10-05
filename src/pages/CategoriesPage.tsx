import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mockCategories } from '../data/mockCategories';
import { mockProducts } from '../data/mockProducts';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { SEOHead } from '../components/common/SEOHead';
import { ArrowRight, Layers, PackageCheck } from 'lucide-react';

export const CategoriesPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-8 pb-20 sm:pb-24 lg:pb-8">
      <SEOHead
        title="All Product Categories | ApnaMart Pakistan"
        description="Explore 12 main product categories: Electronics, Fashion, Shoes, Bags & Accessories, Beauty, Home & Lifestyle, Sports, Gaming, Watches, Automotive, Kids & Office Supplies."
        canonicalUrl="https://apnamart.space/categories"
      />

      {/* Breadcrumbs */}
      <Breadcrumb items={[{ label: 'Categories' }]} />

      {/* Page Title Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-brand-900 rounded-2xl sm:rounded-3xl p-5 sm:p-12 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
        <div className="space-y-2 sm:space-y-3 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-extrabold bg-brand-500/20 text-brand-300 border border-brand-500/30 uppercase tracking-wider">
            <Layers className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            Full Catalog Directory
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Explore All 12 Main Categories
          </h1>
          <p className="text-xs sm:text-base text-slate-300 leading-relaxed font-normal">
            Discover authentic products across our specialized e-commerce departments. From top electronics to luxury fashion, footwear, beauty, gaming, and home decor.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 sm:p-5 rounded-2xl flex items-center gap-4 text-white self-start md:self-auto">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-brand-500 text-white flex items-center justify-center font-extrabold text-lg sm:text-xl shadow-lg">
            <PackageCheck className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold">{mockProducts.length}+</div>
            <div className="text-[10px] sm:text-xs text-slate-300 font-semibold uppercase tracking-wider">Available Products</div>
          </div>
        </div>
      </div>

      {/* 12 Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
        {mockCategories.map((category) => {
          const productCount = mockProducts.filter((p) => p.categoryId === category.id).length;

          return (
            <div
              key={category.id}
              className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              {/* Category Header Image */}
              <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                {/* Count Badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-slate-900 text-xs font-extrabold px-3 py-1.5 rounded-full shadow-md">
                  {productCount} Products
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-extrabold text-white tracking-tight drop-shadow-md">
                    {category.name}
                  </h3>
                </div>
              </div>

              {/* Category Details Body */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {category.description}
                  </p>

                  {/* Subcategories Tags */}
                  {category.subcategories && category.subcategories.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {category.subcategories.slice(0, 5).map((sub, idx) => {
                        const subName = typeof sub === 'string' ? sub : sub.name;
                        return (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-gray-100 text-gray-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
                          >
                            {subName}
                          </span>
                        );
                      })}
                      {category.subcategories.length > 5 && (
                        <span className="px-2 py-1 rounded-lg text-[11px] font-bold bg-gray-100 text-gray-400">
                          +{category.subcategories.length - 5} More
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* View Category Link */}
                <div className="pt-4 border-t border-gray-100">
                  <Link
                    to={`/category/${category.slug}`}
                    className="w-full py-3 px-4 bg-gray-900 hover:bg-brand-600 text-white text-xs font-extrabold rounded-xl shadow-md flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>Browse {category.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
