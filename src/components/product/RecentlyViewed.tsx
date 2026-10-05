import React, { useEffect, useState } from 'react';
import { useAdminData } from '../../context/AdminDataContext';
import { mockProducts } from '../../data/mockProducts';
import { ProductCard } from '../common/ProductCard';
import { Clock } from 'lucide-react';
import { Product } from '../../types/product';

interface RecentlyViewedProps {
  currentProductId: string;
}

export const RecentlyViewed: React.FC<RecentlyViewedProps> = ({ currentProductId }) => {
  const { products } = useAdminData();
  const [recentlyViewedList, setRecentlyViewedList] = useState<Product[]>([]);

  const productList = products && products.length > 0 ? products : mockProducts;

  useEffect(() => {
    try {
      // Get stored product IDs from localStorage
      const stored = localStorage.getItem('apexstore_recently_viewed');
      let ids: string[] = stored ? JSON.parse(stored) : [];

      // Filter out current product ID and get max 4 items
      const recentIds = ids.filter((id) => id !== currentProductId).slice(0, 4);

      const items = recentIds
        .map((id) => productList.find((p) => p.id === id))
        .filter((p): p is Product => p !== undefined);

      setRecentlyViewedList(items);

      // Add current product ID to top of localStorage array
      const updatedIds = [currentProductId, ...ids.filter((id) => id !== currentProductId)].slice(0, 10);
      localStorage.setItem('apexstore_recently_viewed', JSON.stringify(updatedIds));
    } catch (e) {
      console.error('Error tracking recently viewed items:', e);
    }
  }, [currentProductId, productList]);

  if (recentlyViewedList.length === 0) return null;

  return (
    <section className="mt-12 pt-8 border-t border-gray-100">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-5 h-5 text-brand-600" />
        <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">
          Recently Viewed Products
        </h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6">
        {recentlyViewedList.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};
