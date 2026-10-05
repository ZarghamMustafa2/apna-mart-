import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { mockPromoBanners } from '../../data/mockBanners';

export const PromoBanners: React.FC = () => {
  const banners = mockPromoBanners && mockPromoBanners.length > 0 ? mockPromoBanners : [];

  if (banners.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="group relative overflow-hidden rounded-2xl sm:rounded-3xl bg-slate-900 text-white p-5 sm:p-10 min-h-[180px] sm:min-h-[260px] flex flex-col justify-between shadow-lg"
          >
            {/* Background Image with Overlay */}
            <img
              src={banner.image}
              alt={banner.title}
              className="absolute inset-0 w-full h-full object-cover object-center opacity-40 group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />

            {/* Content */}
            <div className="relative z-10 space-y-1 sm:space-y-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-extrabold bg-brand-500 text-white uppercase tracking-wider">
                {banner.tag}
              </span>
              <h3 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight pt-1">
                {banner.title}
              </h3>
              <p className="text-[11px] sm:text-sm text-slate-300 font-medium max-w-xs line-clamp-2">
                {banner.subtitle}
              </p>
            </div>

            <div className="relative z-10 pt-2 sm:pt-4">
              <Link
                to={banner.buttonLink}
                className="inline-flex items-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 bg-white text-slate-900 hover:bg-brand-500 hover:text-white font-extrabold text-[11px] sm:text-xs rounded-xl transition-all shadow-xs active:scale-95"
              >
                <span>{banner.buttonText}</span>
                <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
