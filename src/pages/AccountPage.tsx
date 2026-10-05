import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { AccountDashboard } from '../components/account/AccountDashboard';
import { ProfileEdit } from '../components/account/ProfileEdit';
import { AddressesManager } from '../components/account/AddressesManager';
import { OrderHistory } from '../components/account/OrderHistory';
import { ChangePassword } from '../components/account/ChangePassword';
import { MyReviews } from '../components/account/MyReviews';
import { UserAvatar } from '../components/common/UserAvatar';
import { SEOHead } from '../components/common/SEOHead';
import {
  LayoutDashboard,
  User,
  MapPin,
  Package,
  Heart,
  LogOut,
  KeyRound,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export type AccountTabKey =
  | 'overview'
  | 'profile'
  | 'orders'
  | 'addresses'
  | 'reviews'
  | 'password';

export const AccountPage: React.FC = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AccountTabKey>('overview');

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!isLoggedIn) {
      navigate('/auth', { replace: true, state: { from: '/account' } });
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn || !user) {
    return null;
  }

  const navItems = [
    { id: 'overview' as const, label: 'Overview', icon: LayoutDashboard },
    { id: 'profile' as const, label: 'My Profile', icon: User },
    { id: 'orders' as const, label: 'My Orders', icon: Package },
    { id: 'addresses' as const, label: 'Addresses', icon: MapPin },
    { id: 'reviews' as const, label: 'My Reviews', icon: MessageSquare },
    { id: 'password' as const, label: 'Change Password', icon: KeyRound },
  ];

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 pb-20 sm:pb-24 lg:pb-8">
      <SEOHead
        title="My Account & Profile | ApnaMart"
        description="Manage your ApnaMart customer profile, track recent delivery orders, update delivery addresses, and change security credentials."
        canonicalUrl="https://apnamart.space/account"
      />

      <Breadcrumb items={[{ label: 'Customer Account' }]} />

      {/* Mobile User Header Strip */}
      <div className="lg:hidden p-4 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <UserAvatar name={user.name} avatarUrl={user.avatar} size="md" />
          <div className="min-w-0">
            <h2 className="text-sm font-extrabold text-gray-900 dark:text-white truncate">
              {user.name}
            </h2>
            <p className="text-[11px] text-gray-400 dark:text-slate-400 truncate">
              {user.email}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="p-2 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 flex-shrink-0"
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      {/* Mobile Horizontal Navigation Chips Bar */}
      <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all flex-shrink-0 ${
                isActive
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}

        <Link
          to="/wishlist"
          className="px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-800 flex-shrink-0"
        >
          <Heart className="w-3.5 h-3.5 text-red-500" />
          <span>Wishlist</span>
        </Link>
      </div>

      {/* Main Layout Grid */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
        {/* Desktop Sticky Navigation Sidebar */}
        <aside className="hidden lg:block w-72 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm p-5 space-y-4 flex-shrink-0">
          {/* User Profile Header Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-brand-50/40 dark:from-slate-800 dark:to-slate-800/60 border border-gray-100 dark:border-slate-700/60 flex items-center gap-3">
            <UserAvatar name={user.name} avatarUrl={user.avatar} size="lg" />
            <div className="min-w-0">
              <div className="text-sm font-extrabold text-gray-900 dark:text-white truncate flex items-center gap-1">
                {user.name}
              </div>
              <p className="text-[11px] text-gray-400 dark:text-slate-400 truncate">
                {user.email}
              </p>
              <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-3 h-3" /> ApnaMart Member
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-md'
                      : 'text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                </button>
              );
            })}

            <Link
              to="/wishlist"
              className="w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all"
            >
              <div className="flex items-center gap-3">
                <Heart className="w-4 h-4 text-red-500" />
                <span>Wishlist</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-3 rounded-2xl text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all mt-4 border-t border-gray-100 dark:border-slate-800"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout Account</span>
            </button>
          </nav>
        </aside>

        {/* Tab Content Display */}
        <main className="flex-1 min-w-0 w-full">
          {activeTab === 'overview' && (
            <AccountDashboard onNavigateTab={(t) => {
              if (t === 'dashboard') setActiveTab('overview');
              else if (t === 'orders') setActiveTab('orders');
              else if (t === 'profile') setActiveTab('profile');
              else if (t === 'addresses') setActiveTab('addresses');
              else if (t === 'password') setActiveTab('password');
              else if (t === 'reviews') setActiveTab('reviews');
            }} />
          )}
          {activeTab === 'profile' && <ProfileEdit />}
          {activeTab === 'orders' && <OrderHistory />}
          {activeTab === 'addresses' && <AddressesManager />}
          {activeTab === 'reviews' && <MyReviews />}
          {activeTab === 'password' && <ChangePassword />}
        </main>
      </div>
    </div>
  );
};
