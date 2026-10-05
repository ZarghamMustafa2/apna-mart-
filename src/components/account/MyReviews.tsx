import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrderContext';
import { Rating } from '../common/Rating';
import { MessageSquare, Star, CheckCircle2, Clock } from 'lucide-react';

export const MyReviews: React.FC = () => {
  const { user } = useAuth();
  const { orders } = useOrders();

  // Mock / persisted submitted customer reviews
  const customerReviews = [
    {
      id: 'rev-101',
      productName: 'Sony WH-1000XM5 ANC Headphones',
      productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
      rating: 5,
      date: 'Aug 22, 2026',
      title: 'Best Noise Cancelling Headphones!',
      comment: 'Delivered within 2 days to Karachi. Quality is 10/10 as described, active noise cancellation works like magic.',
      status: 'Approved',
      isVerifiedPurchase: true,
    },
    {
      id: 'rev-102',
      productName: 'Apple iPhone 15 Pro Max',
      productImage: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=400&q=80',
      rating: 4,
      date: 'Aug 19, 2026',
      title: 'Great Camera Performance',
      comment: 'Very satisfied with the purchase. Packaging was very secure and original box included 1-year brand warranty.',
      status: 'Approved',
      isVerifiedPurchase: true,
    },
  ];

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
      <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
        <div className="p-3 rounded-2xl bg-brand-50 text-brand-600">
          <MessageSquare className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
            My Product Reviews ({customerReviews.length})
          </h2>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            View your submitted ratings and verified purchase reviews
          </p>
        </div>
      </div>

      {customerReviews.length > 0 ? (
        <div className="space-y-4">
          {customerReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 rounded-2xl border border-gray-100 hover:border-brand-200 transition-all bg-white space-y-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={rev.productImage}
                    alt={rev.productName}
                    className="w-12 h-12 rounded-xl object-cover bg-gray-50 flex-shrink-0"
                  />
                  <div>
                    <h4 className="font-extrabold text-xs sm:text-sm text-gray-900 line-clamp-1">
                      {rev.productName}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Rating rating={rev.rating} showCount={false} size="sm" />
                      <span className="text-[11px] text-gray-400">• {rev.date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {rev.isVerifiedPurchase && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified Purchase
                    </span>
                  )}
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      rev.status === 'Approved' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {rev.status}
                  </span>
                </div>
              </div>

              <div className="pt-1">
                <h5 className="font-bold text-xs text-gray-900">{rev.title}</h5>
                <p className="text-xs text-gray-600 leading-relaxed mt-0.5">{rev.comment}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center space-y-3">
          <Star className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-lg font-extrabold text-gray-900">No Reviews Submitted Yet</h3>
          <p className="text-xs text-gray-500">
            Share your experience with products you have purchased to help other shoppers!
          </p>
        </div>
      )}
    </div>
  );
};
