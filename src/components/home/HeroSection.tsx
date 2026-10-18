import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Volume2, ShieldCheck, Zap, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { mockHeroSlides } from '../../data/mockBanners';

export const HeroSection: React.FC = () => {
  const { heroSlides } = useAdminData();
  const slides = heroSlides && heroSlides.length > 0 ? heroSlides : mockHeroSlides;
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Reset to first slide if out of bounds
  useEffect(() => {
    if (currentSlideIndex >= slides.length) {
      setCurrentSlideIndex(0);
    }
  }, [slides.length, currentSlideIndex]);

  // Auto-advance if multiple slides
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const activeSlide = slides[currentSlideIndex] || slides[0] || mockHeroSlides[0];

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl mx-3 sm:mx-6 my-3 sm:my-6 transition-colors duration-300 bg-slate-950 text-white border border-slate-800 shadow-xl group">
      {/* Ambient Glowing Light Effects */}
      <div className="absolute top-0 right-0 w-72 sm:w-[500px] h-72 sm:h-[500px] bg-cyan-500/15 blur-[80px] sm:blur-[120px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 left-0 w-64 sm:w-[400px] h-64 sm:h-[400px] bg-brand-600/20 blur-[70px] sm:blur-[100px] rounded-full pointer-events-none" />

      <div className="relative min-h-0 lg:min-h-[500px] flex items-center p-4 sm:p-8 lg:p-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 lg:gap-12 items-center max-w-7xl mx-auto w-full z-10">
          
          {/* Left Text & CTA Container (7 cols on desktop) */}
          <div className="lg:col-span-7 space-y-3 sm:space-y-5 text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 tracking-wider">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400" />
              <span>{activeSlide.badge || 'SPECIAL OFFER'}</span>
            </span>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight sm:leading-[1.12]">
              {activeSlide.title}
            </h1>

            <p className="text-xs sm:text-base text-slate-300 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed line-clamp-2 sm:line-clamp-none">
              {activeSlide.subtitle}
            </p>

            {/* Feature Indicators */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5 sm:gap-2.5 pt-0.5 sm:pt-1">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-md text-[10px] sm:text-xs font-bold text-slate-200 shadow-xs">
                <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Premium Authentic</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-md text-[10px] sm:text-xs font-bold text-slate-200 shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>7-Day Return</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-md text-[10px] sm:text-xs font-bold text-slate-200 shadow-xs">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Fast Nationwide Delivery</span>
              </div>
            </div>

            {/* Hero CTAs */}
            <div className="pt-1.5 sm:pt-3 flex items-center justify-center lg:justify-start gap-2.5 sm:gap-4">
              <Link
                to={activeSlide.buttonLink || '/shop'}
                className="px-5 py-2.5 sm:px-8 sm:py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl sm:rounded-2xl shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
              >
                <span>{activeSlide.buttonText || 'Shop Now'}</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Link>
              <Link
                to="/shop?filter=sale"
                className="px-4 py-2.5 sm:px-7 sm:py-3.5 bg-slate-900/90 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl sm:rounded-2xl border border-slate-700 backdrop-blur-md transition-all hover:scale-105 active:scale-95"
              >
                Explore Deals
              </Link>
            </div>
          </div>

          {/* Right Product Image Composition (5 cols on desktop) */}
          <div className="lg:col-span-5 relative flex items-center justify-center min-h-[180px] sm:min-h-[260px] lg:min-h-[380px]">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-cyan-500/20 blur-2xl sm:blur-3xl rounded-full" />
            
            {/* Floating Rating Badge */}
            <div className="absolute -top-2 -left-2 sm:-top-3 sm:-left-3 z-20 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700 backdrop-blur-md shadow-xl hidden sm:flex items-center gap-2">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <div>
                <div className="text-[11px] font-extrabold text-white">4.9 / 5.0</div>
                <div className="text-[9px] text-slate-400 font-medium">1,240+ Reviews</div>
              </div>
            </div>

            {/* Banner/Product Image */}
            <img
              key={activeSlide.id || currentSlideIndex}
              src={activeSlide.image}
              alt={activeSlide.title}
              className="relative max-h-[180px] sm:max-h-[280px] lg:max-h-[380px] w-auto max-w-full object-contain sm:object-cover rounded-2xl sm:rounded-3xl shadow-xl border border-white/10 hover:scale-105 transition-transform duration-500 z-10"
              fetchPriority="high"
            />
          </div>

        </div>
      </div>

      {/* Slide Navigation Arrows (only if multiple slides) */}
      {slides.length > 1 && (
        <>
          <button
            onClick={handlePrevSlide}
            aria-label="Previous Banner Slide"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700 backdrop-blur-md opacity-70 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={handleNextSlide}
            aria-label="Next Banner Slide"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700 backdrop-blur-md opacity-70 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Indicator Dots */}
          <div className="absolute bottom-3 left-0 right-0 z-20 flex items-center justify-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlideIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all ${
                  idx === currentSlideIndex
                    ? 'w-6 bg-cyan-400'
                    : 'w-2 bg-slate-600 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};
