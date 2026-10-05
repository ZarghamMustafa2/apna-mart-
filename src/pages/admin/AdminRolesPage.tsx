import React from 'react';
import { rolePermissionMap } from '../../context/AdminAuthContext';
import { AdminRoleType, PermissionKey } from '../../types/admin';
import { Shield, Check, X } from 'lucide-react';

export const AdminRolesPage: React.FC = () => {
  const roles: AdminRoleType[] = ['Super Admin', 'Manager', 'Staff'];

  const allPermissionsList: { key: PermissionKey; label: string; desc: string }[] = [
    { key: 'manage_products', label: 'Product Catalog Management', desc: 'Create, edit, delete, and duplicate products' },
    { key: 'view_purchase_cost', label: 'View Purchase Costs', desc: 'Access confidential wholesale purchase cost field' },
    { key: 'manage_categories', label: 'Category & Subcategory Hierarchy', desc: 'Create, edit, and organize taxonomy' },
    { key: 'manage_inventory', label: 'Inventory & Stock Audit', desc: 'Perform manual stock adjustments and view audit logs' },
    { key: 'manage_orders', label: 'Order Processing & Details', desc: 'View customer order breakdowns and address info' },
    { key: 'update_order_status', label: 'Update Order & Payment Status', desc: 'Change order status across 10 stages' },
    { key: 'manage_customers', label: 'Customer CRM Access', desc: 'Access customer profiles and spending records' },
    { key: 'manage_coupons', label: 'Coupons & Discount Rules', desc: 'Create and manage promo voucher rules' },
    { key: 'manage_reviews', label: 'Review & Rating Moderation', desc: 'Approve, hide, or delete customer reviews' },
    { key: 'manage_cms', label: 'Homepage CMS & Banners', desc: 'Edit hero carousel, split banners, and discovery sections' },
    { key: 'view_analytics', label: 'Analytics & Financial Reports', desc: 'Access revenue metrics and sales performance' },
    { key: 'manage_admin_users', label: 'Admin User Management', desc: 'Add, edit, or disable admin staff accounts' },
    { key: 'manage_roles', label: 'Roles & Permissions Matrix', desc: 'Modify role permission definitions' },
    { key: 'manage_settings', label: 'Store Global Settings', desc: 'Configure store info, currency, shipping & payment gateways' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600">Security Architecture</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-0.5">
            Role-Based Access Control (RBAC) Matrix
          </h1>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6 space-y-6">
        <h3 className="text-base font-extrabold text-gray-900 border-b border-gray-100 pb-3">
          System Permission Matrix by Role
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50/80 text-gray-400 font-extrabold uppercase border-b border-gray-100">
                <th className="py-3.5 px-4 w-1/3">Permission Module</th>
                {roles.map((r) => (
                  <th key={r} className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center gap-1 font-bold text-gray-900">
                      <Shield className="w-3.5 h-3.5 text-brand-600" />
                      {r}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-semibold text-gray-800">
              {allPermissionsList.map((perm) => (
                <tr key={perm.key} className="hover:bg-gray-50/50">
                  <td className="py-3.5 px-4">
                    <div className="font-extrabold text-gray-900">{perm.label}</div>
                    <div className="text-[11px] text-gray-400 font-normal">{perm.desc}</div>
                  </td>

                  {roles.map((role) => {
                    const isGranted = rolePermissionMap[role].includes(perm.key);
                    return (
                      <td key={role} className="py-3.5 px-4 text-center">
                        {isGranted ? (
                          <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                            <Check className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
                            <X className="w-4 h-4 text-gray-300" />
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
