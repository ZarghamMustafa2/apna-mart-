import React from 'react';
import { Link } from 'react-router-dom';
import { useAdminData } from '../../context/AdminDataContext';
import { ProductCard } from '../common/ProductCard';
import { ArrowRight, Trophy } from 'lucide-react';

export const BestSellersSection: React.FC = () => {
  const { products } = useAdminData();
  const bestSellers = products ? products.filter((p) => p.badges.includes('Best Seller') || p.reviewCount > 10) : [];
  const displayList = bestSellers.length >= 4 ? bestSellers.slice(0, 4) : (products || []).slice(0, 4);

  if (displayList.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8 lg:py-12">
      <div className="flex items-center justify-between gap-3 mb-4 sm:mb-8">
        <div>
          <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
            <Trophy className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            Top Ranking Demands
          </span>
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5">
            Best Sellers
          </h2>
        </div>

        <Link
          to="/shop?filter=bestsellers"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-5 sm:py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 font-extrabold text-[11px] sm:text-xs rounded-xl sm:rounded-2xl transition-all border border-gray-200 dark:border-slate-700 shadow-2xs flex-shrink-0"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5 text-brand-600 dark:text-cyan-400" />
        </Link>
      </div>

      {/* 2-Column Mobile Grid & 4-Column Desktop Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
        {displayList.map((product, idx) => (
          <div key={product.id} className="relative group">
            {/* Rank Badge Indicator */}
            <div className="absolute -top-2 -left-1 sm:-top-3 sm:-left-2 z-20 w-7 h-7 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-slate-950 text-amber-400 font-black text-xs sm:text-sm flex items-center justify-center border border-amber-400/40 shadow-lg">
              0{idx + 1}
            </div>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};
