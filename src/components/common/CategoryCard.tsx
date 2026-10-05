import React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../../types/product';
import { ArrowRight } from 'lucide-react';

interface CategoryCardProps {
  category: Category;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link
      to={`/shop?category=${category.slug}`}
      className="group relative overflow-hidden rounded-2xl bg-gray-100 aspect-[4/3] block shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <img
        src={category.image}
        alt={category.name}
        className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-5 text-white">
        <span className="text-xs font-medium uppercase tracking-wider text-brand-300 mb-1">
          {category.itemCount} Products
        </span>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold group-hover:text-brand-300 transition-colors">
            {category.name}
          </h3>
          <span className="p-2 rounded-full bg-white/20 backdrop-blur-md group-hover:bg-brand-500 group-hover:text-white transition-all">
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
};
