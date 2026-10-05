import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAdminData } from '../context/AdminDataContext';
import { mockCategories } from '../data/mockCategories';
import { mockProducts } from '../data/mockProducts';
import { ProductCard } from '../components/common/ProductCard';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { SEOHead } from '../components/common/SEOHead';
import { ArrowRight, Grid, Tag, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

export const CategoryPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const { categories, products } = useAdminData();
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const categoryList = categories && categories.length > 0 ? categories : mockCategories;
  const productList = products && products.length > 0 ? products : mockProducts;

  const category = categoryList.find((c) => c.slug === categorySlug) || categoryList[0];

  useEffect(() => {
    window.scrollTo(0, 0);
    setSelectedSubcategory(null);
    setCurrentPage(1);
  }, [categorySlug]);

  let categoryProducts = productList.filter(
    (p) => p.categoryId === category.id || p.category.toLowerCase() === category.name.toLowerCase()
  );

  if (selectedSubcategory) {
    categoryProducts = categoryProducts.filter(
      (p) => p.subcategory?.toLowerCase() === selectedSubcategory.toLowerCase()
    );
  }

  // Pagination calculation
  const totalPages = Math.ceil(categoryProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = categoryProducts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 pb-20 sm:pb-24 lg:pb-8">
      <SEOHead
        title={`${category.name} Products | ApnaMart Pakistan`}
        description={category.description}
        canonicalUrl={`https://apnamart.space/category/${category.slug}`}
      />

      <Breadcrumb items={[{ label: 'Categories', link: '/categories' }, { label: category.name }]} />

      {/* Category Hero Banner - Compact on mobile */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-slate-900 text-white min-h-[110px] sm:min-h-[180px] flex items-center p-4 sm:p-8 shadow-lg">
        <img
          src={category.image}
          alt={category.name}
          className="absolute inset-0 w-full h-full object-cover opacity-30"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        <div className="relative z-10 space-y-1 sm:space-y-2 max-w-xl">
          <span className="px-2.5 py-0.5 rounded-full text-[9px] sm:text-[11px] font-extrabold bg-brand-500 text-white uppercase tracking-wider inline-block">
            Department Showcase
          </span>
          <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">{category.name}</h1>
          <p className="text-[11px] sm:text-sm text-slate-300 leading-tight sm:leading-relaxed line-clamp-2 sm:line-clamp-none">{category.description}</p>
        </div>
      </div>

      {/* Subcategories Chips - Horizontal swipe on mobile */}
      {category.subcategories && category.subcategories.length > 0 && (
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-extrabold text-gray-900 dark:text-white flex items-center gap-1.5 uppercase tracking-wider">
              <Tag className="w-3.5 h-3.5 text-brand-600 dark:text-cyan-400" />
              Subcategories
            </h3>

            {selectedSubcategory && (
              <button
                onClick={() => {
                  setSelectedSubcategory(null);
                  setCurrentPage(1);
                }}
                className="text-xs font-bold text-brand-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Show All</span>
              </button>
            )}
          </div>

          <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none sm:flex-wrap">
            {category.subcategories.map((sub, idx) => {
              const subName = typeof sub === 'string' ? sub : sub.name;
              const isSelected = selectedSubcategory?.toLowerCase() === subName.toLowerCase();
              const subCount = productList.filter(
                (p) =>
                  (p.categoryId === category.id || p.category.toLowerCase() === category.name.toLowerCase()) &&
                  p.subcategory?.toLowerCase() === subName.toLowerCase()
              ).length;

              return (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedSubcategory(isSelected ? null : subName);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 shadow-xs border ${
                    isSelected
                      ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-700 dark:text-slate-300 hover:border-brand-500 hover:bg-brand-50 hover:text-brand-700'
                  }`}
                >
                  <span>{subName}</span>
                  {subCount > 0 && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {subCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Category Products */}
      <div className="space-y-4 sm:space-y-6 pt-1">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-3 sm:pb-4">
          <h3 className="text-sm sm:text-lg font-extrabold text-gray-900 dark:text-white flex items-center gap-1.5 sm:gap-2 truncate">
            <Grid className="w-4 h-4 text-brand-600 dark:text-cyan-400 shrink-0" />
            <span className="truncate">
              {selectedSubcategory ? `${selectedSubcategory}` : `All ${category.name}`}
            </span>
            <span className="text-[11px] sm:text-xs font-semibold text-gray-400 shrink-0">
              ({paginatedProducts.length}/{categoryProducts.length})
            </span>
          </h3>
          <Link
            to={`/shop?category=${encodeURIComponent(category.name)}`}
            className="text-xs font-bold text-brand-600 dark:text-cyan-400 hover:underline flex items-center gap-1 shrink-0 ml-2"
          >
            <span>Filter Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {paginatedProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Category Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-6 border-t border-gray-100 text-xs">
                <button
                  onClick={() => {
                    setCurrentPage((p) => Math.max(p - 1, 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-xl border border-gray-200 font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center gap-1.5 font-semibold text-gray-600">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => {
                        setCurrentPage(pageNum);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`w-8 h-8 rounded-xl font-bold transition-all ${
                        currentPage === pageNum
                          ? 'bg-brand-600 text-white shadow-md'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setCurrentPage((p) => Math.min(p + 1, totalPages));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-xl border border-gray-200 font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="py-12 text-center bg-white rounded-3xl border border-gray-100 p-8 space-y-3">
            <h4 className="text-lg font-extrabold text-gray-900">No Products Found</h4>
            <p className="text-xs text-gray-500">
              No products found in this subcategory selection. Try clicking another subcategory or clear filters.
            </p>
            {selectedSubcategory && (
              <button
                onClick={() => {
                  setSelectedSubcategory(null);
                  setCurrentPage(1);
                }}
                className="px-5 py-2.5 bg-brand-600 text-white font-extrabold text-xs rounded-xl shadow-md inline-flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Show All {category.name}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
