import React, { useState } from 'react';
import { useAdminData } from '../../context/AdminDataContext';
import { PromoBanner } from '../../data/mockBanners';
import { Image, Plus, Trash2, Edit3 } from 'lucide-react';

export const AdminBannersPage: React.FC = () => {
  const { promoBanners, updatePromoBanners } = useAdminData();
  const [banners, setBanners] = useState<PromoBanner[]>(promoBanners);

  const handleDeleteBanner = (id: string) => {
    const updated = banners.filter((b) => b.id !== id);
    setBanners(updated);
    updatePromoBanners(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600">Marketing Assets</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-0.5">
            Banner Management ({banners.length})
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((b) => (
          <div key={b.id} className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-3 relative overflow-hidden">
            <div className="aspect-[2/1] rounded-2xl overflow-hidden bg-gray-100 mb-3 relative">
              <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
              <span className="absolute top-2 left-2 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-slate-900 text-white uppercase">
                {b.tag}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-lg text-gray-900">{b.title}</h3>
              <button
                onClick={() => handleDeleteBanner(b.id)}
                className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-500">{b.subtitle}</p>

            <div className="text-[11px] font-mono text-brand-600 pt-2 border-t border-gray-100">
              CTA Link: <strong>{b.buttonLink}</strong> ({b.buttonText})
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
