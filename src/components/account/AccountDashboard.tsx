import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrderContext';
import { ShoppingBag, MapPin, Heart, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AccountDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const AccountDashboard: React.FC<AccountDashboardProps> = ({ onNavigateTab }) => {
  const { user } = useAuth();
  const { orders } = useOrders();

  // Filter orders associated strictly with this authenticated customer
  const customerOrders = orders.filter((o) => {
    if (user?.id && o.userId === user.id) return true;
    if (user?.email && o.customerEmail && o.customerEmail.toLowerCase() === user.email.toLowerCase()) return true;
    return false;
  });

  const recentOrder = customerOrders[0];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 to-brand-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
            alt={user?.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-brand-400 shadow-md"
          />
          <div>
            <span className="text-xs font-bold text-brand-300 uppercase tracking-wider">Customer Portal</span>
            <h2 className="text-2xl font-extrabold text-white">Welcome back, {user?.name}!</h2>
            <p className="text-xs text-slate-300 mt-0.5">{user?.email} • {user?.phone}</p>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('profile')}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl backdrop-blur-md transition-colors"
        >
          Edit Profile
        </button>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => onNavigateTab('orders')}
          className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Orders</span>
            <div className="text-2xl font-extrabold text-gray-900 mt-1">{customerOrders.length}</div>
          </div>
          <div className="p-3 rounded-2xl bg-brand-50 text-brand-600">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('addresses')}
          className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Saved Addresses</span>
            <div className="text-2xl font-extrabold text-gray-900 mt-1">{user?.savedAddresses.length || 0}</div>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
            <MapPin className="w-6 h-6" />
          </div>
        </div>

        <Link
          to="/wishlist"
          className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Saved Wishlist</span>
            <div className="text-2xl font-extrabold text-gray-900 mt-1">View Saved</div>
          </div>
          <div className="p-3 rounded-2xl bg-red-50 text-red-500">
            <Heart className="w-6 h-6" />
          </div>
        </Link>
      </div>

      {/* Recent Order Preview */}
      {recentOrder && (
        <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <span className="text-xs font-extrabold text-brand-600 uppercase tracking-wider">Latest Order</span>
              <h3 className="text-base font-extrabold text-gray-900">{recentOrder.id}</h3>
            </div>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1"
            >
              <span>View All Orders</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div>
              <div className="text-gray-500">Placed on: <strong className="text-gray-800">{recentOrder.createdAt}</strong></div>
              <div className="text-gray-500 mt-1">Payment Method: <strong className="text-gray-800 uppercase">{recentOrder.paymentMethod}</strong></div>
            </div>
            <div className="sm:text-right">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                {recentOrder.status}
              </span>
              <div className="text-base font-extrabold text-brand-600 mt-1">
                Rs. {recentOrder.total.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
