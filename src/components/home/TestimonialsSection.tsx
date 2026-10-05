import React from 'react';
import { Rating } from '../common/Rating';
import { Quote, CheckCircle2, Heart } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const reviews = [
    {
      name: 'Farhan Ali',
      role: 'Verified Buyer • Lahore',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      rating: 5,
      title: 'Unmatched Sound Quality & Rapid Delivery!',
      quote:
        'Ordered the UltraSound Pro Headphones on Tuesday and received them in Lahore by Thursday morning! Original brand sealed box, active noise cancellation is flawless, and the customer support team kept me updated via WhatsApp.',
    },
    {
      name: 'Sana Tariq',
      role: 'Verified Buyer • Karachi',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      rating: 5,
      title: 'Genuine Products with Easy Return Warranty',
      quote:
        'ApnaMart is my go-to online store in Pakistan for electronics. 100% authentic devices with manufacturer warranty.',
    },
    {
      name: 'Zayn Shah',
      role: 'Verified Buyer • Islamabad',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
      rating: 5,
      title: 'Fast COD Checkout Flow',
      quote:
        'Checkout took less than 30 seconds. Cash on delivery was seamless and the packaging was double bubble-wrapped!',
    },
  ];

  const featured = reviews[0];

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8 lg:py-12">
      <div className="text-center max-w-2xl mx-auto mb-4 sm:mb-8 space-y-1">
        <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-brand-600 dark:text-cyan-400 flex items-center justify-center gap-1.5">
          <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-brand-600 dark:fill-cyan-400" />
          Real Customer Feedback
        </span>
        <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Loved by Thousands of Shoppers
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6 items-stretch">
        
        {/* Large Featured Testimonial Spotlight Card (7 cols) */}
        {featured && (
          <div className="lg:col-span-7 bg-gradient-to-br from-brand-600 to-brand-800 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 flex flex-col justify-between shadow-xl relative overflow-hidden">
            <Quote className="absolute top-3 right-3 sm:top-4 sm:right-4 w-16 h-16 sm:w-24 sm:h-24 text-white/10 pointer-events-none" />

            <div className="space-y-2.5 sm:space-y-4 z-10">
              <div className="flex items-center gap-2">
                <Rating rating={featured.rating} showCount={false} size="sm" />
                <span className="px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-extrabold bg-white/20 text-white border border-white/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                  Verified Buyer
                </span>
              </div>

              <h3 className="text-base sm:text-2xl font-extrabold text-white leading-snug">
                "{featured.title}"
              </h3>

              <p className="text-xs sm:text-base text-brand-100 leading-relaxed font-normal line-clamp-3 sm:line-clamp-none">
                {featured.quote}
              </p>
            </div>

            <div className="pt-3 sm:pt-6 border-t border-white/20 flex items-center gap-3 sm:gap-4 z-10 mt-3 sm:mt-6">
              <img
                src={featured.avatar}
                alt={featured.name}
                className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl object-cover border-2 border-white shadow-xs"
              />
              <div>
                <h4 className="font-extrabold text-xs sm:text-sm text-white">{featured.name}</h4>
                <p className="text-[10px] sm:text-xs text-brand-200">{featured.role}</p>
              </div>
            </div>
          </div>
        )}

        {/* Secondary Testimonials (5 cols) */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5 sm:gap-4">
          {reviews.slice(1).map((rev, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border border-gray-100 dark:border-slate-800 shadow-2xs flex flex-col justify-between space-y-2 sm:space-y-3">
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex items-center justify-between">
                  <Rating rating={rev.rating} showCount={false} size="sm" />
                  <span className="text-[9px] sm:text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    Verified
                  </span>
                </div>
                <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">{rev.title}</h4>
                <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2 sm:line-clamp-3">
                  "{rev.quote}"
                </p>
              </div>

              <div className="flex items-center gap-2.5 pt-1.5 border-t border-gray-100 dark:border-slate-800">
                <img src={rev.avatar} alt={rev.name} className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover" />
                <div>
                  <h5 className="font-bold text-[11px] sm:text-xs text-slate-900 dark:text-white">{rev.name}</h5>
                  <p className="text-[10px] text-slate-400">{rev.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
