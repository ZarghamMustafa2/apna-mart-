import React, { useState, useEffect } from 'react';
import { useAdminData } from '../../context/AdminDataContext';
import { HeroSlide, PromoBanner } from '../../data/mockBanners';
import { HomepageSections } from '../../services/cmsService';
import { ImageUploader } from '../../components/common/ImageUploader';
import { ApnaMartLogo } from '../../components/common/ApnaMartLogo';
import {
  Palette,
  Image as ImageIcon,
  Layers,
  Save,
  Check,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export const AdminWebsiteDesignPage: React.FC = () => {
  const {
    settings,
    updateSettings,
    heroSlides,
    updateHeroSlides,
    promoBanners,
    updatePromoBanners,
    homepageSections,
    updateHomepageSections,
  } = useAdminData();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'banners' | 'logo' | 'sections'>('banners');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Tab 1: Hero Slides & Promo Banners State
  const [slides, setSlides] = useState<HeroSlide[]>(heroSlides);
  const [banners, setBanners] = useState<PromoBanner[]>(promoBanners);

  // Tab 2: Logo & Branding State
  const [logoUrl, setLogoUrl] = useState(settings?.logoUrl || '');
  const [faviconUrl, setFaviconUrl] = useState(settings?.faviconUrl || '');
  const [storeName, setStoreName] = useState(settings?.storeName || 'ApnaMart');
  const [storeTagline, setStoreTagline] = useState(settings?.metaDescription || "Pakistan's Trusted Online Superstore");

  // Tab 3: Homepage Sections State
  const [sections, setSections] = useState<HomepageSections>(homepageSections);

  // Sync state with Context / IndexedDB when loaded
  useEffect(() => {
    if (heroSlides && heroSlides.length > 0) {
      setSlides(heroSlides);
    }
  }, [heroSlides]);

  useEffect(() => {
    if (promoBanners && promoBanners.length > 0) {
      setBanners(promoBanners);
    }
  }, [promoBanners]);

  useEffect(() => {
    if (homepageSections) {
      setSections(homepageSections);
    }
  }, [homepageSections]);

  useEffect(() => {
    if (settings) {
      setLogoUrl(settings.logoUrl || '');
      setFaviconUrl(settings.faviconUrl || '');
      setStoreName(settings.storeName || 'ApnaMart');
      setStoreTagline(settings.metaDescription || "Pakistan's Trusted Online Superstore");
    }
  }, [settings]);

  const showNotification = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Save Banners
  const handleSaveBanners = async () => {
    setIsSaving(true);
    try {
      await updateHeroSlides(slides);
      await updatePromoBanners(banners);
      showNotification();
    } catch (err) {
      console.error('Failed to save banners:', err);
      alert('Error saving banners. Please check your network or try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Save Logo & Brand Identity
  const handleSaveBranding = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateSettings({
        ...settings,
        logoUrl: logoUrl || undefined,
        faviconUrl: faviconUrl || undefined,
        storeName,
        metaDescription: storeTagline,
      });
      showNotification();
    } catch (err) {
      console.error('Failed to save branding:', err);
      alert('Error saving branding settings.');
    } finally {
      setIsSaving(false);
    }
  };

  // Save Homepage Section Settings
  const handleSaveSections = async () => {
    setIsSaving(true);
    try {
      await updateHomepageSections(sections);
      showNotification();
    } catch (err) {
      console.error('Failed to save section settings:', err);
      alert('Error saving section visibility settings.');
    } finally {
      setIsSaving(false);
    }
  };

  // Add a new hero banner slide
  const handleAddSlide = () => {
    const newSlide: HeroSlide = {
      id: `hero-${Date.now()}`,
      badge: 'SPECIAL SALE',
      title: 'New Featured Collection',
      subtitle: 'Shop the best deals available online with fast doorstep delivery.',
      buttonText: 'Shop Now',
      buttonLink: '/shop',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1200&q=80',
      bgGradient: 'from-slate-900 via-brand-950 to-slate-900',
    };
    setSlides([...slides, newSlide]);
  };

  // Remove slide
  const handleDeleteSlide = (index: number) => {
    if (slides.length <= 1) {
      alert('You must have at least one banner slide on the homepage.');
      return;
    }
    setSlides(slides.filter((_, i) => i !== index));
  };

  // Update slide field
  const handleUpdateSlideField = (index: number, field: keyof HeroSlide, value: string) => {
    const copy = [...slides];
    copy[index] = { ...copy[index], [field]: value };
    setSlides(copy);
  };

  // Update promo banner field
  const handleUpdateBannerField = (index: number, field: keyof PromoBanner, value: string) => {
    const copy = [...banners];
    copy[index] = { ...copy[index], [field]: value };
    setBanners(copy);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600">
            Easy Store Customizer
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-0.5">
            Website Design & Banners
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Change your homepage banners, upload your store logo, and choose what appears on your website.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-white border border-gray-200 hover:border-brand-500 hover:text-brand-600 text-gray-700 font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-xs transition-all"
            title="Open storefront in a new tab"
          >
            <ExternalLink className="w-4 h-4 text-brand-600" />
            <span>View Live Website</span>
          </a>

          {saveSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2 animate-fade-in">
              <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Changes saved successfully!</span>
            </div>
          )}
        </div>
      </div>

      {/* 3 Simple Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('banners')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all ${
            activeTab === 'banners'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Homepage Banners ({slides.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('logo')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all ${
            activeTab === 'logo'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Store Logo & Identity</span>
        </button>

        <button
          onClick={() => setActiveTab('sections')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all ${
            activeTab === 'sections'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Homepage Sections</span>
        </button>
      </div>

      {/* TAB 1: HOMEPAGE BANNERS */}
      {activeTab === 'banners' && (
        <div className="space-y-8">
          {/* Main Top Banner Slider */}
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white p-4 rounded-3xl border border-gray-100 shadow-xs">
              <div>
                <h2 className="text-base font-extrabold text-gray-900">Main Top Banners (Slider)</h2>
                <p className="text-xs text-gray-500">These banners slide across the very top of your homepage.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAddSlide}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Banner</span>
                </button>
                <button
                  type="button"
                  onClick={handleSaveBanners}
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-colors disabled:opacity-60"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : 'Save All Banners'}</span>
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {slides.map((slide, idx) => (
                <div key={slide.id} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <span className="text-xs font-extrabold text-brand-600 uppercase tracking-wider">
                      Banner Slide #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteSlide(idx)}
                      className="p-2 text-gray-400 hover:text-red-500 rounded-xl hover:bg-red-50 transition-colors"
                      title="Delete banner"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                    {/* Left: Banner Image Direct Uploader */}
                    <div>
                      <ImageUploader
                        value={slide.image}
                        onChange={(url) => handleUpdateSlideField(idx, 'image', url)}
                        label="Banner Image (Click or Drag photo here)"
                        aspectRatio="video"
                        placeholderText="Upload JPG, PNG or WebP image"
                      />
                    </div>

                    {/* Right: Text on Banner */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Badge Tag</label>
                        <input
                          type="text"
                          value={slide.badge}
                          onChange={(e) => handleUpdateSlideField(idx, 'badge', e.target.value)}
                          placeholder="e.g. SUMMER SALE, NEW ARRIVAL"
                          className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Headline Text</label>
                        <input
                          type="text"
                          value={slide.title}
                          onChange={(e) => handleUpdateSlideField(idx, 'title', e.target.value)}
                          placeholder="e.g. Best Deals on Mobile Phones"
                          className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Description / Subtitle</label>
                        <input
                          type="text"
                          value={slide.subtitle}
                          onChange={(e) => handleUpdateSlideField(idx, 'subtitle', e.target.value)}
                          placeholder="e.g. Up to 40% OFF with fast cash on delivery"
                          className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Button Text</label>
                          <input
                            type="text"
                            value={slide.buttonText}
                            onChange={(e) => handleUpdateSlideField(idx, 'buttonText', e.target.value)}
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Button Link</label>
                          <input
                            type="text"
                            value={slide.buttonLink}
                            onChange={(e) => handleUpdateSlideField(idx, 'buttonLink', e.target.value)}
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Special Offers Promo Banners (2 Cards below hero) */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs">
              <h2 className="text-base font-extrabold text-gray-900">Special Offer Cards (Promo Banners)</h2>
              <p className="text-xs text-gray-500">The 2 side-by-side promotional cards displayed below the hero slider.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {banners.slice(0, 2).map((banner, idx) => (
                <div key={banner.id || idx} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
                  <span className="text-xs font-extrabold text-brand-600 uppercase tracking-wider block border-b border-gray-100 pb-2">
                    Promo Card #{idx + 1}
                  </span>

                  <div>
                    <ImageUploader
                      value={banner.image}
                      onChange={(url) => handleUpdateBannerField(idx, 'image', url)}
                      label="Card Image"
                      aspectRatio="video"
                      placeholderText="Upload card photo"
                    />
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Tag</label>
                      <input
                        type="text"
                        value={banner.tag}
                        onChange={(e) => handleUpdateBannerField(idx, 'tag', e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        value={banner.title}
                        onChange={(e) => handleUpdateBannerField(idx, 'title', e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Subtitle</label>
                      <input
                        type="text"
                        value={banner.subtitle}
                        onChange={(e) => handleUpdateBannerField(idx, 'subtitle', e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Button Text</label>
                        <input
                          type="text"
                          value={banner.buttonText}
                          onChange={(e) => handleUpdateBannerField(idx, 'buttonText', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Button Link</label>
                        <input
                          type="text"
                          value={banner.buttonLink}
                          onChange={(e) => handleUpdateBannerField(idx, 'buttonLink', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleSaveBanners}
              disabled={isSaving}
              className="px-8 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg transition-all flex items-center gap-2 disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving Banners...' : 'Save All Banners'}</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: STORE LOGO & BRANDING */}
      {activeTab === 'logo' && (
        <form onSubmit={handleSaveBranding} className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h2 className="text-base font-extrabold text-gray-900">Store Brand Logo & Favicon</h2>
              <p className="text-xs text-gray-500 font-medium">
                Upload your custom logo here. It will immediately show on the website header, footer, and mobile drawer.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Store Logo Direct Upload */}
              <div className="space-y-3">
                <ImageUploader
                  value={logoUrl}
                  onChange={setLogoUrl}
                  label="Upload Store Logo (Header & Footer)"
                  aspectRatio="banner"
                  placeholderText="Upload your custom store logo (PNG, JPG, WebP)"
                />

                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-gray-800 block">Default Vector Logo:</span>
                    <span className="text-[11px] text-gray-500">Shown automatically if no custom logo is uploaded:</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl shadow-xs border border-gray-100">
                    <ApnaMartLogo size="sm" />
                  </div>
                </div>
              </div>

              {/* Favicon & Details */}
              <div className="space-y-4">
                <ImageUploader
                  value={faviconUrl}
                  onChange={setFaviconUrl}
                  label="Upload Browser Tab Icon (Favicon)"
                  aspectRatio="square"
                  placeholderText="Upload square 32x32 icon"
                />

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Store Brand Name
                  </label>
                  <input
                    type="text"
                    required
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Store Tagline / Slogan
                  </label>
                  <input
                    type="text"
                    value={storeTagline}
                    onChange={(e) => setStoreTagline(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="px-8 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg transition-all flex items-center gap-2 disabled:opacity-60"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : 'Save Store Logo & Name'}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 3: HOMEPAGE SECTIONS */}
      {activeTab === 'sections' && (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h2 className="text-base font-extrabold text-gray-900">Show or Hide Website Sections</h2>
            <p className="text-xs text-gray-500 font-medium">
              Click on any section below to toggle it Visible or Hidden on your customer website. Changes will persist permanently in your database.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { key: 'hero', title: '1. Top Banner Slider', desc: 'Large sliding promotional banners at the top of the homepage' },
              { key: 'categories', title: '2. Top Categories Grid', desc: 'Boxes showing Electronics, Fashion, Shoes, and Home categories' },
              { key: 'promo', title: '3. Special Offers Banners', desc: 'Two side-by-side promotional cards for special deals' },
              { key: 'products', title: '4. Featured Products Tabs', desc: 'New arrivals, best sellers, and trending product showcase' },
              { key: 'trust', title: '5. Why Choose Us Trust Badges', desc: 'Free shipping, cash on delivery, and 7-day return badges' },
              { key: 'testimonials', title: '6. Customer Reviews', desc: 'Verified buyer testimonials and ratings on the homepage' },
              { key: 'newsletter', title: '7. Discount Voucher Banner', desc: 'Sign up voucher box at the bottom of the page' },
            ].map((sec) => {
              const isEnabled = sections[sec.key as keyof HomepageSections];
              return (
                <div
                  key={sec.key}
                  onClick={() =>
                    setSections((prev) => ({
                      ...prev,
                      [sec.key]: !prev[sec.key as keyof HomepageSections],
                    }))
                  }
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between select-none ${
                    isEnabled
                      ? 'border-brand-600 bg-brand-50/40 text-gray-900 hover:border-brand-700'
                      : 'border-gray-200 bg-gray-50/60 text-gray-400 opacity-60 hover:opacity-80'
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-xs sm:text-sm font-extrabold block">{sec.title}</span>
                    <span className="text-[11px] text-gray-500 block">{sec.desc}</span>
                  </div>

                  <div className="flex-shrink-0 ml-3">
                    {isEnabled ? (
                      <span className="px-3 py-1 bg-brand-600 text-white text-[11px] font-extrabold rounded-full flex items-center gap-1 shadow-xs">
                        <Eye className="w-3.5 h-3.5" />
                        Visible
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-gray-200 text-gray-600 text-[11px] font-extrabold rounded-full flex items-center gap-1">
                        <EyeOff className="w-3.5 h-3.5" />
                        Hidden
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">
              Click &quot;Save Section Settings&quot; to apply changes immediately to your storefront.
            </span>
            <button
              type="button"
              onClick={handleSaveSections}
              disabled={isSaving}
              className="px-8 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg transition-all flex items-center gap-2 disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving Sections...' : 'Save Section Settings'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
