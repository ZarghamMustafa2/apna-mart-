import React, { useState } from 'react';
import { useAdminData } from '../../context/AdminDataContext';
import { HeroSlide } from '../../data/mockBanners';
import { LayoutTemplate, Plus, Edit3, Trash2, Eye, EyeOff, Save, Check } from 'lucide-react';

export const AdminCmsPage: React.FC = () => {
  const { heroSlides, updateHeroSlides } = useAdminData();
  const [slides, setSlides] = useState<HeroSlide[]>(heroSlides);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [sections, setSections] = useState({
    hero: true,
    categories: true,
    promo: true,
    products: true,
    trust: true,
    testimonials: true,
    newsletter: true,
  });

  const handleToggleSection = (key: keyof typeof sections) => {
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveCms = () => {
    updateHeroSlides(slides);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600">Storefront Builder</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-0.5">
            Homepage CMS & Content Management
          </h1>
        </div>

        <button
          onClick={handleSaveCms}
          className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Save Homepage Layout</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Homepage CMS layout changes updated! Visible on live store.</span>
        </div>
      )}

      {/* Section Visibility Manager */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h3 className="text-base font-extrabold text-gray-900 border-b border-gray-100 pb-3">
          Homepage Section Controls
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { key: 'hero', label: '1. Hero Banner Carousel' },
            { key: 'categories', label: '2. Featured Categories Grid' },
            { key: 'promo', label: '3. Promotional Split Banners' },
            { key: 'products', label: '4. Discovery Products Tabs' },
            { key: 'trust', label: '5. Why Choose Us Trust Section' },
            { key: 'testimonials', label: '6. Verified Reviews & Testimonials' },
            { key: 'newsletter', label: '7. Newsletter Voucher Banner' },
          ].map((sec) => {
            const isVisible = sections[sec.key as keyof typeof sections];
            return (
              <div
                key={sec.key}
                onClick={() => handleToggleSection(sec.key as any)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                  isVisible ? 'border-brand-600 bg-brand-50/50' : 'border-gray-100 bg-gray-50/50 opacity-60'
                }`}
              >
                <span className="text-xs font-bold text-gray-900">{sec.label}</span>
                {isVisible ? <Eye className="w-4 h-4 text-brand-600" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Hero Slide Manager */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h3 className="text-base font-extrabold text-gray-900 border-b border-gray-100 pb-3">
          Hero Slider Slides ({slides.length})
        </h3>

        <div className="space-y-4">
          {slides.map((slide, idx) => (
            <div key={slide.id} className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-brand-600">Slide #{idx + 1} - {slide.badge}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={slide.title}
                  onChange={(e) => {
                    const copy = [...slides];
                    copy[idx].title = e.target.value;
                    setSlides(copy);
                  }}
                  className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold"
                />
                <input
                  type="text"
                  value={slide.subtitle}
                  onChange={(e) => {
                    const copy = [...slides];
                    copy[idx].subtitle = e.target.value;
                    setSlides(copy);
                  }}
                  className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
