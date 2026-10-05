import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap } from 'lucide-react';

export const DealsSection: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8 lg:py-12">
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-brand-950 text-white p-4 sm:p-8 lg:p-14 border border-slate-800 shadow-xl">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-red-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-center relative z-10">
          
          {/* Left Text & Discount Badge (7 cols) */}
          <div className="lg:col-span-7 space-y-3 sm:space-y-5 text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-extrabold bg-red-500/20 text-red-300 border border-red-500/40 tracking-wider">
              <Zap className="w-3.5 h-3.5 text-red-400" />
              <span>LIMITED TIME FLASH SALE</span>
            </span>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Deals Worth Grabbing.{' '}
              <span className="bg-gradient-to-r from-red-400 to-amber-300 bg-clip-text text-transparent">
                Up to 40% OFF.
              </span>
            </h2>

            <p className="text-xs sm:text-base text-slate-300 max-w-xl mx-auto lg:mx-0 line-clamp-2 sm:line-clamp-none">
              Limited time offers on flagship smartphones, noise-cancelling audio gear, and leather accessories.
            </p>

            {/* Countdown Preview */}
            <div className="flex items-center justify-center lg:justify-start gap-2.5 sm:gap-4 pt-0.5 sm:pt-1">
              {[
                { label: 'Hours', value: '18' },
                { label: 'Minutes', value: '42' },
                { label: 'Seconds', value: '09' },
              ].map((time, i) => (
                <div key={i} className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-slate-900/90 border border-slate-800 text-center min-w-[56px] sm:min-w-[70px]">
                  <div className="text-base sm:text-xl font-black text-amber-400">{time.value}</div>
                  <div className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase">{time.label}</div>
                </div>
              ))}
            </div>

            <div className="pt-2 sm:pt-4 flex justify-center lg:justify-start">
              <Link
                to="/shop?filter=sale"
                className="px-5 py-2.5 sm:px-8 sm:py-4 bg-red-500 hover:bg-red-600 text-white font-extrabold text-xs sm:text-sm rounded-xl sm:rounded-2xl shadow-lg shadow-red-500/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
              >
                <span>Grab Limited Deals</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Link>
            </div>
          </div>

          {/* Right Deal Image */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80"
              alt="Flash Deals Showcase"
              className="max-h-[160px] sm:max-h-[260px] lg:max-h-[320px] object-cover rounded-2xl sm:rounded-3xl shadow-xl border border-white/10 hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>

        </div>
      </div>
    </section>
  );
};
