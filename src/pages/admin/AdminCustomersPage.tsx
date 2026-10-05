import React, { useState } from 'react';
import { Search, Users, Mail, Phone, MapPin, Eye } from 'lucide-react';
import { Modal } from '../../components/common/Modal';

export const AdminCustomersPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);

  const mockCustomers = [
    {
      id: 'cust-1',
      name: 'Farhan Ali',
      email: 'farhan.ali@example.com',
      phone: '+92 300 1234567',
      city: 'Lahore',
      address: 'House # 42, Block B, Main Boulevard, Gulberg III',
      totalOrders: 3,
      totalSpent: 42800,
      createdAt: '2026-01-15',
    },
    {
      id: 'cust-2',
      name: 'Ayesha Khan',
      email: 'ayesha.k@example.com',
      phone: '+92 321 9876543',
      city: 'Karachi',
      address: 'Plot 14-C, Khayaban-e-Shahbaz, DHA Phase 6',
      totalOrders: 5,
      totalSpent: 89500,
      createdAt: '2026-02-01',
    },
    {
      id: 'cust-3',
      name: 'Bilal Ahmed',
      email: 'bilal.ahmed@example.com',
      phone: '+92 333 4567890',
      city: 'Islamabad',
      address: 'House 88, Street 12, Sector F-7/2',
      totalOrders: 2,
      totalSpent: 28400,
      createdAt: '2026-02-18',
    },
  ];

  const filtered = mockCustomers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600">Customer CRM</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-0.5">
            Registered Customers ({filtered.length})
          </h1>
        </div>
      </div>

      <div className="p-4 bg-white rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div className="relative max-w-md w-full">
          <input
            type="text"
            placeholder="Search customers by name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-500"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50/80 text-gray-400 font-extrabold uppercase border-b border-gray-100">
                <th className="py-3.5 px-4">Customer Name</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Phone</th>
                <th className="py-3.5 px-4">City</th>
                <th className="py-3.5 px-4">Total Orders</th>
                <th className="py-3.5 px-4">Total Spent</th>
                <th className="py-3.5 px-4">Joined Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-semibold text-gray-800">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/50">
                  <td className="py-3.5 px-4 font-bold text-gray-900">{c.name}</td>
                  <td className="py-3.5 px-4 text-gray-600">{c.email}</td>
                  <td className="py-3.5 px-4 font-mono">{c.phone}</td>
                  <td className="py-3.5 px-4">{c.city}</td>
                  <td className="py-3.5 px-4 font-extrabold text-brand-600">{c.totalOrders} Orders</td>
                  <td className="py-3.5 px-4 font-extrabold text-gray-900">Rs. {c.totalSpent.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-gray-400 font-normal">{c.createdAt}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedCustomer(c)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                      title="View Customer Profile"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedCustomer && (
        <Modal isOpen={!!selectedCustomer} onClose={() => setSelectedCustomer(null)} title={`Customer Details - ${selectedCustomer.name}`} maxWidth="md">
          <div className="space-y-3 text-xs">
            <div className="p-4 bg-gray-50 rounded-2xl space-y-1">
              <div className="font-bold text-gray-900">Full Name: {selectedCustomer.name}</div>
              <div>Email: {selectedCustomer.email}</div>
              <div>Phone: {selectedCustomer.phone}</div>
              <div>Default Delivery Address: {selectedCustomer.address}</div>
            </div>
            <div className="p-4 bg-brand-50/60 rounded-2xl text-brand-900 font-bold space-y-1">
              <div>Total Orders Placed: {selectedCustomer.totalOrders}</div>
              <div>Lifetime Spending: Rs. {selectedCustomer.totalSpent.toLocaleString()}</div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
