export type AdminRoleType = 'Super Admin' | 'Manager' | 'Staff';

export type PermissionKey =
  | 'manage_products'
  | 'view_purchase_cost'
  | 'manage_categories'
  | 'manage_inventory'
  | 'manage_orders'
  | 'update_order_status'
  | 'manage_customers'
  | 'manage_coupons'
  | 'manage_reviews'
  | 'manage_cms'
  | 'view_analytics'
  | 'manage_admin_users'
  | 'manage_roles'
  | 'manage_settings';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRoleType;
  avatar?: string;
  isOwner?: boolean;
  status: 'Active' | 'Disabled';
  createdAt: string;
  lastLogin?: string;
}

export interface RolePermissions {
  role: AdminRoleType;
  description: string;
  permissions: PermissionKey[];
}

export interface AdminNotification {
  id: string;
  type: 'order' | 'stock' | 'customer' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
}
