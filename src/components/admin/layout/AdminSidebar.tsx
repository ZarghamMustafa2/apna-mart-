import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Boxes,
  ShoppingBag,
  Users,
  Tag,
  Star,
  LayoutTemplate,
  Image,
  BarChart3,
  FileText,
  Bell,
  UserCheck,
  ShieldAlert,
  Settings,
  LogOut,
  X,
  ExternalLink,
  Shield,
} from 'lucide-react';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { useAdminNotifications } from '../../../context/NotificationContext';
import { useAdminData } from '../../../context/AdminDataContext';
import { PermissionKey } from '../../../types/admin';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  link: string;
  icon: any;
  permission?: PermissionKey;
  badge?: number;
  badgeColor?: string;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { adminUser, logoutAdmin, hasPermission } = useAdminAuth();
  const { unreadCount } = useAdminNotifications();
  const { adminOrders, products } = useAdminData();

  const pendingOrdersCount = adminOrders.filter((o) => o.status === 'New Order' || o.status === 'Confirmed' || o.status === 'Processing').length;
  const lowStockCount = products.filter((p) => p.stock <= 5).length;

  const navItems: NavItem[] = [
    { label: 'Dashboard', link: '/admin', icon: LayoutDashboard },
    { label: 'Products', link: '/admin/products', icon: Package, permission: 'manage_products' },
    { label: 'Categories', link: '/admin/categories', icon: FolderTree, permission: 'manage_categories' },
    { label: 'Inventory', link: '/admin/inventory', icon: Boxes, permission: 'manage_inventory', badge: lowStockCount, badgeColor: 'bg-amber-500' },
    { label: 'Orders', link: '/admin/orders', icon: ShoppingBag, permission: 'manage_orders', badge: pendingOrdersCount, badgeColor: 'bg-brand-600' },
    { label: 'Customers', link: '/admin/customers', icon: Users, permission: 'manage_customers' },
    { label: 'Coupons', link: '/admin/coupons', icon: Tag, permission: 'manage_coupons' },
    { label: 'Reviews & Ratings', link: '/admin/reviews', icon: Star, permission: 'manage_reviews' },
    { label: 'Homepage CMS', link: '/admin/cms', icon: LayoutTemplate, permission: 'manage_cms' },
    { label: 'Banners', link: '/admin/banners', icon: Image, permission: 'manage_cms' },
    { label: 'Analytics', link: '/admin/analytics', icon: BarChart3, permission: 'view_analytics' },
    { label: 'Reports & Exports', link: '/admin/reports', icon: FileText, permission: 'view_analytics' },
    { label: 'Notifications', link: '/admin/notifications', icon: Bell, badge: unreadCount, badgeColor: 'bg-red-500' },
    { label: 'Admin Users', link: '/admin/users', icon: UserCheck, permission: 'manage_admin_users' },
    { label: 'Roles & Permissions', link: '/admin/roles', icon: ShieldAlert, permission: 'manage_roles' },
    { label: 'Store Settings', link: '/admin/settings', icon: Settings, permission: 'manage_settings' },
  ];

  return (
    <>
      {/* Sidebar Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={onClose} />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-slate-950 text-slate-300 flex flex-col justify-between border-r border-slate-900 shadow-2xl transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Sidebar Header */}
          <div className="p-5 border-b border-slate-900 flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-brand-500/20">
                A
              </div>
              <div>
                <span className="text-lg font-extrabold text-white tracking-tight">ApexControl</span>
                <span className="block text-[10px] font-bold text-brand-400 uppercase tracking-widest -mt-1">
                  Admin System
                </span>
              </div>
            </Link>

            <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white lg:hidden">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Store Shortcut Button */}
          <div className="p-3">
            <Link
              to="/"
              target="_blank"
              className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center justify-between border border-slate-800 transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-brand-400" />
                View Customer Store
              </span>
              <span className="text-[10px] bg-brand-500/20 text-brand-300 px-1.5 py-0.5 rounded font-mono">Live</span>
            </Link>
          </div>

          {/* Nav Links */}
          <nav className="p-3 space-y-1 max-h-[calc(100vh-210px)] overflow-y-auto scrollbar-none">
            {navItems.map((item) => {
              // Permission Guard for Menu item
              if (item.permission && !hasPermission(item.permission)) {
                return null;
              }

              const isActive = location.pathname === item.link || (item.link !== '/admin' && location.pathname.startsWith(item.link));
              const Icon = item.icon;

              return (
                <Link
                  key={item.link}
                  to={item.link}
                  onClick={onClose}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold text-white ${item.badgeColor || 'bg-brand-500'}`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer User Info */}
        <div className="p-4 border-t border-slate-900 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <img
              src={adminUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
              alt={adminUser?.name}
              className="w-9 h-9 rounded-full object-cover border border-slate-700"
            />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white truncate">{adminUser?.name}</div>
              <div className="flex items-center gap-1 text-[10px] font-semibold text-brand-400">
                <Shield className="w-3 h-3" />
                <span>{adminUser?.role}</span>
              </div>
            </div>
            <button
              onClick={logoutAdmin}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
              title="Logout Admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
