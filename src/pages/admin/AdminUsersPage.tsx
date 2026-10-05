import React, { useState } from 'react';
import { mockAdminUsers, useAdminAuth } from '../../context/AdminAuthContext';
import { AdminUser, AdminRoleType } from '../../types/admin';
import { ImageUploader } from '../../components/common/ImageUploader';
import { UserCheck, Shield, Plus, Lock, AlertCircle, Edit3, Trash2 } from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const { adminUser, hasPermission } = useAdminAuth();
  const [users, setUsers] = useState<AdminUser[]>(mockAdminUsers);
  const [showAddModal, setShowAddModal] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<AdminRoleType>('Staff');
  const [avatar, setAvatar] = useState('');

  const canManageUsers = hasPermission('manage_admin_users');

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) {
      const newUser: AdminUser = {
        id: `adm-${Date.now()}`,
        name,
        email,
        role,
        avatar: avatar || undefined,
        isOwner: false,
        status: 'Active',
        createdAt: new Date().toISOString().split('T')[0],
      };
      setUsers([...users, newUser]);
      setShowAddModal(false);
      setName('');
      setEmail('');
      setAvatar('');
    }
  };

  const handleToggleStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          if (u.isOwner) return u; // Prevent owner deletion/disable
          return { ...u, status: u.status === 'Active' ? 'Disabled' : 'Active' };
        }
        return u;
      })
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600">Access Management</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-0.5">
            Admin Users & Accounts ({users.length})
          </h1>
        </div>

        {canManageUsers && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-3 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Add Admin Staff</span>
          </button>
        )}
      </div>

      {!canManageUsers && (
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold rounded-2xl flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>Viewing Mode Only: Your role ({adminUser?.role}) cannot add or modify admin user credentials.</span>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50/80 text-gray-400 font-extrabold uppercase border-b border-gray-100">
                <th className="py-3.5 px-4">Admin Name</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Assigned Role</th>
                <th className="py-3.5 px-4">Account Status</th>
                <th className="py-3.5 px-4">Last Login</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-semibold text-gray-800">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50/50">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'} alt={u.name} className="w-9 h-9 rounded-full object-cover border" />
                      <div>
                        <div className="font-extrabold text-gray-900 flex items-center gap-1.5">
                          {u.name}
                          {u.isOwner && <span className="px-2 py-0.2 text-[9px] font-extrabold bg-amber-100 text-amber-800 rounded">Primary Owner</span>}
                        </div>
                        <div className="text-[10px] text-gray-400 font-normal">ID: {u.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-gray-600">{u.email}</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 font-extrabold text-[11px]">
                      <Shield className="w-3 h-3" />
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${u.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-gray-400 font-normal">{u.lastLogin || 'Never'}</td>
                  <td className="py-3.5 px-4 text-right">
                    {canManageUsers && !u.isOwner && (
                      <button
                        onClick={() => handleToggleStatus(u.id)}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl"
                      >
                        {u.status === 'Active' ? 'Disable' : 'Enable'}
                      </button>
                    )}
                    {u.isOwner && <span className="text-[11px] text-gray-400 font-bold">Protected</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 space-y-4">
            <h3 className="text-lg font-extrabold text-gray-900 border-b border-gray-100 pb-3">Add Admin Staff Account</h3>
            <form onSubmit={handleAddUser} className="space-y-4">
              <ImageUploader
                value={avatar}
                onChange={setAvatar}
                label="Staff Profile Picture"
                aspectRatio="square"
                placeholderText="Upload photo (JPG, PNG, WebP)"
              />

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Staff Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ali Ahmed"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="ali.staff@apnamart.space"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Role Assignment *</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as AdminRoleType)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 cursor-pointer"
                >
                  <option value="Super Admin">Super Admin (Full Control)</option>
                  <option value="Manager">Manager (Catalog, Orders, Customers, Reports)</option>
                  <option value="Staff">Staff (Order Processing Only)</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 py-3 bg-brand-600 text-white font-extrabold text-xs rounded-xl shadow-md">
                  Create Admin Account
                </button>
                <button type="button" onClick={() => setShowAddModal(false)} className="py-3 px-5 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
