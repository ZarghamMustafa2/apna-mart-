import React from 'react';

interface PriceDisplayProps {
  regularPrice: number;
  salePrice?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSavings?: boolean;
  className?: string;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  regularPrice,
  salePrice,
  size = 'md',
  showSavings = false,
  className = '',
}) => {
  const hasSale = salePrice !== undefined && salePrice < regularPrice;
  const currentPrice = hasSale ? salePrice : regularPrice;
  const savedAmount = hasSale ? regularPrice - salePrice : 0;
  const savedPercentage = hasSale ? Math.round((savedAmount / regularPrice) * 100) : 0;

  const sizeClasses = {
    sm: 'text-sm font-semibold',
    md: 'text-base font-bold',
    lg: 'text-xl font-bold',
    xl: 'text-2xl font-extrabold',
  };

  const regularSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
  };

  return (
    <div className={`flex flex-wrap items-baseline gap-2 ${className}`}>
      <span className={`text-brand-600 ${sizeClasses[size]}`}>
        Rs. {currentPrice.toLocaleString()}
      </span>

      {hasSale && (
        <span className={`text-gray-400 line-through ${regularSizeClasses[size]}`}>
          Rs. {regularPrice.toLocaleString()}
        </span>
      )}

      {hasSale && showSavings && (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-red-50 text-red-600 border border-red-200">
          Save Rs. {savedAmount.toLocaleString()} ({savedPercentage}% OFF)
        </span>
      )}
    </div>
  );
};
