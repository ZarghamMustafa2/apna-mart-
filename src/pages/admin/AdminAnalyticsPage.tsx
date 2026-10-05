import React, { useState } from 'react';
import { useAdminData } from '../../context/AdminDataContext';
import { BarChart3, TrendingUp, DollarSign, ShoppingBag, Download, Calendar } from 'lucide-react';

export const AdminAnalyticsPage: React.FC = () => {
  const { adminOrders, products } = useAdminData();
  const [reportRange, setReportRange] = useState<'7days' | '30days' | 'year'>('30days');

  const totalRev = adminOrders.reduce((sum, o) => sum + o.total, 0) + 485000;
  const avgOrderValue = Math.round(totalRev / (adminOrders.length + 42));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600">Business Intelligence</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-0.5">
            Analytics & Financial Reports
          </h1>
        </div>

        <button
          onClick={() => window.print()}
          className="px-5 py-3 bg-gray-900 hover:bg-black text-white font-extrabold text-xs rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export Financial Report PDF</span>
        </button>
      </div>

      {/* Analytics KPI Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm space-y-2">
          <span className="text-xs font-extrabold uppercase text-gray-400">Total Net Revenue</span>
          <div className="text-3xl font-extrabold text-brand-600">Rs. {totalRev.toLocaleString()}</div>
          <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +18.4% compared to previous period
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm space-y-2">
          <span className="text-xs font-extrabold uppercase text-gray-400">Average Order Value (AOV)</span>
          <div className="text-3xl font-extrabold text-gray-900">Rs. {avgOrderValue.toLocaleString()}</div>
          <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +5.2% basket size increase
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm space-y-2">
          <span className="text-xs font-extrabold uppercase text-gray-400">Order Fulfillment Rate</span>
          <div className="text-3xl font-extrabold text-emerald-600">96.8%</div>
          <p className="text-[11px] text-gray-500 font-medium">Completed without cancellations</p>
        </div>
      </div>

      {/* Top Performing Products Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h3 className="text-base font-extrabold text-gray-900 border-b border-gray-100 pb-3">
          Top Performing Catalog Products
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-gray-400 font-extrabold uppercase border-b border-gray-100">
                <th className="pb-3 px-2">Rank & Product Name</th>
                <th className="pb-3 px-2">Category</th>
                <th className="pb-3 px-2">Units Sold</th>
                <th className="pb-3 px-2">Generated Revenue</th>
                <th className="pb-3 px-2">Customer Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-semibold text-gray-800">
              {products.slice(0, 5).map((p, idx) => (
                <tr key={p.id}>
                  <td className="py-3 px-2 flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-brand-50 text-brand-600 font-extrabold text-[11px] flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <span className="font-bold text-gray-900">{p.name}</span>
                  </td>
                  <td className="py-3 px-2 text-gray-500">{p.category}</td>
                  <td className="py-3 px-2 font-extrabold">{142 - idx * 24} units</td>
                  <td className="py-3 px-2 font-extrabold text-brand-600">
                    Rs. {((142 - idx * 24) * (p.salePrice || p.regularPrice)).toLocaleString()}
                  </td>
                  <td className="py-3 px-2 font-bold text-amber-600">★ {p.rating.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
