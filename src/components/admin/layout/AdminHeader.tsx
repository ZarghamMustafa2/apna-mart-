import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Search, Shield, ExternalLink, Check } from 'lucide-react';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { NotificationCenter } from './NotificationCenter';
import { AdminRoleType } from '../../../types/admin';

interface AdminHeaderProps {
  onOpenSidebar: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onOpenSidebar }) => {
  const { adminUser, switchRoleForTesting } = useAdminAuth();
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/admin/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
      {/* Left: Mobile Menu Button & Search */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onOpenSidebar}
          className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 lg:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Global Admin Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative max-w-sm w-full hidden sm:block">
          <input
            type="text"
            placeholder="Search products, orders, customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-100 border border-transparent rounded-xl text-xs font-semibold focus:bg-white focus:border-brand-500 focus:outline-none"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </form>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Role Switcher Button for Testing */}
        <div className="relative">
          <button
            onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-extrabold hover:bg-slate-800 transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-brand-400" />
            <span>Role: {adminUser?.role}</span>
          </button>

          {isRoleMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
              onMouseLeave={() => setIsRoleMenuOpen(false)}
            >
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-3 py-1 mb-1">
                Switch Role for Testing
              </div>
              {(['Super Admin', 'Manager', 'Staff'] as AdminRoleType[]).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    switchRoleForTesting(r);
                    setIsRoleMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl text-left transition-colors ${
                    adminUser?.role === r ? 'bg-brand-50 text-brand-700 font-bold' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span>{r}</span>
                  {adminUser?.role === r && <Check className="w-3.5 h-3.5 text-brand-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Real-Time Notification Center Drawer */}
        <NotificationCenter />

        {/* View Customer Store Link */}
        <Link
          to="/"
          target="_blank"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5 text-brand-600" />
          <span>View Store</span>
        </Link>
      </div>
    </header>
  );
};
