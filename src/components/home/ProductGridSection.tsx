import React, { useState } from 'react';
import { ProductCard } from '../common/ProductCard';
import { mockProducts } from '../../data/mockProducts';
import { Product } from '../../types/product';
import { Modal } from '../common/Modal';
import { PriceDisplay } from '../common/PriceDisplay';
import { Rating } from '../common/Rating';
import { useCart } from '../../context/CartContext';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

type TabType = 'all' | 'featured' | 'new' | 'bestseller' | 'sale';

export const ProductGridSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [selectedQuickView, setSelectedQuickView] = useState<Product | null>(null);
  const { addToCart } = useCart();

  const productsList = mockProducts && mockProducts.length > 0 ? mockProducts : [];

  const filteredProducts = productsList.filter((p) => {
    if (activeTab === 'featured') return p.isFeatured;
    if (activeTab === 'new') return p.isNewArrival || p.badges.includes('New');
    if (activeTab === 'bestseller') return p.isBestSeller || p.badges.includes('Best Seller');
    if (activeTab === 'sale') return !!p.salePrice;
    return true;
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600">
            Handpicked For You
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-1">
            Top Product Discoveries
          </h2>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All Products' },
            { id: 'featured', label: 'Featured' },
            { id: 'new', label: 'New Arrivals' },
            { id: 'bestseller', label: 'Best Sellers' },
            { id: 'sale', label: 'On Sale' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onQuickView={(p) => setSelectedQuickView(p)}
          />
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-gray-900 hover:bg-brand-600 text-white text-sm font-extrabold rounded-2xl shadow-lg transition-all"
        >
          <span>View Entire Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Quick View Modal */}
      {selectedQuickView && (
        <Modal
          isOpen={!!selectedQuickView}
          onClose={() => setSelectedQuickView(null)}
          maxWidth="4xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100">
              <img
                src={selectedQuickView.images[0]}
                alt={selectedQuickView.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-4 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                  {selectedQuickView.brand}
                </span>
                <h3 className="text-2xl font-extrabold text-gray-900 mt-1">
                  {selectedQuickView.name}
                </h3>

                <div className="mt-2">
                  <Rating
                    rating={selectedQuickView.rating}
                    reviewCount={selectedQuickView.reviewCount}
                  />
                </div>

                <div className="mt-4">
                  <PriceDisplay
                    regularPrice={selectedQuickView.regularPrice}
                    salePrice={selectedQuickView.salePrice}
                    size="xl"
                    showSavings={true}
                  />
                </div>

                <p className="mt-4 text-xs text-gray-600 leading-relaxed">
                  {selectedQuickView.shortDescription}
                </p>

                <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500 space-y-1">
                  <div>
                    <strong>SKU:</strong> {selectedQuickView.sku}
                  </div>
                  <div>
                    <strong>Category:</strong> {selectedQuickView.category}
                  </div>
                  <div>
                    <strong>Availability:</strong>{' '}
                    <span className="text-emerald-600 font-bold">
                      {selectedQuickView.stock} Units Available
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => {
                    addToCart(selectedQuickView, 1);
                    setSelectedQuickView(null);
                  }}
                  className="flex-1 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to Cart
                </button>
                <Link
                  to={`/product/${selectedQuickView.slug}`}
                  onClick={() => setSelectedQuickView(null)}
                  className="px-5 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-sm rounded-xl transition-colors"
                >
                  Full Details
                </Link>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
};
