import React, { useState } from 'react';
import { useAdminData } from '../../context/AdminDataContext';
import { PromoBanner } from '../../data/mockBanners';
import { ImageUploader } from '../../components/common/ImageUploader';
import { Plus, Trash2, Edit3, X, Image as ImageIcon } from 'lucide-react';

export const AdminBannersPage: React.FC = () => {
  const { promoBanners, updatePromoBanners } = useAdminData();
  const [banners, setBanners] = useState<PromoBanner[]>(promoBanners);

  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<PromoBanner | null>(null);

  // Form State
  const [tag, setTag] = useState('SPECIAL DEAL');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [buttonText, setButtonText] = useState('Shop Now');
  const [buttonLink, setButtonLink] = useState('/shop');
  const [image, setImage] = useState('');

  const handleOpenAdd = () => {
    setEditingBanner(null);
    setTag('HOT OFFER');
    setTitle('');
    setSubtitle('');
    setButtonText('Shop Now');
    setButtonLink('/shop');
    setImage('');
    setShowModal(true);
  };

  const handleOpenEdit = (banner: PromoBanner) => {
    setEditingBanner(banner);
    setTag(banner.tag);
    setTitle(banner.title);
    setSubtitle(banner.subtitle);
    setButtonText(banner.buttonText);
    setButtonLink(banner.buttonLink);
    setImage(banner.image);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      alert('Please upload a banner image.');
      return;
    }

    let updated: PromoBanner[];
    if (editingBanner) {
      updated = banners.map((b) =>
        b.id === editingBanner.id
          ? { ...b, tag, title, subtitle, buttonText, buttonLink, image }
          : b
      );
    } else {
      const newBanner: PromoBanner = {
        id: `promo-${Date.now()}`,
        tag,
        title,
        subtitle,
        buttonText,
        buttonLink,
        image,
      };
      updated = [newBanner, ...banners];
    }

    setBanners(updated);
    updatePromoBanners(updated);
    setShowModal(false);
  };

  const handleDeleteBanner = (id: string) => {
    if (window.confirm('Are you sure you want to remove this promotional banner?')) {
      const updated = banners.filter((b) => b.id !== id);
      setBanners(updated);
      updatePromoBanners(updated);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600">Marketing Assets</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-0.5">
            Banner Management ({banners.length})
          </h1>
          <p className="text-xs text-gray-500 font-medium">Manage promotional banners displayed on the customer storefront</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all hover:scale-105 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Promo Banner</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((b) => (
          <div key={b.id} className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-3 relative overflow-hidden group">
            <div className="aspect-[2/1] rounded-2xl overflow-hidden bg-gray-100 mb-3 relative">
              <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
              <span className="absolute top-2 left-2 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-slate-900/90 text-white uppercase tracking-wider backdrop-blur-sm">
                {b.tag}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <h3 className="font-extrabold text-lg text-gray-900 truncate">{b.title}</h3>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => handleOpenEdit(b)}
                  className="p-1.5 text-gray-400 hover:text-brand-600 rounded-lg hover:bg-brand-50 transition-colors"
                  title="Edit banner"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteBanner(b.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                  title="Delete banner"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-xs text-gray-500">{b.subtitle}</p>

            <div className="text-[11px] font-mono text-brand-600 pt-2 border-t border-gray-100 flex items-center justify-between">
              <span>CTA: <strong>{b.buttonText}</strong></span>
              <span className="text-gray-400">Target: {b.buttonLink}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Banner Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-brand-600" />
                <span>{editingBanner ? 'Edit Promo Banner' : 'Create New Promo Banner'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Banner Tag</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. LIMITED TIME OFFER, SUPER SALE"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Headline Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flagship Smartphones"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Subtitle / Deal Details</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Save up to Rs. 13,000 on 5G Mobiles"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Button Text</label>
                  <input
                    type="text"
                    required
                    value={buttonText}
                    onChange={(e) => setButtonText(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Button Link</label>
                  <input
                    type="text"
                    required
                    value={buttonLink}
                    onChange={(e) => setButtonLink(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Direct Banner Image Uploader */}
              <ImageUploader
                value={image}
                onChange={setImage}
                label="Banner Graphic Image *"
                aspectRatio="banner"
                placeholderText="Upload high-res banner image (JPG, PNG, WebP)"
              />

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-colors"
                >
                  Save Banner
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="py-3 px-5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
