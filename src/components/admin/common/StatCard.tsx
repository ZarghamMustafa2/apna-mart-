import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: any;
  colorBg?: string;
  colorText?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
  colorBg = 'bg-brand-50',
  colorText = 'text-brand-600',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`p-5 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-extrabold uppercase tracking-wider text-gray-400">{title}</span>
        <div className={`p-3 rounded-2xl ${colorBg} ${colorText}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <div className="text-2xl font-extrabold text-gray-900 tracking-tight">{value}</div>

        {change && (
          <span
            className={`inline-flex items-center text-xs font-bold ${
              isPositive ? 'text-emerald-600' : 'text-red-500'
            }`}
          >
            {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            {change}
          </span>
        )}
      </div>
    </div>
  );
};
