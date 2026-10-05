import React from 'react';
import { Link } from 'react-router-dom';
import { useAdminData } from '../../context/AdminDataContext';
import { ProductCard } from '../common/ProductCard';
import { ArrowRight, Sparkles } from 'lucide-react';

export const NewArrivalsSection: React.FC = () => {
  const { products } = useAdminData();
  const newArrivals = products ? products.filter((p) => p.badges.includes('New')) : [];
  const displayList = newArrivals.length >= 4 ? newArrivals.slice(0, 4) : (products || []).slice(0, 4);

  if (displayList.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8 lg:py-12">
      <div className="flex items-center justify-between gap-3 mb-4 sm:mb-8">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-0.5">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            Just Landed
          </span>
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5">
            New Arrivals
          </h2>
        </div>

        <Link
          to="/shop?filter=new"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-5 sm:py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 font-extrabold text-[11px] sm:text-xs rounded-xl sm:rounded-2xl transition-all border border-gray-200 dark:border-slate-700 shadow-2xs flex-shrink-0"
        >
          <span>Explore All</span>
          <ArrowRight className="w-3.5 h-3.5 text-brand-600 dark:text-cyan-400" />
        </Link>
      </div>

      {/* 2-Column Mobile Grid & 4-Column Desktop Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
        {displayList.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};
