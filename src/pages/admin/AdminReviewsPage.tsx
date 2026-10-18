import React, { useState, useEffect } from 'react';
import { Rating } from '../../components/common/Rating';
import { CheckCircle2, EyeOff, Trash2, Star, Check, RefreshCw } from 'lucide-react';
import { getReviews, updateReviewStatus, deleteReview, CustomerReview } from '../../services/reviewService';
import { broadcastSync } from '../../context/AdminDataContext';

export const AdminReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const list = await getReviews();
      setReviews(list);
    } catch (e) {
      console.error('Error fetching admin reviews:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();

    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel('apnamart_db_sync');
      channel.onmessage = (event) => {
        if (event?.data?.type === 'APNAMART_SYNC') {
          fetchReviews();
        }
      };
      return () => {
        channel.close();
      };
    }
  }, []);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 2500);
  };

  const handleApprove = async (id: string) => {
    await updateReviewStatus(id, 'Approved');
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'Approved' } : r)));
    broadcastSync('reviews');
    showToast('Review approved! Visible on customer storefront.');
  };

  const handleHide = async (id: string) => {
    await updateReviewStatus(id, 'Hidden');
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'Hidden' } : r)));
    broadcastSync('reviews');
    showToast('Review hidden from customer storefront.');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this customer review?')) {
      await deleteReview(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
      broadcastSync('reviews');
      showToast('Review deleted permanently.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600">Customer Feedback</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-0.5">
            Reviews & Ratings Moderation ({reviews.length})
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Moderate verified buyer reviews. Approved reviews appear on customer product pages.
          </p>
        </div>

        <button
          onClick={fetchReviews}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors self-start"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Reviews</span>
        </button>
      </div>

      {successToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {isLoading ? (
        <div className="p-12 text-center text-gray-400">Loading customer reviews from database...</div>
      ) : reviews.length === 0 ? (
        <div className="p-12 text-center text-gray-400 bg-white rounded-3xl border border-gray-100">
          No customer reviews submitted yet.
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div key={rev.id} className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                <div>
                  <span className="font-extrabold text-sm text-gray-900">{rev.productName}</span>
                  <div className="text-xs text-gray-500">
                    By <strong>{rev.userName}</strong> on {rev.date}
                  </div>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    rev.status === 'Approved'
                      ? 'bg-emerald-50 text-emerald-700'
                      : rev.status === 'Pending'
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-red-50 text-red-700'
                  }`}
                >
                  {rev.status}
                </span>
              </div>

              <Rating rating={rev.rating} showCount={false} size="sm" />
              <p className="text-xs text-gray-700 italic">&quot;{rev.comment}&quot;</p>

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
                  className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                  title="Delete Review"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
