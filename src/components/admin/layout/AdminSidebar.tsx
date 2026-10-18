import React, { useState, useEffect } from 'react';
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
  Palette,
  BarChart3,
  FileText,
  Bell,
  UserCheck,
  ShieldAlert,
  Settings,
  LogOut,
  X,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Sliders,
} from 'lucide-react';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { useAdminNotifications } from '../../../context/NotificationContext';
import { useAdminData } from '../../../context/AdminDataContext';
import { ApnaMartLogo } from '../../common/ApnaMartLogo';
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
  const { adminOrders, products, settings } = useAdminData();

  const pendingOrdersCount = adminOrders.filter(
    (o) => o.status === 'New Order' || o.status === 'Confirmed' || o.status === 'Processing'
  ).length;
  const lowStockCount = products.filter((p) => p.stock <= 5).length;

  // 1. Primary Menu Options (Exactly 8 beginner-friendly items)
  const primaryNavItems: NavItem[] = [
    { label: 'Dashboard', link: '/admin', icon: LayoutDashboard },
    { label: 'Products', link: '/admin/products', icon: Package, permission: 'manage_products' },
    { label: 'Orders', link: '/admin/orders', icon: ShoppingBag, permission: 'manage_orders', badge: pendingOrdersCount, badgeColor: 'bg-brand-600' },
    { label: 'Categories', link: '/admin/categories', icon: FolderTree, permission: 'manage_categories' },
    { label: 'Customers', link: '/admin/customers', icon: Users, permission: 'manage_customers' },
    { label: 'Website Design', link: '/admin/design', icon: Palette, permission: 'manage_cms' },
    { label: 'Discounts', link: '/admin/coupons', icon: Tag, permission: 'manage_coupons' },
    { label: 'Settings', link: '/admin/settings', icon: Settings, permission: 'manage_settings' },
  ];

  // 2. Advanced / Secondary Tools (Moved into collapsible section)
  const advancedNavItems: NavItem[] = [
    { label: 'Inventory & Stock', link: '/admin/inventory', icon: Boxes, permission: 'manage_inventory', badge: lowStockCount, badgeColor: 'bg-amber-500' },
    { label: 'Sales Analytics', link: '/admin/analytics', icon: BarChart3, permission: 'view_analytics' },
    { label: 'Reports & Exports', link: '/admin/reports', icon: FileText, permission: 'view_analytics' },
    { label: 'Customer Reviews', link: '/admin/reviews', icon: Star, permission: 'manage_reviews' },
    { label: 'Admin Staff', link: '/admin/users', icon: UserCheck, permission: 'manage_admin_users' },
    { label: 'Roles & Access', link: '/admin/roles', icon: ShieldAlert, permission: 'manage_roles' },
    { label: 'Notifications', link: '/admin/notifications', icon: Bell, badge: unreadCount, badgeColor: 'bg-red-500' },
  ];

  const isCurrentRouteAdvanced = advancedNavItems.some(
    (item) => location.pathname === item.link || location.pathname.startsWith(item.link)
  );

  const [isAdvancedOpen, setIsAdvancedOpen] = useState(isCurrentRouteAdvanced);

  useEffect(() => {
    if (isCurrentRouteAdvanced) {
      setIsAdvancedOpen(true);
    }
  }, [location.pathname, isCurrentRouteAdvanced]);

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
              <ApnaMartLogo customLogoUrl={settings?.logoUrl} size="md" inverted taglineText="Admin Console" />
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
          <nav className="p-3 space-y-1 max-h-[calc(100vh-220px)] overflow-y-auto scrollbar-none">
            {/* 1. PRIMARY MENU (Clean & Visible) */}
            <div className="space-y-1">
              {primaryNavItems.map((item) => {
                if (item.permission && !hasPermission(item.permission)) {
                  return null;
                }

                const isActive =
                  location.pathname === item.link ||
                  (item.link !== '/admin' && location.pathname.startsWith(item.link));
                const Icon = item.icon;

                return (
                  <Link
                    key={item.link}
                    to={item.link}
                    onClick={onClose}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30'
                        : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== undefined && item.badge > 0 && (
                      <span className={`px-2 py-0.5 text-[10px] font-extrabold text-white rounded-full ${item.badgeColor || 'bg-brand-500'}`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* 2. ADVANCED TOOLS (Collapsible Secondary Menu) */}
            <div className="pt-4 mt-2 border-t border-slate-900">
              <button
                type="button"
                onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 hover:text-slate-200 transition-colors rounded-xl hover:bg-slate-900/60"
              >
                <div className="flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5 text-slate-500" />
                  <span>Advanced Tools</span>
                </div>
                {isAdvancedOpen ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>

              {isAdvancedOpen && (
                <div className="mt-1 space-y-1 pl-1">
                  {advancedNavItems.map((item) => {
                    if (item.permission && !hasPermission(item.permission)) {
                      return null;
                    }

                    const isActive =
                      location.pathname === item.link ||
                      (item.link !== '/admin' && location.pathname.startsWith(item.link));
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.link}
                        to={item.link}
                        onClick={onClose}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-slate-800 text-white font-bold'
                            : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-brand-400' : 'text-slate-500'}`} />
                          <span>{item.label}</span>
                        </div>

                        {item.badge !== undefined && item.badge > 0 && (
                          <span className={`px-1.5 py-0.2 text-[9px] font-bold text-white rounded-full ${item.badgeColor || 'bg-brand-500'}`}>
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Sidebar Footer User Info & Sign Out */}
        <div className="p-4 border-t border-slate-900 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-white flex-shrink-0">
              {adminUser?.name?.charAt(0) || 'A'}
            </div>
            <div className="truncate">
              <span className="block text-xs font-bold text-white truncate">{adminUser?.name || 'Administrator'}</span>
              <span className="text-[10px] text-slate-400 capitalize">{adminUser?.role}</span>
            </div>
          </div>

          <button
            onClick={logoutAdmin}
            className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-900 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </>
  );
};
