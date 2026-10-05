import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { AccountDashboard } from '../components/account/AccountDashboard';
import { ProfileEdit } from '../components/account/ProfileEdit';
import { AddressesManager } from '../components/account/AddressesManager';
import { OrderHistory } from '../components/account/OrderHistory';
import { ChangePassword } from '../components/account/ChangePassword';
import { MyReviews } from '../components/account/MyReviews';
import { AuthPage } from './AuthPage';
import { LayoutDashboard, User, MapPin, Package, Heart, LogOut, KeyRound, MessageSquare } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const AccountPage: React.FC = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'profile' | 'addresses' | 'orders' | 'password' | 'reviews'
  >('dashboard');

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!isLoggedIn) {
      navigate('/auth', { replace: true, state: { from: '/account' } });
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) {
    return null;
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'reviews', label: 'My Reviews', icon: MessageSquare },
    { id: 'profile', label: 'Profile Information', icon: User },
    { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
    { id: 'password', label: 'Change Password', icon: KeyRound },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <Breadcrumb items={[{ label: 'My Account' }]} />

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Navigation Sidebar Drawer */}
        <aside className="w-full lg:w-64 bg-white rounded-3xl border border-gray-100 shadow-sm p-4 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 p-3 rounded-2xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}

          <Link
            to="/wishlist"
            className="w-full flex items-center gap-3 p-3 rounded-2xl text-xs font-bold text-gray-700 hover:bg-gray-100 transition-all"
          >
            <Heart className="w-4 h-4 text-red-500" />
            <span>Saved Wishlist</span>
          </Link>

          <button
            onClick={() => {
              logout();
              navigate('/', { replace: true });
            }}
            className="w-full flex items-center gap-3 p-3 rounded-2xl text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all mt-4 border-t border-gray-100 dark:border-slate-800"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Account</span>
          </button>
        </aside>

        {/* Tab Content Display */}
        <main className="flex-1 min-w-0 w-full">
          {activeTab === 'dashboard' && <AccountDashboard onNavigateTab={(t) => setActiveTab(t as any)} />}
          {activeTab === 'orders' && <OrderHistory />}
          {activeTab === 'reviews' && <MyReviews />}
          {activeTab === 'profile' && <ProfileEdit />}
          {activeTab === 'addresses' && <AddressesManager />}
          {activeTab === 'password' && <ChangePassword />}
        </main>
      </div>
    </div>
  );
};
