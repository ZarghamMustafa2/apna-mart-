import React, { useState } from 'react';
import { Product, SpecificationGroup, SpecificationItem } from '../../types/product';
import { Rating } from '../common/Rating';
import { WriteReviewModal } from './WriteReviewModal';
import { Plus, CheckCircle2 } from 'lucide-react';

interface ProductTabsProps {
  product: Product;
}

export const ProductTabs: React.FC<ProductTabsProps> = ({ product }) => {
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const ratingDistribution = [
    { stars: 5, percentage: 78, count: Math.round(product.reviewCount * 0.78) },
    { stars: 4, percentage: 16, count: Math.round(product.reviewCount * 0.16) },
    { stars: 3, percentage: 4, count: Math.round(product.reviewCount * 0.04) },
    { stars: 2, percentage: 2, count: Math.round(product.reviewCount * 0.02) },
    { stars: 1, percentage: 0, count: 0 },
  ];

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Tabs Header */}
      <div className="flex border-b border-gray-100 overflow-x-auto scrollbar-none">
        {[
          { id: 'description', label: 'Description' },
          { id: 'specs', label: 'Specifications' },
          { id: 'reviews', label: `Reviews (${product.reviewCount})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-4 text-xs sm:text-sm font-extrabold transition-all border-b-2 whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-brand-600 text-brand-600 bg-brand-50/20'
                : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content Container */}
      <div className="p-6 sm:p-8">
        {/* Description Tab */}
        {activeTab === 'description' && (
          <div className="prose prose-sm max-w-none text-gray-700 space-y-4">
            <p className="leading-relaxed text-xs sm:text-sm">{product.description}</p>
          </div>
        )}

        {/* Specifications Tab */}
        {activeTab === 'specs' && (
          <div className="max-w-3xl space-y-6">
            {product.specifications && product.specifications.length > 0 ? (
              <div className="space-y-6">
                {product.specifications.map((group: any, groupIdx: number) => {
                  const isGroup = 'groupName' in group;
                  return (
                    <div key={groupIdx} className="space-y-3">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-brand-600 border-b border-gray-100 pb-1">
                        {isGroup ? group.groupName : 'Product Specifications'}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        {isGroup
                          ? group.items.map((item: SpecificationItem, itemIdx: number) => (
                              <div key={itemIdx} className="p-3 bg-gray-50 rounded-2xl flex justify-between gap-4">
                                <span className="font-bold text-gray-500">{item.name}</span>
                                <span className="font-extrabold text-gray-900 text-right">{item.value}</span>
                              </div>
                            ))
                          : (
                              <div className="p-3 bg-gray-50 rounded-2xl flex justify-between gap-4 col-span-2">
                                <span className="font-bold text-gray-500">{group.name}</span>
                                <span className="font-extrabold text-gray-900 text-right">{group.value}</span>
                              </div>
                            )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-gray-500">Standard specifications apply to this item.</p>
            )}
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="space-y-8 max-w-3xl">
            {/* Rating Breakdown Summary */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="text-center md:text-left flex-shrink-0">
                <div className="text-4xl font-extrabold text-gray-900">{product.rating.toFixed(1)}</div>
                <div className="mt-1">
                  <Rating rating={product.rating} showCount={false} size="lg" />
                </div>
                <p className="text-xs text-gray-500 mt-1">Based on {product.reviewCount} verified reviews</p>
              </div>

              {/* Star Rating Percentage Distribution */}
              <div className="w-full max-w-xs space-y-1.5 text-xs font-bold text-gray-600">
                {ratingDistribution.map((dist) => (
                  <div key={dist.stars} className="flex items-center gap-3">
                    <span className="w-10 flex-shrink-0 text-right">{dist.stars} Star</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all"
                        style={{ width: `${dist.percentage}%` }}
                      />
                    </div>
                    <span className="w-8 flex-shrink-0 text-gray-400 text-right">{dist.percentage}%</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-2xl shadow-md flex items-center gap-2 transition-all hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                <span>Write a Review</span>
              </button>
            </div>

            {/* Verified Reviews List */}
            <div className="space-y-4">
              {[
                {
                  name: 'Zayn Shah',
                  rating: 5,
                  date: 'Aug 22, 2026',
                  comment: 'Amazing product! Delivered within 2 days to Karachi. Quality is 10/10 as described.',
                  isVerifiedPurchase: true,
                },
                {
                  name: 'Sana Tariq',
                  rating: 4,
                  date: 'Aug 19, 2026',
                  comment: 'Very satisfied with the purchase. Packaging was very secure and original box included warranty.',
                  isVerifiedPurchase: true,
                },
              ].map((rev, i) => (
                <div key={i} className="p-5 rounded-2xl border border-gray-100 space-y-2 bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs text-gray-900">{rev.name}</span>
                      {rev.isVerifiedPurchase && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-gray-400">{rev.date}</span>
                  </div>
                  <Rating rating={rev.rating} showCount={false} size="sm" />
                  <p className="text-xs text-gray-600 leading-relaxed pt-1">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Review Submission Modal */}
      {isReviewModalOpen && (
        <WriteReviewModal
          productName={product.name}
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
        />
      )}
    </div>
  );
};
