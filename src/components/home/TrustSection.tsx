import React from 'react';
import { ShieldCheck, RotateCcw, Truck, Headphones } from 'lucide-react';

export const TrustSection: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-3.5 sm:p-8 border border-gray-100 dark:border-slate-800 shadow-2xs">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
          
          <div className="flex items-center gap-2.5 sm:gap-4 p-2 sm:p-0">
            <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex-shrink-0">
              <ShieldCheck className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">100% Authentic</h4>
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">Official brand warranty</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-4 p-2 sm:p-0">
            <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex-shrink-0">
              <RotateCcw className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">7-Day Returns</h4>
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">Hassle-free refund</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-4 p-2 sm:p-0">
            <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-cyan-400 flex-shrink-0">
              <Truck className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">Fast Delivery</h4>
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">Express dispatch</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-4 p-2 sm:p-0">
            <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-brand-50 dark:bg-slate-800 text-brand-600 dark:text-cyan-400 flex-shrink-0">
              <Headphones className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">24/7 Support</h4>
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">WhatsApp & call</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
