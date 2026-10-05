import React from 'react';
import { OrderStatus } from '../../../types/order';

interface StatusBadgeProps {
  status: OrderStatus | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const getBadgeStyle = (st: string) => {
    switch (st) {
      case 'New Order':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Confirmed':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Processing':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Packed':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Shipped':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'Out for Delivery':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Cancelled':
      case 'Refunded':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Returned':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Active':
      case 'In Stock':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Out of Stock':
      case 'Disabled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const sizeClasses = {
    sm: 'px-2.5 py-0.5 text-[11px]',
    md: 'px-3 py-1 text-xs',
  };

  return (
    <span className={`inline-flex items-center rounded-full font-bold border ${getBadgeStyle(status)} ${sizeClasses[size]}`}>
      {status}
    </span>
  );
};
