import React, { useState } from 'react';
import { Rating } from '../../components/common/Rating';
import { CheckCircle2, EyeOff, Trash2, Star, Check } from 'lucide-react';

export const AdminReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState([
    { id: 'rev-1', product: 'UltraSound Pro Wireless Headphones', user: 'Zayn Shah', rating: 5, comment: 'Amazing sound quality and battery life!', status: 'Approved', date: '2026-08-22' },
    { id: 'rev-2', product: 'Apex Smartphone Pro 5G', user: 'Hamza Malik', rating: 5, comment: 'Superfast charging and smooth 120Hz display.', status: 'Approved', date: '2026-08-20' },
    { id: 'rev-3', product: 'ProRunner FlyMesh Sneakers', user: 'Usman Ali', rating: 4, comment: 'Very comfortable for daily workout routines.', status: 'Pending', date: '2026-08-24' },
  ]);

  const handleApprove = (id: string) => {
    setReviews(reviews.map((r) => (r.id === id ? { ...r, status: 'Approved' } : r)));
  };

  const handleHide = (id: string) => {
    setReviews(reviews.map((r) => (r.id === id ? { ...r, status: 'Hidden' } : r)));
  };

  const handleDelete = (id: string) => {
    setReviews(reviews.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600">Customer Feedback</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-0.5">
            Reviews & Ratings Moderation ({reviews.length})
          </h1>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((rev) => (
          <div key={rev.id} className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
              <div>
                <span className="font-extrabold text-sm text-gray-900">{rev.product}</span>
                <div className="text-xs text-gray-500">By <strong>{rev.user}</strong> on {rev.date}</div>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${rev.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' : rev.status === 'Pending' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>
                {rev.status}
              </span>
            </div>

            <Rating rating={rev.rating} showCount={false} size="sm" />
            <p className="text-xs text-gray-700 italic">"{rev.comment}"</p>

            <div className="pt-2 flex items-center justify-end gap-2">
              {rev.status !== 'Approved' && (
                <button
                  onClick={() => handleApprove(rev.id)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 transition-colors"
                >
                  <Check className="w-3.5 h-3.5" /> Approve
                </button>
              )}
              {rev.status !== 'Hidden' && (
                <button
                  onClick={() => handleHide(rev.id)}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl flex items-center gap-1 transition-colors"
                >
                  <EyeOff className="w-3.5 h-3.5" /> Hide
                </button>
              )}
              <button
                onClick={() => handleDelete(rev.id)}
                className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
