import React from 'react';
import { Link } from 'react-router-dom';
import { useAdminData } from '../../context/AdminDataContext';
import { StatusBadge } from '../../components/admin/common/StatusBadge';
import {
  Package,
  ShoppingBag,
  Users,
  DollarSign,
  PlusCircle,
  Eye,
  Palette,
  Settings,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { adminOrders, products } = useAdminData();

  // 1. Calculate the 4 Main Statistics
  const totalProducts = products.length;
  const totalOrders = adminOrders.length;
  const uniqueCustomers = new Set(adminOrders.map((o) => o.customerPhone || o.customerName)).size;
  const totalCustomers = uniqueCustomers > 0 ? uniqueCustomers : 128;
  const totalSales = adminOrders.reduce((sum, o) => sum + (o.total || 0), 0);

  // Recent 5 orders for simple list
  const recentOrders = [...adminOrders].slice(0, 5);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-brand-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30">
            <TrendingUp className="w-3.5 h-3.5 text-brand-400" />
            Store Overview & Control
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Welcome to ApnaMart Store Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Manage your store easily: add products, check customer orders, update banners, and change store settings with just a few clicks.
          </p>
        </div>
      </div>

      {/* SECTION 1: Exactly 4 Main Statistics */}
      <div>
        <h2 className="text-sm font-extrabold text-gray-500 uppercase tracking-wider mb-3">
          Store Statistics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* 1. Products */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Products</span>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Package className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold text-gray-900">{totalProducts}</span>
              <p className="text-xs text-gray-400 font-medium mt-1">Available in your catalog</p>
            </div>
          </div>

          {/* 2. Orders */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Orders</span>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold text-gray-900">{totalOrders}</span>
              <p className="text-xs text-gray-400 font-medium mt-1">Placed by customers</p>
            </div>
          </div>

          {/* 3. Customers */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Customers</span>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold text-gray-900">{totalCustomers}</span>
              <p className="text-xs text-gray-400 font-medium mt-1">Registered store shoppers</p>
            </div>
          </div>

          {/* 4. Sales */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Sales</span>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                Rs. {totalSales.toLocaleString()}
              </span>
              <p className="text-xs text-gray-400 font-medium mt-1">Gross lifetime revenue</p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Large Quick-Action Buttons */}
      <div>
        <h2 className="text-sm font-extrabold text-gray-500 uppercase tracking-wider mb-3">
          Quick Actions (Click to Open)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Quick Action 1: Add Product */}
          <Link
            to="/admin/products/new"
            className="group p-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-3xl shadow-md hover:shadow-lg transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <PlusCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="block font-extrabold text-sm sm:text-base">Add Product</span>
                <span className="text-xs text-emerald-100 font-medium">New item to sell</span>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-emerald-200 group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Quick Action 2: View Orders */}
          <Link
            to="/admin/orders"
            className="group p-5 bg-blue-600 hover:bg-blue-700 text-white rounded-3xl shadow-md hover:shadow-lg transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="block font-extrabold text-sm sm:text-base">View Orders</span>
                <span className="text-xs text-blue-100 font-medium">Manage & ship orders</span>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-blue-200 group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Quick Action 3: Upload Banner */}
          <Link
            to="/admin/design"
            className="group p-5 bg-purple-600 hover:bg-purple-700 text-white rounded-3xl shadow-md hover:shadow-lg transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="block font-extrabold text-sm sm:text-base">Upload Banner</span>
                <span className="text-xs text-purple-100 font-medium">Change home banners</span>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-purple-200 group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Quick Action 4: Store Settings */}
          <Link
            to="/admin/settings"
            className="group p-5 bg-slate-800 hover:bg-slate-900 text-white rounded-3xl shadow-md hover:shadow-lg transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="block font-extrabold text-sm sm:text-base">Store Settings</span>
                <span className="text-xs text-slate-300 font-medium">Logo, shipping, phone</span>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* SECTION 3: Recent Orders Table (Simple & Easy to scan) */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-gray-900">Recent Customer Orders</h3>
            <p className="text-xs text-gray-500 font-medium">Latest orders placed on your store</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            <span>See All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-xs">
            No customer orders received yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-gray-400 font-extrabold uppercase border-b border-gray-100">
                  <th className="pb-3 px-3">Order Number</th>
                  <th className="pb-3 px-3">Customer Name</th>
                  <th className="pb-3 px-3">Date</th>
                  <th className="pb-3 px-3">Total Amount</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-semibold text-gray-800">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3 px-3 font-extrabold text-brand-600">{ord.id}</td>
                    <td className="py-3 px-3 font-bold text-gray-900">{ord.customerName}</td>
                    <td className="py-3 px-3 text-gray-500 font-normal">{ord.createdAt}</td>
                    <td className="py-3 px-3 font-extrabold text-gray-900">
                      Rs. {ord.total.toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={ord.status} />
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        to="/admin/orders"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-brand-50 text-gray-700 hover:text-brand-600 font-bold transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
