import React, { useState, useEffect } from 'react';
import { Search, Users, Mail, Phone, MapPin, Eye, Calendar, ShoppingBag } from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { useAdminData } from '../../context/AdminDataContext';
import { dbGetAll } from '../../services/db';
import { isSupabaseConfigured, fetchCustomersFromSupabase } from '../../services/apiServices';

export const AdminCustomersPage: React.FC = () => {
  const { adminOrders } = useAdminData();
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [customerList, setCustomerList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCustomers = async () => {
    try {
      let registeredCustomers: any[] = [];
      if (isSupabaseConfigured()) {
        try {
          const cloud = await fetchCustomersFromSupabase();
          if (cloud && cloud.length > 0) {
            registeredCustomers = cloud;
          }
        } catch (e) {
          console.warn('Supabase customer fetch fallback:', e);
        }
      }

      if (registeredCustomers.length === 0) {
        const allUsers = await dbGetAll<any>('users');
        registeredCustomers = (allUsers || []).filter((u) => !u.role);
      }

      // Map with live order counts and spending
      const mapped = registeredCustomers.map((u) => {
        const userOrders = adminOrders.filter(
          (o) =>
            (u.id && o.userId === u.id) ||
            (u.email && o.customerEmail && o.customerEmail.toLowerCase() === u.email.toLowerCase()) ||
            (u.phone && o.customerPhone && o.customerPhone === u.phone)
        );

        const totalOrders = userOrders.length;
        const totalSpent = userOrders.reduce((sum, o) => sum + (o.total || 0), 0);
        const city = u.city || u.defaultAddress?.city || userOrders[0]?.shippingAddress?.city || 'Lahore';
        const address =
          u.defaultAddress?.address
            ? `${u.defaultAddress.address}${u.defaultAddress.area ? ', ' + u.defaultAddress.area : ''}`
            : userOrders[0]?.shippingAddress?.address || 'No address saved yet';

        return {
          id: u.id,
          name: u.name,
          email: u.email,
          phone: u.phone || u.defaultAddress?.phone || userOrders[0]?.customerPhone || '-',
          city,
          address,
          totalOrders,
          totalSpent,
          createdAt: u.createdAt || u.created_at || '2026-01-15',
          avatar: u.avatar,
        };
      });

      // Also discover any customers who placed orders directly but might not have user record
      const knownEmails = new Set(registeredCustomers.map((u) => u.email.toLowerCase()));
      adminOrders.forEach((o) => {
        const guestEmail = o.customerEmail;
        if (guestEmail && !knownEmails.has(guestEmail.toLowerCase())) {
          knownEmails.add(guestEmail.toLowerCase());
          const guestOrders = adminOrders.filter(
            (ord) => ord.customerEmail && ord.customerEmail.toLowerCase() === guestEmail.toLowerCase()
          );
          mapped.push({
            id: `guest-${mapped.length + 1}`,
            name: o.customerName,
            email: guestEmail,
            phone: o.customerPhone || '-',
            city: o.shippingAddress?.city || 'Lahore',
            address: o.shippingAddress?.address || '-',
            totalOrders: guestOrders.length,
            totalSpent: guestOrders.reduce((sum, ord) => sum + ord.total, 0),
            createdAt: (o.createdAt || '2026-10-17').split(' ')[0],
            avatar: undefined,
          });
        }
      });

      setCustomerList(mapped);
    } catch (err) {
      console.error('Failed to load customers from database:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, [adminOrders]);

  const filteredCustomers = customerList.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600">User Management</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-0.5">
            Store Customers ({customerList.length})
          </h1>
          <p className="text-xs text-gray-500 font-medium">Real-time buyer profiles, lifetime spend, order history & contact records</p>
        </div>

        {/* Live Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, phone, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50/80 text-gray-400 font-extrabold uppercase border-b border-gray-100">
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Contact Info</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Orders Placed</th>
                <th className="py-3.5 px-4">Total Spend</th>
                <th className="py-3.5 px-4">Joined On</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-semibold text-gray-800">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    Loading customer database...
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    No customers match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50/50">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={customer.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                          alt={customer.name}
                          className="w-9 h-9 rounded-full object-cover border border-gray-100 flex-shrink-0 bg-gray-50"
                        />
                        <div>
                          <div className="font-extrabold text-gray-900">{customer.name}</div>
                          <div className="text-[10px] text-gray-400 font-normal">ID: {customer.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <div className="text-gray-900 flex items-center gap-1.5 font-medium">
                          <Mail className="w-3 h-3 text-gray-400" />
                          <span>{customer.email}</span>
                        </div>
                        <div className="text-gray-500 flex items-center gap-1.5 font-normal">
                          <Phone className="w-3 h-3 text-gray-400" />
                          <span>{customer.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 text-gray-700">
                        <MapPin className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
                        <span className="font-bold">{customer.city}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                        <ShoppingBag className="w-3 h-3" />
                        {customer.totalOrders}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-brand-600">
                      Rs. {customer.totalSpent.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-gray-400 font-normal">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{customer.createdAt}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedCustomer(customer)}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl inline-flex items-center gap-1 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Profile</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Profile Modal */}
      {selectedCustomer && (
        <Modal
          isOpen={!!selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          title={`Customer Profile: ${selectedCustomer.name}`}
          maxWidth="md"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <img
                src={selectedCustomer.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                alt={selectedCustomer.name}
                className="w-16 h-16 rounded-full object-cover border"
              />
              <div>
                <h4 className="font-extrabold text-base text-gray-900">{selectedCustomer.name}</h4>
                <p className="text-xs text-gray-500">{selectedCustomer.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Verified Store Buyer
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Total Orders</span>
                <span className="font-extrabold text-sm text-gray-900">{selectedCustomer.totalOrders} Orders</span>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Lifetime Spend</span>
                <span className="font-extrabold text-sm text-brand-600">Rs. {selectedCustomer.totalSpent.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-gray-400 font-bold block text-[10px] uppercase">Phone Number</span>
                <span className="font-semibold text-gray-800">{selectedCustomer.phone}</span>
              </div>
              <div>
                <span className="text-gray-400 font-bold block text-[10px] uppercase">Default Shipping Address</span>
                <span className="font-semibold text-gray-800">{selectedCustomer.address}</span>
              </div>
              <div>
                <span className="text-gray-400 font-bold block text-[10px] uppercase">City</span>
                <span className="font-semibold text-gray-800">{selectedCustomer.city}</span>
              </div>
              <div>
                <span className="text-gray-400 font-bold block text-[10px] uppercase">Account Registered</span>
                <span className="font-semibold text-gray-800">{selectedCustomer.createdAt}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
