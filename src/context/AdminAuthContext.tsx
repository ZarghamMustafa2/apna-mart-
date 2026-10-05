import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser, AdminRoleType, PermissionKey, RolePermissions } from '../types/admin';

export const rolePermissionMap: Record<AdminRoleType, PermissionKey[]> = {
  'Super Admin': [
    'manage_products',
    'view_purchase_cost',
    'manage_categories',
    'manage_inventory',
    'manage_orders',
    'update_order_status',
    'manage_customers',
    'manage_coupons',
    'manage_reviews',
    'manage_cms',
    'view_analytics',
    'manage_admin_users',
    'manage_roles',
    'manage_settings',
  ],
  Manager: [
    'manage_products',
    'view_purchase_cost',
    'manage_categories',
    'manage_inventory',
    'manage_orders',
    'update_order_status',
    'manage_customers',
    'manage_coupons',
    'manage_reviews',
    'manage_cms',
    'view_analytics',
  ],
  Staff: ['manage_orders', 'update_order_status', 'manage_customers'],
};

export const mockAdminUsers: AdminUser[] = [
  {
    id: 'adm-001',
    name: 'Super Administrator',
    email: 'admin@apexstore.pk',
    role: 'Super Admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    isOwner: true,
    status: 'Active',
    createdAt: '2026-01-01',
    lastLogin: 'Today, 09:15 AM',
  },
  {
    id: 'adm-002',
    name: 'Sarah Manager',
    email: 'sarah.manager@apexstore.pk',
    role: 'Manager',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    isOwner: false,
    status: 'Active',
    createdAt: '2026-02-10',
    lastLogin: 'Yesterday',
  },
  {
    id: 'adm-003',
    name: 'Usman Fulfillment Staff',
    email: 'usman.staff@apexstore.pk',
    role: 'Staff',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    isOwner: false,
    status: 'Active',
    createdAt: '2026-03-01',
    lastLogin: 'Aug 24, 2026',
  },
];

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  isAuthenticated: boolean;
  loginAdmin: (email: string, pass: string) => boolean;
  logoutAdmin: () => void;
  hasPermission: (permission: PermissionKey) => boolean;
  switchRoleForTesting: (role: AdminRoleType) => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);
const ADMIN_AUTH_STORAGE_KEY = 'apex_ecommerce_admin_auth';

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem(ADMIN_AUTH_STORAGE_KEY);
      return saved ? JSON.parse(saved) : mockAdminUsers[0]; // default to Super Admin for demo preview
    } catch (e) {
      return mockAdminUsers[0];
    }
  });

  useEffect(() => {
    if (adminUser) {
      localStorage.setItem(ADMIN_AUTH_STORAGE_KEY, JSON.stringify(adminUser));
    } else {
      localStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
    }
  }, [adminUser]);

  const loginAdmin = (email: string, pass: string): boolean => {
    const found = mockAdminUsers.find(a => a.email.toLowerCase() === email.toLowerCase());
    if (found && pass) {
      setAdminUser(found);
      return true;
    }
    // Allow demo login
    if (email && pass) {
      setAdminUser(mockAdminUsers[0]);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setAdminUser(null);
  };

  const hasPermission = (permission: PermissionKey): boolean => {
    if (!adminUser) return false;
    const permissions = rolePermissionMap[adminUser.role] || [];
    return permissions.includes(permission);
  };

  const switchRoleForTesting = (role: AdminRoleType) => {
    const targetUser = mockAdminUsers.find(u => u.role === role) || {
      ...mockAdminUsers[0],
      role,
      name: `Test ${role}`,
    };
    setAdminUser(targetUser);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        isAuthenticated: !!adminUser,
        loginAdmin,
        logoutAdmin,
        hasPermission,
        switchRoleForTesting,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
