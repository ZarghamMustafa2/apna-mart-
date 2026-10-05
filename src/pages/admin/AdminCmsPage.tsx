import React, { useState } from 'react';
import { useAdminData } from '../../context/AdminDataContext';
import { HeroSlide } from '../../data/mockBanners';
import { ImageUploader } from '../../components/common/ImageUploader';
import { LayoutTemplate, Plus, Trash2, Eye, EyeOff, Save, Check, Image as ImageIcon } from 'lucide-react';

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

  const handleUpdateSlideField = (index: number, field: keyof HeroSlide, value: string) => {
    const copy = [...slides];
    copy[index] = { ...copy[index], [field]: value };
    setSlides(copy);
  };

  const handleAddSlide = () => {
    const newSlide: HeroSlide = {
      id: `hero-${Date.now()}`,
      badge: 'SPECIAL PROMO',
      title: 'New Featured Showcase',
      subtitle: 'Exclusive deals available for a limited time across all categories.',
      buttonText: 'Shop Collection',
      buttonLink: '/shop',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1200&q=80',
      bgGradient: 'from-slate-900 via-brand-950 to-slate-900',
    };
    setSlides([...slides, newSlide]);
  };

  const handleDeleteSlide = (index: number) => {
    if (slides.length <= 1) {
      alert('You must have at least one hero slide.');
      return;
    }
    const copy = slides.filter((_, i) => i !== index);
    setSlides(copy);
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
          <p className="text-xs text-gray-500 font-medium">Manage homepage slides, images, and live storefront layout</p>
        </div>

        <button
          onClick={handleSaveCms}
          className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-105"
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
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-gray-900">
              Hero Slider Slides ({slides.length})
            </h3>
            <p className="text-xs text-gray-500 font-medium">Customize high-impact banners and direct image uploads</p>
          </div>
          <button
            type="button"
            onClick={handleAddSlide}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Slide</span>
          </button>
        </div>

        <div className="space-y-6">
          {slides.map((slide, idx) => (
            <div key={slide.id} className="p-6 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <span className="text-xs font-extrabold uppercase text-brand-600 tracking-wider">
                  Slide #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleDeleteSlide(idx)}
                  className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  title="Remove slide"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Badge Tag</label>
                    <input
                      type="text"
                      value={slide.badge}
                      onChange={(e) => handleUpdateSlideField(idx, 'badge', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Slide Title</label>
                    <input
                      type="text"
                      value={slide.title}
                      onChange={(e) => handleUpdateSlideField(idx, 'title', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Subtitle</label>
                    <textarea
                      rows={2}
                      value={slide.subtitle}
                      onChange={(e) => handleUpdateSlideField(idx, 'subtitle', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Button Text</label>
                      <input
                        type="text"
                        value={slide.buttonText}
                        onChange={(e) => handleUpdateSlideField(idx, 'buttonText', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Button Link</label>
                      <input
                        type="text"
                        value={slide.buttonLink}
                        onChange={(e) => handleUpdateSlideField(idx, 'buttonLink', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold"
                      />
                    </div>
                  </div>
                </div>

                {/* Direct Slide Image Uploader */}
                <div>
                  <ImageUploader
                    value={slide.image}
                    onChange={(url) => handleUpdateSlideField(idx, 'image', url)}
                    label="Slide Featured Image"
                    aspectRatio="video"
                    placeholderText="Upload slide hero graphic"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
