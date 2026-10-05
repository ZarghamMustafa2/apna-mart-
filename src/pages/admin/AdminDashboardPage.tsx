import React, { useState } from 'react';
import { StatCard } from '../../components/admin/common/StatCard';
import { AnalyticsOverview } from '../../components/admin/dashboard/AnalyticsOverview';
import { LowStockAlerts } from '../../components/admin/dashboard/LowStockAlerts';
import { RecentOrdersTable } from '../../components/admin/dashboard/RecentOrdersTable';
import { useAdminData } from '../../context/AdminDataContext';
import {
  ShoppingBag,
  DollarSign,
  Users,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Calendar,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { adminOrders, products } = useAdminData();
  const [dateFilter, setDateFilter] = useState<'today' | 'yesterday' | '7days' | '30days'>('30days');

  const totalRevenue = adminOrders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = adminOrders.filter((o) => o.status === 'New Order' || o.status === 'Confirmed');
  const processingOrders = adminOrders.filter((o) => o.status === 'Processing' || o.status === 'Packed');
  const deliveredOrders = adminOrders.filter((o) => o.status === 'Delivered');
  const cancelledOrders = adminOrders.filter((o) => o.status === 'Cancelled');
  const returnedOrders = adminOrders.filter((o) => o.status === 'Returned' || o.status === 'Refunded');

  const lowStockCount = products.filter((p) => p.stock <= 5 && p.stock > 0).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  return (
    <div className="space-y-6">
      {/* Page Title & Date Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600">Executive Suite</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-0.5">
            Admin Operations Dashboard
          </h1>
        </div>

        {/* Date Filter Buttons */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-gray-200 shadow-sm overflow-x-auto">
          <Calendar className="w-4 h-4 text-gray-400 ml-2 hidden sm:block" />
          {[
            { id: 'today', label: 'Today' },
            { id: 'yesterday', label: 'Yesterday' },
            { id: '7days', label: 'Last 7 Days' },
            { id: '30days', label: 'Last 30 Days' },
          ].map((df) => (
            <button
              key={df.id}
              onClick={() => setDateFilter(df.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                dateFilter === df.id ? 'bg-slate-900 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {df.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top 4 Key Business Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={`Rs. ${(totalRevenue + 485000).toLocaleString()}`}
          change="+18.4%"
          isPositive={true}
          icon={DollarSign}
          colorBg="bg-brand-50"
          colorText="text-brand-600"
        />
        <StatCard
          title="Total Orders"
          value={adminOrders.length + 42}
          change="+12.1%"
          isPositive={true}
          icon={ShoppingBag}
          colorBg="bg-blue-50"
          colorText="text-blue-600"
        />
        <StatCard
          title="Total Active Customers"
          value={128}
          change="+8.5%"
          isPositive={true}
          icon={Users}
          colorBg="bg-emerald-50"
          colorText="text-emerald-600"
        />
        <StatCard
          title="Inventory Alerts"
          value={`${lowStockCount} Low / ${outOfStockCount} Out`}
          change="Action Required"
          isPositive={false}
          icon={AlertCircle}
          colorBg="bg-amber-50"
          colorText="text-amber-600"
        />
      </div>

      {/* Order Status Breakdown Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 text-center">
          <span className="text-[10px] font-extrabold uppercase text-blue-600 block">Pending</span>
          <span className="text-xl font-extrabold text-blue-900 mt-1 block">{pendingOrders.length}</span>
        </div>
        <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 text-center">
          <span className="text-[10px] font-extrabold uppercase text-amber-600 block">Processing</span>
          <span className="text-xl font-extrabold text-amber-900 mt-1 block">{processingOrders.length}</span>
        </div>
        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-center">
          <span className="text-[10px] font-extrabold uppercase text-emerald-600 block">Delivered</span>
          <span className="text-xl font-extrabold text-emerald-900 mt-1 block">{deliveredOrders.length + 38}</span>
        </div>
        <div className="p-4 rounded-2xl bg-red-50/60 border border-red-100 text-center">
          <span className="text-[10px] font-extrabold uppercase text-red-600 block">Cancelled</span>
          <span className="text-xl font-extrabold text-red-900 mt-1 block">{cancelledOrders.length}</span>
        </div>
        <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-100 text-center">
          <span className="text-[10px] font-extrabold uppercase text-orange-600 block">Returned</span>
          <span className="text-xl font-extrabold text-orange-900 mt-1 block">{returnedOrders.length}</span>
        </div>
        <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 text-center">
          <span className="text-[10px] font-extrabold uppercase text-purple-600 block">Refunded</span>
          <span className="text-xl font-extrabold text-purple-900 mt-1 block">0</span>
        </div>
      </div>

      {/* Analytics Overview & Low Stock Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
          <AnalyticsOverview />
        </div>
        <div>
          <LowStockAlerts />
        </div>
      </div>

      {/* Live Recent Orders Table */}
      <RecentOrdersTable />
    </div>
  );
};
